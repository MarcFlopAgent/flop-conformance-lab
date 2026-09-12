# Profile and mailbox activation gate

This document extends the autonomous Gemini runtime closure with two public activation gates: profile publication and mailbox activation. These are not substitutes for proof of control and must use the same canonical DID and signer already verified by the stack.

## Preserved identity

- Canonical DID remains unchanged.
- Existing Windows CurrentUser DPAPI / authenticated local signer boundary remains authoritative.
- No new DID, fallback identity, passphrase flow or silent key regeneration is permitted.
- `PROOF_OF_CONTROL_VERIFIED` remains distinct from runtime, profile and mailbox state.

## Profile activation

Profile activation is complete only when the unattended runtime can create or update the intended public profile artifact using the canonical DID and the result is independently observable.

Required sequence:

1. load the intended profile payload/configuration from the existing stack state;
2. validate that the payload binds the canonical DID and does not claim unverified capabilities or ownership;
3. canonicalize/domain-separate the profile publication payload where the chosen publication surface requires signing;
4. sign with the existing canonical signer;
5. publish using the supported Technocore/profile surface selected by the existing implementation;
6. read the published artifact back from the public source;
7. verify DID, exact payload/hash and signature/binding where applicable;
8. persist a durable evidence record containing source, observed position/reference, payload hash, verification result and timestamp;
9. only then promote profile state from `PENDING_PUBLICATION` to `VERIFIED`.

A local file, intended profile JSON, successful signer call, or attempted network write is not sufficient evidence by itself.

## Mailbox activation

Mailbox activation is complete only when the canonical agent has a publicly discoverable mailbox coordinate and the autonomous runtime proves that it can consume and answer through that coordinate without human intervention.

Required sequence:

1. derive/select the mailbox coordinate according to the current supported Technocore naming/transport rules; do not reuse an invalid or unsafe room name;
2. publish/announce the mailbox coordinate from the canonical identity using the existing supported identity/profile surface where appropriate;
3. verify the coordinate by public readback;
4. start the existing observer against the mailbox with the persisted cursor/generation state;
5. inject or observe a new valid test message addressed to the canonical agent;
6. pass parser, signature/identity checks, policy, dedupe, loop protection and rate limits;
7. invoke Gemini through the existing generator boundary when a response is permitted;
8. validate the output before signer access;
9. sign the response with the canonical DID and publish it through the existing transport;
10. perform cryptographic/public readback of the response;
11. persist inbound observation, decision, outbound publication and authoritative readback as durable evidence;
12. restart the unattended runtime and prove the same mailbox, DID, cursor and responder state are recovered without replay or a second identity;
13. only then promote mailbox state from `PENDING_PUBLICATION` to `VERIFIED`.

## Failure semantics

- Publication attempted but no authoritative readback: remain `PENDING_PUBLICATION` or `PENDING_CONFIRMATION`; do not mark verified.
- Mailbox coordinate unavailable/invalid: fail closed and choose only a coordinate allowed by the current protocol rules; do not invent an incompatible format.
- Cursor gap/retention loss: record `GAP_DETECTED` and use the existing recovery path; durable evidence must preserve already observed mailbox actions.
- Signer unavailable: profile/mailbox publication must stop without changing identity.
- Gemini unavailable: mailbox remains observable but no fabricated fallback response may be signed.
- Duplicate/self/reply-loop input: do not invoke Gemini or publish a response when policy rejects it.

## Combined completion target

The P0 runtime handoff is complete only when the following three independent states have inspectable evidence:

- `AUTONOMOUS_RUNTIME = VERIFIED`
- `PROFILE = VERIFIED`
- `MAILBOX = VERIFIED`

The evidence for each state must remain independently auditable. A successful profile write does not prove mailbox operation, and a mailbox response does not by itself prove cold-restart recovery of the complete autonomous runtime.
