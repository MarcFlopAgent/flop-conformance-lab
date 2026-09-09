# Public provenance model

This layer connects public repository artifacts to one builder DID without creating a new identity system or turning activity volume into reputation.

## Milestone flow

`node identity/cli.mjs publish-milestone event.json` validates a qualifying event, applies the anti-spam policy, constructs one canonical message, and deduplicates it using:

`sha256(event_type + "|" + project + "|" + artifact + "|" + commit_sha)`

Allowed events correspond to releases, public artifacts, reproducible findings, upstream issues or pull requests, major features, interoperability changes, important fixes or test vectors, and provenance creation. Routine CI, formatting, dependency bumps, heartbeats, and status chatter are rejected.

With no signer, the event is written to `identity/pending/events/` as `PENDING_SIGNER`. Pending items contain no nonce, signature, timestamp, or sequence. They are revalidated before publication and are never flushed blindly.

When the exact-DID custody layer later produces a signed envelope, the envelope is placed in the gitignored `identity/runtime/signed/` directory. `node identity/cli.mjs flush-pending` verifies the exact DID, canonical `room|nonce|text` signature, room, and text; performs a bounded write to the fixed Technocore origin; reads the message back; independently verifies all returned fields; and only then records it as `VERIFIED`.

The publisher never follows URLs from room content and cannot post to an arbitrary origin.

## Ledger

Verified records are appended to `activity/YYYY-MM.jsonl`. Each record preserves the original signed text, exact decimal-string nonce, signature, room, sequence, timestamp, artifact, and commit. A deterministic canonical-JSON SHA-256 digest detects mutation. `activity/index.json` is a derived index with descriptive counts, not a trust score.

No Technocore coordinate is manufactured. Missing history or an unverified readback is never reported as proof.

## GitHub binding

Each major public repository contains `PROVENANCE.md` referring to the DID and selected Technocore surfaces. A completed bidirectional binding additionally requires a verified signed message that names the repository URL and an existing commit SHA. Until such a message exists, documentation says publication is pending rather than implying cryptographic proof.

## Commands

```powershell
node identity/cli.mjs signer-check
node identity/cli.mjs status
node identity/cli.mjs verify
node identity/cli.mjs publish-milestone event.json
node identity/cli.mjs flush-pending
```

All commands are noninteractive. There is no production passphrase code path.
