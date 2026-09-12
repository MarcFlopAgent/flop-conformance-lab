# Publication status

This file distinguishes repository/package state, Git tag state, and GitHub Release state so public documentation does not imply that an unpublished asset already exists.

## Current repository state

- Package metadata: `0.1.4`.
- `main` passes the full local check suite, including Windows package smoke and conformance.
- Public tag `v0.1.4-alpha` exists on the tested release commit.
- Local release artifact `flop-tools-conformance-lab-0.1.4.tgz` and `SHA256SUMS` were generated from that tested tree.
- GitHub Release `v0.1.4-alpha` is published as a prerelease with `flop-tools-conformance-lab-0.1.4.tgz` and `SHA256SUMS` attached.

Therefore `v0.1.4-alpha` is a **published GitHub prerelease with downloadable, checksummed assets**.

## Publication acceptance gate

A version may be described as a published GitHub Release only after all of the following exist for the same immutable commit:

- package version;
- report version generated from the same package metadata;
- passing CI/check suite;
- release tag;
- GitHub Release entry;
- packaged artifact(s);
- SHA-256 checksum manifest;
- protocol/source compatibility manifest or equivalent pinned evidence where applicable.

Until then, use `tagged repository/package state` or `pending GitHub Release asset publication` rather than `published GitHub Release`.
