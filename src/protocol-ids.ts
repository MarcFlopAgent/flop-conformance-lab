import { contractId, offerId } from "@flop-labs/tclk";

// UPSTREAM_COMPATIBILITY_WORKAROUND: @flop-labs/tclk@0.1.0 hashes every
// enumerable property supplied to offerId/contractId. Project decoded runtime
// objects onto the normative tclk/1 fields before deriving protocol IDs.
const OFFER_FIELDS=["type","from","role","amount","asset","lock","rails","claimByMs","refundAfterMs","expiresMs","paymentKey","job","nonce"] as const;
const OFFER_FRAME=[...OFFER_FIELDS,"id"] as const;
const ACCEPT_CORE=["from","ref","statement","paymentKey","nonce"] as const;

function project(value:Record<string,unknown>,keys:readonly string[]){return Object.fromEntries(keys.filter(k=>value[k]!==undefined).map(k=>[k,value[k]]));}

export function normativeOfferId(value:Record<string,unknown>):string{return offerId(project(value,OFFER_FIELDS) as never);}
export function normativeContractId(offer:Record<string,unknown>,accept:Record<string,unknown>):string{return contractId(project(offer,OFFER_FRAME) as never,project(accept,ACCEPT_CORE) as never);}
