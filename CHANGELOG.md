# Changelog

## 0.1.3-alpha - 2026-09-08

- Separate release, pinned-upstream, target-spec, and live conformance lanes.
- Keep FLOP E.51 wire closure explicitly unresolved and public runtime conformance unavailable.
- Add a non-authoritative differential adapter seam without copying community implementations.

## 0.1.2-alpha - 2026-09-08

- Include all pinned runtime dependency tarballs in the clean-package offline smoke test so a cold CI cache cannot trigger registry access.

## 0.1.1-alpha - 2026-09-08

- Make clean-package smoke tests deterministic and offline by installing the lockfile-pinned local TCLK tarball alongside the Lab tarball.

## 0.1.0-alpha - 2026-09-08

- Initial cross-system TCLK, Technocore, signing, Router and FLOP target-spec lanes, including normative-field ID regression coverage.
