"use strict";(()=>{var e={};e.id=729,e.ids=[729],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},8072:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>f,patchFetch:()=>y,requestAsyncStorage:()=>m,routeModule:()=>p,serverHooks:()=>x,staticGenerationAsyncStorage:()=>u});var a={};i.r(a),i.d(a,{POST:()=>h});var r=i(9303),n=i(8716),o=i(3131),s=i(7070);let l=process.env.OLLAMA_URL||"http://localhost:11434",c=process.env.OLLAMA_MODEL||"llama3";async function d(e){let t=await fetch(`${l}/api/chat`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:c,messages:e,stream:!1})});if(!t.ok){let e=await t.text();throw Error(`Ollama API error: ${t.status} ${e}`)}let i=await t.json();return i.message?.content||i.response||"{}"}async function h(e){try{let{selectedText:t,contextText:i,sourceType:a,scenarioMeta:r,viewMode:n}=await e.json();if(!t||"string"!=typeof t)return s.NextResponse.json({error:"Missing or invalid selectedText"},{status:400});if(t.toLowerCase(),[/what should i do/i,/how do i treat/i,/should i take/i,/can you help me/i,/what medicine/i,/dose|dosing/i].some(e=>e.test(t)))return s.NextResponse.json({term:t.trim(),definitionSimple:"I can explain medical terms, but I can't give personal medical advice. If you have health concerns, please see a licensed healthcare professional.",definitionClinical:"This appears to be a request for medical advice, which cannot be provided. Consult a licensed healthcare professional for personal medical concerns.",whyItMatters:"Medical advice requires a proper evaluation by a qualified healthcare provider.",whyItMattersHere:"Medical advice requires a proper evaluation by a qualified healthcare provider.",example:"This is for educational purposes only.",exampleFromContext:"This is for educational purposes only.",source:"ai"});let o=`You are a medical education assistant for high school students.
The user highlighted a term or phrase from a simulated medical case.
You MUST use the provided context text to infer the meaning in that situation.

CRITICAL RULES:
- Use the context text to understand how the term is used in this specific case
- If the term is medical, give a clear definition
- If it's used as a clinical adjective (like "tachycardic"), explain what it indicates in that context (e.g., "fast heart rate")
- Do NOT give medical advice, treatment instructions, dosing, or personal guidance
- Keep it accurate, concrete, and student-friendly
- If the phrase is not medical, explain it as general English
- Always emphasize that this is educational, not medical advice

Return ONLY valid JSON with this exact structure (no markdown, no extra text):
{
  "term": "the exact term or phrase as highlighted",
  "definitionSimple": "plain English explanation for high school students, using context when helpful",
  "definitionClinical": "more technical medical definition",
  "whyItMatters": "brief explanation of why this term is important medically",
  "whyItMattersHere": "specific explanation of why this matters in the context provided (reference the context)",
  "example": "a simple example sentence using the term",
  "exampleFromContext": "a short rephrased example based on the provided context (not a generic placeholder)",
  "synonymsOrRelated": ["synonym1", "related term2"] (optional array)
}

The "whyItMattersHere" field MUST explicitly reference what the context suggests.
The "exampleFromContext" should be a short rephrased example based on the provided context.`,l=i?`

Context from ${a||"the case"}:
${i}`:"",c=r?`

Scenario: ${r.scenarioTitle||""}
Chief Complaint: ${r.chiefComplaint||""}
Specialty: ${r.specialty||""}`:"",h=`Explain this term or phrase: "${t.trim()}"
${l}${c}

Provide both simple (for high school students) and clinical definitions.
Use the context to understand how this term is being used in this specific case.
If the term is used as a clinical descriptor (like "tachycardic" meaning "having a fast heart rate"), explain what it indicates in this context.`,p=await d([{role:"system",content:o},{role:"user",content:h}]),m=p,u=p.match(/\{[\s\S]*\}/);u&&(m=u[0]);try{let e=JSON.parse(m);if(!e.term||!e.definitionSimple)throw Error("Invalid response format");return s.NextResponse.json({term:e.term||t.trim(),definitionSimple:e.definitionSimple||"",definitionClinical:e.definitionClinical||e.definitionSimple||"",whyItMatters:e.whyItMatters||"This is an important medical term to understand.",whyItMattersHere:e.whyItMattersHere||e.whyItMatters||"",example:e.example||`Example: The term "${t.trim()}" is used in medical contexts.`,exampleFromContext:e.exampleFromContext||e.example||"",synonymsOrRelated:e.synonymsOrRelated||[],source:"ai"})}catch(e){return s.NextResponse.json({term:t.trim(),definitionSimple:`The term "${t.trim()}" is used in medical contexts. This is a general term that may need context to fully understand.`,definitionClinical:`The term "${t.trim()}" may refer to a medical concept, condition, or procedure. Consult medical resources for specific definitions.`,whyItMatters:"Understanding medical terminology helps in learning about healthcare.",whyItMattersHere:i?`In this case: ${i.substring(0,100)}...`:"Understanding medical terminology helps in learning about healthcare.",example:`Example usage of "${t.trim()}".`,exampleFromContext:i?`In this case: ${t.trim()} appears in the context provided.`:`Example usage of "${t.trim()}".`,synonymsOrRelated:[],source:"ai"})}}catch(e){return console.error("Error in explain-term API:",e),s.NextResponse.json({error:"Failed to explain term",details:e.message||"Unknown error"},{status:500})}}let p=new r.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/explain-term/route",pathname:"/api/explain-term",filename:"route",bundlePath:"app/api/explain-term/route"},resolvedPagePath:"/home/runner/work/Brinmeet123.github.io/Brinmeet123.github.io/app/api/explain-term/route.ts",nextConfigOutput:"standalone",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:u,serverHooks:x}=p,f="/api/explain-term/route";function y(){return(0,o.patchFetch)({serverHooks:x,staticGenerationAsyncStorage:u})}}};var t=require("../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),a=t.X(0,[276,972],()=>i(8072));module.exports=a})();