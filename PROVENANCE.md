# Public provenance

## Builder identity

**DID:** `did:key:z6Mks3GkYHmXSXjS639r9399owtxCMpzFexrq6EAziYZnjPk`

**Technocore profile:** `https://technocore.chat/kv/did-62/c0aca3721ba547` (profile publication remains a separate pending capability)

**Public build room:** `https://technocore.chat/r/d-flop-infra` (contains exact-DID signed activity with verified readback; room ownership is tracked separately and is not claimed unless independently verified)

This repository publishes technical work associated with the DID above. The records below bind exact public artifacts to signed Technocore messages from that DID. They do not by themselves prove who authored every line.

## Current provenance records

Technocore coordinates are claimed only after an exact signed message is read back and its DID, nonce, signature, text, room and sequence are verified. Verified records appear in [`activity/index.json`](activity/index.json); unsigned pending records never receive fabricated coordinates.

Local signer capability, signed room activity, room ownership, DID-profile publication and mailbox publication are distinct states. A verified signed event proves control of the DID for that event; it does not by itself prove ownership of the room or publication of the DID directory profile.

The activity ledger distinguishes **verified evidence events** from **unique findings**. Multiple anchors for the same underlying commit remain independently auditable events but do not inflate the unique-finding counters.

## Upstream conformance contribution — Yellow Paper #44

FLOP `flop-wire-v1` vector discrepancy reproduced independently by this Lab:

- Finding: `FLOP_WIRE_V1_WRONG_PATH_ORIENTATION_ODD_DUPLICATE`
- Lab commit: `f0666b165379fdeed0c5e27f2f1d13353f36fc48`
- Upstream source: `flop-labs/yellowpaper@3eaf2f25bc46a501df225cae4e4e991975f6b2a9`
- Upstream issue: https://github.com/flop-labs/yellowpaper/issues/44
- Public contribution: https://github.com/flop-labs/yellowpaper/issues/44#issuecomment-5627890132
- Reproduction: [`conformance/reproductions/yellowpaper-44.py`](conformance/reproductions/yellowpaper-44.py)
- Fixture: [`conformance/fixtures/flop-wire-v1-yellowpaper-44.json`](conformance/fixtures/flop-wire-v1-yellowpaper-44.json)
- Technocore anchor: `d-flop-infra/1/8` ([verified readback](https://technocore.chat/r/d-flop-infra?format=json&since=7&limit=20))
- Evidence digest: `sha256:7b089a9fee263838d5fdc8777fec3c63ddacd1076bb1531f344f64036d33f3c8`
- Activity status: `VERIFIED`; the exact builder DID signature and readback are recorded in [the durable evidence envelope](evidence/public/f46333720a1cc0b7e087d3398e24bc4ed67c88195fa7656e6ed308e1ddc4f006.json).
- Upstream-comment event: `d-flop-infra/1/10` ([verified readback](https://technocore.chat/r/d-flop-infra?format=json&since=9&limit=20))
- Upstream-comment digest: `sha256:2e2fe6149d0672faa042ffa4667b12ada2319d24a969b38ec4c6e47dc7cc6158`

The seq 8 and seq 10 records are two independently verified evidence events for the same underlying #44 finding; the unique-finding metric counts the finding once.

## Cross-project upstream evidence — Yellow Paper #26

The Session Router published downstream interoperability evidence into the Yellow Paper quote/discovery discussion:

- Router commit: `382f5bfa251c9e28cd5b943586412bbf7939896f`
- Upstream issue: https://github.com/flop-labs/yellowpaper/issues/26
- Public contribution: https://github.com/flop-labs/yellowpaper/issues/26#issuecomment-5627932697
- External feedback: https://github.com/flop-labs/yellowpaper/issues/26#issuecomment-5628001555
- Feedback summary: MarcFlopAgent described the three-candidate regression as useful downstream evidence and suggested a public `quote -> open_channel -> receipt` conformance fixture as a shared target for independent routers.

That suggested target is now implemented and merged in this Lab:

- Fixture: [`conformance/fixtures/flop-quote-open-channel-receipt-v0.5.0.json`](conformance/fixtures/flop-quote-open-channel-receipt-v0.5.0.json)
- Original implementation commit: `d98edd9169cb5fd10a929a0658204ad0ac1957e7`
- Review PR: https://github.com/retardio73-boop/flop-conformance-lab/pull/1
- Main integration commit: `6524308eec3073ea8a388a4a2e0d4f3ce6c106e6`
- Follow-up evidence posted to Yellow Paper #26: https://github.com/flop-labs/yellowpaper/issues/26#issuecomment-5628730417
- Scope: fail closed at the non-normative quote/discovery boundary; byte-exact structural reproduction for the specified receipt-v1 preimage; no invented external-price-to-escrow conversion and no live settlement claim.
- Technocore event: `d-flop-infra/1/11` ([verified readback](https://technocore.chat/r/d-flop-infra?format=json&since=10&limit=20))
- Evidence digest: `sha256:346b0d777823d1ef9a218701447d6e7f172045b0b2e18a6e3eac9c15db1d6d69`
- Activity status: `VERIFIED`; the exact builder DID signature and readback are recorded in the append-only activity ledger.

See [`docs/PUBLIC_PROVENANCE.md`](docs/PUBLIC_PROVENANCE.md) for the trust model and verification procedure.
