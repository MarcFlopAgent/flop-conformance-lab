import test from"node:test";import assert from"node:assert/strict";import{assertFreshGameId,SONNET_CONTEST_ID,validateSonnetAction,verifyPrestartTimestamp}from"../src/sonnet.js";
const c=(v:unknown):string=>{if(v===null||typeof v==="string"||typeof v==="boolean")return JSON.stringify(v);if(typeof v==="number")return String(v);if(Array.isArray(v))return`[${v.map(c).join(",")}]`;if(typeof v==="object")return`{${Object.entries(v as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>`${JSON.stringify(k)}:${c(x)}`).join(",")}}`;throw new Error("bad");};

test("accepts canonical sonnet-2 registration",()=>{const payload={type:"sonnet.register.v1",contest_id:SONNET_CONTEST_ID,role:"writer",x_account_url:"https://x.com/example",request_id:"s2-reg-1"};const a=validateSonnetAction({room:"mb-sonnet-2-registration",payload,canonicalPayload:c(payload)});assert.equal(a.room,"mb-sonnet-2-registration");});

test("blocks sonnet-1",()=>{const payload={type:"sonnet.register.v1",contest_id:"sonnet-1",role:"writer",request_id:"old"};assert.throws(()=>validateSonnetAction({room:"mb-sonnet-1-registration",payload,canonicalPayload:c(payload)}),/OBSOLETE_CONTEST_NAMESPACE/);});

test("blocks wrong room",()=>{const payload={type:"sonnet.submit.v1",contest_id:SONNET_CONTEST_ID,request_id:"s2-sub-1"};assert.throws(()=>validateSonnetAction({room:"mb-sonnet-2-discovery",payload,canonicalPayload:c(payload)}),/SONNET_SUBMIT_WRONG_ROOM/);});

test("requires canonical payload",()=>{const payload={type:"sonnet.team-request.v1",contest_id:SONNET_CONTEST_ID,game_id:"team1",request_id:"x"};assert.throws(()=>validateSonnetAction({room:"mb-sonnet-2-discovery",payload,canonicalPayload:"{}"}),/NON_CANONICAL_SONNET_ACTION/);});

test("strict prestart cutoff",()=>{assert.equal(verifyPrestartTimestamp("2026-09-11T11:59:59.999Z"),true);assert.equal(verifyPrestartTimestamp("2026-09-11T12:00:00.000Z"),false);});

test("game id validation",()=>{assert.doesNotThrow(()=>assertFreshGameId("team-1"));assert.throws(()=>assertFreshGameId("Bad Team"),/INVALID_GAME_ID/);});
