# Upstream vector discrepancies

## FLOP `flop-wire-v1` — `wrong_path_orientation`

**Status:** independently reproduced against `flop-labs/yellowpaper@3eaf2f25bc46a501df225cae4e4e991975f6b2a9`.

**Upstream issue:** https://github.com/flop-labs/yellowpaper/issues/44

The published negative vector expects `reject LeafNotInRoot`. The pinned Merkle path proves V3 at index 2 of a three-leaf tree whose odd last node is duplicated. At level 0 the sibling is therefore the V3 leaf itself.

Independent reproduction shows:

- published path -> committed root: `true`
- level-0 orientation flipped where sibling == running node -> committed root: `true`
- level-1 orientation flipped where sibling != running node -> committed root: `false`

Classification: `UPSTREAM_VECTOR_EXPECTATION_CONFLICT`.

This is evidence of a corpus expectation discrepancy, not a claim that the Merkle construction permits forging membership proofs.

Reproduce with Python 3.10+ and no third-party dependencies:

```bash
python conformance/reproductions/yellowpaper-44.py
```

Pinned fixture: [`conformance/fixtures/flop-wire-v1-yellowpaper-44.json`](../conformance/fixtures/flop-wire-v1-yellowpaper-44.json)

Builder provenance: [`PROVENANCE.md`](../PROVENANCE.md)
