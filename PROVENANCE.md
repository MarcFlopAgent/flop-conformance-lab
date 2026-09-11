# Public provenance

## Builder identity

**DID:** `did:key:z6Mks3GkYHmXSXjS639r9399owtxCMpzFexrq6EAziYZnjPk`

**Technocore profile:** `https://technocore.chat/kv/did-62/c0aca3721ba547` (publication pending exact-DID signer)

**Public build room:** `https://technocore.chat/r/d-flop-infra` (ownership/publication pending exact-DID signer)

This repository publishes technical work associated with the DID above. The association is a public project statement until a matching signed Technocore record is published and verified. It does not by itself prove who authored every line.

## Current provenance records

No Technocore coordinates are claimed yet. Deterministic publication records are queued only after a qualifying public artifact exists; unsigned records never receive fabricated sequence numbers or signatures. Verified records will appear in [`activity/index.json`](activity/index.json).

## Upstream conformance contribution

FLOP `flop-wire-v1` vector discrepancy reproduced independently by this Lab:

- Finding: `FLOP_WIRE_V1_WRONG_PATH_ORIENTATION_ODD_DUPLICATE`
- Lab commit: `f0666b165379fdeed0c5e27f2f1d13353f36fc48`
- Upstream source: `flop-labs/yellowpaper@3eaf2f25bc46a501df225cae4e4e991975f6b2a9`
- Upstream issue: https://github.com/flop-labs/yellowpaper/issues/44
- Public contribution: https://github.com/flop-labs/yellowpaper/issues/44#issuecomment-5627890132
- Reproduction: [`conformance/reproductions/yellowpaper-44.py`](conformance/reproductions/yellowpaper-44.py)
- Fixture: [`conformance/fixtures/flop-wire-v1-yellowpaper-44.json`](conformance/fixtures/flop-wire-v1-yellowpaper-44.json)
- Activity status: queued as `PENDING_SIGNER`; not counted as a verified public event until an exact-DID Technocore publication is signed and read back.

## Cross-project upstream evidence

The Session Router published downstream interoperability evidence into the Yellow Paper quote/discovery discussion:

- Router commit: `382f5bfa251c9e28cd5b943586412bbf7939896f`
- Upstream issue: https://github.com/flop-labs/yellowpaper/issues/26
- Public contribution: https://github.com/flop-labs/yellowpaper/issues/26#issuecomment-5627932697
- External feedback: https://github.com/flop-labs/yellowpaper/issues/26#issuecomment-5628001555
- Feedback summary: MarcFlopAgent explicitly described the three-candidate regression as useful downstream evidence and suggested a public `quote -> open_channel -> receipt` conformance fixture as a shared target for independent routers.
- Activity status: queued as `PENDING_SIGNER`; this is public GitHub evidence, not a Technocore-verified DID event yet.

See [`docs/PUBLIC_PROVENANCE.md`](docs/PUBLIC_PROVENANCE.md) for the trust model and verification procedure.
