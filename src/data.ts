export interface Requirement {
  id: string;
  text: string;
  purpose: string;
  implementation: string;
  examples: string[];
  evidence: string[];
}

export interface MaturityLevelData {
  level: number;
  title: string;
  requirements: Requirement[];
}

export interface MitigationStrategy {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  description: string;
  maturityLevels: MaturityLevelData[];
}

function g(t: string, s: string): { p: string; i: string; e: string[]; v: string[] } {
  const l = t.toLowerCase();
  if (l.includes('asset discovery')) return { p: 'Ensures all assets are known so vulnerability scanning covers the complete attack surface.', i: 'Deploy automated asset discovery tools scanning at least every 14 days. Integrate with CMDB.', e: ['Microsoft Endpoint Manager', 'Lansweeper', 'ServiceNow Discovery', 'Qualys Asset Inventory'], v: ['Discovery configuration', 'CMDB export', 'Scan reports', 'Reconciliation records'] };
  if (l.includes('vulnerability scanner with an up-to-date')) return { p: 'Scanners with current databases detect known flaws. Outdated scanners miss recent vulnerabilities.', i: 'Deploy enterprise scanner with daily vulnerability definition updates. Ensure authenticated scanning.', e: ['Nessus/Tenable.io', 'Qualys VM', 'Rapid7 InsightVM', 'Microsoft Defender Vuln Management'], v: ['Scanner auto-update config', 'Database version', 'Deployment documentation'] };
  if (l.includes('daily') && l.includes('online service')) return { p: 'Online services are directly exposed to internet attacks. Daily scanning finds critical vulns rapidly.', i: 'Configure daily scans against all internet-facing services. Immediate alerts for critical findings.', e: ['Qualys EASM', 'Tenable.io external', 'Rapid7 external', 'Burp Suite Enterprise'], v: ['Daily scan schedule', 'Sample reports', 'Alert config', 'Review logs'] };
  if (l.includes('weekly') && l.includes('office')) return { p: 'Office apps and browsers are primary phishing/malware vectors. Weekly scanning catches vulnerabilities.', i: 'Configure weekly scans for office suites, browsers, email clients, PDF software.', e: ['Nessus app scanning', 'Qualys Agent', 'Defender for Endpoint', 'Ivanti Patch'], v: ['Weekly scan config', 'App vuln reports', 'Browser inventory', 'Version reports'] };
  if (l.includes('fortnightly') && l.includes('applications other')) return { p: 'ML2 expands scanning to ALL applications, not just productivity tools.', i: 'Extend scanning to cover all installed applications fortnightly.', e: ['Nessus full scan', 'Qualys SCA', 'Flexera SVA'], v: ['Scan policies', 'Fortnightly reports', 'App inventory'] };
  if (l.includes('48 hours')) return { p: 'Critical vulnerabilities are actively exploited. 48-hour patching minimises exposure.', i: 'Establish emergency patching process. Monitor vendor advisories and CVE feeds.', e: ['WSUS auto-approval', 'Azure Update Management', 'Ivanti Patch'], v: ['Emergency patching procedure', 'Deployment tickets <48hr', 'Vendor advisory records'] };
  if (l.includes('two weeks')) return { p: 'Non-critical vulns still pose risk. Two-week patching ensures systematic remediation.', i: 'Establish bi-weekly patching cycle. Automate deployment. Track compliance.', e: ['WSUS/SCCM bi-weekly', 'Azure Automanage', 'Automox'], v: ['Patching schedule', 'Compliance reports', 'Deployment records'] };
  if (l.includes('one month')) return { p: 'Monthly patching prevents vulnerability accumulation across the enterprise.', i: 'Maintain comprehensive monthly patching cycle.', e: ['Monthly enterprise cycle', 'Automox cross-platform'], v: ['Monthly schedule', 'Compliance reports'] };
  if (l.includes('no longer supported')) return { p: 'Unsupported software receives no security patches, leaving permanent vulnerabilities.', i: 'Maintain inventory with EOL dates. Execute migration plans.', e: ['Sunset plans', 'Server migration', 'EOL replacement'], v: ['EOL inventory', 'Migration plans', 'Removal scans'] };
  if (l.includes('drivers')) return { p: 'Drivers run at kernel level. Vulnerable drivers allow privilege escalation.', i: 'Add driver vulnerability scanning to fortnightly cycle.', e: ['Nessus driver scanning', 'Dell Command Monitor'], v: ['Driver scan config', 'Version inventory'] };
  if (l.includes('firmware')) return { p: 'Firmware vulns provide persistent, hard-to-detect access.', i: 'Implement firmware vulnerability scanning fortnightly.', e: ['Qualys firmware assessment', 'Dell BIOS management'], v: ['Firmware scan config', 'Version inventory'] };
  if (l.includes('latest release') && l.includes('previous release')) return { p: 'Running current or previous OS releases ensures access to latest security features.', i: 'Enforce OS version compliance via endpoint management.', e: ['Intune compliance', 'SCCM baselines'], v: ['Version enforcement config'] };
  if (l.includes('multi-factor authentication') || l.includes(' mfa ')) return { p: 'MFA prevents unauthorised access even when credentials are compromised.', i: 'Deploy MFA across all systems. Use phishing-resistant methods for privileged access.', e: ['Azure AD MFA', 'Duo Security', 'YubiKey FIDO2', 'Okta Adaptive MFA'], v: ['Enrollment reports', 'Configuration screenshots', 'Auth logs'] };
  if (l.includes('phishing-resistant')) return { p: 'SMS/voice MFA can be bypassed. Phishing-resistant methods provide stronger protection.', i: 'Deploy FIDO2 security keys. Phase out SMS/voice MFA.', e: ['YubiKey 5 series', 'Feitian FIDO2', 'Windows Hello'], v: ['FIDO2 deployment records', 'Token inventory'] };
  if (l.includes('centrally logged') && l.includes('authentication')) return { p: 'Central logging of MFA events enables detection of brute force and bypass attempts.', i: 'Forward all MFA logs to SIEM.', e: ['Azure AD Sign-in Logs to Sentinel', 'Duo to Splunk'], v: ['SIEM integration config', 'Log forwarding rules'] };
  if (l.includes('privileged') && (l.includes('access') || l.includes('account') || l.includes('user'))) return { p: 'Limiting privileged access reduces the attack surface and prevents lateral movement.', i: 'Implement least privilege. Use dedicated admin accounts. Deploy PAM.', e: ['CyberArk PAM', 'BeyondTrust', 'Microsoft LAPS', 'Azure AD PIM'], v: ['Privileged access policy', 'Admin account inventory', 'PAM configuration'] };
  if (l.includes('jump server') || l.includes('secure admin workstation')) return { p: 'Jump servers and SAWs provide a hardened, isolated environment for admin tasks.', i: 'Deploy dedicated jump servers or PAWs. Require MFA and session recording.', e: ['Azure Bastion', 'CyberArk PSM', 'Microsoft PAW'], v: ['Jump server deployment', 'Hardening standards', 'Session recordings'] };
  if (l.includes('application control')) return { p: 'Application control prevents execution of unapproved/malicious code.', i: 'Deploy app control solution. Start with workstations, expand to servers.', e: ['Windows Defender App Control', 'AppLocker', 'Carbon Black App Control'], v: ['App control policy', 'Deployment records', 'Coverage reports'] };
  if (l.includes('microsoft') && l.includes('blocklist')) return { p: "Microsoft's recommended blocklist blocks known vulnerable and malicious applications.", i: 'Import and enforce Microsoft recommended application blocklist.', e: ['WDAC Microsoft blocklist'], v: ['Blocklist import records', 'Current version'] };
  if (l.includes('macros')) return { p: 'Macros are a primary malware delivery vector. Restricting them prevents document-based attacks.', i: 'Disable macros by default. Enable only for users with documented business need.', e: ['GPO macro settings', 'Intune Office policies'], v: ['GPO configuration', 'Macro exemption register'] };
  if (l.includes('internet explorer')) return { p: 'IE11 is end-of-life with known, unpatched vulnerabilities.', i: 'Disable IE11 via GPO. Set Edge IE mode for legacy sites.', e: ['GPO IE disable', 'Edge IE Mode'], v: ['GPO configuration', 'IE removal verification'] };
  if (l.includes('java') && l.includes('internet')) return { p: 'Java applets are a common exploitation target.', i: 'Disable Java browser plugin via GPO.', e: ['Java GPO disable'], v: ['GPO configuration'] };
  if (l.includes('web advertisements') || l.includes(' web ads')) return { p: 'Malvertising delivers malware through ad networks.', i: 'Deploy ad-blocking via browser policies or DNS filtering.', e: ['uBlock Origin enterprise', 'DNS filtering'], v: ['Ad blocking configuration'] };
  if (l.includes('hardened') && (l.includes('asd') || l.includes('vendor'))) return { p: 'ASD hardening guidance provides vetted, security-optimal configurations.', i: 'Apply ASD Essential Eight hardening guides.', e: ['ASD Security Guides', 'CIS Benchmarks'], v: ['Hardening guide version', 'Implementation verification'] };
  if ((l.includes('office') || l.includes('pdf')) && (l.includes('child processes') || l.includes('executable content') || l.includes('injecting code') || l.includes('ole'))) return { p: 'Office/PDF exploitation techniques are common malware vectors.', i: 'Enable ASR rules to block exploitation techniques.', e: ['Defender ASR rules', 'WDAC policies'], v: ['ASR rule configuration', 'Test execution logs'] };
  if (l.includes('.net framework 3.5') || l.includes('powershell 2.0')) return { p: 'Legacy frameworks lack modern security features and are common attack targets.', i: 'Disable legacy frameworks via Windows Features GPO.', e: ['Windows Features GPO', 'DISM disable'], v: ['Disabled verification'] };
  if (l.includes('constrained language')) return { p: 'Constrained Language Mode restricts PowerShell to core functionality.', i: 'Configure via App Control or GPO for non-admin users.', e: ['WDAC Constrained Language', 'GPO PowerShell policy'], v: ['Language mode configuration'] };
  if (l.includes('powershell') && l.includes('logging')) return { p: 'PowerShell logging captures script execution for forensic analysis.', i: 'Enable module logging, script block logging, and transcription via GPO.', e: ['GPO PowerShell logging', 'SIEM integration'], v: ['GPO logging config', 'Log forwarding setup'] };
  if (l.includes('command line') && l.includes('logging')) return { p: 'Logging command line activity captures attacker tool execution.', i: 'Enable command line process creation auditing via GPO.', e: ['GPO audit policy', 'Security Event Log'], v: ['Audit policy config', '4688 event samples'] };
  if (l.includes('pdf')) return { p: 'PDF software is frequently exploited. Hardening prevents PDF-based attacks.', i: 'Harden PDF readers per ASD guidance. Block child process creation.', e: ['Adobe Reader Protected Mode', 'Foxit hardening'], v: ['PDF hardening config', 'Protected mode verification'] };
  if (l.includes('backups') && l.includes('performed')) return { p: 'Regular backups are the last line of defense against ransomware and data loss.', i: 'Implement automated backup schedule aligned with RPO/RTO requirements.', e: ['Veeam Backup', 'Commvault', 'Azure Backup'], v: ['Backup policy document', 'Backup schedule config'] };
  if (l.includes('backups') && (l.includes('synchronised') || l.includes('common point'))) return { p: 'Synchronized backups ensure all systems can be restored to a consistent state.', i: 'Use application-aware backup solutions with VSS/quiescing.', e: ['Veeam application-aware', 'Azure VM snapshots'], v: ['Backup consistency configuration'] };
  if (l.includes('backups') && l.includes('secure and resilient')) return { p: 'Backups must be protected from tampering, encryption, and destruction.', i: 'Encrypt backups. Use immutable storage. Follow 3-2-1 rule.', e: ['Immutable S3 buckets', 'Air-gapped backups', 'WORM storage'], v: ['Encryption configuration', 'Immutability settings'] };
  if (l.includes('backups') && l.includes('tested')) return { p: 'Untested backups may fail when needed. Regular DR exercises verify recoverability.', i: 'Conduct DR restoration tests quarterly.', e: ['DR test procedures', 'Quarterly test schedule'], v: ['DR test schedule', 'Test result reports'] };
  if (l.includes('backups') && (l.includes('access') || l.includes('modifying') || l.includes('deleting'))) return { p: 'Restricting backup access prevents attackers from destroying recovery data.', i: 'Implement RBAC for backup systems. Use retention locks.', e: ['RBAC for backup systems', 'S3 Object Lock', 'Immutable storage'], v: ['RBAC configuration', 'Retention lock settings'] };
  if (l.includes('centrally logged') || (l.includes('event logs') && l.includes('protected'))) return { p: 'Central logging enables forensic investigation and threat detection.', i: 'Forward all security logs to SIEM. Protect from tamper.', e: ['Microsoft Sentinel', 'Splunk', 'ELK Stack'], v: ['SIEM integration config', 'Log forwarding rules'] };
  if (l.includes('analysed in a timely manner')) return { p: 'Event logs must be analysed promptly to detect attacks.', i: 'Configure SIEM alert rules and correlation searches.', e: ['SIEM alert rules', 'SOAR playbooks'], v: ['Alert rule configuration', 'Alert review logs'] };
  if (l.includes('incidents are reported')) return { p: 'Incident reporting to CISO and ASD ensures appropriate response.', i: 'Define incident reporting procedure with escalation paths.', e: ['Incident response plan', 'Communication templates'], v: ['IR plan document', 'Incident notification records'] };
  if (l.includes('incident response plan is enacted')) return { p: 'Having a tested IR plan and enacting it quickly minimises damage.', i: 'Maintain documented IR plan. Conduct regular tabletop exercises.', e: ['IR plan document', 'Tabletop exercise records'], v: ['Current IR plan', 'Exercise reports'] };
  return { p: `Addresses a key aspect of ${s.replace(/-/g, ' ')} per ACSC maturity model.`, i: 'Implement this requirement as part of your security controls. Document and maintain evidence.', e: ['ACSC Essential Eight guidance', 'Vendor documentation'], v: ['Configuration documentation', 'Screenshots', 'Audit logs', 'Compliance reports'] };
}

