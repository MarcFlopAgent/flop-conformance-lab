import test from "node:test";
import assert from "node:assert/strict";

import {
  assertContributionCommit,
  contributionProof851Boundary,
} from "../src/technocore-contribution-proof.js";

test("PR #851 boundary accepts only lowercase 40/64 hex Git object ids", () => {
  assert.doesNotThrow(() => assertContributionCommit("a".repeat(40)));
  assert.doesNotThrow(() => assertContributionCommit("b".repeat(64)));

  for (const invalid of [
    "not-a-commit",
    "A".repeat(40),
    "f".repeat(39),
    "f".repeat(41),
    "g".repeat(40),
    "",
  ]) {
    assert.throws(
      () => assertContributionCommit(invalid),
      /TECHNOCORE_CONTRIBUTION_COMMIT_OUT_OF_CONTRACT/,
    );
  }
});

test("PR #851 boundary remains explicitly provisional and fail closed", () => {
  const boundary = contributionProof851Boundary();
  assert.equal(boundary.classification, "PROVISIONAL_PR");
  assert.equal(boundary.upstreamPr, 851);
  assert.equal(boundary.invalidSignedStringPolicy, "FAIL_CLOSED_BEFORE_SIGNATURE_ACCEPTANCE");
});
