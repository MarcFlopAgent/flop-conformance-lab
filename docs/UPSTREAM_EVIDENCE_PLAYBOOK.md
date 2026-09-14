# Upstream evidence playbook

Use upstream threads as evidence channels, not promotion channels.

## Publish only when there is new evidence
A follow-up is justified when the Lab can attach one of:
- an independent reproduction;
- a deterministic fixture;
- a before -> upstream resolution -> conformance result;
- a downstream implementation failure that exposes a protocol boundary;
- a verified external CI result.

Do not post merely because a release exists or to repeat a repository link.

## Minimal follow-up shape
1. State the observed boundary or upstream change.
2. Link the immutable reproduction/fixture/consumer evidence.
3. State PASS/PARTIAL/FAIL and normative classification.
4. State what is deliberately not claimed.
5. Ask a question only when an unresolved normative choice remains.

## Existing proof points
Yellow Paper #26: Router downstream evidence -> shared fixture request -> Lab fixture -> upstream clarification.
Yellow Paper #44: Lab independent reproduction -> second independent implementation reached the same result.

These are distribution evidence because another implementation or upstream discussion consumed the result; they are not claims that FLOP Labs adopted Lab code.
