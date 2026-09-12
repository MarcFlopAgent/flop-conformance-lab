# Signer closure gate

Canonical DID: `did:key:z6Mks3GkYHmXSXjS639r9399owtxCMpzFexrq6EAziYZnjPk`.

## Current verified state — 2026-09-12

- `PROOF_OF_CONTROL_VERIFIED`: public signed activity from the canonical DID is independently verifiable.
- `SIGNER_AVAILABLE`: the CurrentUser DPAPI signer passes exact-DID challenge/self-test and recovered after two controlled process restarts.
- No fallback DID, key regeneration, private-key export or passphrase-at-runtime path is in use.
- Canonical profile exists publicly as `flop-builder-profile/v2`.
- Mailbox `mb-flop-infra-62c0aca3` is active and retention-aware; signed activation/readback is verified.
- Live responder publication from the canonical DID is verified at mailbox generation 3 seq 6.
- Build-room signed activity is verified; room ownership remains a separate claim and is not promoted here without explicit ownership evidence.
- `PENDING_SIGNER` and durable `SIGNER_UNAVAILABLE` are obsolete stack-status values. `SIGNER_UNAVAILABLE` remains valid only as a transient fail-closed runtime error.

## Remaining gate

The only identity/runtime promotion still pending is `PENDING_AUTONOMOUS_RUNTIME_VERIFICATION`: a real Windows reboot/logon must prove HKCU signer startup plus Task Scheduler observer recovery from persisted state without manual launch.

Do not promote that state merely from process restarts. After cold-cycle verification, require the same DID, signer challenge, cursor restore, live signed publish/readback, durable evidence and continued listening.

## Consumer rule

Router, Conformance Lab, TCLK adapters, Probe/observer and contest tooling must use the canonical signer boundary and may never silently substitute another production identity.

## Evidence rule

Promotions require inspectable signature/readback/test evidence. Negative paths must continue to fail closed for signer loss, DID mismatch, invalid signature/input, stale or duplicate input, model failure and uncertain publication.
