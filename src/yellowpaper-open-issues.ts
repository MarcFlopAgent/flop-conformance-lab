import { readFileSync } from "node:fs";
import { receiptMessageV1 } from "./flop-quote-boundary.js";

const FIXTURE_URL = new URL(
  "../conformance/fixtures/yellowpaper-56-57-v0.5.0.json",
  import.meta.url,
);

const PINNED_YELLOWPAPER_COMMIT = "3eaf2f25bc46a501df225cae4e4e991975f6b2a9";

type Canary = {
  currentState: string;
  promotionTarget: string;
  promoteOnlyWhenAll: string[];
  before: string;
  requiredResolutionEvidence: Record<string, string>;
  forbidPromotionWhen: string[];
};

type Fixture = {
  id: string;
  classification: string;
  upstream: { commit: string; issues: number[] };
  resolutionCanaries: {
    issue56: Canary;
    issue57: Canary;
    followUpPolicy: {
      mode: string;
      requiredShape: string[];
      noFollowUpWhileOpen: boolean;
      releasePolicy: string;
    };
  };
  payableBoundary: {
    status: string;
    reason: string;
    unitStatus: string;
    commonReceiptFields: {
      channelIdHex: string;
      finalRootHex: string;
      aggregateGn: string;
    };
    interpretations: Array<{ id: string; payable: string }>;
    mustNotInfer: string[];
  };
  merkleBoundary: {
    status: string;
    nodeRule: string;
    nodePreimageBytes: number;
    nodeCarriesAggregate: boolean;
    aggregateCheck: string;
    mustNotInclude: string[];
    vector: { leftHex: string; rightHex: string; expectedNodePreimageHex: string };
  };
  scope: Record<string, boolean>;
};

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

function parseHex32(value: string, label: string): Buffer {
  assert(/^[0-9a-f]{64}$/i.test(value), `${label}_MUST_BE_32_BYTES_HEX`);
  return Buffer.from(value, "hex");
}

function validateCanary(issue: number, canary: Canary, required: string[]): void {
  assert(canary.currentState === "OPEN_ISSUE", `ISSUE_${issue}_CANARY_MUST_REMAIN_OPEN`);
  assert(canary.promotionTarget === "TARGET_SPEC", `ISSUE_${issue}_PROMOTION_TARGET_DIVERGENCE`);
  for (const criterion of required) {
    assert(canary.promoteOnlyWhenAll.includes(criterion), `ISSUE_${issue}_MISSING_PROMOTION_CRITERION_${criterion}`);
  }
  assert(canary.forbidPromotionWhen.length > 0, `ISSUE_${issue}_PROMOTION_GUARDS_MISSING`);
}

export function resolutionCanaryStatus(): Record<string, unknown> {
  const fixture = JSON.parse(readFileSync(FIXTURE_URL, "utf8")) as Fixture;
  return {
    classification: fixture.classification,
    issue56: fixture.resolutionCanaries.issue56,
    issue57: fixture.resolutionCanaries.issue57,
    followUpPolicy: fixture.resolutionCanaries.followUpPolicy,
  };
}

