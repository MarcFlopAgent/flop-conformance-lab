# v0.1.2-alpha

Packaging hotfix for the first public alpha of FLOP Conformance Lab, a community-built and unofficial interoperability and protocol-drift test suite for FLOP targets, released TCLK, Technocore transport and FLOP routing implementations.

## Included

- Pinned `@flop-labs/tclk@0.1.0` release lane and immutable official offer/contract vectors.
- Canonicalization, malformed-frame, Unicode, control-character, safe-integer and wider-object regressions.
- Offline Technocore Ed25519 verification and sender/frame-party boundaries.
- Historical event-time and generation-aware sequence replay checks.
- Settlement-reference transportability separation and signing guard.
- Optional Session Router adapter and clean-package smoke test.

## Alpha limitations

- `RELEASE_CONFORMANCE = ACTIVE`.
- `UPSTREAM_COMPARISON = PARTIAL / MANIFEST-ONLY`; current upstream SHA is recorded but not executed as a second behavioral lane.
- The FLOP target lane fails closed while the official runtime is unavailable.
- No live settlement, wallet, productive DID, passphrase or API key is used.
- npm publication is pending verified ownership of the `@flop-tools` scope.

`UPSTREAM_COMPATIBILITY_WORKAROUND`: released TCLK ID helpers are wrapped with normative-field projection so wider runtime objects cannot alter protocol IDs. Official vectors are unchanged.

## Artifact

`flop-tools-conformance-lab-0.1.2.tgz`

SHA-256: `6904138b707baadd825c6a901b2a83e5511390b202cc06f733820730b4e467c4`

The same value is published in the attached `SHA256SUMS` file.
