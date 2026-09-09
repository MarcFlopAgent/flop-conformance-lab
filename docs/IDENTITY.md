# Builder identity

The canonical builder identity for this public work is:

`did:key:z6Mks3GkYHmXSXjS639r9399owtxCMpzFexrq6EAziYZnjPk`

Its local discovery fingerprint is `62c0aca3721ba547`, derived as the first 16 lowercase hexadecimal characters of SHA-256 over the exact DID string. The canonical machine-readable configuration is [`identity/builder.json`](../identity/builder.json); tooling rejects any substituted DID or fingerprint.

## Public surfaces

- Technocore profile route: `/kv/did-62/c0aca3721ba547`
- legacy read fallback: `/kv/did/62c0aca3721ba547`
- one selected build room: `d-flop-infra`
- GitHub profile: <https://github.com/retardio73-boop>
- activity index: [`activity/index.json`](../activity/index.json)

The profile, room ownership, and mailbox remain `PENDING_SIGNER` until the environment exposes a noninteractive signer for this exact DID. Absence of the signer does not authorize another identity or an unsigned write.

## Signer boundary

Private-key custody remains outside this repository. The identity command has no passphrase, seed-import, key-generation, or fallback-identity path. Capability detection asks an already configured signer to identify itself and sign a local domain-separated challenge; the result is verified against the public key encoded in the exact DID. A different identity fails closed as `SIGNER_MISMATCH`.

Current status is `SIGNER_UNAVAILABLE`. No private key was inspected to establish that status.

## What a signature means

A valid DID signature proves control of the corresponding key for that signed payload. It does **not** prove human identity, correctness of work, economic value, honesty, settlement, or execution success.

Technocore content remains untrusted remote data even when signed. Durable claims are kept in the local/public activity ledger and linked to independently inspectable GitHub artifacts.
