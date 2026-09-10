import type { Finding, ProjectFile, Severity } from '../types';

type Rule = {
  id: string;
  title: string;
  severity: Severity;
  re: RegExp;
  message: string;
};

// Deterministic, dependency-free heuristic rules. These are signals for review,
// not a replacement for SAST/DAST, dependency auditing, or human review.
const rules: Rule[] = [
  { id:'SEC001', title:'Possible hard-coded secret', severity:'high', re:/(api[_-]?key|secret|password|token|access[_-]?token)\s*[:=]\s*["'][^"']{8,}["']/i, message:'A credential-like value appears to be embedded in source code.' },
  { id:'SEC002', title:'Private key material', severity:'critical', re:/-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----/, message:'Private key material was detected. Never commit private keys.' },
  { id:'SEC003', title:'Dangerous eval', severity:'high', re:/\beval\s*\(/, message:'eval() executes dynamically supplied code and can create injection risk.' },
  { id:'SEC004', title:'Potential command injection', severity:'high', re:/child_process\.(?:exec|execSync|spawn|spawnSync)\s*\(/, message:'Shell/process execution should validate and constrain untrusted input.' },
  { id:'SEC005', title:'Debug logging', severity:'low', re:/console\.(?:log|debug|info)\s*\(/, message:'Debug logs can expose sensitive runtime data in production.' },
  { id:'SEC006', title:'Wildcard CORS', severity:'medium', re:/Access-Control-Allow-Origin["'\s:=]+["']\*["']/i, message:'Wildcard CORS can expose resources to arbitrary origins.' },
  { id:'SEC007', title:'DOM XSS sink', severity:'high', re:/\.(?:innerHTML|outerHTML)\s*=|insertAdjacentHTML\s*\(/, message:'A DOM HTML sink can execute attacker-controlled markup if input is not safely encoded.' },
  { id:'SEC008', title:'document.write usage', severity:'medium', re:/\bdocument\.write(?:ln)?\s*\(/, message:'document.write can create DOM injection and rendering risks.' },
  { id:'SEC009', title:'SQL string construction', severity:'high', re:/(?:SELECT|INSERT|UPDATE|DELETE)\b[^\n]*(?:\+|\$\{|`\s*\+)/i, message:'SQL appears to be constructed with string interpolation or concatenation; use parameterized queries.' },
  { id:'SEC010', title:'Insecure HTTP URL', severity:'medium', re:/https?:\/\/(?!localhost\b|127\.0\.0\.1\b)[^\s"'<>]+/i, message:'Plain HTTP traffic can expose data in transit. Prefer HTTPS.' },
  { id:'SEC011', title:'TLS verification disabled', severity:'high', re:/(?:rejectUnauthorized\s*:\s*false|verify\s*[:=]\s*false|ssl_verify\s*[:=]\s*false)/i, message:'TLS certificate verification appears to be disabled.' },
  { id:'SEC012', title:'Weak cryptographic hash', severity:'medium', re:/\b(?:md5|sha1)\s*\(|createHash\s*\(\s*["'](?:md5|sha1)["']\s*\)/i, message:'MD5/SHA-1 are unsuitable for security-sensitive hashing. Prefer modern primitives.' },
  { id:'SEC013', title:'Weak encryption algorithm', severity:'high', re:/\b(?:des|3des|rc4|rc2)\b/i, message:'A legacy cryptographic algorithm was referenced; use a modern authenticated cipher.' },
  { id:'SEC014', title:'Insecure randomness', severity:'medium', re:/\bMath\.random\s*\(/, message:'Math.random is not cryptographically secure and should not generate secrets, tokens, or security-sensitive IDs.' },
  { id:'SEC015', title:'JWT algorithm none', severity:'critical', re:/["']alg["']\s*:\s*["']none["']/i, message:'JWT algorithm "none" disables signature verification and is unsafe for authenticated tokens.' },
  { id:'SEC016', title:'Potential path traversal', severity:'high', re:/(?:readFile|writeFile|unlink|open|createReadStream|createWriteStream)\s*\([^\n]*(?:req\.(?:query|params|body)|request\.(?:query|params|body)|userInput|input)/i, message:'A filesystem operation appears to consume request/user input; constrain paths and prevent traversal.' },
  { id:'SEC017', title:'Prototype pollution sink', severity:'high', re:/(?:Object\.assign|\[\s*["']__proto__["']\s*\]|constructor\s*\[\s*["']prototype["']\s*\])/, message:'Potential prototype-pollution pattern detected; validate keys before merging or assigning objects.' },
  { id:'SEC018', title:'Unsafe deserialization', severity:'high', re:/(?:pickle\.loads?|yaml\.load\s*\(|unserialize\s*\(|ObjectInputStream)/i, message:'Deserializing untrusted data can lead to code execution or object injection.' },
  { id:'SEC019', title:'Shell execution string', severity:'high', re:/\b(?:shelljs|execFile|system)\s*\([^\n]*(?:req\.|request\.|userInput|input)/i, message:'A shell/process API appears to consume external input; validate arguments and avoid shell interpretation.' },
  { id:'SEC020', title:'Permissive file permissions', severity:'high', re:/(?:chmod|umask)\s*\([^\n]*(?:0?777|0?666)\b|\b(?:mode|permissions)\s*[:=]\s*["']?(?:777|666)["']?/i, message:'Overly permissive filesystem permissions can expose files or enable unauthorized modification.' },
  { id:'SEC021', title:'Hard-coded private IP binding', severity:'low', re:/(?:host|hostname|bind)\s*[:=]\s*["']0\.0\.0\.0["']/i, message:'Binding to all network interfaces may unintentionally expose a service.' },
  { id:'SEC022', title:'Docker privileged mode', severity:'critical', re:/\bprivileged\s*:\s*true\b/i, message:'Privileged containers can substantially weaken isolation.' },
  { id:'SEC023', title:'Docker host filesystem exposure', severity:'high', re:/\/var\/run\/docker\.sock|docker\.sock/i, message:'Exposing the Docker socket can grant host-level control to a containerized process.' },
  { id:'SEC024', title:'Sensitive environment exposure', severity:'medium', re:/\bprocess\.env\b|\bos\.environ\b/i, message:'Environment variables may contain secrets; avoid logging, rendering, or broadly exposing them.' },
  { id:'SEC025', title:'Hard-coded cloud credential', severity:'critical', re:/(?:AKIA|ASIA)[A-Z0-9]{16}/, message:'An AWS access-key-shaped credential was detected.' },
  { id:'SEC026', title:'Basic authentication in URL', severity:'high', re:/https?:\/\/[^\s/@]+:[^\s/@]+@/i, message:'Credentials embedded in URLs can leak through logs, browser history, proxies, and telemetry.' },
  { id:'SEC027', title:'Potential SSRF', severity:'high', re:/(?:fetch|axios\.(?:get|post|put|delete|request)|http\.request|https\.request)\s*\([^\n]*(?:req\.|request\.|userInput|input)/i, message:'A network request appears to use external input as its destination; validate and allowlist outbound targets.' },
  { id:'SEC028', title:'Database credentials in connection string', severity:'critical', re:/(?:mongodb(?:\+srv)?|postgres(?:ql)?|mysql|redis):\/\/[^\s/@]+:[^\s/@]+@/i, message:'Database credentials appear in a connection URL; use secret management and avoid committing credentials.' },
  { id:'SEC029', title:'Potential open redirect', severity:'medium', re:/(?:redirect|location\.href|window\.location)\s*[:=(][^\n]*(?:req\.|request\.|query|params|returnUrl|redirectUrl)/i, message:'A redirect destination may be controlled by user input; validate against an allowlist.' },
  { id:'SEC030', title:'CORS credentials with wildcard origin', severity:'high', re:/Access-Control-Allow-(?:Origin|origin)["'\s:=]+["']\*["'][^\n]*(?:Allow-Credentials|allowCredentials)["'\s:=]+true/i, message:'Credentialed cross-origin requests must not use a wildcard origin.' },
];

export function analyzeFiles(files: ProjectFile[]): Finding[] {
  const findings: Finding[] = [];
  for (const file of files) {
    const lines = file.content.split(/\r?\n/);
    lines.forEach((line, i) => {
      for (const rule of rules) {
        rule.re.lastIndex = 0;
        if (rule.re.test(line)) {
          findings.push({ id:`${rule.id}-${i+1}-${file.path}`, rule:rule.id, title:rule.title, severity:rule.severity, file:file.path, line:i+1, message:rule.message });
        }
      }
    });
  }
  return findings;
}

export function healthScore(findings: Finding[], fileCount:number): number {
  const weights: Record<Severity,number> = { critical:30, high:15, medium:8, low:3, info:1 };
  return Math.max(0, Math.min(100, 100 - findings.reduce((n,f)=>n+weights[f.severity],0) - Math.max(0,10-fileCount)));
}

export function getSecurityRuleCount(): number { return rules.length; }

export function getSecurityRules(): ReadonlyArray<Pick<Rule, 'id' | 'title' | 'severity'>> {
  return rules.map(({ id, title, severity }) => ({ id, title, severity }));
}