export function validateYellowpaper5657Fixture(): Record<string, unknown> {
  const fixture = JSON.parse(readFileSync(FIXTURE_URL, "utf8")) as Fixture;

  assert(fixture.upstream.commit === PINNED_YELLOWPAPER_COMMIT, "YELLOWPAPER_PIN_DIVERGENCE");
  assert(fixture.upstream.issues.includes(56), "ISSUE_56_NOT_PINNED");
  assert(fixture.upstream.issues.includes(57), "ISSUE_57_NOT_PINNED");

  validateCanary(56, fixture.resolutionCanaries.issue56, [
    "payable_semantics_defined_normatively",
    "payable_unit_defined_normatively",
    "payable_value_origin_defined_for_receipt_verification",
    "new_upstream_source_pinned_by_commit",
    "fixture_reproduces_new_rule_without_local_inference",
  ]);
  validateCanary(57, fixture.resolutionCanaries.issue57, [
    "sum_tree_wording_removed_or_normatively_reconciled",
    "merkle_node_preimage_unambiguous",
    "aggregate_gn_binding_location_unambiguous",
    "new_upstream_source_pinned_by_commit",
    "fixture_reproduces_new_rule_without_local_inference",
  ]);
  assert(
    fixture.resolutionCanaries.followUpPolicy.mode === "SINGLE_TECHNICAL_FOLLOW_UP_AFTER_RESOLUTION",
    "FOLLOW_UP_POLICY_DIVERGENCE",
  );
  assert(
    fixture.resolutionCanaries.followUpPolicy.requiredShape.join("|") === "before|resolution|conformance_result",
    "FOLLOW_UP_SHAPE_DIVERGENCE",
  );
  assert(fixture.resolutionCanaries.followUpPolicy.noFollowUpWhileOpen, "FOLLOW_UP_MUST_WAIT_FOR_RESOLUTION");
  assert(
    fixture.resolutionCanaries.followUpPolicy.releasePolicy === "BATCH_WITH_NEXT_CONFORMANCE_LAB_RELEASE",
    "RELEASE_POLICY_DIVERGENCE",
  );

  assert(fixture.payableBoundary.status === "FAIL_CLOSED", "PAYABLE_BOUNDARY_MUST_FAIL_CLOSED");
  assert(
    fixture.payableBoundary.reason === "PAYABLE_SEMANTICS_UNRESOLVED",
    "PAYABLE_BOUNDARY_REASON_DIVERGENCE",
  );
  assert(fixture.payableBoundary.unitStatus === "UNRESOLVED", "PAYABLE_UNIT_MUST_REMAIN_UNRESOLVED");
  assert(fixture.payableBoundary.interpretations.length === 2, "PAYABLE_INTERPRETATION_COUNT_DIVERGENCE");

  const [first, second] = fixture.payableBoundary.interpretations;
  assert(first !== undefined && second !== undefined, "PAYABLE_INTERPRETATIONS_MISSING");
  assert(first.payable !== second.payable, "PAYABLE_INTERPRETATIONS_MUST_DIVERGE");

  const common = fixture.payableBoundary.commonReceiptFields;
  const firstMessage = receiptMessageV1({ ...common, payable: first.payable });
  const secondMessage = receiptMessageV1({ ...common, payable: second.payable });
  assert(!firstMessage.equals(secondMessage), "PAYABLE_DIVERGENCE_MUST_CHANGE_RECEIPT_PREIMAGE");

  for (const forbidden of [
    "payable_equals_reserved_escrow",
    "payable_equals_metered_amount",
    "payable_unit_is_flop_base_units",
    "settle_reconstructs_payable_by_unspecified_rule",
  ]) {
    assert(fixture.payableBoundary.mustNotInfer.includes(forbidden), `MISSING_GUARD_${forbidden}`);
  }

  assert(
    fixture.merkleBoundary.nodeRule === "blake2_256(left || right)",
    "MERKLE_NODE_RULE_DIVERGENCE",
  );
  assert(fixture.merkleBoundary.nodePreimageBytes === 64, "MERKLE_NODE_PREIMAGE_LENGTH_DIVERGENCE");
  assert(fixture.merkleBoundary.nodeCarriesAggregate === false, "MERKLE_NODE_MUST_NOT_CARRY_AGGREGATE");
  assert(
    fixture.merkleBoundary.aggregateCheck === "ARITHMETIC_SEPARATE",
    "AGGREGATE_CHECK_MUST_BE_SEPARATE",
  );
  assert(fixture.merkleBoundary.mustNotInclude.includes("aggregate_gn"), "MERKLE_NODE_AGGREGATE_GUARD_MISSING");
  assert(fixture.merkleBoundary.mustNotInclude.includes("subtree_sum"), "MERKLE_SUM_TREE_GUARD_MISSING");

  const left = parseHex32(fixture.merkleBoundary.vector.leftHex, "LEFT");
  const right = parseHex32(fixture.merkleBoundary.vector.rightHex, "RIGHT");
  const preimage = Buffer.concat([left, right]);
  assert(preimage.length === 64, "MERKLE_PREIMAGE_MUST_BE_64_BYTES");
  assert(
    preimage.toString("hex") === fixture.merkleBoundary.vector.expectedNodePreimageHex,
    "MERKLE_PREIMAGE_DIVERGENCE",
  );

  assert(!fixture.scope.networkMutation, "FIXTURE_MUST_BE_OFFLINE");
  assert(!fixture.scope.liveSettlement, "FIXTURE_MUST_NOT_SETTLE");
  assert(!fixture.scope.signatureGeneration, "FIXTURE_MUST_NOT_SIGN");
  assert(!fixture.scope.claimIssueResolved, "OPEN_ISSUES_MUST_NOT_BE_CLAIMED_RESOLVED");
  assert(!fixture.scope.claimPayableSemantics, "PAYABLE_SEMANTICS_MUST_NOT_BE_INVENTED");
  assert(!fixture.scope.claimMerkleSumTree, "MERKLE_SUM_TREE_MUST_NOT_BE_CLAIMED");

  return {
    fixture: fixture.id,
    classification: fixture.classification,
    yellowpaperCommit: fixture.upstream.commit,
    payableBoundary: fixture.payableBoundary.reason,
    payableUnit: fixture.payableBoundary.unitStatus,
    receiptPreimagesDiffer: true,
    merkleNodeRule: fixture.merkleBoundary.nodeRule,
    merkleNodePreimageBytes: preimage.length,
    aggregateCheck: fixture.merkleBoundary.aggregateCheck,
    issues: fixture.upstream.issues,
    resolutionCanaries: {
      issue56: fixture.resolutionCanaries.issue56.currentState,
      issue57: fixture.resolutionCanaries.issue57.currentState,
      promotionTarget: "TARGET_SPEC",
      followUpPolicy: fixture.resolutionCanaries.followUpPolicy.mode,
      releasePolicy: fixture.resolutionCanaries.followUpPolicy.releasePolicy,
    },
  };
}
