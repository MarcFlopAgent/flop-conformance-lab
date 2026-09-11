#!/usr/bin/env node
import {existsSync,readFileSync,readdirSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";
import {TARGET_DID,TARGET_FINGERPRINT,detectSigner,flushPending,loadConfig,loadIndex,preparePendingSignatures,queueMilestone,renderProfile,verifyRepositoryState} from "./core.mjs";
import {enrollPersistentSigner,loadPersistentSigner} from "./persistent-signer.mjs";

const root=dirname(dirname(fileURLToPath(import.meta.url)));
const [command,...args]=process.argv.slice(2),arg=args[0];
const emit=value=>console.log(JSON.stringify(value,null,2));

async function profileStatus(config){
  const output={};
  for(const [name,path] of [["canonical",config.technocore.profilePath],["legacy",config.technocore.legacyProfilePath]]){
    try{
      const response=await fetch(`https://technocore.chat${path}?format=json`,{redirect:"error",signal:AbortSignal.timeout(10000)});
      output[name]=response.status===404?"MISSING":response.ok?"FOUND":"UNAVAILABLE";
    }catch{output[name]="UNAVAILABLE";}
  }
  return output;
}

async function main(){
  const config=loadConfig(root);
  if(command==="signer-check")return emit(await detectSigner(await loadPersistentSigner(root,TARGET_DID)));
  if(command==="signer-enroll"){await enrollPersistentSigner(root,TARGET_DID);return emit(await detectSigner(await loadPersistentSigner(root,TARGET_DID)));}
  if(command==="publish-milestone"){
    if(!arg)throw Error("usage: identity publish-milestone EVENT.json");
    return emit(queueMilestone(root,JSON.parse(readFileSync(arg,"utf8"))));
  }
  if(command==="flush-pending")return emit(await flushPending(root));
  if(command==="prepare-signatures"){const signer=await loadPersistentSigner(root,TARGET_DID);if(!signer)throw Error("SIGNER_UNAVAILABLE");return emit(await preparePendingSignatures(root,signer,args));}
  if(command==="render-profile")return emit({status:(await detectSigner(await loadPersistentSigner(root,TARGET_DID))).status,profile:renderProfile(config)});
  if(command==="status"){
    const index=loadIndex(root),pendingDir=join(root,"identity","pending","events"),signer=await detectSigner(await loadPersistentSigner(root,TARGET_DID));
    return emit({did:TARGET_DID,fingerprint:TARGET_FINGERPRINT,signer:signer.status,technocoreProfile:await profileStatus(config),buildRoom:config.technocore.buildRoom,buildRoomStatus:config.technocore.buildRoomStatus,mailbox:config.technocore.mailbox,githubProvenance:config.projects.filter(project=>project.visibility==="PUBLIC_ACTIVE").length,activityLedger:index.metrics,pending:existsSync(pendingDir)?readdirSync(pendingDir).filter(name=>name.endsWith(".json")).length:0});
  }
  if(command==="verify"){
    const checks=verifyRepositoryState(root);
    const result=checks.some(check=>check.status==="FAIL")?"FAIL":checks.some(check=>check.status==="WARN")?"WARN":"PASS";
    return emit({did:TARGET_DID,result,checks});
  }
  throw Error("usage: identity <status|verify|signer-enroll|signer-check|render-profile|publish-milestone|prepare-signatures [FILE...]|flush-pending>");
}

main().catch(error=>{console.error(JSON.stringify({error:error.message}));process.exitCode=1;});
