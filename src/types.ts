export type NormativeStatus="RELEASE_NORMATIVE"|"PINNED_UPSTREAM"|"PROVISIONAL_PR"|"OPEN_ISSUE"|"TARGET_SPEC"|"LOCAL_POLICY";
export type ConformanceLane="RELEASE_CONFORMANCE"|"UPSTREAM_CONFORMANCE"|"TARGET_SPEC_CONFORMANCE"|"LIVE_CONFORMANCE";
export interface CaseResult{id:string;suite:string;status:"PASS"|"FAIL"|"SKIP";normativeStatus:NormativeStatus;durationMs:number;details?:Record<string,unknown>}
export interface LabReport{version:string;generatedAt:string;summary:{pass:number;fail:number;skip:number};lanes:Record<ConformanceLane,"ACTIVE"|"MANIFEST_ONLY"|"PUBLIC_RUNTIME_UNAVAILABLE">;cases:CaseResult[];sources:unknown}
export interface TechnocoreRecord{seq:number;ts:string;from:string;text:string;nonce?:number|string;sig?:string}
export interface TransportRecord extends TechnocoreRecord{room:string;generation:number}
