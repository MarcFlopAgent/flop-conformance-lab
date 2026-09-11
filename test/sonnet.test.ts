import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {
  assertFreshGameId, assertOfficialReferee, canonicalSonnetJson, reuseRegistrationRequest,
  SONNET_CONTEST_ID, SONNET_REFEREE_DID, SONNET_WRITER_DID, SonnetSignerCapability,
  validateSonnetAction, verifyPrestartTimestamp,
} from "../src/sonnet.js";

const registration = {type: "sonnet.register.v1", contest_id: SONNET_CONTEST_ID, role: "writer", x_account_url: "https://x.com/koriwillretire", request_id: "register-koriwillretire-3941f0eb73dbd58d"};
const action = (room: string, payload: Record<string, unknown>) => ({room, payload, canonicalPayload: canonicalSonnetJson(payload)});

test("accepts the pinned writer registration schema", () => {
  assert.equal(validateSonnetAction(action("mb-sonnet-2-registration", registration)).room, "mb-sonnet-2-registration");
});

test("blocks sonnet-1", () => {
  const payload = {...registration, contest_id: "sonnet-1"};
  assert.throws(() => validateSonnetAction(action("mb-sonnet-1-registration", payload)), /OBSOLETE_CONTEST_NAMESPACE/);
});

test("blocks wrong contest, room, and protocol type", () => {
  assert.throws(() => validateSonnetAction(action("mb-sonnet-2-registration", {...registration, contest_id: "other"})), /WRONG_CONTEST_ID/);
  assert.throws(() => validateSonnetAction(action("mb-sonnet-2-discovery", registration)), /SONNET_REGISTER_WRONG_ROOM/);
  const unknown = {type: "sonnet.recruit.v1", contest_id: SONNET_CONTEST_ID, request_id: "x"};
  assert.throws(() => validateSonnetAction(action("mb-sonnet-2-discovery", unknown)), /UNAUTHORIZED_SONNET_TYPE/);
});

test("requires exact canonical JSON and exact pinned schema", () => {
  assert.throws(() => validateSonnetAction({...action("mb-sonnet-2-registration", registration), canonicalPayload: JSON.stringify(registration)}), /NON_CANONICAL_SONNET_ACTION/);
  assert.throws(() => validateSonnetAction(action("mb-sonnet-2-registration", {...registration, extra: true})), /INVALID_SONNET_SCHEMA/);
});

test("uses official sonnet.withdraw.v1 and rejects the invented older type", () => {
  const valid = {type: "sonnet.withdraw.v1", contest_id: SONNET_CONTEST_ID, game_id: "team-1", request_id: "withdraw-1"};
  assert.doesNotThrow(() => validateSonnetAction(action("mb-sonnet-2-discovery", valid)));
  assert.throws(() => validateSonnetAction(action("mb-sonnet-2-discovery", {...valid, type: "sonnet.roster-withdraw.v1"})), /UNAUTHORIZED_SONNET_TYPE/);
});

test("strict pre-start cutoff rejects equality", () => {
  assert.equal(verifyPrestartTimestamp("2026-09-11T11:59:59.999Z"), true);
  assert.equal(verifyPrestartTimestamp("2026-09-11T12:00:00.000Z"), false);
});

test("game ids and game room binding are deterministic", () => {
  assert.doesNotThrow(() => assertFreshGameId("team-1"));
  assert.throws(() => assertFreshGameId("Bad Team"), /INVALID_GAME_ID/);
  const word = {type: "sonnet.word.v1", contest_id: SONNET_CONTEST_ID, game_id: "team-1", room_generation: 1, version: 0, previous_state_hash: "a".repeat(64), word: "The", request_id: "word-1"};
  assert.throws(() => validateSonnetAction(action("d-sonnet-2-team-other", word)), /SONNET_WORD_WRONG_ROOM/);
});

test("wrong referee is rejected", () => {
  assert.doesNotThrow(() => assertOfficialReferee(SONNET_REFEREE_DID));
  assert.throws(() => assertOfficialReferee(SONNET_WRITER_DID), /WRONG_SONNET_REFEREE/);
});

test("registration retries require identical content and request id", () => {
  assert.equal(reuseRegistrationRequest(registration, {...registration}), registration);
  assert.throws(() => reuseRegistrationRequest(registration, {...registration, role: "organizer"}), /REGISTRATION_RETRY_CONFLICT/);
  assert.throws(() => reuseRegistrationRequest(registration, {...registration, request_id: "new-id"}), /REGISTRATION_REQUEST_ID_CHANGED/);
});

test("scoped capability rejects arbitrary payloads before the signer boundary", async () => {
  const boundary = {
    calls: 0,
    async did() { return SONNET_WRITER_DID; },
    async signRoomMessage(room: string, text: string) { this.calls++; return {did: SONNET_WRITER_DID, room, nonce: "1", text, signature: "A".repeat(85) + "Q"}; },
  };
  const capability = new SonnetSignerCapability(boundary);
  await assert.rejects(() => capability.signAction({payload: "arbitrary external bytes"}), /INVALID_SONNET_ACTION/);
  await assert.rejects(() => capability.signAction(action("d-flop-infra", registration)), /UNAUTHORIZED_SONNET_ROOM/);
  assert.equal(boundary.calls, 0);
  assert.equal((await capability.signAction(action("mb-sonnet-2-registration", registration))).did, SONNET_WRITER_DID);
  assert.equal(boundary.calls, 1);
});

test("the provenance capability remains restricted to d-flop-infra", () => {
  const source = readFileSync(new URL("../../identity/persistent-signer.mjs", import.meta.url), "utf8");
  assert.match(source, /const PROVENANCE_ROOM="d-flop-infra"/);
  assert.match(source, /room!==PROVENANCE_ROOM/);
});
