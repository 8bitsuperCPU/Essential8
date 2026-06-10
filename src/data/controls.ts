import type { Control } from '../types/index.ts';

export const controls: Control[] = [
  {
    id: 'application-control',
    name: 'Application Control',
    description: 'Prevent execution of unapproved or malicious applications including executables, scripts, installers, and libraries.',
    guidance: 'Application control is one of the most effective mitigation strategies in the Essential Eight. It prevents malicious code from executing on systems by only allowing approved applications to run. This significantly reduces the impact of malware, ransomware, and other cyber threats.',
    icon: 'Shield',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'app-whitelisting',
            title: 'Application Allowlisting',
            summary: 'Only approved applications can execute on workstations and servers.',
            purpose: 'Application allowlisting ensures that only trusted, approved software can run on organizational systems. This prevents attackers from executing malicious code even if they gain access to a system.',
            implementation: 'Deploy application control solutions on all workstations and servers. Create and maintain a list of approved applications using cryptographic hashes or digital signatures. Configure the solution to block all executables, scripts, libraries, and installers not on the approved list. Regularly review and update the allowlist as business needs change.',
            examples: ['Microsoft AppLocker', 'Windows Defender Application Control (WDAC', 'Carbon Black App Control', 'Airlock Digital'],
            evidence: ['Application control policy document', 'Approved application list/hash database', 'Application control configuration screenshots', 'Exception/approval process records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'portable-device-control',
            title: 'Application Control on Portable Devices',
            summary: 'Control application execution on USB and portable storage devices.',
            purpose: 'Portable devices are a common vector for malware introduction. Controlling what can execute from these devices prevents autorun-based attacks and unauthorized software installation.',
            implementation: 'Configure application control policies to block execution from removable media. Disable autorun functionality across all endpoints. Implement device control policies to restrict unauthorized USB devices. Log and monitor any attempts to execute code from portable media.',
            examples: ['Group Policy Autorun settings', 'USB device control software', 'Endpoint detection and response (EDR) tools'],
            evidence: ['Device control policy', 'Autorun configuration settings', 'USB access logs', 'Exception request records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'system-component-control',
            title: 'System Component Control',
            summary: 'Control drivers, libraries, and system-level components.',
            purpose: 'Attackers often exploit vulnerable or malicious drivers and system libraries to gain kernel-level access. Controlling these components prevents privilege escalation and rootkit installation.',
            implementation: 'Implement driver signing enforcement. Restrict installation of unsigned drivers. Control DLL loading paths and prevent DLL hijacking. Monitor system directories for unauthorized modifications. Use secure boot to verify system integrity at startup.',
            examples: ['Driver Signature Enforcement', 'Secure Boot', 'Windows System File Checker', 'Code Integrity policies'],
            evidence: ['Driver signing policy', 'Secure boot configuration', 'Code integrity event logs', 'System file integrity reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'all-users-control',
            title: 'Application Control for All Users',
            summary: 'Enforce application control including on administrator workstations.',
            purpose: 'Administrators are high-value targets. If an admin workstation is compromised, attackers can use elevated privileges to disable security controls. Application control must apply equally to admin accounts.',
            implementation: 'Deploy application control on all administrative workstations with the same rigor as standard workstations. Ensure admin accounts cannot bypass application control policies. Implement separate admin workstations (PAW) with enhanced controls. Regularly audit admin workstation compliance.',
            examples: ['Microsoft AppLocker with admin rules', 'WDAC with managed installer', 'Privileged Access Workstations'],
            evidence: ['Admin workstation application control policy', 'PAW deployment records', 'Admin workstation compliance reports', 'Audit logs showing enforcement'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'server-cloud-control',
            title: 'Server and Cloud Application Control',
            summary: 'Extend application control to servers and cloud infrastructure.',
            purpose: 'Servers and cloud workloads often run critical business applications. Compromised servers can lead to data breaches and lateral movement. Application control on servers prevents unauthorized code execution in these high-value environments.',
            implementation: 'Implement application control on all production servers. Extend controls to cloud IaaS and PaaS environments. Use infrastructure-as-code to enforce consistent application control policies. Monitor cloud workloads for unauthorized process execution.',
            examples: ['AWS Systems Manager', 'Azure Policy', 'Kubernetes admission controllers', 'Container image scanning'],
            evidence: ['Server application control configuration', 'Cloud security policies', 'Container security configurations', 'Cloud audit logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'high-risk-app-control',
            title: 'High-Risk Application Control',
            summary: 'Apply enhanced controls to commonly exploited applications.',
            purpose: 'Applications like PDF readers, web browsers, and Office suites are frequently targeted by attackers. Enhanced controls on these applications reduce the attack surface from document-based and web-based threats.',
            implementation: 'Identify high-risk applications used in the organization. Implement enhanced application control rules for these applications. Disable unnecessary features and plugins. Use application sandboxing where available. Monitor for exploitation attempts targeting these applications.',
            examples: ['Adobe Reader Protected Mode', 'Office Trust Center settings', 'Browser sandboxing', 'Click-to-Run Office'],
            evidence: ['High-risk application inventory', 'Enhanced control configurations', 'Sandboxing implementation records', 'Threat detection logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'script-macro-control',
            title: 'Script and Macro Control',
            summary: 'Control execution of scripts and macros across the environment.',
            purpose: 'Scripts and macros are commonly used in phishing attacks and post-exploitation activities. Controlling their execution prevents attackers from using these tools for lateral movement and persistence.',
            implementation: 'Block execution of scripts from the internet zone. Configure PowerShell Constrained Language Mode. Disable or restrict VBScript, JScript, and HTA execution. Implement macro blocking for Office documents from untrusted sources. Log all script execution attempts.',
            examples: ['PowerShell Constrained Language Mode', 'Windows Script Host restrictions', 'AMSI (Antimalware Scan Interface)', 'Office macro blocking via Group Policy'],
            evidence: ['Script execution policy', 'PowerShell configuration', 'Macro blocking settings', 'Script execution logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'all-endpoints-control',
            title: 'Application Control for All Endpoints',
            summary: 'Extend application control to BYOD, IoT, and all network-connected devices.',
            purpose: 'Modern environments include diverse endpoints beyond traditional workstations and servers. Extending application control to all devices ensures consistent protection across the entire attack surface.',
            implementation: 'Implement application control on BYOD devices through MDM solutions. Deploy lightweight agents on IoT devices where possible. Use network-based application control for devices that cannot run agents. Maintain a comprehensive asset inventory to ensure coverage.',
            examples: ['Mobile Device Management (MDM)', 'Network Access Control (NAC)', 'IoT security platforms', 'Unified Endpoint Management (UEM)'],
            evidence: ['BYOD policy with application control requirements', 'IoT security architecture', 'Asset inventory completeness report', 'Coverage compliance metrics'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'privileged-account-control',
            title: 'Enhanced Privileged Account Control',
            summary: 'Apply strict application control for privileged accounts and service accounts.',
            purpose: 'Privileged accounts are the ultimate target for attackers. Enhanced application control on these accounts limits the tools attackers can use even after credential compromise.',
            implementation: 'Implement the most restrictive application control policies for privileged accounts. Use dedicated privileged access workstations with hardened configurations. Monitor and alert on any application control violations by privileged accounts. Implement just-in-time access with time-limited application permissions.',
            examples: ['Privileged Access Workstations (PAW)', 'Just-in-Time administration', 'Microsoft LAPS', 'CyberArk PAM'],
            evidence: ['Privileged account application control policy', 'PAW configuration standards', 'JIT access logs', 'Privileged session recordings'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'cloud-workload-control',
            title: 'Cloud Workload Application Control',
            summary: 'Control application execution in containers, serverless, and cloud-native workloads.',
            purpose: 'Cloud-native workloads require application control approaches that work in ephemeral, scalable environments. Traditional agent-based approaches may not be suitable for containers and serverless functions.',
            implementation: 'Implement admission controllers in Kubernetes to enforce pod security policies. Use container image scanning and signing. Deploy runtime security monitoring for cloud workloads. Implement serverless function allowlisting. Use infrastructure-as-code to enforce consistent policies.',
            examples: ['Kubernetes Pod Security Standards', 'Docker Content Trust', 'AWS Lambda execution policies', 'Azure Container Registry content trust'],
            evidence: ['Kubernetes security policies', 'Container image signing configuration', 'Runtime security monitoring alerts', 'Infrastructure-as-code templates'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'continuous-monitoring-response',
            title: 'Continuous Monitoring and Response',
            summary: 'Real-time monitoring and automated response to application control events.',
            purpose: 'Application control is most effective when combined with real-time monitoring and automated response. This enables rapid detection and containment of threats that attempt to bypass controls.',
            implementation: 'Integrate application control logs with SIEM/SOAR platforms. Configure real-time alerts for application control violations. Implement automated response playbooks for common violation scenarios. Conduct regular threat hunting using application control telemetry. Review and tune detection rules based on emerging threats.',
            examples: ['Microsoft Sentinel', 'Splunk SIEM', 'SOAR platforms', 'EDR with application control integration'],
            evidence: ['SIEM integration configuration', 'Alert rules and thresholds', 'Automated response playbooks', 'Threat hunting reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  },
  {
    id: 'patch-applications',
    name: 'Patch Applications',
    description: 'Close security vulnerabilities in applications to prevent exploitation by malicious actors.',
    guidance: 'Patching applications closes known security vulnerabilities before attackers can exploit them. The ACSC recommends patching critical vulnerabilities within 48 hours for extreme risk, and within 2 weeks for other vulnerabilities.',
    icon: 'Clock',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'patch-management-policy',
            title: 'Patch Management Policy',
            summary: 'Establish a formal policy defining patch management responsibilities and timelines.',
            purpose: 'A patch management policy provides the foundation for consistent and timely vulnerability remediation. It defines roles, responsibilities, and timelines to ensure patches are applied before attackers can exploit vulnerabilities.',
            implementation: 'Develop and approve a patch management policy that defines patching timelines (48 hours for extreme risk vulnerabilities). Assign clear roles and responsibilities for patch management. Define exception processes for systems that cannot be immediately patched. Include all application types in the policy scope.',
            examples: ['NIST SP 800-40', 'ISO 27001 patch management controls', 'CIS Controls patching guidelines'],
            evidence: ['Approved patch management policy', 'Policy approval records', 'Roles and responsibilities matrix', 'Exception process documentation'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'critical-vulnerability-patching',
            title: 'Critical Vulnerability Patching',
            summary: 'Patch critical and extreme-risk vulnerabilities within 48 hours.',
            purpose: 'Extreme-risk vulnerabilities are actively exploited in the wild. Rapid patching within 48 hours significantly reduces the window of opportunity for attackers to compromise systems.',
            implementation: 'Monitor vulnerability intelligence feeds for critical and extreme-risk vulnerabilities. Establish emergency patching procedures for rapid deployment. Test patches in a staging environment before production deployment. Prioritize patching based on asset criticality and exposure.',
            examples: ['CVE databases', 'Vendor security advisories', 'ACSC alerts', 'Vulnerability intelligence platforms'],
            evidence: ['Vulnerability assessment reports', 'Patching completion records with timestamps', 'Emergency patching procedure documents', 'Vulnerability tracking system records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'application-inventory',
            title: 'Application Inventory',
            summary: 'Maintain a comprehensive inventory of all applications.',
            purpose: 'You cannot patch what you do not know about. A comprehensive application inventory ensures that all software is accounted for and included in the patch management process.',
            implementation: 'Deploy automated asset discovery tools to identify all applications. Maintain a CMDB with application versions and patch levels. Regularly reconcile the inventory with actual deployments. Include cloud-hosted and SaaS applications in the inventory.',
            examples: ['SCCM/Intune asset inventory', 'ServiceNow CMDB', 'Lansweeper', 'Snipe-IT'],
            evidence: ['Application inventory report', 'CMDB records', 'Asset discovery scan results', 'Inventory reconciliation records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'automated-patch-deployment',
            title: 'Automated Patch Deployment',
            summary: 'Automate patch deployment to ensure consistent and timely application.',
            purpose: 'Manual patching is error-prone and cannot scale. Automated patch deployment ensures patches are applied consistently and within required timeframes across the entire environment.',
            implementation: 'Deploy patch management tools with automated deployment capabilities. Configure maintenance windows for patch deployment. Implement automated testing and rollback procedures. Monitor patch deployment success rates and remediate failures promptly.',
            examples: ['WSUS/SCCM', 'Microsoft Intune', 'Ivanti Patch Management', 'Automox'],
            evidence: ['Patch management tool configuration', 'Deployment schedules and maintenance windows', 'Patch success/failure reports', 'Rollback procedure documentation'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'regular-patching-cycle',
            title: 'Regular Patching Cycle',
            summary: 'Apply patches within 2 weeks of release for all applications.',
            purpose: 'A regular patching cycle ensures that vulnerabilities are addressed in a systematic and timely manner, reducing the overall attack surface and preventing accumulation of unpatched vulnerabilities.',
            implementation: 'Establish a regular patching schedule (e.g., monthly patch Tuesday plus out-of-band for critical issues). Automate patch approval for low-risk updates. Track patch compliance across all systems. Report on patch compliance metrics to management.',
            examples: ['Monthly patch cycles', 'Automated patch approval workflows', 'Patch compliance dashboards'],
            evidence: ['Patching schedule documentation', 'Patch compliance reports', 'Management reporting records', 'Patch approval workflow configuration'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'vulnerability-scanning',
            title: 'Vulnerability Scanning',
            summary: 'Regularly scan for vulnerabilities and missing patches.',
            purpose: 'Vulnerability scanning identifies missing patches and configuration weaknesses before attackers can exploit them. Regular scanning provides visibility into the organization\'s security posture.',
            implementation: 'Deploy vulnerability scanning tools across the environment. Schedule regular scans (at least weekly for critical systems). Prioritize remediation based on scan results. Track vulnerability remediation progress over time.',
            examples: ['Nessus', 'Qualys', 'Rapid7 InsightVM', 'Microsoft Defender Vulnerability Management'],
            evidence: ['Vulnerability scan reports', 'Scan schedule configuration', 'Remediation tracking records', 'Trend analysis reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'patch-testing-validation',
            title: 'Patch Testing and Validation',
            summary: 'Test patches before deployment to production environments.',
            purpose: 'Patches can sometimes cause system instability or compatibility issues. Testing patches before production deployment ensures business continuity while maintaining security.',
            implementation: 'Establish a test environment that mirrors production. Define test cases for critical business applications. Document test results and approval process. Implement rollback procedures for failed patches.',
            examples: ['Staging environments', 'Automated testing frameworks', 'Canary deployment strategies'],
            evidence: ['Patch testing procedures', 'Test environment documentation', 'Test result records', 'Rollback procedure documentation'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'third-party-patching',
            title: 'Third-Party Application Patching',
            summary: 'Patch all third-party applications including browsers, PDF readers, and plugins.',
            purpose: 'Third-party applications are frequently targeted by attackers. Many organizations focus on OS patching but neglect third-party applications, leaving significant vulnerabilities unaddressed.',
            implementation: 'Include all third-party applications in the patch management program. Monitor vendor security advisories for all deployed applications. Prioritize patching for internet-facing and commonly exploited applications. Use application inventory to ensure complete coverage.',
            examples: ['Chrome Enterprise update policies', 'Adobe updater', 'Java update management', 'Patch My PC'],
            evidence: ['Third-party application inventory', 'Third-party patch compliance reports', 'Vendor advisory monitoring records', 'Update configuration settings'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'zero-day-response',
            title: 'Zero-Day Response',
            summary: 'Respond to zero-day vulnerabilities within 48 hours.',
            purpose: 'Zero-day vulnerabilities represent the highest risk as they are exploited before patches are available. A rapid response capability minimizes exposure during the window between disclosure and patch availability.',
            implementation: 'Establish a zero-day response team and procedures. Monitor threat intelligence for zero-day disclosures. Implement compensating controls (virtual patching, network segmentation) when patches are unavailable. Deploy emergency patches within 48 hours of release.',
            examples: ['Threat intelligence platforms', 'Virtual patching (IPS/WAF)', 'Network micro-segmentation', 'Emergency change management procedures'],
            evidence: ['Zero-day response procedures', 'Threat intelligence feed subscriptions', 'Compensating control implementations', 'Emergency patching records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'continuous-vulnerability-management',
            title: 'Continuous Vulnerability Management',
            summary: 'Implement continuous monitoring and real-time vulnerability assessment.',
            purpose: 'Traditional periodic scanning leaves gaps in visibility. Continuous vulnerability management provides real-time awareness of the security posture and enables immediate response to new threats.',
            implementation: 'Deploy continuous vulnerability monitoring tools. Integrate vulnerability data with SIEM and ticketing systems. Implement risk-based prioritization using threat intelligence. Automate remediation workflows for common vulnerability types.',
            examples: ['Continuous vulnerability scanners', 'Attack surface management platforms', 'Risk-based vulnerability management tools'],
            evidence: ['Continuous monitoring configuration', 'Integration architecture documentation', 'Risk scoring methodology', 'Automated remediation workflow records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'patch-compliance-reporting',
            title: 'Patch Compliance Reporting',
            summary: 'Generate detailed compliance reports and track metrics over time.',
            purpose: 'Metrics and reporting provide visibility into patch management effectiveness and support continuous improvement. They also demonstrate compliance to auditors and management.',
            implementation: 'Generate automated patch compliance reports on a regular basis. Track key metrics including mean time to patch, patch success rate, and compliance percentage. Report to executive management monthly. Use metrics to identify and address process improvements.',
            examples: ['Patch compliance dashboards', 'Executive security reports', 'Trend analysis tools', 'GRC platforms'],
            evidence: ['Patch compliance reports', 'Executive briefing materials', 'Metric trend analysis', 'Process improvement records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'emergency-patching-procedures',
            title: 'Emergency Patching Procedures',
            summary: 'Formalized procedures for emergency patching outside normal cycles.',
            purpose: 'Critical vulnerabilities sometimes require immediate patching outside normal maintenance windows. Formalized emergency procedures ensure rapid response while managing risk.',
            implementation: 'Define criteria for emergency patching (e.g., active exploitation, extreme risk). Establish an emergency change approval process. Pre-stage emergency patching capabilities. Conduct post-emergency patching reviews to improve procedures.',
            examples: ['Emergency change advisory board', 'Pre-approved emergency patching windows', 'Automated emergency deployment pipelines'],
            evidence: ['Emergency patching procedure document', 'Emergency change records', 'Post-incident review reports', 'Procedure improvement records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  },
  {
    id: 'configure-microsoft-office-macro-settings',
    name: 'Configure Microsoft Office Macro Settings',
    description: 'Block macros from the internet and only allow vetted macros in trusted locations.',
    guidance: 'Macros are a common attack vector used to deliver malware through Office documents. The ACSC recommends blocking macros from the internet and only allowing vetted macros from trusted locations.',
    icon: 'FileCode',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'block-macros-internet',
            title: 'Block Macros from Internet',
            summary: 'Block macros in Office files originating from the internet.',
            purpose: 'Office files downloaded from the internet are a primary malware delivery vector. Blocking macros in these files prevents a common initial access technique used by threat actors.',
            implementation: 'Configure Office to block macros in files from the internet zone. Use Group Policy to enforce this setting across all endpoints. Enable the "Block macros from running in Office files from the Internet" setting. Verify enforcement through regular audits.',
            examples: ['Microsoft Office Group Policy settings', 'Office Trust Center settings', 'Mark of the Web (MOTW) enforcement'],
            evidence: ['Group Policy configuration', 'Office security settings screenshots', 'Audit logs showing enforcement', 'User notification records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'disable-macros-default',
            title: 'Disable Macros by Default',
            summary: 'Disable all macros with notification by default.',
            purpose: 'Disabling macros by default ensures that users must explicitly enable macros, reducing the risk of accidental macro execution. This provides a defense-in-depth layer against macro-based attacks.',
            implementation: 'Configure Office to disable all macros with notification. Use Group Policy to enforce this setting. Educate users on the risks of enabling macros. Implement application control to prevent macro-enabled documents from executing unauthorized code.',
            examples: ['Office Trust Center macro settings', 'Group Policy macro restrictions', 'VBA macro security levels'],
            evidence: ['Macro security configuration', 'Group Policy settings', 'User education materials', 'Compliance audit results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'macro-signing-requirements',
            title: 'Macro Signing Requirements',
            summary: 'Only allow digitally signed macros from trusted publishers.',
            purpose: 'Digital signatures provide assurance that macros come from a trusted source and have not been tampered with. Requiring signed macros reduces the risk of malicious macro execution.',
            implementation: 'Configure Office to only allow macros signed by trusted publishers. Establish a process for approving and adding trusted publishers. Maintain a list of approved macro signing certificates. Regularly review and update the trusted publishers list.',
            examples: ['Code signing certificates', 'Trusted Publishers store', 'Certificate-based macro approval'],
            evidence: ['Trusted publishers list', 'Certificate management records', 'Macro signing policy', 'Approval process documentation'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'user-education-macros',
            title: 'User Education on Macro Risks',
            summary: 'Train users to recognize and avoid macro-based threats.',
            purpose: 'Users are the last line of defense. Educating users about macro risks reduces the likelihood that they will enable macros in malicious documents, even if technical controls fail.',
            implementation: 'Include macro security in security awareness training. Provide examples of macro-based phishing attacks. Teach users to verify document sources before enabling macros. Conduct regular phishing simulations that include macro-based scenarios.',
            examples: ['Security awareness training platforms', 'Phishing simulation tools', 'Security newsletters'],
            evidence: ['Training completion records', 'Phishing simulation results', 'Training materials', 'User awareness assessment results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'vetted-macro-allowlist',
            title: 'Vetted Macro Allowlist',
            summary: 'Maintain an allowlist of approved, vetted macros.',
            purpose: 'A vetted macro allowlist ensures that only business-approved macros can execute. This provides granular control over which macros are permitted while blocking all others.',
            implementation: 'Identify business-critical macros that are required. Vet each macro for security and business need. Implement technical controls to allow only approved macros. Establish a process for requesting and approving new macros.',
            examples: ['Application control solutions', 'Macro-specific allowlisting tools', 'Document management systems with macro control'],
            evidence: ['Approved macro inventory', 'Macro vetting records', 'Allowlist configuration', 'Request and approval records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'macro-execution-logging',
            title: 'Macro Execution Logging',
            summary: 'Log all macro execution attempts for monitoring and investigation.',
            purpose: 'Logging macro execution provides visibility into macro usage and enables detection of suspicious activity. This supports both real-time monitoring and forensic investigation.',
            implementation: 'Enable macro execution logging in Office applications. Forward logs to a centralized SIEM platform. Configure alerts for suspicious macro execution patterns. Retain logs for a minimum of 12 months.',
            examples: ['Windows Event Log', 'SIEM integration', 'Office telemetry', 'Advanced audit policies'],
            evidence: ['Logging configuration', 'SIEM integration documentation', 'Alert configuration', 'Log retention policy'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'group-policy-enforcement',
            title: 'Group Policy Enforcement',
            summary: 'Use Group Policy to enforce macro settings across all endpoints.',
            purpose: 'Group Policy provides centralized, consistent enforcement of macro security settings. This ensures that all endpoints have the correct configuration and prevents users from overriding security settings.',
            implementation: 'Create and deploy Group Policy Objects for macro security settings. Apply policies to all relevant OUs. Prevent local override of macro settings. Regularly audit Group Policy compliance.',
            examples: ['Active Directory Group Policy', 'Microsoft Endpoint Manager', 'Office ADMX templates'],
            evidence: ['GPO configuration documentation', 'Group Policy compliance reports', 'GPO backup files', 'Audit results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'shared-document-macro-security',
            title: 'Macro Security for Shared Documents',
            summary: 'Apply enhanced macro controls to shared and collaborative documents.',
            purpose: 'Shared documents in collaboration platforms may bypass traditional macro controls. Ensuring consistent macro security across all document sharing scenarios prevents attackers from exploiting these gaps.',
            implementation: 'Configure macro security settings in SharePoint and OneDrive. Implement DLP policies to detect and block macro-enabled documents in unauthorized locations. Scan shared documents for malicious macros. Educate users on safe document sharing practices.',
            examples: ['SharePoint macro settings', 'OneDrive security policies', 'DLP policies for macro-enabled documents', 'Cloud App Security'],
            evidence: ['SharePoint security configuration', 'DLP policy configuration', 'Document scanning reports', 'User education records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'advanced-macro-analysis',
            title: 'Advanced Macro Analysis',
            summary: 'Use sandboxing and advanced analysis to vet macros before execution.',
            purpose: 'Static analysis alone may not detect sophisticated malicious macros. Advanced analysis using sandboxing and behavioral detection provides deeper inspection of macro behavior before allowing execution.',
            implementation: 'Deploy sandboxing solutions for macro analysis. Configure automated analysis of all macros before allowing execution. Integrate with threat intelligence for known malicious macro indicators. Implement machine learning-based detection for novel macro threats.',
            examples: ['Sandboxing solutions', 'Threat intelligence platforms', 'Machine learning-based email security', 'Document detonation chambers'],
            evidence: ['Sandbox configuration', 'Analysis workflow documentation', 'Detection accuracy metrics', 'Integration architecture'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'automated-macro-vetting',
            title: 'Automated Macro Vetting',
            summary: 'Automate the vetting and approval process for macros.',
            purpose: 'Manual macro vetting does not scale and introduces delays. Automated vetting enables rapid approval of legitimate macros while maintaining security standards.',
            implementation: 'Implement automated macro analysis and scoring. Define criteria for automatic approval and escalation. Integrate with change management for audit trails. Continuously improve detection accuracy based on feedback.',
            examples: ['Automated code review tools', 'Macro analysis pipelines', 'CI/CD for macro deployment'],
            evidence: ['Automated vetting workflow', 'Approval criteria documentation', 'Accuracy metrics', 'Process improvement records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'macro-behavior-monitoring',
            title: 'Macro Behavior Monitoring',
            summary: 'Monitor macro behavior at runtime for suspicious activity.',
            purpose: 'Even vetted macros may exhibit unexpected behavior at runtime. Runtime monitoring detects suspicious activities such as network connections, file system changes, or process creation by macros.',
            implementation: 'Deploy endpoint detection and response (EDR) solutions with macro monitoring capabilities. Configure behavioral rules for macro execution. Alert on suspicious macro behavior. Integrate with SOAR for automated response.',
            examples: ['EDR solutions', 'Behavioral analysis tools', 'SOAR platforms', 'Threat detection rules'],
            evidence: ['EDR configuration', 'Behavioral rule documentation', 'Alert records', 'Incident response playbooks'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'integration-application-control',
            title: 'Integration with Application Control',
            summary: 'Integrate macro controls with application control for defense in depth.',
            purpose: 'Macro controls are most effective when combined with application control. This layered approach ensures that even if a malicious macro executes, application control prevents subsequent malicious actions.',
            implementation: 'Configure application control to restrict what processes macros can spawn. Block macros from launching PowerShell, cmd, or scripting engines. Implement application control rules specific to Office child processes. Monitor and alert on application control violations from Office applications.',
            examples: ['WDAC with Office rules', 'AppLocker path rules', 'Application control for Office child processes'],
            evidence: ['Application control policy for Office', 'Integration configuration', 'Violation logs', 'Compliance reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  },
  {
    id: 'user-application-hardening',
    name: 'User Application Hardening',
    description: 'Harden user applications including web browsers, Office suites, PDF readers, and email clients against attacks.',
    guidance: 'Application hardening reduces the attack surface by disabling unnecessary features and configuring security settings. This prevents exploitation of common application vulnerabilities.',
    icon: 'UserCheck',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'browser-security-settings',
            title: 'Browser Security Settings',
            summary: 'Configure web browsers with secure settings and disable unnecessary features.',
            purpose: 'Web browsers are the primary interface to the internet and a common attack vector. Hardening browser settings reduces exposure to web-based attacks including drive-by downloads, malicious scripts, and exploit kits.',
            implementation: 'Disable or remove Flash Player, Java applets, and unnecessary browser extensions. Configure browsers to block pop-ups and malicious websites. Enable site isolation and sandboxing features. Deploy browser security settings via Group Policy or MDM.',
            examples: ['Chrome Enterprise policies', 'Firefox GPO templates', 'Edge security configuration', 'Browser extension whitelisting'],
            evidence: ['Browser security configuration', 'Group Policy settings', 'Extension whitelist', 'Compliance audit results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'office-application-hardening',
            title: 'Office Application Hardening',
            summary: 'Disable unnecessary Office features and configure security settings.',
            purpose: 'Office applications have many features that can be exploited by attackers, including DDE, OLE, and ActiveX. Disabling unnecessary features reduces the attack surface while maintaining productivity.',
            implementation: 'Disable Dynamic Data Exchange (DDE) in Office applications. Configure OLE package handler settings. Disable unnecessary ActiveX controls. Block Object Linking and Embedding (OLE) from the internet. Configure Protected View for documents from the internet.',
            examples: ['Office Group Policy settings', 'DDE mitigation configurations', 'OLE security settings', 'Protected View configuration'],
            evidence: ['Office security configuration', 'Group Policy settings', 'Feature disablement records', 'Compliance reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'pdf-reader-hardening',
            title: 'PDF Reader Hardening',
            summary: 'Configure PDF readers to prevent exploitation of PDF vulnerabilities.',
            purpose: 'PDF readers are frequently targeted by attackers through malicious PDF files. Hardening PDF reader settings prevents exploitation of vulnerabilities in PDF parsing and rendering.',
            implementation: 'Disable JavaScript execution in PDF readers. Enable sandboxing/protected mode. Disable automatic opening of non-PDF attachments. Configure PDF readers to block connections to the internet. Keep PDF readers patched to the latest version.',
            examples: ['Adobe Reader Protected Mode', 'Foxit Reader security settings', 'PDF viewer sandboxing'],
            evidence: ['PDF reader security configuration', 'Sandboxing settings', 'JavaScript disablement records', 'Patch compliance reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'email-client-security',
            title: 'Email Client Security',
            summary: 'Harden email clients against phishing and malicious content.',
            purpose: 'Email is the primary vector for phishing and malware delivery. Hardening email clients reduces the risk of users falling victim to email-based attacks.',
            implementation: 'Disable automatic loading of external content. Configure email clients to display emails in plain text by default. Disable automatic execution of attachments. Implement email authentication (SPF, DKIM, DMARC). Deploy anti-phishing protections.',
            examples: ['Outlook security settings', 'Email authentication (SPF/DKIM/DMARC)', 'Anti-phishing solutions', 'Email gateway security'],
            evidence: ['Email client security configuration', 'Email authentication records', 'Anti-phishing configuration', 'Security audit results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'application-firewall-rules',
            title: 'Application Firewall Rules',
            summary: 'Configure firewall rules to restrict application network access.',
            purpose: 'Restricting application network access prevents compromised applications from communicating with command-and-control servers and limits lateral movement.',
            implementation: 'Implement application-aware firewall rules. Restrict outbound connections from applications to only required destinations. Block applications from connecting to known malicious IPs and domains. Log and monitor application network activity.',
            examples: ['Windows Firewall with Advanced Security', 'Next-generation firewalls', 'Host-based firewalls', 'DNS filtering solutions'],
            evidence: ['Firewall rule documentation', 'Application network access matrix', 'Firewall logs', 'Change management records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'content-filtering',
            title: 'Content Filtering',
            summary: 'Filter web and email content to block malicious material.',
            purpose: 'Content filtering prevents users from accessing malicious websites and receiving malicious content. This provides an additional layer of protection against web-based and email-based threats.',
            implementation: 'Deploy web content filtering solutions. Configure email content filtering and sandboxing. Block access to known malicious categories of websites. Implement SSL/TLS inspection for encrypted traffic. Regularly update filtering rules and categories.',
            examples: ['Web proxy filters', 'DNS-based content filtering', 'Email content disarm and reconstruction (CDR)', 'SSL inspection appliances'],
            evidence: ['Content filtering policy', 'Filter configuration', 'Blocked content logs', 'Category update records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'certificate-pinning',
            title: 'Certificate Pinning',
            summary: 'Implement certificate pinning for critical applications.',
            purpose: 'Certificate pinning prevents man-in-the-middle attacks by ensuring applications only accept specific certificates. This protects against compromised certificate authorities and SSL interception attacks.',
            implementation: 'Identify critical applications that handle sensitive data. Implement certificate pinning for these applications. Monitor for certificate pinning failures. Maintain a process for updating pinned certificates before expiry.',
            examples: ['HTTP Public Key Pinning (HPKP)', 'Application-level certificate pinning', 'Certificate transparency monitoring'],
            evidence: ['Certificate pinning configuration', 'Pinned certificate inventory', 'Monitoring alerts', 'Certificate update procedures'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'tls-configuration',
            title: 'TLS Configuration',
            summary: 'Enforce strong TLS settings for all application communications.',
            purpose: 'Weak TLS configurations can be exploited to intercept or modify communications. Enforcing strong TLS settings ensures data confidentiality and integrity for all application traffic.',
            implementation: 'Disable SSL 2.0, SSL 3.0, TLS 1.0, and TLS 1.1. Enforce TLS 1.2 or higher. Configure strong cipher suites. Implement HSTS for web applications. Regularly scan for TLS configuration weaknesses.',
            examples: ['TLS 1.2/1.3 enforcement', 'Cipher suite configuration', 'HSTS headers', 'SSL/TLS scanning tools'],
            evidence: ['TLS configuration documentation', 'Cipher suite settings', 'HSTS configuration', 'TLS scan results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'advanced-threat-protection',
            title: 'Advanced Threat Protection',
            summary: 'Deploy advanced threat protection for user applications.',
            purpose: 'Advanced threat protection uses behavioral analysis, machine learning, and cloud-based intelligence to detect and block sophisticated attacks that bypass traditional security controls.',
            implementation: 'Deploy endpoint detection and response (EDR) solutions. Enable cloud-delivered protection for antivirus. Implement attack surface reduction rules. Configure network protection features. Integrate threat intelligence feeds.',
            examples: ['Microsoft Defender for Endpoint', 'CrowdStrike Falcon', 'SentinelOne', 'Carbon Black'],
            evidence: ['EDR deployment records', 'Threat detection configuration', 'Alert and response logs', 'Threat intelligence integration'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'application-sandboxing',
            title: 'Application Sandboxing',
            summary: 'Run applications in sandboxed environments to contain breaches.',
            purpose: 'Application sandboxing contains the impact of a compromised application by isolating it from the rest of the system. This prevents attackers from accessing sensitive data or moving laterally even if an application is exploited.',
            implementation: 'Enable sandboxing for all supported applications. Configure sandbox policies to restrict file system and network access. Deploy application virtualization for high-risk applications. Monitor sandbox escape attempts.',
            examples: ['Windows Sandbox', 'Docker containers', 'Application virtualization', 'Browser sandboxing'],
            evidence: ['Sandboxing configuration', 'Sandbox policy documentation', 'Isolation test results', 'Monitoring logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'memory-protection',
            title: 'Memory Protection',
            summary: 'Enforce memory protection mechanisms across all applications.',
            purpose: 'Memory-based exploits such as buffer overflows and use-after-free are common attack techniques. Enforcing memory protection mechanisms makes these exploits significantly more difficult.',
            implementation: 'Enable ASLR (Address Space Layout Randomization) system-wide. Enforce DEP (Data Execution Prevention) for all applications. Enable Control Flow Guard (CFG). Configure Exploit Protection settings. Monitor for memory exploitation attempts.',
            examples: ['ASLR', 'DEP/NX bit', 'Control Flow Guard', 'Windows Exploit Protection'],
            evidence: ['Memory protection configuration', 'ASLR/DEP enforcement records', 'Exploit protection settings', 'Security scan results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'zero-trust-application-access',
            title: 'Zero Trust Application Access',
            summary: 'Implement zero trust principles for application access.',
            purpose: 'Zero trust assumes no application or user is inherently trustworthy. Implementing zero trust for application access ensures continuous verification and least-privilege access.',
            implementation: 'Implement identity-aware proxy for application access. Enforce device health checks before granting application access. Use continuous authentication and authorization. Segment application access based on risk. Monitor all application access sessions.',
            examples: ['Zero Trust Network Access (ZTNA)', 'Identity-aware proxies', 'Software-defined perimeter', 'Conditional access policies'],
            evidence: ['Zero trust architecture documentation', 'Access policy configuration', 'Device health check settings', 'Access monitoring logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  },
  {
    id: 'restrict-administrative-privileges',
    name: 'Restrict Administrative Privileges',
    description: 'Limit administrative privileges to reduce the attack surface and prevent unauthorized system changes.',
    guidance: 'Administrative privileges provide unrestricted access to systems. Restricting these privileges limits the damage that can be caused by compromised accounts and reduces the attack surface.',
    icon: 'Lock',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'admin-account-inventory',
            title: 'Admin Account Inventory',
            summary: 'Maintain a complete inventory of all administrative accounts.',
            purpose: 'You cannot protect what you do not know about. A complete inventory of administrative accounts is essential for managing privileged access and identifying unauthorized accounts.',
            implementation: 'Discover and document all administrative accounts across the environment. Include domain admin, local admin, service accounts, and cloud admin accounts. Regularly reconcile the inventory. Remove or disable unnecessary admin accounts.',
            examples: ['Active Directory audit tools', 'Privileged account discovery tools', 'Cloud IAM auditing', 'CMDB integration'],
            evidence: ['Admin account inventory', 'Discovery scan results', 'Reconciliation records', 'Account removal documentation'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'separate-admin-accounts',
            title: 'Separate Admin Accounts',
            summary: 'Use separate accounts for administrative and standard user tasks.',
            purpose: 'Using the same account for email, web browsing, and administration dramatically increases the risk of credential compromise. Separate admin accounts ensure that administrative credentials are only used for administrative tasks.',
            implementation: 'Create dedicated admin accounts for all users with administrative privileges. Ensure admin accounts are not used for email, web browsing, or other daily tasks. Configure admin accounts with additional security controls. Implement naming conventions to identify admin accounts.',
            examples: ['Named admin accounts (e.g., admin-jsmith)', 'Privileged access workstations', 'Admin account naming conventions'],
            evidence: ['Admin account policy', 'Account inventory showing separation', 'User acknowledgment records', 'Compliance audit results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'just-in-time-admin',
            title: 'Just-In-Time Admin Access',
            summary: 'Provide administrative access only when needed and for limited time.',
            purpose: 'Standing administrative privileges increase the window of opportunity for attackers. Just-in-time access ensures privileges are only active when needed, reducing the attack surface.',
            implementation: 'Implement a just-in-time access solution. Define approval workflows for admin access requests. Set time limits for elevated access. Automatically revoke privileges after the approved period. Log all elevation events.',
            examples: ['Microsoft LAPS', 'CyberArk PAM', 'BeyondTrust PAM', 'Azure AD PIM'],
            evidence: ['JIT access configuration', 'Approval workflow documentation', 'Access request logs', 'Automatic revocation records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'admin-password-vault',
            title: 'Admin Password Vault',
            summary: 'Store and manage administrative passwords in a secure vault.',
            purpose: 'Administrative passwords stored in spreadsheets or shared documents are a significant security risk. A password vault provides secure storage, rotation, and access control for privileged credentials.',
            implementation: 'Deploy a privileged access management (PAM) solution. Store all administrative passwords in the vault. Implement automatic password rotation. Control and audit access to privileged credentials. Integrate with ITSM for workflow management.',
            examples: ['CyberArk', 'BeyondTrust', 'Thycotic Secret Server', 'HashiCorp Vault'],
            evidence: ['PAM solution deployment', 'Password vault configuration', 'Rotation policy and records', 'Access audit logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'privileged-access-workstations',
            title: 'Privileged Access Workstations (PAW)',
            summary: 'Use dedicated, hardened workstations for administrative tasks.',
            purpose: 'Administrative tasks performed on regular workstations expose privileged credentials to malware and phishing. PAWs provide a clean, hardened environment for administrative work.',
            implementation: 'Deploy dedicated PAWs for all administrators. Harden PAWs with enhanced security controls. Restrict PAW access to administrative tasks only. Implement application control on PAWs. Monitor PAW usage and compliance.',
            examples: ['Microsoft PAW guidance', 'Dedicated admin laptops', 'Virtual PAWs', 'Secure admin workstations'],
            evidence: ['PAW deployment records', 'PAW hardening standards', 'Access control configuration', 'Usage monitoring logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'admin-session-monitoring',
            title: 'Admin Session Monitoring',
            summary: 'Monitor and record all administrative sessions.',
            purpose: 'Monitoring administrative sessions provides visibility into privileged activities and enables detection of unauthorized or malicious actions. Session recordings support forensic investigation.',
            implementation: 'Deploy session monitoring for all administrative access. Record sessions for high-risk activities. Store session recordings securely with appropriate retention. Configure alerts for suspicious administrative activities. Regularly review session logs.',
            examples: ['PAM session recording', 'RDP session monitoring', 'SSH session recording', 'Jump server logging'],
            evidence: ['Session monitoring configuration', 'Recording storage and retention policy', 'Alert configuration', 'Review records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'role-based-access-control',
            title: 'Role-Based Access Control',
            summary: 'Implement RBAC to grant minimum necessary privileges.',
            purpose: 'RBAC ensures that administrators only have the privileges necessary for their specific role. This limits the impact of compromised accounts and reduces the risk of accidental system changes.',
            implementation: 'Define administrative roles based on job functions. Assign privileges based on least privilege principle. Implement RBAC across all systems including cloud platforms. Regularly review and update role assignments.',
            examples: ['Active Directory groups', 'Azure AD roles', 'AWS IAM roles', 'Custom RBAC implementations'],
            evidence: ['Role definition documentation', 'Privilege assignment matrix', 'RBAC configuration', 'Review records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'admin-account-review',
            title: 'Admin Account Review Process',
            summary: 'Regularly review and certify administrative access.',
            purpose: 'Administrative access requirements change over time. Regular reviews ensure that only current, authorized users retain administrative privileges, reducing the risk of unauthorized access.',
            implementation: 'Establish a quarterly review process for all admin accounts. Require managers to certify their staff\'s admin access needs. Remove access for users who no longer require it. Document review decisions and actions taken.',
            examples: ['Access certification campaigns', 'Manager attestation processes', 'Automated access reviews', 'GRC platform workflows'],
            evidence: ['Review schedule and process', 'Review completion records', 'Access removal documentation', 'Exception approvals'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'zero-standing-privileges',
            title: 'Zero Standing Privileges',
            summary: 'Eliminate permanent administrative privileges entirely.',
            purpose: 'Standing privileges are a prime target for attackers. Zero standing privileges means no account has permanent admin access, dramatically reducing the attack surface for credential theft.',
            implementation: 'Remove all permanent administrative privileges. Implement just-in-time elevation for all admin tasks. Use time-limited access tokens. Implement break-glass procedures for emergencies. Monitor and audit all privilege elevation.',
            examples: ['Azure AD PIM', 'AWS STS temporary credentials', 'CyberArk PAM', 'HashiCorp Vault dynamic secrets'],
            evidence: ['Zero standing privilege policy', 'JIT configuration', 'Break-glass procedures', 'Elevation audit logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'pam-solution',
            title: 'Privileged Access Management (PAM)',
            summary: 'Deploy comprehensive PAM solution for all privileged access.',
            purpose: 'A comprehensive PAM solution provides centralized control, monitoring, and auditing of all privileged access. This is the foundation for managing privileged credentials and sessions.',
            implementation: 'Deploy an enterprise PAM solution. Integrate with all systems requiring privileged access. Implement credential vaulting, session management, and access workflows. Automate password rotation for all privileged accounts.',
            examples: ['CyberArk Core PAS', 'BeyondTrust PAM', 'Delinea Secret Server', 'Arkose Labs'],
            evidence: ['PAM architecture documentation', 'Integration records', 'Workflow configuration', 'Usage metrics'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'admin-activity-auditing',
            title: 'Admin Activity Auditing',
            summary: 'Comprehensive auditing of all administrative activities.',
            purpose: 'Detailed auditing of administrative activities enables detection of unauthorized changes, supports forensic investigation, and demonstrates compliance with security policies.',
            implementation: 'Enable detailed auditing on all systems. Forward audit logs to a centralized SIEM. Configure alerts for high-risk administrative actions. Retain audit logs for a minimum of 12 months. Conduct regular audit log reviews.',
            examples: ['Windows Security Event Log', 'Linux auditd', 'Cloud audit logs', 'SIEM correlation rules'],
            evidence: ['Audit policy configuration', 'SIEM integration', 'Alert configuration', 'Log retention verification'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'automated-privilege-revocation',
            title: 'Automated Privilege Revocation',
            summary: 'Automatically revoke privileges based on defined conditions.',
            purpose: 'Manual privilege revocation is slow and error-prated. Automated revocation ensures that privileges are removed immediately when conditions are met, such as role change or suspicious activity.',
            implementation: 'Implement automated revocation based on HR events (termination, role change). Configure risk-based revocation triggered by suspicious activity. Integrate with identity governance platforms. Test revocation procedures regularly.',
            examples: ['HR system integration', 'Identity governance platforms', 'Automated deprovisioning workflows', 'Risk-based revocation rules'],
            evidence: ['Automation workflow configuration', 'Integration documentation', 'Revocation test records', 'Incident response metrics'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  },
  {
    id: 'patch-operating-systems',
    name: 'Patch Operating Systems',
    description: 'Close security vulnerabilities in operating systems to prevent exploitation by malicious actors.',
    guidance: 'Operating system vulnerabilities are frequently exploited by attackers. The ACSC recommends patching critical OS vulnerabilities within 48 hours for extreme risk, and within 2 weeks for other vulnerabilities.',
    icon: 'Monitor',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'os-patch-policy',
            title: 'OS Patch Management Policy',
            summary: 'Establish a formal policy for operating system patch management.',
            purpose: 'A formal OS patch management policy provides the framework for consistent and timely patching of operating systems across the organization.',
            implementation: 'Develop and approve an OS patch management policy. Define patching timelines (48 hours for extreme risk). Assign roles and responsibilities. Include all operating system types in scope. Define exception and emergency patching procedures.',
            examples: ['NIST SP 800-40', 'ISO 27001', 'CIS Controls'],
            evidence: ['Approved OS patch management policy', 'Policy approval records', 'Roles and responsibilities matrix', 'Exception process documentation'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'critical-os-patching',
            title: 'Critical OS Patching',
            summary: 'Patch critical and extreme-risk OS vulnerabilities within 48 hours.',
            purpose: 'OS vulnerabilities are actively exploited by attackers. Rapid patching of critical OS vulnerabilities within 48 hours significantly reduces the risk of system compromise.',
            implementation: 'Monitor OS vendor security advisories. Establish emergency OS patching procedures. Test patches before deployment. Prioritize patching based on asset criticality and exposure. Track patching completion against timelines.',
            examples: ['Windows Update', 'WSUS', 'Linux package managers', 'Vendor security advisories'],
            evidence: ['OS vulnerability assessment reports', 'Patching completion records', 'Emergency patching procedures', 'Timeline compliance metrics'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'os-inventory-baseline',
            title: 'OS Inventory and Baseline',
            summary: 'Maintain inventory of all operating systems and their patch levels.',
            purpose: 'A comprehensive OS inventory ensures that all systems are accounted for and included in the patch management process. Baselines enable detection of unauthorized changes.',
            implementation: 'Deploy automated OS inventory tools. Maintain a CMDB with OS versions and patch levels. Establish secure baseline configurations. Regularly reconcile inventory with actual deployments.',
            examples: ['SCCM/Intune', 'Lansweeper', 'ServiceNow CMDB', 'OSQuery'],
            evidence: ['OS inventory report', 'CMDB records', 'Baseline configuration documentation', 'Reconciliation records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'automated-os-updates',
            title: 'Automated OS Updates',
            summary: 'Automate operating system update deployment.',
            purpose: 'Automated OS updates ensure consistent and timely patching across the entire environment, reducing the risk of human error and missed patches.',
            implementation: 'Configure automatic OS update deployment. Define maintenance windows for updates. Implement update testing and rollback procedures. Monitor update compliance across all systems.',
            examples: ['Windows Update for Business', 'WSUS', 'Red Hat Satellite', 'Ubuntu Landscape'],
            evidence: ['Update automation configuration', 'Maintenance window schedules', 'Compliance reports', 'Rollback procedures'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'regular-os-patching-cycle',
            title: 'Regular OS Patching Cycle',
            summary: 'Apply OS patches within 2 weeks of release.',
            purpose: 'A regular OS patching cycle ensures systematic and timely patching, preventing accumulation of unpatched vulnerabilities.',
            implementation: 'Establish a regular OS patching schedule. Automate patch approval for low-risk updates. Track OS patch compliance. Report compliance metrics to management.',
            examples: ['Monthly patch cycles', 'Automated approval workflows', 'Compliance dashboards'],
            evidence: ['Patching schedule', 'Compliance reports', 'Management reports', 'Workflow configuration'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'os-vulnerability-scanning',
            title: 'OS Vulnerability Scanning',
            summary: 'Regularly scan for OS vulnerabilities and missing patches.',
            purpose: 'OS vulnerability scanning identifies missing patches and configuration weaknesses before attackers can exploit them.',
            implementation: 'Deploy OS vulnerability scanning tools. Schedule regular scans. Prioritize remediation based on results. Track remediation progress.',
            examples: ['Nessus', 'Qualys', 'Rapid7', 'OpenVAS'],
            evidence: ['Scan reports', 'Scan schedules', 'Remediation tracking', 'Trend analysis'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'os-patch-testing',
            title: 'Patch Testing for OS Updates',
            summary: 'Test OS patches before production deployment.',
            purpose: 'OS patches can cause system instability. Testing before deployment ensures business continuity while maintaining security.',
            implementation: 'Establish a test environment mirroring production. Define test cases for critical systems. Document test results. Implement rollback procedures.',
            examples: ['Staging environments', 'Automated testing', 'Canary deployments'],
            evidence: ['Testing procedures', 'Test environment documentation', 'Test results', 'Rollback procedures'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'eol-os-management',
            title: 'End-of-Life OS Management',
            summary: 'Identify and manage end-of-life operating systems.',
            purpose: 'End-of-life operating systems no longer receive security patches, making them vulnerable to known exploits. Identifying and replacing EOL systems is critical for security.',
            implementation: 'Identify all EOL operating systems. Develop migration plans to supported versions. Implement compensating controls for systems that cannot be immediately upgraded. Track migration progress.',
            examples: ['EOL tracking tools', 'Migration project plans', 'Compensating control documentation'],
            evidence: ['EOL system inventory', 'Migration plans', 'Compensating control records', 'Migration progress reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'zero-day-os-response',
            title: 'Zero-Day OS Response',
            summary: 'Respond to zero-day OS vulnerabilities within 48 hours.',
            purpose: 'Zero-day OS vulnerabilities represent the highest risk. A rapid response capability minimizes exposure during the window between disclosure and patch availability.',
            implementation: 'Establish a zero-day OS response team. Monitor threat intelligence for OS zero-days. Implement compensating controls when patches are unavailable. Deploy emergency patches within 48 hours.',
            examples: ['Threat intelligence platforms', 'Virtual patching', 'Network segmentation', 'Emergency change procedures'],
            evidence: ['Response procedures', 'Threat intelligence subscriptions', 'Compensating controls', 'Emergency patching records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'continuous-os-vulnerability-management',
            title: 'Continuous OS Vulnerability Management',
            summary: 'Implement continuous OS vulnerability monitoring.',
            purpose: 'Continuous monitoring provides real-time awareness of OS security posture and enables immediate response to new threats.',
            implementation: 'Deploy continuous OS vulnerability monitoring. Integrate with SIEM and ticketing. Implement risk-based prioritization. Automate remediation workflows.',
            examples: ['Continuous scanners', 'Attack surface management', 'Risk-based prioritization tools'],
            evidence: ['Monitoring configuration', 'Integration documentation', 'Risk scoring methodology', 'Automation workflows'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'os-patch-compliance-reporting',
            title: 'OS Patch Compliance Reporting',
            summary: 'Generate detailed OS patch compliance reports.',
            purpose: 'Compliance reporting provides visibility into patch management effectiveness and supports audit requirements.',
            implementation: 'Generate automated OS patch compliance reports. Track key metrics. Report to executive management. Use metrics for process improvement.',
            examples: ['Compliance dashboards', 'Executive reports', 'GRC platforms'],
            evidence: ['Compliance reports', 'Executive briefings', 'Metric trends', 'Improvement records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'emergency-os-patching',
            title: 'Emergency OS Patching Procedures',
            summary: 'Formalized procedures for emergency OS patching.',
            purpose: 'Critical OS vulnerabilities may require immediate patching outside normal cycles. Formalized procedures ensure rapid response while managing risk.',
            implementation: 'Define criteria for emergency OS patching. Establish emergency change approval. Pre-stage emergency patching capabilities. Conduct post-patching reviews.',
            examples: ['Emergency CAB', 'Pre-approved windows', 'Automated emergency deployment'],
            evidence: ['Emergency procedures', 'Change records', 'Review reports', 'Improvement records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  },
  {
    id: 'multi-factor-authentication',
    name: 'Multi-Factor Authentication',
    description: 'Require multiple authentication factors to protect accounts from unauthorized access.',
    guidance: 'MFA is one of the most effective controls against credential-based attacks. The ACSC recommends phishing-resistant MFA for all users, especially for privileged and remote access accounts.',
    icon: 'KeyRound',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'mfa-remote-access',
            title: 'MFA for Remote Access',
            summary: 'Require MFA for all remote access to organizational systems.',
            purpose: 'Remote access is a primary target for credential-based attacks. MFA for remote access prevents attackers from using stolen credentials to access organizational systems from external locations.',
            implementation: 'Deploy MFA for all remote access methods including VPN, RDP, and web-based access. Use phishing-resistant MFA methods where possible. Configure MFA to require re-authentication after session timeout. Monitor and alert on MFA bypass attempts.',
            examples: ['Azure AD MFA', 'Duo Security', 'Okta MFA', 'RSA SecurID'],
            evidence: ['MFA configuration for remote access', 'MFA enrollment reports', 'Bypass attempt logs', 'Session timeout settings'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'mfa-privileged-accounts',
            title: 'MFA for Privileged Accounts',
            summary: 'Require MFA for all privileged account access.',
            purpose: 'Privileged accounts are high-value targets. MFA for privileged accounts provides critical protection against credential theft and unauthorized administrative access.',
            implementation: 'Enforce MFA for all privileged accounts including domain admin, cloud admin, and service accounts. Use the strongest available MFA methods for privileged accounts. Implement step-up authentication for sensitive administrative actions. Monitor privileged account MFA usage.',
            examples: ['FIDO2 security keys', 'Smart cards', 'Certificate-based authentication', 'Azure AD PIM with MFA'],
            evidence: ['Privileged account MFA policy', 'MFA configuration for admin accounts', 'Enforcement verification', 'Usage monitoring logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'mfa-email-cloud',
            title: 'MFA for Email and Cloud Services',
            summary: 'Require MFA for email and cloud service access.',
            purpose: 'Email and cloud services contain sensitive data and are frequently targeted. MFA protects these services from credential stuffing, phishing, and password spray attacks.',
            implementation: 'Enable MFA for all email and cloud service accounts. Configure conditional access policies to require MFA from untrusted locations. Implement MFA for all cloud admin consoles. Monitor MFA enrollment and usage.',
            examples: ['Microsoft 365 MFA', 'Google Workspace MFA', 'AWS IAM MFA', 'Cloud SSO with MFA'],
            evidence: ['Email MFA configuration', 'Cloud service MFA settings', 'Enrollment reports', 'Conditional access policies'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'phishing-resistant-mfa',
            title: 'Phishing-Resistant MFA',
            summary: 'Deploy phishing-resistant MFA methods for high-risk accounts.',
            purpose: 'Not all MFA is equal. SMS and voice-based MFA can be bypassed through SIM swapping and social engineering. Phishing-resistant MFA provides stronger protection for high-risk accounts.',
            implementation: 'Identify high-risk accounts requiring phishing-resistant MFA. Deploy FIDO2 security keys or certificate-based authentication. Phase out SMS and voice-based MFA for privileged accounts. Educate users on phishing-resistant MFA usage.',
            examples: ['FIDO2/WebAuthn security keys', 'Certificate-based authentication', 'Windows Hello for Business', 'Platform authenticators'],
            evidence: ['Phishing-resistant MFA deployment plan', 'Hardware token inventory', 'Enrollment records', 'Phase-out plan for weak MFA'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'mfa-all-users',
            title: 'MFA for All Users',
            summary: 'Require MFA for all user accounts across the organization.',
            purpose: 'Limiting MFA to only privileged or remote access accounts leaves other accounts vulnerable. MFA for all users provides comprehensive protection against credential-based attacks.',
            implementation: 'Extend MFA to all user accounts. Provide MFA enrollment support and training. Implement self-service MFA management. Monitor and enforce MFA compliance. Handle exceptions through a formal approval process.',
            examples: ['Organization-wide MFA enrollment', 'Self-service MFA portal', 'MFA compliance monitoring'],
            evidence: ['MFA enrollment statistics', 'Compliance reports', 'Training materials', 'Exception records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'mfa-internal-systems',
            title: 'MFA for Internal Systems',
            summary: 'Require MFA for access to internal systems and applications.',
            purpose: 'Internal systems are often protected only by passwords. MFA for internal systems provides protection against lateral movement and insider threats.',
            implementation: 'Identify internal systems requiring MFA. Implement SSO with MFA for internal applications. Configure MFA for database and infrastructure access. Monitor internal system authentication.',
            examples: ['Internal SSO with MFA', 'Database MFA', 'Infrastructure access MFA', 'Application-level MFA'],
            evidence: ['Internal system MFA configuration', 'SSO integration records', 'Access logs', 'Compliance reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'mfa-vpn-rdp',
            title: 'MFA for VPN and RDP',
            summary: 'Require MFA for VPN and remote desktop access.',
            purpose: 'VPN and RDP are common entry points for attackers. MFA for these services prevents unauthorized remote access even if credentials are compromised.',
            implementation: 'Configure MFA for all VPN connections. Implement MFA for RDP sessions through RD Gateway or similar. Use network-level authentication with MFA. Monitor VPN and RDP authentication events.',
            examples: ['VPN with MFA integration', 'RD Gateway with MFA', 'Zero trust network access', 'MFA-enabled jump servers'],
            evidence: ['VPN MFA configuration', 'RDP MFA settings', 'Authentication logs', 'Compliance verification'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'mfa-monitoring-alerts',
            title: 'MFA Monitoring and Alerts',
            summary: 'Monitor MFA events and alert on suspicious activity.',
            purpose: 'Monitoring MFA events enables detection of attacks such as MFA fatigue (push bombing), credential stuffing, and unauthorized access attempts.',
            implementation: 'Forward MFA logs to SIEM. Configure alerts for MFA failures and suspicious patterns. Monitor for MFA bypass attempts. Implement automated response for repeated MFA failures.',
            examples: ['SIEM integration', 'MFA anomaly detection', 'Automated response playbooks'],
            evidence: ['MFA monitoring configuration', 'Alert rules', 'Incident response playbooks', 'Detection metrics'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'adaptive-mfa',
            title: 'Adaptive MFA',
            summary: 'Implement risk-based adaptive MFA that adjusts authentication requirements.',
            purpose: 'Adaptive MFA provides stronger authentication when risk is elevated while reducing friction for low-risk access. This balances security with user experience.',
            implementation: 'Deploy adaptive MFA solution. Define risk signals (location, device, behavior). Configure step-up authentication for risky access. Continuously tune risk models. Monitor false positive and negative rates.',
            examples: ['Azure AD Conditional Access', 'Okta Adaptive MFA', 'Duo Risk-Based Authentication', 'Google BeyondCorp'],
            evidence: ['Adaptive MFA configuration', 'Risk signal definitions', 'Policy configuration', 'Tuning records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'mfa-all-applications',
            title: 'MFA for All Applications',
            summary: 'Require MFA for access to all organizational applications.',
            purpose: 'Application-level MFA ensures that every application is protected, not just those covered by network-level or SSO-based MFA.',
            implementation: 'Inventory all organizational applications. Implement MFA for each application through SSO or native integration. Monitor application-level authentication. Ensure no application is accessible without MFA.',
            examples: ['Application SSO integration', 'API-based MFA', 'Legacy application MFA wrappers'],
            evidence: ['Application inventory with MFA status', 'Integration records', 'Authentication logs', 'Compliance reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'mfa-service-accounts',
            title: 'MFA for Service Accounts',
            summary: 'Implement MFA or equivalent controls for service accounts.',
            purpose: 'Service accounts often have elevated privileges and are difficult to manage with traditional MFA. Implementing equivalent controls for service accounts closes a significant security gap.',
            implementation: 'Identify all service accounts. Implement managed identities or certificate-based authentication where possible. Use PAM solutions for service account credential management. Monitor service account authentication.',
            examples: ['Managed identities', 'Certificate-based auth', 'PAM for service accounts', 'Workload identity federation'],
            evidence: ['Service account inventory', 'Managed identity configuration', 'Certificate management records', 'Monitoring logs'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'continuous-authentication',
            title: 'Continuous Authentication',
            summary: 'Implement continuous authentication to verify user identity throughout sessions.',
            purpose: 'Traditional MFA only verifies identity at session start. Continuous authentication monitors user behavior throughout the session to detect account takeover.',
            implementation: 'Deploy continuous authentication solutions. Configure behavioral biometrics and session monitoring. Define risk thresholds for step-up authentication. Integrate with incident response for detected anomalies.',
            examples: ['Behavioral biometrics', 'Session risk scoring', 'Continuous identity verification', 'User and entity behavior analytics (UEBA)'],
            evidence: ['Continuous authentication configuration', 'Behavioral baseline documentation', 'Risk threshold settings', 'Detection and response records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  },
  {
    id: 'regular-backups',
    name: 'Regular Backups',
    description: 'Ensure regular backups of important data to enable recovery from cybersecurity incidents.',
    guidance: 'Regular backups are the last line of defense against ransomware and data loss. The ACSC recommends maintaining offline, offsite, and encrypted backups with regular testing.',
    icon: 'Database',
    maturityLevels: [
      {
        level: 1,
        title: 'Maturity Level One',
        components: [
          {
            id: 'backup-policy-schedule',
            title: 'Backup Policy and Schedule',
            summary: 'Establish a formal backup policy defining scope, frequency, and responsibilities.',
            purpose: 'A backup policy ensures that all critical data is backed up consistently and that responsibilities are clearly defined. Without a policy, backups may be incomplete or inconsistent.',
            implementation: 'Develop and approve a backup policy. Define backup scope (all important data, software, and configuration). Establish backup frequency (daily minimum for critical data). Assign backup management responsibilities. Include cloud and on-premises data in scope.',
            examples: ['NIST SP 800-34', 'ISO 27001 backup controls', '3-2-1 backup rule'],
            evidence: ['Approved backup policy', 'Backup schedule documentation', 'Roles and responsibilities', 'Scope definition'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'daily-backups',
            title: 'Daily Backups of Important Data',
            summary: 'Perform daily backups of all important data and configurations.',
            purpose: 'Daily backups ensure that data can be recovered with minimal loss in the event of a ransomware attack or other data loss incident.',
            implementation: 'Configure automated daily backups for all important data. Include databases, file shares, email, and configuration data. Verify backup completion through monitoring. Store backups in accordance with the 3-2-1 rule.',
            examples: ['Veeam', 'Commvault', 'Veritas NetBackup', 'AWS Backup'],
            evidence: ['Backup job configuration', 'Backup completion logs', 'Backup inventory', 'Monitoring alerts'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'backup-encryption',
            title: 'Backup Encryption',
            summary: 'Encrypt all backup data at rest and in transit.',
            purpose: 'Backups contain sensitive data and must be protected from unauthorized access. Encryption ensures that backup data remains confidential even if backup media is lost or stolen.',
            implementation: 'Enable encryption for all backup data. Use strong encryption algorithms (AES-256). Manage encryption keys separately from backup data. Encrypt backup data in transit to offsite locations.',
            examples: ['AES-256 encryption', 'Backup software encryption features', 'TLS for backup transit', 'Key management systems'],
            evidence: ['Encryption configuration', 'Key management documentation', 'Encryption verification tests', 'Key rotation records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'backup-access-controls',
            title: 'Backup Access Controls',
            summary: 'Restrict access to backup systems and data.',
            purpose: 'Attackers target backup systems to prevent recovery. Restricting access to backups ensures that only authorized personnel can manage or delete backup data.',
            implementation: 'Implement role-based access control for backup systems. Separate backup administration from system administration. Require MFA for backup system access. Monitor and log all backup access. Implement immutable backup storage.',
            examples: ['RBAC for backup systems', 'Separate backup admin accounts', 'Immutable storage', 'MFA for backup access'],
            evidence: ['Access control policy for backups', 'RBAC configuration', 'Access logs', 'MFA configuration'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 2,
        title: 'Maturity Level Two',
        components: [
          {
            id: 'backup-testing-restoration',
            title: 'Backup Testing and Restoration',
            summary: 'Regularly test backup restoration to verify recoverability.',
            purpose: 'Backups that cannot be restored are useless. Regular testing ensures that backup data is complete, uncorrupted, and can be restored within required timeframes.',
            implementation: 'Establish a backup testing schedule (at least quarterly). Test restoration of different data types. Document test results and recovery times. Address any issues identified during testing. Include both full and partial restoration tests.',
            examples: ['Automated backup testing', 'Restoration test procedures', 'Recovery time tracking', 'Test result documentation'],
            evidence: ['Backup testing schedule', 'Test result documentation', 'Recovery time records', 'Issue remediation records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'offline-offsite-backups',
            title: 'Offline and Offsite Backups',
            summary: 'Maintain offline and offsite backup copies.',
            purpose: 'Ransomware specifically targets connected backups. Offline and offsite backups ensure that clean backup copies are available even if the primary environment is compromised.',
            implementation: 'Implement offline backup copies (air-gapped or immutable storage). Maintain offsite backup copies at a separate geographic location. Test offline/offsite restoration procedures. Ensure offsite copies are updated regularly.',
            examples: ['Air-gapped backups', 'Immutable cloud storage', 'Offsite tape storage', 'Geographic replication'],
            evidence: ['Offline backup configuration', 'Offsite storage documentation', 'Restoration test results', 'Update frequency records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'backup-monitoring-alerting',
            title: 'Backup Monitoring and Alerting',
            summary: 'Monitor backup operations and alert on failures.',
            purpose: 'Backup failures can go unnoticed until recovery is needed. Monitoring and alerting ensure that backup issues are identified and resolved promptly.',
            implementation: 'Deploy backup monitoring tools. Configure alerts for backup failures, missed jobs, and capacity issues. Establish on-call procedures for backup alerts. Track backup success rates over time.',
            examples: ['Backup monitoring dashboards', 'Automated alerting', 'Backup health reports', 'Capacity planning tools'],
            evidence: ['Monitoring configuration', 'Alert rules', 'Alert response procedures', 'Success rate reports'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'backup-retention-policy',
            title: 'Backup Retention Policy',
            summary: 'Define and enforce backup retention periods.',
            purpose: 'A retention policy ensures that backup data is available for the required period while managing storage costs. It also supports compliance with data retention requirements.',
            implementation: 'Define retention periods based on business and regulatory requirements. Implement automated retention enforcement. Document retention periods for different data types. Regularly review and update retention policy.',
            examples: ['Automated retention enforcement', 'Tiered retention schedules', 'Compliance-driven retention'],
            evidence: ['Retention policy documentation', 'Retention configuration', 'Compliance mapping', 'Review records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      },
      {
        level: 3,
        title: 'Maturity Level Three',
        components: [
          {
            id: 'immutable-backups',
            title: 'Immutable Backups',
            summary: 'Implement immutable backups that cannot be modified or deleted.',
            purpose: 'Sophisticated ransomware targets backup deletion and modification. Immutable backups ensure that recovery data cannot be tampered with, even by administrators.',
            implementation: 'Deploy immutable backup storage solutions. Configure retention locks that prevent deletion. Implement separate credentials for immutable backup management. Test immutable backup restoration regularly.',
            examples: ['AWS S3 Object Lock', 'Azure Immutable Blob Storage', 'WORM storage', 'Immutable backup appliances'],
            evidence: ['Immutable backup configuration', 'Retention lock settings', 'Access control for immutable storage', 'Restoration test results'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'automated-recovery-testing',
            title: 'Automated Recovery Testing',
            summary: 'Automate backup recovery testing to ensure continuous verification.',
            purpose: 'Manual testing is periodic and may miss issues between tests. Automated recovery testing provides continuous verification that backups are recoverable.',
            implementation: 'Deploy automated recovery testing tools. Schedule regular automated restoration tests. Configure alerts for test failures. Track recovery time objectives. Integrate with change management.',
            examples: ['Automated DR testing platforms', 'Backup verification tools', 'Continuous recovery validation'],
            evidence: ['Automated testing configuration', 'Test schedule', 'Test result reports', 'Recovery time metrics'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'cloud-workload-backups',
            title: 'Backup for Cloud Workloads',
            summary: 'Implement backup for cloud-native workloads including SaaS, IaaS, and PaaS.',
            purpose: 'Cloud workloads require different backup approaches than traditional on-premises systems. Ensuring comprehensive cloud backup coverage protects against cloud-specific threats.',
            implementation: 'Identify all cloud workloads requiring backup. Implement backup for SaaS data (email, documents, configurations). Backup IaaS instances and PaaS configurations. Test cloud backup restoration. Manage cloud backup costs.',
            examples: ['SaaS backup solutions', 'Cloud-native backup services', 'Infrastructure-as-code backup', 'Cloud snapshot management'],
            evidence: ['Cloud workload backup inventory', 'Backup configuration for each cloud service', 'Restoration test results', 'Cost management records'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          },
          {
            id: 'disaster-recovery-planning',
            title: 'Disaster Recovery Planning',
            summary: 'Develop and maintain a comprehensive disaster recovery plan.',
            purpose: 'Backups are only one component of disaster recovery. A comprehensive DR plan ensures that the organization can recover operations within required timeframes.',
            implementation: 'Develop a disaster recovery plan covering all critical systems. Define recovery time objectives (RTO) and recovery point objectives (RPO). Conduct regular DR exercises. Update the plan based on exercise results and infrastructure changes.',
            examples: ['DR plan documentation', 'DR exercise reports', 'RTO/RPO definitions', 'Business continuity integration'],
            evidence: ['Disaster recovery plan', 'DR exercise records', 'RTO/RPO documentation', 'Plan update history'],
            references: ['https://www.cyber.gov.au/resources-business-and-government/essential-cyber-security/essential-eight']
          }
        ]
      }
    ]
  }
];
