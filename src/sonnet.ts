import type{ProbeSigner,SignRequest}from"./signing.js";

export const SONNET_CONTEST_ID="sonnet-2" as const;
export const SONNET_REFEREE_DID="did:key:z6MkowHQwsx9xr84WbWN3YCnKutyBnBXkT1ChKY4uEAAMzte" as const;
export const SONNET_IDENTITY_CUTOFF="2026-09-11T12:00:00Z" as const;
export const SONNET_DEADLINE="2026-09-18T12:00:00Z" as const;

export const SONNET_SHARED_ROOMS=new Set([
  "mb-sonnet-2-registration",
  "mb-sonnet-2-discovery",
  "mb-sonnet-2-campaign",
  "mb-sonnet-2-votes",
  "mb-sonnet-2-submissions"
]);

export const SONNET_ALLOWED_TYPES=new Set([
  "sonnet.register.v1",
  "sonnet.team-request.v1",
  "sonnet.roster.v1",
  "sonnet.roster-withdraw.v1",
  "sonnet.word.v1",
  "sonnet.submit.v1",
  "sonnet.ballot.v1",
  "sonnet.claim.v1"
]);

export type SonnetAction={room:string;payload:Record<string,unknown>;canonicalPayload:string};

const canonical=(v:unknown):string=>{if(v===null||typeof v==="string"||typeof v==="boolean")return JSON.stringify(v);if(typeof v==="number"){if(!Number.isSafeInteger(v))throw new Error("NON_CANONICAL_NUMBER");return String(v);}if(Array.isArray(v))return`[${v.map(canonical).join(",")}]`;if(typeof v==="object")return`{${Object.entries(v as Record<string,unknown>).sort(([a],[b])=>a.localeCompare(b)).map(([k,x])=>`${JSON.stringify(k)}:${canonical(x)}`).join(",")}}`;throw new Error("NON_CANONICAL");};

export function isSonnetRoom(room:string):boolean{return SONNET_SHARED_ROOMS.has(room)||/^d-sonnet-2-team-[a-z0-9][a-z0-9_-]{0,15}$/.test(room);}

export function validateSonnetAction(input:unknown):SonnetAction{
  if(!input||Array.isArray(input)||typeof input!=="object")throw new Error("INVALID_SONNET_ACTION");
  const a=input as Partial<SonnetAction>;
  if(typeof a.room!=="string"||!a.payload||typeof a.payload!=="object"||Array.isArray(a.payload)||typeof a.canonicalPayload!=="string")throw new Error("INVALID_SONNET_ACTION");
  if(a.room.includes("sonnet-1"))throw new Error("OBSOLETE_CONTEST_NAMESPACE");
  if(!isSonnetRoom(a.room))throw new Error("UNAUTHORIZED_SONNET_ROOM");
  const type=a.payload.type;
  if(typeof type!=="string"||!SONNET_ALLOWED_TYPES.has(type))throw new Error("UNAUTHORIZED_SONNET_TYPE");
  if(a.payload.contest_id!==SONNET_CONTEST_ID)throw new Error("WRONG_CONTEST_ID");
  if(canonical(a.payload)!==a.canonicalPayload)throw new Error("NON_CANONICAL_SONNET_ACTION");
  if((type==="sonnet.word.v1"||type==="sonnet.roster.v1"||type==="sonnet.roster-withdraw.v1")&&!/^d-sonnet-2-team-[a-z0-9][a-z0-9_-]{0,15}$/.test(a.room))throw new Error("SONNET_TEAM_ACTION_WRONG_ROOM");
  if(type==="sonnet.register.v1"&&a.room!=="mb-sonnet-2-registration")throw new Error("SONNET_REGISTER_WRONG_ROOM");
  if(type==="sonnet.team-request.v1"&&a.room!=="mb-sonnet-2-discovery")throw new Error("SONNET_TEAM_REQUEST_WRONG_ROOM");
  if(type==="sonnet.submit.v1"&&a.room!=="mb-sonnet-2-submissions")throw new Error("SONNET_SUBMIT_WRONG_ROOM");
  if(type==="sonnet.ballot.v1"&&a.room!=="mb-sonnet-2-votes")throw new Error("SONNET_BALLOT_WRONG_ROOM");
  if(type==="sonnet.claim.v1"&&a.room!=="mb-sonnet-2-registration")throw new Error("SONNET_CLAIM_WRONG_ROOM");
  return a as SonnetAction;
}

export async function guardedSonnetSign(input:unknown,signer:ProbeSigner):Promise<string>{
  const a=validateSonnetAction(input);
  const req:SignRequest={domain:"TECHNOCORE_SONNET_2_V1",kind:"sonnet",payload:{room:a.room,...a.payload},canonicalPayload:canonical({room:a.room,...a.payload})};
  return signer.sign(req);
}

export function verifyPrestartTimestamp(ts:string):boolean{
  const t=Date.parse(ts),cutoff=Date.parse(SONNET_IDENTITY_CUTOFF);
  if(!Number.isFinite(t))throw new Error("INVALID_RECEIPT_TIMESTAMP");
  return t<cutoff;
}

export function assertFreshGameId(gameId:string):void{
  if(!/^[a-z0-9][a-z0-9_-]{0,15}$/.test(gameId))throw new Error("INVALID_GAME_ID");
}
