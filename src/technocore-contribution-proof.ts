export const TECHNOCoreContributionProofPr = 851;
export const TECHNOCoreContributionSchema = "technocore-contribution-v1";

const GIT_OID = /^(?:[0-9a-f]{40}|[0-9a-f]{64})$/;

/**
 * Local fail-closed canary for open Technocore PR #851.
 * This is PROVISIONAL_PR policy, not released Technocore semantics.
 */
export function assertContributionCommit(commit: unknown): asserts commit is string {
  if (typeof commit !== "string" || !GIT_OID.test(commit)) {
    throw new Error("TECHNOCORE_CONTRIBUTION_COMMIT_OUT_OF_CONTRACT");
  }
}

export function contributionProof851Boundary() {
  return {
    schema: "technocore.contribution-proof-pr851-boundary.v1",
    classification: "PROVISIONAL_PR",
    upstreamPr: TECHNOCoreContributionProofPr,
    upstreamState: "OPEN",
    acceptedCommitGrammar: "lowercase hexadecimal Git object id, exactly 40 or 64 characters",
    invalidSignedStringPolicy: "FAIL_CLOSED_BEFORE_SIGNATURE_ACCEPTANCE",
    nonClaims: [
      "PR #851 is not merged or released.",
      "This canary does not claim complete v1 verifier compatibility.",
      "A valid signature over an invalid commit string is not a valid contribution proof.",
    ],
  } as const;
}

export const TECHNOCoreContributionOuterSchema = "technocore-contribution-proof-v1";

export interface DeployedContributionProofShape {
  artifact_url: string;
  commit: string;
  did: string;
  signature: string;
  schema: typeof TECHNOCoreContributionOuterSchema;
}

export function assertDeployedContributionProofShape(
  proof: unknown,
): asserts proof is DeployedContributionProofShape {
  if (typeof proof !== "object" || proof === null || Array.isArray(proof)) {
    throw new Error("TECHNOCORE_CONTRIBUTION_PROOF_SHAPE_OUT_OF_CONTRACT");
  }
  const value = proof as Record<string, unknown>;
  const keys = Object.keys(value).sort();
  const expected = ["artifact_url", "commit", "did", "schema", "signature"];
  if (JSON.stringify(keys) !== JSON.stringify(expected)) {
    throw new Error("TECHNOCORE_CONTRIBUTION_PROOF_SHAPE_OUT_OF_CONTRACT");
  }
  if (value.schema !== TECHNOCoreContributionOuterSchema) {
    throw new Error("TECHNOCORE_CONTRIBUTION_OUTER_SCHEMA_OUT_OF_CONTRACT");
  }
  assertContributionCommit(value.commit);
}
