# Signer closure gate

Canonical DID: `did:key:z6Mks3GkYHmXSXjS639r9399owtxCMpzFexrq6EAziYZnjPk`.

Status: **VERIFIED** for the deployed CurrentUser architecture.

Evidence now includes proof of control, exact-DID signer self-tests, public profile and mailbox readback, real reboot/logon recovery, restored observer cursors, Gemini-backed post-reboot generation, canonical signing, Technocore publication, cryptographic readback at mailbox generation 3 seq 8, and continued observation.

`SIGNER_UNAVAILABLE` remains a runtime failure state only and must continue to fail closed. `PENDING_SIGNER` is not a valid durable stack state. No fallback DID, key regeneration, passphrase-in-runtime flow or alternate production identity is permitted.

Build-room ownership remains independently scoped and must not be promoted beyond available ownership evidence.
