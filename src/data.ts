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

function r(id: string, text: string, strategy: string): Requirement {
  const { p, i, e, v } = g(text, strategy);
  return { id, text, purpose: p, implementation: i, examples: e, evidence: v };
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


export const strategies: MitigationStrategy[] = [
  {
    id: 'patch-applications', name: 'Patch applications', shortName: 'Patch applications', icon: 'Clock',
    description: 'Maturity assessment for patch applications.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('patch-applications-ml1-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-applications'),
          r('patch-applications-ml1-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-applications'),
          r('patch-applications-ml1-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in online services.', 'patch-applications'),
          r('patch-applications-ml1-4', 'A vulnerability scanner is used at least weekly to identify missing patches or updates for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products.', 'patch-applications'),
          r('patch-applications-ml1-5', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-applications'),
          r('patch-applications-ml1-6', 'Patches, updates or other vendor mitigations for vulnerabilities in online services are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-applications'),
          r('patch-applications-ml1-7', 'Patches, updates or other vendor mitigations for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within two weeks of release.', 'patch-applications'),
          r('patch-applications-ml1-8', 'Online services that are no longer supported by vendors are removed.', 'patch-applications'),
          r('patch-applications-ml1-9', 'Office productivity suites, web browsers and their extensions, email clients, PDF software, Adobe Flash Player, and security products that are no longer supported by vendors are removed.', 'patch-applications'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
          r('patch-applications-ml2-1', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, and security products.', 'patch-applications'),
          r('patch-applications-ml2-2', 'Patches, updates or other vendor mitigations for vulnerabilities in applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within one month of release.', 'patch-applications'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('patch-applications-ml3-1', 'Patches, updates or other vendor mitigations for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-applications'),
          r('patch-applications-ml3-2', 'Patches, updates or other vendor mitigations for vulnerabilities in office productivity suites, web browsers and their extensions, email clients, PDF software, and security products are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-applications'),
          r('patch-applications-ml3-3', 'Applications other than office productivity suites, web browsers and their extensions, email clients, PDF software, Adobe Flash Player, and security products that are no longer supported by vendors are removed.', 'patch-applications'),
      ]},
    ]
  },
  {
    id: 'patch-operating-systems', name: 'Patch operating systems', shortName: 'Patch operating systems', icon: 'Monitor',
    description: 'Maturity assessment for patch operating systems.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('patch-operating-systems-ml1-1', 'An automated method of asset discovery is used at least fortnightly to support the detection of assets for subsequent vulnerability scanning activities.', 'patch-operating-systems'),
          r('patch-operating-systems-ml1-2', 'A vulnerability scanner with an up-to-date vulnerability database is used for vulnerability scanning activities.', 'patch-operating-systems'),
          r('patch-operating-systems-ml1-3', 'A vulnerability scanner is used at least daily to identify missing patches or updates for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices.', 'patch-operating-systems'),
          r('patch-operating-systems-ml1-4', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices.', 'patch-operating-systems'),
          r('patch-operating-systems-ml1-5', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml1-6', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of internet-facing servers and internet-facing network devices are applied within two weeks of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml1-7', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices are applied within one month of release.', 'patch-operating-systems'),
          r('patch-operating-systems-ml1-8', 'Operating systems that are no longer supported by vendors are replaced.', 'patch-operating-systems'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [

      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('patch-operating-systems-ml3-1', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in drivers.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-2', 'A vulnerability scanner is used at least fortnightly to identify missing patches or updates for vulnerabilities in firmware.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-3', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-4', 'Patches, updates or other vendor mitigations for vulnerabilities in operating systems of workstations, non-internet-facing servers and non-internet-facing network devices are applied within one month of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-5', 'Patches, updates or other vendor mitigations for vulnerabilities in drivers are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-6', 'Patches, updates or other vendor mitigations for vulnerabilities in drivers are applied within one month of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-7', 'Patches, updates or other vendor mitigations for vulnerabilities in firmware are applied within 48 hours of release when vulnerabilities are assessed as critical by vendors or when working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-8', 'Patches, updates or other vendor mitigations for vulnerabilities in firmware are applied within one month of release when vulnerabilities are assessed as non-critical by vendors and no working exploits exist.', 'patch-operating-systems'),
          r('patch-operating-systems-ml3-9', 'The latest release, or the previous release, of operating systems are used.', 'patch-operating-systems'),
      ]},
    ]
  },
  {
    id: 'multi-factor-authentication', name: 'Multi-factor authentication', shortName: 'Multi-factor authentication', icon: 'KeyRound',
    description: 'Maturity assessment for multi-factor authentication.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('multi-factor-authentication-ml1-1', 'Multi-factor authentication is used to authenticate users to their organisation’s online services that process, store or communicate their organisation’s sensitive data.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml1-2', 'Multi-factor authentication is used to authenticate users to third-party online services that process, store or communicate their organisation’s sensitive data.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml1-3', 'Multi-factor authentication (where available) is used to authenticate users to third-party online services that process, store or communicate their organisation’s non-sensitive data.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml1-4', 'Multi-factor authentication is used to authenticate users to their organisation’s online customer services that process, store or communicate their organisation’s sensitive customer data.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml1-5', 'Multi-factor authentication is used to authenticate users to third-party online customer services that process, store or communicate their organisation’s sensitive customer data.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml1-6', 'Multi-factor authentication is used to authenticate customers to online customer services that process, store or communicate sensitive customer data.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml1-7', 'Multi-factor authentication uses either: something users have and something users know, or something users have that is unlocked by something users know or are.', 'multi-factor-authentication'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
          r('multi-factor-authentication-ml2-1', 'Multi-factor authentication is used to authenticate privileged users of systems.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-2', 'Multi-factor authentication is used to authenticate unprivileged users of systems.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-3', 'Multi-factor authentication used for authenticating users of online services is phishing-resistant.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-4', 'Multi-factor authentication used for authenticating customers of online customer services provides a phishing-resistant option.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-5', 'Multi-factor authentication used for authenticating users of systems is phishing-resistant.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-6', 'Successful and unsuccessful multi-factor authentication events are centrally logged.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-7', 'Event logs are protected from unauthorised modification and deletion.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-8', 'Event logs from internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-9', 'Cybersecurity events are analysed in a timely manner to identify cybersecurity incidents.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-10', 'Cybersecurity incidents are reported to the chief information security officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-11', 'Cybersecurity incidents are reported to ASD as soon as possible after they occur or are discovered.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml2-12', 'Following the identification of a cybersecurity incident, the cybersecurity incident response plan is enacted.', 'multi-factor-authentication'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('multi-factor-authentication-ml3-1', 'Multi-factor authentication is used to authenticate users of data repositories.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml3-2', 'Multi-factor authentication used for authenticating customers of online customer services is phishing-resistant.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml3-3', 'Multi-factor authentication used for authenticating users of data repositories is phishing-resistant.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml3-4', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'multi-factor-authentication'),
          r('multi-factor-authentication-ml3-5', 'Event logs from workstations are analysed in a timely manner to detect cybersecurity events.', 'multi-factor-authentication'),
      ]},
    ]
  },
  {
    id: 'restrict-administrative-privileges', name: 'Restrict administrative privileges', shortName: 'Restrict administrative privileges', icon: 'Lock',
    description: 'Maturity assessment for restrict administrative privileges.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('restrict-administrative-privileges-ml1-1', 'Privileged users are assigned a dedicated privileged user account to be used solely for duties requiring privileged access.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml1-2', 'Requests for privileged access to systems, applications and data repositories are validated when first requested.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml1-3', 'Privileged user accounts (excluding those explicitly authorised to access online services) are prevented from accessing the internet, email and web services.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml1-4', 'Privileged user accounts explicitly authorised to access online services are strictly limited to only what is required for users and services to undertake their duties.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml1-5', 'Privileged users use separate privileged and unprivileged operating environments.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml1-6', 'Unprivileged user accounts cannot logon to privileged operating environments.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml1-7', 'Privileged user accounts (excluding local administrator accounts) cannot logon to unprivileged operating environments.', 'restrict-administrative-privileges'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
          r('restrict-administrative-privileges-ml2-1', 'Privileged access to systems, applications and data repositories is disabled after 12 months unless revalidated.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-2', 'Privileged access to systems and applications is disabled after 45 days of inactivity.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-3', 'Privileged operating environments are not virtualised within unprivileged operating environments.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-4', 'Administrative activities are conducted through jump servers.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-5', 'Credentials for break glass accounts, local administrator accounts and service accounts are long, unique, unpredictable and managed.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-6', 'Privileged access events are centrally logged.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-7', 'Privileged user account and security group management events are centrally logged.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-8', 'Event logs are protected from unauthorised modification and deletion.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-9', 'Event logs from internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-10', 'Cybersecurity events are analysed in a timely manner to identify cybersecurity incidents.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-11', 'Cybersecurity incidents are reported to the chief information security officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-12', 'Cybersecurity incidents are reported to ASD as soon as possible after they occur or are discovered.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml2-13', 'Following the identification of a cybersecurity incident, the cybersecurity incident response plan is enacted.', 'restrict-administrative-privileges'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('restrict-administrative-privileges-ml3-1', 'Privileged access to systems, applications and data repositories is limited to only what is required for users and services to undertake their duties.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-2', 'Secure Admin Workstations are used in the performance of administrative activities.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-3', 'Just-in-time administration is used for administering systems and applications.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-4', 'Memory integrity functionality is enabled.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-5', 'Local Security Authority protection functionality is enabled.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-6', 'Credential Guard functionality is enabled.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-7', 'Remote Credential Guard functionality is enabled.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-8', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'restrict-administrative-privileges'),
          r('restrict-administrative-privileges-ml3-9', 'Event logs from workstations are analysed in a timely manner to detect cybersecurity events.', 'restrict-administrative-privileges'),
      ]},
    ]
  },
  {
    id: 'application-control', name: 'Application control', shortName: 'Application control', icon: 'Shield',
    description: 'Maturity assessment for application control.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('application-control-ml1-1', 'Application control is implemented on workstations.', 'application-control'),
          r('application-control-ml1-2', 'Application control is applied to user profiles and temporary folders used by operating systems, web browsers and email clients.', 'application-control'),
          r('application-control-ml1-3', 'Application control restricts the execution of executables, software libraries, scripts, installers, compiled HTML, HTML applications and control panel applets to an organisation-approved set.', 'application-control'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
          r('application-control-ml2-1', 'Application control is implemented on internet-facing servers.', 'application-control'),
          r('application-control-ml2-2', 'Application control is applied to all locations other than user profiles and temporary folders used by operating systems, web browsers and email clients.', 'application-control'),
          r('application-control-ml2-3', 'Microsoft’s recommended application blocklist is implemented.', 'application-control'),
          r('application-control-ml2-4', 'Application control rulesets are validated on an annual or more frequent basis.', 'application-control'),
          r('application-control-ml2-5', 'Allowed and blocked application control events are centrally logged.', 'application-control'),
          r('application-control-ml2-6', 'Event logs are protected from unauthorised modification and deletion.', 'application-control'),
          r('application-control-ml2-7', 'Event logs from internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'application-control'),
          r('application-control-ml2-8', 'Cybersecurity events are analysed in a timely manner to identify cybersecurity incidents.', 'application-control'),
          r('application-control-ml2-9', 'Cybersecurity incidents are reported to the chief information security officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'application-control'),
          r('application-control-ml2-10', 'Cybersecurity incidents are reported to ASD as soon as possible after they occur or are discovered.', 'application-control'),
          r('application-control-ml2-11', 'Following the identification of a cybersecurity incident, the cybersecurity incident response plan is enacted.', 'application-control'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('application-control-ml3-1', 'Application control is implemented on non-internet-facing servers.', 'application-control'),
          r('application-control-ml3-2', 'Application control restricts the execution of drivers to an organisation-approved set.', 'application-control'),
          r('application-control-ml3-3', 'Microsoft’s vulnerable driver blocklist is implemented.', 'application-control'),
          r('application-control-ml3-4', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'application-control'),
          r('application-control-ml3-5', 'Event logs from workstations are analysed in a timely manner to detect cybersecurity events.', 'application-control'),
      ]},
    ]
  },
  {
    id: 'restrict-microsoft-office-macros', name: 'Restrict Microsoft Office macros', shortName: 'Restrict Microsoft Office macros', icon: 'FileCode',
    description: 'Maturity assessment for restrict microsoft office macros.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('restrict-microsoft-office-macros-ml1-1', 'Microsoft Office macros are disabled for users that do not have a demonstrated business requirement.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml1-2', 'Microsoft Office macros in files originating from the internet are blocked.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml1-3', 'Microsoft Office macro antivirus scanning is enabled.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml1-4', 'Microsoft Office macro security settings cannot be changed by users.', 'restrict-microsoft-office-macros'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
          r('restrict-microsoft-office-macros-ml2-1', 'Microsoft Office macros are blocked from making Win32 API calls.', 'restrict-microsoft-office-macros'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('restrict-microsoft-office-macros-ml3-1', 'Only Microsoft Office macros running from within a sandboxed environment, a Trusted Location or that are digitally signed by a trusted publisher are allowed to execute.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml3-2', 'Microsoft Office macros are checked to ensure they are free of malicious code before being digitally signed or placed within Trusted Locations.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml3-3', 'Only privileged users responsible for checking that Microsoft Office macros are free of malicious code can write to and modify content within Trusted Locations.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml3-4', 'Microsoft Office macros digitally signed by an untrusted publisher cannot be enabled via the Message Bar or Backstage View.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml3-5', 'Microsoft Office macros digitally signed by signatures other than V3 signatures cannot be enabled via the Message Bar or Backstage View.', 'restrict-microsoft-office-macros'),
          r('restrict-microsoft-office-macros-ml3-6', 'Microsoft Office’s list of trusted publishers is validated on an annual or more frequent basis.', 'restrict-microsoft-office-macros'),
      ]},
    ]
  },
  {
    id: 'user-application-hardening', name: 'User application hardening', shortName: 'User application hardening', icon: 'UserCheck',
    description: 'Maturity assessment for user application hardening.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('user-application-hardening-ml1-1', 'Internet Explorer 11 is disabled or removed.', 'user-application-hardening'),
          r('user-application-hardening-ml1-2', 'Web browsers do not process Java from the internet.', 'user-application-hardening'),
          r('user-application-hardening-ml1-3', 'Web browsers do not process web advertisements from the internet.', 'user-application-hardening'),
          r('user-application-hardening-ml1-4', 'Web browser security settings cannot be changed by users.', 'user-application-hardening'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
          r('user-application-hardening-ml2-1', 'Web browsers are hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
          r('user-application-hardening-ml2-2', 'Microsoft Office is blocked from creating child processes.', 'user-application-hardening'),
          r('user-application-hardening-ml2-3', 'Microsoft Office is blocked from creating executable content.', 'user-application-hardening'),
          r('user-application-hardening-ml2-4', 'Microsoft Office is blocked from injecting code into other processes.', 'user-application-hardening'),
          r('user-application-hardening-ml2-5', 'Microsoft Office is configured to prevent activation of Object Linking and Embedding packages.', 'user-application-hardening'),
          r('user-application-hardening-ml2-6', 'Office productivity suites are hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
          r('user-application-hardening-ml2-7', 'Office productivity suite security settings cannot be changed by users.', 'user-application-hardening'),
          r('user-application-hardening-ml2-8', 'PDF software is blocked from creating child processes.', 'user-application-hardening'),
          r('user-application-hardening-ml2-9', 'PDF software is hardened using ASD and vendor hardening guidance, with the most restrictive guidance taking precedence when conflicts occur.', 'user-application-hardening'),
          r('user-application-hardening-ml2-10', 'PDF software security settings cannot be changed by users.', 'user-application-hardening'),
          r('user-application-hardening-ml2-11', 'PowerShell module logging, script block logging and transcription events are centrally logged.', 'user-application-hardening'),
          r('user-application-hardening-ml2-12', 'Command line process creation events are centrally logged.', 'user-application-hardening'),
          r('user-application-hardening-ml2-13', 'Event logs are protected from unauthorised modification and deletion.', 'user-application-hardening'),
          r('user-application-hardening-ml2-14', 'Event logs from internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'user-application-hardening'),
          r('user-application-hardening-ml2-15', 'Cybersecurity events are analysed in a timely manner to identify cybersecurity incidents.', 'user-application-hardening'),
          r('user-application-hardening-ml2-16', 'Cybersecurity incidents are reported to the chief information security officer, or one of their delegates, as soon as possible after they occur or are discovered.', 'user-application-hardening'),
          r('user-application-hardening-ml2-17', 'Cybersecurity incidents are reported to ASD as soon as possible after they occur or are discovered.', 'user-application-hardening'),
          r('user-application-hardening-ml2-18', 'Following the identification of a cybersecurity incident, the cybersecurity incident response plan is enacted.', 'user-application-hardening'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('user-application-hardening-ml3-1', '.NET Framework 3.5 (includes .NET 2.0 and 3.0) is disabled or removed.', 'user-application-hardening'),
          r('user-application-hardening-ml3-2', 'Windows PowerShell 2.0 is disabled or removed.', 'user-application-hardening'),
          r('user-application-hardening-ml3-3', 'PowerShell is configured to use Constrained Language Mode.', 'user-application-hardening'),
          r('user-application-hardening-ml3-4', 'Event logs from non-internet-facing servers are analysed in a timely manner to detect cybersecurity events.', 'user-application-hardening'),
          r('user-application-hardening-ml3-5', 'Event logs from workstations are analysed in a timely manner to detect cybersecurity events.', 'user-application-hardening'),
      ]},
    ]
  },
  {
    id: 'regular-backups', name: 'Regular backups', shortName: 'Regular backups', icon: 'Database',
    description: 'Maturity assessment for regular backups.',
    maturityLevels: [
      { level: 1, title: 'Maturity Level One', requirements: [
          r('regular-backups-ml1-1', 'Backups of data, applications and settings are performed and retained in accordance with business criticality and business continuity requirements.', 'regular-backups'),
          r('regular-backups-ml1-2', 'Backups of data, applications and settings are synchronised to enable restoration to a common point in time.', 'regular-backups'),
          r('regular-backups-ml1-3', 'Backups of data, applications and settings are retained in a secure and resilient manner.', 'regular-backups'),
          r('regular-backups-ml1-4', 'Restoration of data, applications and settings from backups to a common point in time is tested as part of disaster recovery exercises.', 'regular-backups'),
          r('regular-backups-ml1-5', 'Unprivileged user accounts cannot access backups belonging to other user accounts.', 'regular-backups'),
          r('regular-backups-ml1-6', 'Unprivileged user accounts are prevented from modifying and deleting backups.', 'regular-backups'),
      ]},
      { level: 2, title: 'Maturity Level Two', requirements: [
          r('regular-backups-ml2-1', 'Privileged user accounts (excluding backup administrator accounts) cannot access backups belonging to other user accounts.', 'regular-backups'),
          r('regular-backups-ml2-2', 'Privileged user accounts (excluding backup administrator accounts) are prevented from modifying and deleting backups.', 'regular-backups'),
      ]},
      { level: 3, title: 'Maturity Level Three', requirements: [
          r('regular-backups-ml3-1', 'Unprivileged user accounts cannot access their own backups.', 'regular-backups'),
          r('regular-backups-ml3-2', 'Privileged user accounts (excluding backup administrator accounts) cannot access their own backups.', 'regular-backups'),
          r('regular-backups-ml3-3', 'Backup administrator accounts are prevented from modifying and deleting backups during their retention period.', 'regular-backups'),
      ]},
    ]
  },
];