const r = (id: string, text: string, strategy: string): Requirement => {
  const { p, i, e, v } = g(text, strategy);
  return { id, text, purpose: p, implementation: i, examples: e, evidence: v };
};

export const strategies: MitigationStrategy[] = [
  {
    id: 'patch-applications', name: 'Patch Applications', shortName: 'Patch Apps', icon: 'Clock',
    description: 'Patches, updates or other vendor mitigations for vulnerabilities in applications are applied in a timely manner.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('pa-ml1-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-applications'),
        r('pa-ml1-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-applications'),
        r('pa-ml1-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in online services.', 'patch-applications'),
        r('pa-ml1-4', 'A vulnerability scanner is used at least weekly to identify missing patches or updates for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products.', 'patch-applications'),
        r('pa-ml1-5', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-applications'),
        r('pa-ml1-6', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-applications'),
        r('pa-ml1-7', 'Patches, updates or other vendor mitigations for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within two weeks of release.', 'patch-applications'),
        r('pa-ml1-8', 'Online services that are no longer supported by vendors are removed.', 'patch-applications'),
        r('pa-ml1-9', 'Office productivity suites, web browsers and their extensions, email clients, PDF software, Adobe Flash Player, and security products that are no longer supported by vendors are removed.', 'patch-applications'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('pa-ml2-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-applications'),
        r('pa-ml2-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-applications'),
        r('pa-ml2-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in online services.', 'patch-applications'),
        r('pa-ml2-4', 'A vulnerability scanner is used at least weekly to identify missing patches or updates for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products.', 'patch-applications'),
        r('pa-ml2-5', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, and security products.', 'patch-applications'),
        r('pa-ml2-6', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-applications'),
        r('pa-ml2-7', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-applications'),
        r('pa-ml2-8', 'Patches, updates or other vendor mitigations for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within two weeks of release.', 'patch-applications'),
        r('pa-ml2-9', 'Patches, updates or other vendor mitigations for vulnerabilities in applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within one month of release.', 'patch-applications'),
        r('pa-ml2-10', 'Online services that are no longer supported by vendors are removed.', 'patch-applications'),
        r('pa-ml2-11', 'Office productivity suites, web browsers and their extensions, email clients, PDF software, Adobe Flash Player, and security products that are no longer supported by vendors are removed.', 'patch-applications'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('pa-ml3-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-applications'),
        r('pa-ml3-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-applications'),
        r('pa-ml3-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in online services.', 'patch-applications'),
        r('pa-ml3-4', 'A vulnerability scanner is used at least weekly to identify missing patches or updates for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products.', 'patch-applications'),
        r('pa-ml3-5', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, and security products.', 'patch-applications'),
        r('pa-ml3-6', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-applications'),
        r('pa-ml3-7', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-applications'),
        r('pa-ml3-8', 'Patches, updates or other vendor mitigations for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-applications'),
        r('pa-ml3-9', 'Patches, updates or other vendor mitigations for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-applications'),
        r('pa-ml3-10', 'Patches, updates or other vendor mitigations for vulnerabilities in applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within one month of release.', 'patch-applications'),
        r('pa-ml3-11', 'Online services that are no longer supported by vendors are removed.', 'patch-applications'),
        r('pa-ml3-12', 'Office productivity suites, web browsers and their extensions, email clients, PDF software, Adobe Flash Player, and security products that are no longer supported by vendors are removed.', 'patch-applications'),
        r('pa-ml3-13', 'Applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, Adobe Flash Player, and security products that are no longer supported by vendors are removed.', 'patch-applications'),
      ]},
    ],
  },
  {
    id: 'patch-operating-systems', name: 'Patch Operating Systems', shortName: 'Patch OS', icon: 'Monitor',
    description: 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems are applied in a timely manner.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('os-ml1-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-operating-systems'),
        r('os-ml1-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-operating-systems'),
        r('os-ml1-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices.', 'patch-operating-systems'),
        r('os-ml1-4', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices.', 'patch-operating-systems'),
        r('os-ml1-5', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
        r('os-ml1-6', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
        r('os-ml1-7', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices are applied within one month of release.', 'patch-operating-systems'),
        r('os-ml1-8', 'Operating systems that are no longer supported by vendors are replaced.', 'patch-operating-systems'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('os-ml2-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-operating-systems'),
        r('os-ml2-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-operating-systems'),
        r('os-ml2-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices.', 'patch-operating-systems'),
        r('os-ml2-4', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices.', 'patch-operating-systems'),
        r('os-ml2-5', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
        r('os-ml2-6', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
        r('os-ml2-7', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices are applied within one month of release.', 'patch-operating-systems'),
        r('os-ml2-8', 'Operating systems that are no longer supported by vendors are replaced.', 'patch-operating-systems'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('os-ml3-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-operating-systems'),
        r('os-ml3-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-operating-systems'),
        r('os-ml3-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices.', 'patch-operating-systems'),
        r('os-ml3-4', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices.', 'patch-operating-systems'),
        r('os-ml3-5', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in drivers.', 'patch-operating-systems'),
        r('os-ml3-6', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in firmware.', 'patch-operating-systems'),
        r('os-ml3-7', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-8', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-9', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-10', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices are applied within one month of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-11', 'Patches, updates or other vendor mitigations for vulnerabilities in drivers are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-12', 'Patches, updates or other vendor mitigations for vulnerabilities in drivers are applied within one month of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-13', 'Patches, updates or other vendor mitigations for vulnerabilities in firmware are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-14', 'Patches, updates or other vendor mitigations for vulnerabilities in firmware are applied within one month of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
        r('os-ml3-15', 'The latest release, or the previous release, of operating systems are used.', 'patch-operating-systems'),
        r('os-ml3-16', 'Operating systems that are no longer supported by vendors are replaced.', 'patch-operating-systems'),
      ]},
    ],
  },
  {
    id: 'multi-factor-authentication', name: 'Multi-Factor Authentication', shortName: 'MFA', icon: 'KeyRound',
    description: 'Multi-factor authentication is used to authenticate users to systems and services.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('mfa-ml1-1', "Multi-factor authentication is used to authenticate users to their organisation's online services that process, store or communicate their organisation's sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml1-2', "Multi-factor authentication is used to authenticate users to third-party online services that process, store or communicate their organisation's sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml1-3', "Multi-factor authentication (where available) is used to authenticate users to third-party online services that process, store or communicate their organisation's non-sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml1-4', "Multi-factor authentication is used to authenticate users to their organisation's online customer services that process, store or communicate their organisation's sensitive customer data.", 'multi-factor-authentication'),
        r('mfa-ml1-5', "Multi-factor authentication is used to authenticate users to third-party online customer services that process, store or communicate their organisation's sensitive customer data.", 'multi-factor-authentication'),
        r('mfa-ml1-6', 'Multi-factor authentication is used to authenticate customers to online customer services that process, store or communicate sensitive customer data.', 'multi-factor-authentication'),
        r('mfa-ml1-7', 'Multi-factor authentication uses either: something users have and something users know, or something users have that is unlocked by something users know or are.', 'multi-factor-authentication'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('mfa-ml2-1', "Multi-factor authentication is used to authenticate users to their organisation's online services that process, store or communicate their organisation's sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml2-2', "Multi-factor authentication is used to authenticate users to third-party online services that process, store or communicate their organisation's sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml2-3', "Multi-factor authentication (where available) is used to authenticate users to third-party online services that process, store or communicate their organisation's non-sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml2-4', "Multi-factor authentication is used to authenticate users to their organisation's online customer services that process, store or communicate their organisation's sensitive customer data.", 'multi-factor-authentication'),
        r('mfa-ml2-5', "Multi-factor authentication is used to authenticate users to third-party online customer services that process, store or communicate their organisation's sensitive customer data.", 'multi-factor-authentication'),
        r('mfa-ml2-6', 'Multi-factor authentication is used to authenticate customers to online customer services that process, store or communicate sensitive customer data.', 'multi-factor-authentication'),
        r('mfa-ml2-7', 'Multi-factor authentication is used to authenticate privileged users of systems.', 'multi-factor-authentication'),
        r('mfa-ml2-8', 'Multi-factor authentication is used to authenticate unprivileged users of systems.', 'multi-factor-authentication'),
        r('mfa-ml2-9', 'Multi-factor authentication uses either: something users have and something users know, or something users have that is unlocked by something users know or are.', 'multi-factor-authentication'),
        r('mfa-ml2-10', 'Multi-factor authentication used for authenticating users of online services is phishing-resistant.', 'multi-factor-authentication'),
        r('mfa-ml2-11', 'Multi-factor authentication used for authenticating customers of online customer services provides a phishing-resistant option.', 'multi-factor-authentication'),
        r('mfa-ml2-12', 'Multi-factor authentication used for authenticating users of systems is phishing-resistant.', 'multi-factor-authentication'),
        r('mfa-ml2-13', 'Successful and unsuccessful multi-factor authentication events are centrally logged.', 'multi-factor-authentication'),
        r('mfa-ml2-14', 'Event logs are protected from unauthorised modification and deletion.', 'multi-factor-authentication'),
        r('mfa-ml2-15', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'multi-factor-authentication'),
        r('mfa-ml2-16', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'multi-factor-authentication'),
        r('mfa-ml2-17', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'multi-factor-authentication'),
        r('mfa-ml2-18', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'multi-factor-authentication'),
        r('mfa-ml2-19', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'multi-factor-authentication'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('mfa-ml3-1', "Multi-factor authentication is used to authenticate users to their organisation's online services that process, store or communicate their organisation's sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml3-2', "Multi-factor authentication is used to authenticate users to third-party online services that process, store or communicate their organisation's sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml3-3', "Multi-factor authentication (where available) is used to authenticate users to third-party online services that process, store or communicate their organisation's non-sensitive data.", 'multi-factor-authentication'),
        r('mfa-ml3-4', "Multi-factor authentication is used to authenticate users to their organisation's online customer services that process, store or communicate their organisation's sensitive customer data.", 'multi-factor-authentication'),
        r('mfa-ml3-5', "Multi-factor authentication is used to authenticate users to third-party online customer services that process, store or communicate their organisation's sensitive customer data.", 'multi-factor-authentication'),
        r('mfa-ml3-6', 'Multi-factor authentication is used to authenticate customers to online customer services that process, store or communicate sensitive customer data.', 'multi-factor-authentication'),
        r('mfa-ml3-7', 'Multi-factor authentication is used to authenticate privileged users of systems.', 'multi-factor-authentication'),
        r('mfa-ml3-8', 'Multi-factor authentication is used to authenticate unprivileged users of systems.', 'multi-factor-authentication'),
        r('mfa-ml3-9', 'Multi-factor authentication is used to authenticate users of data repositories.', 'multi-factor-authentication'),
        r('mfa-ml3-10', 'Multi-factor authentication uses either: something users have and something users know, or something users have that is unlocked by something users know or are.', 'multi-factor-authentication'),
        r('mfa-ml3-11', 'Multi-factor authentication used for authenticating users of online services is phishing-resistant.', 'multi-factor-authentication'),
        r('mfa-ml3-12', 'Multi-factor authentication used for authenticating customers of online customer services is phishing-resistant.', 'multi-factor-authentication'),
        r('mfa-ml3-13', 'Multi-factor authentication used for authenticating users of systems is phishing-resistant.', 'multi-factor-authentication'),
        r('mfa-ml3-14', 'Multi-factor authentication used for authenticating users of data repositories is phishing-resistant.', 'multi-factor-authentication'),
        r('mfa-ml3-15', 'Successful and unsuccessful multi-factor authentication events are centrally logged.', 'multi-factor-authentication'),
        r('mfa-ml3-16', 'Event logs are protected from unauthorised modification and deletion.', 'multi-factor-authentication'),
        r('mfa-ml3-17', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'multi-factor-authentication'),
        r('mfa-ml3-18', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cyber security events.', 'multi-factor-authentication'),
        r('mfa-ml3-19', 'Event logs from workstations are analysed in a timely manner to detect cyber security events.', 'multi-factor-authentication'),
        r('mfa-ml3-20', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'multi-factor-authentication'),
        r('mfa-ml3-21', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'multi-factor-authentication'),
        r('mfa-ml3-22', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'multi-factor-authentication'),
        r('mfa-ml3-23', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'multi-factor-authentication'),
      ]},
    ],
  },
  {
    id: 'restrict-administrative-privileges', name: 'Restrict Administrative Privileges', shortName: 'Restrict Admin', icon: 'Lock',
    description: 'Privileged access to systems, applications and data repositories is restricted to only what is required.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('rap-ml1-1', 'Requests for privileged access to systems, applications and data repositories are validated when first requested.', 'restrict-administrative-privileges'),
        r('rap-ml1-2', 'Privileged users are assigned a dedicated privileged user account to be used solely for duties requiring privileged access.', 'restrict-administrative-privileges'),
        r('rap-ml1-3', 'Privileged user accounts (excluding those explicitly authorised to access online services) are prevented from accessing the internet, email and web services.', 'restrict-administrative-privileges'),
        r('rap-ml1-4', 'Privileged user accounts explicitly authorised to access online services are strictly limited to only what is required for users and services to undertake their duties.', 'restrict-administrative-privileges'),
        r('rap-ml1-5', 'Privileged users use separate privileged and unprivileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml1-6', 'Unprivileged user accounts cannot logon to privileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml1-7', 'Privileged user accounts (excluding local administrator accounts) cannot logon to unprivileged operating environments.', 'restrict-administrative-privileges'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('rap-ml2-1', 'Requests for privileged access to systems, applications and data repositories are validated when first requested.', 'restrict-administrative-privileges'),
        r('rap-ml2-2', 'Privileged access to systems, applications and data repositories is disabled after 12 months unless revalidated.', 'restrict-administrative-privileges'),
        r('rap-ml2-3', 'Privileged access to systems and applications is disabled after 45 days of inactivity.', 'restrict-administrative-privileges'),
        r('rap-ml2-4', 'Privileged users are assigned a dedicated privileged user account to be used solely for duties requiring privileged access.', 'restrict-administrative-privileges'),
        r('rap-ml2-5', 'Privileged user accounts (excluding those explicitly authorised to access online services) are prevented from accessing the internet, email and web services.', 'restrict-administrative-privileges'),
        r('rap-ml2-6', 'Privileged user accounts explicitly authorised to access online services are strictly limited to only what is required for users and services to undertake their duties.', 'restrict-administrative-privileges'),
        r('rap-ml2-7', 'Privileged users use separate privileged and unprivileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml2-8', 'Privileged operating environments are not virtualised within unprivileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml2-9', 'Unprivileged user accounts cannot logon to privileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml2-10', 'Privileged user accounts (excluding local administrator accounts) cannot logon to unprivileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml2-11', 'Administrative activities are conducted through jump servers.', 'restrict-administrative-privileges'),
        r('rap-ml2-12', 'Credentials for break glass accounts, local administrator accounts and service accounts are long, unique, unpredictable and managed.', 'restrict-administrative-privileges'),
        r('rap-ml2-13', 'Privileged access events are centrally logged.', 'restrict-administrative-privileges'),
        r('rap-ml2-14', 'Privileged user account and security group management events are centrally logged.', 'restrict-administrative-privileges'),
        r('rap-ml2-15', 'Event logs are protected from unauthorised modification and deletion.', 'restrict-administrative-privileges'),
        r('rap-ml2-16', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'restrict-administrative-privileges'),
        r('rap-ml2-17', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'restrict-administrative-privileges'),
        r('rap-ml2-18', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'restrict-administrative-privileges'),
        r('rap-ml2-19', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'restrict-administrative-privileges'),
        r('rap-ml2-20', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'restrict-administrative-privileges'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('rap-ml3-1', 'Requests for privileged access to systems, applications and data repositories are validated when first requested.', 'restrict-administrative-privileges'),
        r('rap-ml3-2', 'Privileged access to systems, applications and data repositories is disabled after 12 months unless revalidated.', 'restrict-administrative-privileges'),
        r('rap-ml3-3', 'Privileged access to systems and applications is disabled after 45 days of inactivity.', 'restrict-administrative-privileges'),
        r('rap-ml3-4', 'Privileged users are assigned a dedicated privileged user account to be used solely for duties requiring privileged access.', 'restrict-administrative-privileges'),
        r('rap-ml3-5', 'Privileged access to systems, applications and data repositories is limited to only what is required for users and services to undertake their duties.', 'restrict-administrative-privileges'),
        r('rap-ml3-6', 'Privileged user accounts (excluding those explicitly authorised to access online services) are prevented from accessing the internet, email and web services.', 'restrict-administrative-privileges'),
        r('rap-ml3-7', 'Privileged user accounts explicitly authorised to access online services are strictly limited to only what is required for users and services to undertake their duties.', 'restrict-administrative-privileges'),
        r('rap-ml3-8', 'Secure Admin Workstations are used in the performance of administrative activities.', 'restrict-administrative-privileges'),
        r('rap-ml3-9', 'Privileged users use separate privileged and unprivileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml3-10', 'Privileged operating environments are not virtualised within unprivileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml3-11', 'Unprivileged user accounts cannot logon to privileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml3-12', 'Privileged user accounts (excluding local administrator accounts) cannot logon to unprivileged operating environments.', 'restrict-administrative-privileges'),
        r('rap-ml3-13', 'Just-in-time administration is used for administering systems and applications.', 'restrict-administrative-privileges'),
        r('rap-ml3-14', 'Administrative activities are conducted through jump servers.', 'restrict-administrative-privileges'),
        r('rap-ml3-15', 'Credentials for break glass accounts, local administrator accounts and service accounts are long, unique, unpredictable and managed.', 'restrict-administrative-privileges'),
        r('rap-ml3-16', 'Memory integrity functionality is enabled.', 'restrict-administrative-privileges'),
        r('rap-ml3-17', 'Local Security Authority protection functionality is enabled.', 'restrict-administrative-privileges'),
        r('rap-ml3-18', 'Credential Guard functionality is enabled.', 'restrict-administrative-privileges'),
        r('rap-ml3-19', 'Remote Credential Guard functionality is enabled.', 'restrict-administrative-privileges'),
        r('rap-ml3-20', 'Privileged access events are centrally logged.', 'restrict-administrative-privileges'),
        r('rap-ml3-21', 'Privileged user account and security group management events are centrally logged.', 'restrict-administrative-privileges'),
        r('rap-ml3-22', 'Event logs are protected from unauthorised modification and deletion.', 'restrict-administrative-privileges'),
        r('rap-ml3-23', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'restrict-administrative-privileges'),
        r('rap-ml3-24', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cyber security events.', 'restrict-administrative-privileges'),
        r('rap-ml3-25', 'Event logs from workstations are analysed in a timely manner to detect cyber security events.', 'restrict-administrative-privileges'),
        r('rap-ml3-26', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'restrict-administrative-privileges'),
        r('rap-ml3-27', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'restrict-administrative-privileges'),
        r('rap-ml3-28', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'restrict-administrative-privileges'),
        r('rap-ml3-29', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'restrict-administrative-privileges'),
      ]},
    ],
  },
  {
    id: 'application-control', name: 'Application Control', shortName: 'App Control', icon: 'Shield',
    description: 'Application control is implemented to restrict the execution of executables, software libraries, scripts, installers and other unapproved files.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('ac-ml1-1', 'Application control is implemented on workstations.', 'application-control'),
        r('ac-ml1-2', 'Application control is applied to user profiles and temporary folders used by operating systems, web browsers and email clients.', 'application-control'),
        r('ac-ml1-3', 'Application control restricts the execution of executables, software libraries, scripts, installers, compiled HTML, HTML applications and control panel applets to an organisation-approved set.', 'application-control'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('ac-ml2-1', 'Application control is implemented on workstations.', 'application-control'),
        r('ac-ml2-2', 'Application control is implemented on internet-facing servers.', 'application-control'),
        r('ac-ml2-3', 'Application control is applied to user profiles and temporary folders used by operating systems, web browsers and email clients.', 'application-control'),
        r('ac-ml2-4', 'Application control is applied to all locations other than user profiles and temporary folders used by operating systems, web browsers and email clients.', 'application-control'),
        r('ac-ml2-5', 'Application control restricts the execution of executables, software libraries, scripts, installers, compiled HTML, HTML applications and control panel applets to an organisation-approved set.', 'application-control'),
        r('ac-ml2-6', "Microsoft's recommended application blocklist is implemented.", 'application-control'),
        r('ac-ml2-7', 'Application control rulesets are validated on an annual or more frequent basis.', 'application-control'),
        r('ac-ml2-8', 'Allowed and blocked application control events are centrally logged.', 'application-control'),
        r('ac-ml2-9', 'Event logs are protected from unauthorised modification and deletion.', 'application-control'),
        r('ac-ml2-10', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'application-control'),
        r('ac-ml2-11', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'application-control'),
        r('ac-ml2-12', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'application-control'),
        r('ac-ml2-13', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'application-control'),
        r('ac-ml2-14', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'application-control'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('ac-ml3-1', 'Application control is implemented on workstations.', 'application-control'),
        r('ac-ml3-2', 'Application control is implemented on internet-facing servers.', 'application-control'),
        r('ac-ml3-3', 'Application control is implemented on non-internet-facing servers.', 'application-control'),
        r('ac-ml3-4', 'Application control is applied to user profiles and temporary folders used by operating systems, web browsers and email clients.', 'application-control'),
        r('ac-ml3-5', 'Application control is applied to all locations other than user profiles and temporary folders used by operating systems, web browsers and email clients.', 'application-control'),
        r('ac-ml3-6', 'Application control restricts the execution of executables, software libraries, scripts, installers, compiled HTML, HTML applications and control panel applets to an organisation-approved set.', 'application-control'),
        r('ac-ml3-7', 'Application control restricts the execution of drivers to an organisation-approved set.', 'application-control'),
        r('ac-ml3-8', "Microsoft's recommended application blocklist is implemented.", 'application-control'),
        r('ac-ml3-9', "Microsoft's vulnerable driver blocklist is implemented.", 'application-control'),
        r('ac-ml3-10', 'Application control rulesets are validated on an annual or more frequent basis.', 'application-control'),
        r('ac-ml3-11', 'Allowed and blocked application control events are centrally logged.', 'application-control'),
        r('ac-ml3-12', 'Event logs are protected from unauthorised modification and deletion.', 'application-control'),
        r('ac-ml3-13', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'application-control'),
        r('ac-ml3-14', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cyber security events.', 'application-control'),
        r('ac-ml3-15', 'Event logs from workstations are analysed in a timely manner to detect cyber security events.', 'application-control'),
        r('ac-ml3-16', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'application-control'),
        r('ac-ml3-17', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'application-control'),
        r('ac-ml3-18', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'application-control'),
        r('ac-ml3-19', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'application-control'),
      ]},
    ],
  },
  {
    id: 'restrict-microsoft-office-macros', name: 'Restrict Microsoft Office Macros', shortName: 'Office Macros', icon: 'FileCode',
    description: 'Microsoft Office macros are restricted to only those that are vetted and from trusted sources.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('mo-ml1-1', 'Microsoft Office macros are disabled for users that do not have a demonstrated business requirement.', 'restrict-microsoft-office-macros'),
        r('mo-ml1-2', 'Microsoft Office macros in files originating from the internet are blocked.', 'restrict-microsoft-office-macros'),
        r('mo-ml1-3', 'Microsoft Office macro antivirus scanning is enabled.', 'restrict-microsoft-office-macros'),
        r('mo-ml1-4', 'Microsoft Office macro security settings cannot be changed by users.', 'restrict-microsoft-office-macros'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('mo-ml2-1', 'Microsoft Office macros are disabled for users that do not have a demonstrated business requirement.', 'restrict-microsoft-office-macros'),
        r('mo-ml2-2', 'Microsoft Office macros in files originating from the internet are blocked.', 'restrict-microsoft-office-macros'),
        r('mo-ml2-3', 'Microsoft Office macro antivirus scanning is enabled.', 'restrict-microsoft-office-macros'),
        r('mo-ml2-4', 'Microsoft Office macros are blocked from making Win32 API calls.', 'restrict-microsoft-office-macros'),
        r('mo-ml2-5', 'Microsoft Office macro security settings cannot be changed by users.', 'restrict-microsoft-office-macros'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('mo-ml3-1', 'Microsoft Office macros are disabled for users that do not have a demonstrated business requirement.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-2', 'Only Microsoft Office macros running from within a sandboxed environment, a Trusted Location or that are digitally signed by a trusted publisher are allowed to execute.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-3', 'Microsoft Office macros are checked to ensure they are free of malicious code before being digitally signed or placed within Trusted Locations.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-4', 'Only privileged users responsible for checking that Microsoft Office macros are free of malicious code can write to and modify content within Trusted Locations.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-5', 'Microsoft Office macros digitally signed by an untrusted publisher cannot be enabled via the Message Bar or Backstage View.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-6', 'Microsoft Office macros digitally signed by signatures other than V3 signatures cannot be enabled via the Message Bar or Backstage View.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-7', "Microsoft Office's list of trusted publishers is validated on an annual or more frequent basis.", 'restrict-microsoft-office-macros'),
        r('mo-ml3-8', 'Microsoft Office macros in files originating from the internet are blocked.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-9', 'Microsoft Office macro antivirus scanning is enabled.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-10', 'Microsoft Office macros are blocked from making Win32 API calls.', 'restrict-microsoft-office-macros'),
        r('mo-ml3-11', 'Microsoft Office macro security settings cannot be changed by users.', 'restrict-microsoft-office-macros'),
      ]},
    ],
  },
  {
    id: 'user-application-hardening', name: 'User Application Hardening', shortName: 'App Hardening', icon: 'UserCheck',
    description: 'User applications are hardened to reduce the attack surface and prevent exploitation.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('uh-ml1-1', 'Internet Explorer 11 is disabled or removed.', 'user-application-hardening'),
        r('uh-ml1-2', 'Web browsers do not process Java from the internet.', 'user-application-hardening'),
        r('uh-ml1-3', 'Web browsers do not process web advertisements from the internet.', 'user-application-hardening'),
        r('uh-ml1-4', 'Web browser security settings cannot be changed by users.', 'user-application-hardening'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('uh-ml2-1', 'Internet Explorer 11 is disabled or removed.', 'user-application-hardening'),
        r('uh-ml2-2', 'Web browsers do not process Java from the internet.', 'user-application-hardening'),
        r('uh-ml2-3', 'Web browsers do not process web advertisements from the internet.', 'user-application-hardening'),
        r('uh-ml2-4', 'Web browsers are hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
        r('uh-ml2-5', 'Web browser security settings cannot be changed by users.', 'user-application-hardening'),
        r('uh-ml2-6', 'Microsoft Office is blocked from creating child processes.', 'user-application-hardening'),
        r('uh-ml2-7', 'Microsoft Office is blocked from creating executable content.', 'user-application-hardening'),
        r('uh-ml2-8', 'Microsoft Office is blocked from injecting code into other processes.', 'user-application-hardening'),
        r('uh-ml2-9', 'Microsoft Office is configured to prevent activation of Object Linking and Embedding packages.', 'user-application-hardening'),
        r('uh-ml2-10', 'Office productivity suites are hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
        r('uh-ml2-11', 'Office productivity suite security settings cannot be changed by users.', 'user-application-hardening'),
        r('uh-ml2-12', 'PDF software is blocked from creating child processes.', 'user-application-hardening'),
        r('uh-ml2-13', 'PDF software is hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
        r('uh-ml2-14', 'PDF software security settings cannot be changed by users.', 'user-application-hardening'),
        r('uh-ml2-15', 'PowerShell module logging, script block logging and transcription events are centrally logged.', 'user-application-hardening'),
        r('uh-ml2-16', 'Command line process creation events are centrally logged.', 'user-application-hardening'),
        r('uh-ml2-17', 'Event logs are protected from unauthorised modification and deletion.', 'user-application-hardening'),
        r('uh-ml2-18', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'user-application-hardening'),
        r('uh-ml2-19', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'user-application-hardening'),
        r('uh-ml2-20', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'user-application-hardening'),
        r('uh-ml2-21', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'user-application-hardening'),
        r('uh-ml2-22', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'user-application-hardening'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('uh-ml3-1', 'Internet Explorer 11 is disabled or removed.', 'user-application-hardening'),
        r('uh-ml3-2', 'Web browsers do not process Java from the internet.', 'user-application-hardening'),
        r('uh-ml3-3', 'Web browsers do not process web advertisements from the internet.', 'user-application-hardening'),
        r('uh-ml3-4', 'Web browsers are hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
        r('uh-ml3-5', 'Web browser security settings cannot be changed by users.', 'user-application-hardening'),
        r('uh-ml3-6', 'Microsoft Office is blocked from creating child processes.', 'user-application-hardening'),
        r('uh-ml3-7', 'Microsoft Office is blocked from creating executable content.', 'user-application-hardening'),
        r('uh-ml3-8', 'Microsoft Office is blocked from injecting code into other processes.', 'user-application-hardening'),
        r('uh-ml3-9', 'Microsoft Office is configured to prevent activation of Object Linking and Embedding packages.', 'user-application-hardening'),
        r('uh-ml3-10', 'Office productivity suites are hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
        r('uh-ml3-11', 'Office productivity suite security settings cannot be changed by users.', 'user-application-hardening'),
        r('uh-ml3-12', 'PDF software is blocked from creating child processes.', 'user-application-hardening'),
        r('uh-ml3-13', 'PDF software is hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
        r('uh-ml3-14', 'PDF software security settings cannot be changed by users.', 'user-application-hardening'),
        r('uh-ml3-15', '.NET Framework 3.5 (includes .NET 2.0 and 3.0) is disabled or removed.', 'user-application-hardening'),
        r('uh-ml3-16', 'Windows PowerShell 2.0 is disabled or removed.', 'user-application-hardening'),
        r('uh-ml3-17', 'PowerShell is configured to use Constrained Language Mode.', 'user-application-hardening'),
        r('uh-ml3-18', 'PowerShell module logging, script block logging and transcription events are centrally logged.', 'user-application-hardening'),
        r('uh-ml3-19', 'Command line process creation events are centrally logged.', 'user-application-hardening'),
        r('uh-ml3-20', 'Event logs are protected from unauthorised modification and deletion.', 'user-application-hardening'),
        r('uh-ml3-21', 'Event logs from internet-facing servers are analysed in a timely manner to detect cyber security events.', 'user-application-hardening'),
        r('uh-ml3-22', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cyber security events.', 'user-application-hardening'),
        r('uh-ml3-23', 'Event logs from workstations are analysed in a timely manner to detect cyber security events.', 'user-application-hardening'),
        r('uh-ml3-24', 'Cyber security events are analysed in a timely manner to identify cyber security incidents.', 'user-application-hardening'),
        r('uh-ml3-25', 'Cyber security incidents are reported to the Chief Information Security Officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'user-application-hardening'),
        r('uh-ml3-26', 'Cyber security incidents are reported to ASD as soon as possible after they occur or are discovered.', 'user-application-hardening'),
        r('uh-ml3-27', 'Following the identification of a cyber security incident, the cyber security incident response plan is enacted.', 'user-application-hardening'),
      ]},
    ],
  },
  {
    id: 'regular-backups', name: 'Regular Backups', shortName: 'Backups', icon: 'Database',
    description: 'Regular backups of data, applications and settings are performed and retained in a secure and resilient manner.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
        r('rb-ml1-1', 'Backups of data, applications and settings are performed and retained in accordance with business criticality and business continuity requirements.', 'regular-backups'),
        r('rb-ml1-2', 'Backups of data, applications and settings are synchronised to enable restoration to a common point in time.', 'regular-backups'),
        r('rb-ml1-3', 'Backups of data, applications and settings are retained in a secure and resilient manner.', 'regular-backups'),
        r('rb-ml1-4', 'Restoration of data, applications and settings from backups to a common point in time is tested as part of disaster recovery exercises.', 'regular-backups'),
        r('rb-ml1-5', 'Unprivileged user accounts cannot access backups belonging to other user accounts.', 'regular-backups'),
        r('rb-ml1-6', 'Unprivileged user accounts are prevented from modifying and deleting backups.', 'regular-backups'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
        r('rb-ml2-1', 'Backups of data, applications and settings are performed and retained in accordance with business criticality and business continuity requirements.', 'regular-backups'),
        r('rb-ml2-2', 'Backups of data, applications and settings are synchronised to enable restoration to a common point in time.', 'regular-backups'),
        r('rb-ml2-3', 'Backups of data, applications and settings are retained in a secure and resilient manner.', 'regular-backups'),
        r('rb-ml2-4', 'Restoration of data, applications and settings from backups to a common point in time is tested as part of disaster recovery exercises.', 'regular-backups'),
        r('rb-ml2-5', 'Unprivileged user accounts cannot access backups belonging to other user accounts.', 'regular-backups'),
        r('rb-ml2-6', 'Privileged user accounts (excluding backup administrator accounts) cannot access backups belonging to other user accounts.', 'regular-backups'),
        r('rb-ml2-7', 'Unprivileged user accounts are prevented from modifying and deleting backups.', 'regular-backups'),
        r('rb-ml2-8', 'Privileged user accounts (excluding backup administrator accounts) are prevented from modifying and deleting backups.', 'regular-backups'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
        r('rb-ml3-1', 'Backups of data, applications and settings are performed and retained in accordance with business criticality and business continuity requirements.', 'regular-backups'),
        r('rb-ml3-2', 'Backups of data, applications and settings are synchronised to enable restoration to a common point in time.', 'regular-backups'),
        r('rb-ml3-3', 'Backups of data, applications and settings are retained in a secure and resilient manner.', 'regular-backups'),
        r('rb-ml3-4', 'Restoration of data, applications and settings from backups to a common point in time is tested as part of disaster recovery exercises.', 'regular-backups'),
        r('rb-ml3-5', 'Unprivileged user accounts cannot access backups belonging to other user accounts.', 'regular-backups'),
        r('rb-ml3-6', 'Unprivileged user accounts cannot access their own backups.', 'regular-backups'),
        r('rb-ml3-7', 'Privileged user accounts (excluding backup administrator accounts) cannot access backups belonging to other user accounts.', 'regular-backups'),
        r('rb-ml3-8', 'Privileged user accounts (excluding backup administrator accounts) cannot access their own backups.', 'regular-backups'),
        r('rb-ml3-9', 'Unprivileged accounts are prevented from modifying and deleting backups.', 'regular-backups'),
        r('rb-ml3-10', 'Privileged user accounts (excluding backup administrator accounts) are prevented from modifying and deleting backups.', 'regular-backups'),
        r('rb-ml3-11', 'Backup administrator accounts are prevented from modifying and deleting backups during their retention period.', 'regular-backups'),
      ]},
    ],
  },
];
