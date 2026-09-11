#!/usr/bin/env python3
"""Independent reproduction for flop-labs/yellowpaper#44.

Uses only Python's standard library and constants pinned from the official
flop-wire-v1 corpus at commit 3eaf2f25bc46a501df225cae4e4e991975f6b2a9.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
FIXTURE = HERE.parent / "fixtures" / "flop-wire-v1-yellowpaper-44.json"


def blake2_256(data: bytes) -> bytes:
    return hashlib.blake2b(data, digest_size=32).digest()


def root_from_path(leaf: bytes, path: list[tuple[bytes, bool]]) -> bytes:
    current = leaf
    for sibling, sibling_is_left in path:
        preimage = sibling + current if sibling_is_left else current + sibling
        current = blake2_256(preimage)
    return current


def flipped(path: list[tuple[bytes, bool]], level: int) -> list[tuple[bytes, bool]]:
    result = list(path)
    sibling, sibling_is_left = result[level]
    result[level] = (sibling, not sibling_is_left)
    return result


def main() -> None:
    fixture = json.loads(FIXTURE.read_text(encoding="utf-8"))
    merkle = fixture["merkle"]

    leaf = bytes.fromhex(merkle["leaf_v3_hex"])
    root = bytes.fromhex(merkle["root_hex"])
    path = [
        (bytes.fromhex(item["sibling_hex"]), bool(item["sibling_is_left"]))
        for item in merkle["path_for_index_2"]
    ]

    published_ok = root_from_path(leaf, path) == root
    level0_self_sibling = path[0][0] == leaf
    level0_flip_ok = root_from_path(leaf, flipped(path, 0)) == root
    level1_flip_ok = root_from_path(leaf, flipped(path, 1)) == root

    assert published_ok, "pinned official path must reconstruct the committed root"
    assert level0_self_sibling, "level 0 must be the duplicated odd V3 node"
    assert level0_flip_ok, (
        "flipping orientation of an identical self-sibling must leave the hash preimage unchanged"
    )
    assert not level1_flip_ok, (
        "control: flipping orientation where sibling != running node must change the root"
    )

    print("upstream profile:", fixture["upstream"]["profile"])
    print("vector:", fixture["upstream"]["vector"])
    print("upstream expected:", fixture["upstream"]["expected"])
    print("published path -> committed root:", published_ok)
    print("level-0 sibling is V3 itself:", level0_self_sibling)
    print("level 0 flipped -> committed root:", level0_flip_ok)
    print("level 1 flipped -> committed root:", level1_flip_ok)
    print("classification:", fixture["classification"])


if __name__ == "__main__":
    main()
