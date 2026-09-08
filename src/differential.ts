export interface DifferentialCase<Input=unknown,Output=unknown>{id:string;normativeSource:string;input:Input;expected?:Output}

export interface DifferentialImplementationAdapter<Input=unknown,Output=unknown>{
  id:string;
  authority:"NON_AUTHORITATIVE";
  evaluate(testCase:DifferentialCase<Input,Output>):Promise<Output>;
}

export interface DifferentialResult<Output=unknown>{implementationId:string;caseId:string;authority:"NON_AUTHORITATIVE";output:Output;matchesNormative:boolean|"UNRESOLVED"}

export async function runDifferential<Input,Output>(adapter:DifferentialImplementationAdapter<Input,Output>,testCase:DifferentialCase<Input,Output>,compare:(actual:Output,expected:Output)=>boolean):Promise<DifferentialResult<Output>>{
  const output=await adapter.evaluate(testCase);
  return{implementationId:adapter.id,caseId:testCase.id,authority:adapter.authority,output,matchesNormative:testCase.expected===undefined?"UNRESOLVED":compare(output,testCase.expected)};
}
