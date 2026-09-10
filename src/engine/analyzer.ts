import type { Finding, ProjectFile, Severity } from '../types';
const rules: Array<{id:string;title:string;severity:Severity;re:RegExp;message:string}> = [
{id:'SEC001',title:'Possible hard-coded secret',severity:'high',re:/(api[_-]?key|secret|password|token)\s*[:=]\s*["'][^"']{8,}["']/i,message:'A credential-like value appears to be embedded in source code.'},
{id:'SEC002',title:'Private key material',severity:'critical',re:/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,message:'Private key material was detected. Never commit private keys.'},
{id:'SEC003',title:'Dangerous eval',severity:'high',re:/\beval\s*\(/,message:'eval() executes dynamically supplied code and can create injection risk.'},
{id:'SEC004',title:'Potential command injection',severity:'high',re:/child_process\.(?:exec|execSync)\s*\(/,message:'Shell execution should validate and constrain untrusted input.'},
{id:'SEC005',title:'Debug logging',severity:'low',re:/console\.log\s*\(/,message:'Debug logs may expose sensitive runtime data in production.'},
{id:'SEC006',title:'Wildcard CORS',severity:'medium',re:/Access-Control-Allow-Origin["'\s:=]+["']\*["']/,message:'Wildcard CORS can expose resources to arbitrary origins.'},
];
export function analyzeFiles(files: ProjectFile[]): Finding[] {
 const findings: Finding[]=[];
 for (const file of files) {
  const lines=file.content.split(/\r?\n/);
  lines.forEach((line,i)=>rules.forEach(rule=>{ if(rule.re.test(line)) findings.push({id:`${rule.id}-${i+1}-${file.path}`,rule:rule.id,title:rule.title,severity:rule.severity,file:file.path,line:i+1,message:rule.message}); }));
 }
 return findings;
}
export function healthScore(findings: Finding[], fileCount:number): number {
 const weights:Record<Severity,number>={critical:30,high:15,medium:8,low:3,info:1};
 return Math.max(0,Math.min(100,100-findings.reduce((n,f)=>n+weights[f.severity],0)-Math.max(0,10-fileCount)));
}
