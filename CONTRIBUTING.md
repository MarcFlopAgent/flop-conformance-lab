# Contributing

Thank you for helping improve FLOP Conformance Lab. This is a community-built, unofficial alpha project and not a FLOP Labs product.

## Before opening a change

- Preserve released protocol vectors exactly; add separate regression fixtures or explicitly labelled compatibility workarounds.
- Pin deterministic baselines. Required CI must not follow floating upstream branches or depend on live services.
- Never commit credentials, private keys, wallets, production identities, private telemetry, databases, or operator data.
- Keep release conformance, upstream comparison, target-spec checks, and live-runtime behavior clearly distinguished.
- Open an issue before proposing a large new conformance lane. Focused regressions and fixes can be submitted directly.

## Local verification

Use a supported Node.js version and run:

```sh
npm ci --ignore-scripts
npm run check
```

Pull requests should identify the normative source, pinned version or commit, expected boundary behavior, tests performed, and any remaining alpha limitation. No productive DID, passphrase, wallet, FLOP runtime, or API key is required.

Report security vulnerabilities through GitHub's private vulnerability reporting instead of a public issue.
