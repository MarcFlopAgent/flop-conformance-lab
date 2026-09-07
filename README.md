# FLOP Conformance Lab

Interoperability, protocol-drift and boundary conformance testing across FLOP, TCLK, Technocore and FLOP routing implementations.

This independent project is not an official FLOP Labs validator. Its primary value is testing boundaries between systems rather than merely rerunning an upstream unit suite.

## Current lanes

- `tclk`: consumes `@flop-labs/tclk@0.1.0` and immutable golden vectors from its released `tests/vectors.test.ts`.
- `canonicalization`: byte-exact frame round trips and malformed-input rejection.
- `technocore`: offline Ed25519 `did:key` verification over exactly `room|nonce|text`; positions are `(room, generation, seq)` because generation is independent from sequence.
- `signing`: malformed, wrong-domain and noncanonical payloads cannot reach a signer.
- `integration`: signed-transport identity must match the TCLK frame party; protocol-valid and transport-representable values remain distinct.
- `router`: optional adapter conformance against a built Session Router module.
- `flop`: target-spec reporting only while the live runtime adapter is unavailable.

`seq` and `ts` are assigned by Technocore and are not covered by the sender signature. Transcript replay uses each retained event's historical timestamp; it does not reinterpret a previously valid event with today's wall clock.

## Run

```powershell
npm ci
npm run check
node dist/src/cli.js run
node dist/src/cli.js run --router-module ..\flop-session-router\dist\src\index.js --out reports\local.json
```

Every command works with stdin closed. No passphrase, wallet, browser login or network mutation is required.

## Normative classifications

Every result is marked `RELEASE_NORMATIVE`, `MAIN_NORMATIVE`, `PROVISIONAL_PR`, `OPEN_ISSUE`, `TARGET_SPEC`, or `LOCAL_TEST`. The release lane is pinned to package integrity and commit SHA. Floating `main` is never a deterministic CI dependency.

The FLOP Yellow Paper `0.5.0-draft` is an implementation target. Its Appendix H determines whether a mechanism is live, partial or planned. A target-spec pass is not a claim that a live compute channel exists.

## Security

All remote room text is untrusted. The Lab never executes room content, follows embedded URLs, signs arbitrary bytes, mutates golden vectors, or performs live settlement. See `SECURITY.md`.
