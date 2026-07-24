import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({ config })

async function upsertPage(slug: string, data: Record<string, unknown>) {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs.length > 0) {
    payload.logger.info(`— Updating page "${slug}"...`)
    return payload.update({
      collection: 'pages',
      id: existing.docs[0].id,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      context: { disableRevalidate: true },
    })
  } else {
    payload.logger.info(`— Creating page "${slug}"...`)
    return payload.create({
      collection: 'pages',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: data as any,
      context: { disableRevalidate: true },
    })
  }
}

async function deletePageIfExists(slug: string) {
  const existing = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  if (existing.docs.length > 0) {
    payload.logger.info(`— Removing stale test page "${slug}"...`)
    await payload.delete({ collection: 'pages', id: existing.docs[0].id, context: { disableRevalidate: true } })
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function simpleContentLayout(text: string) {
  return [
    {
      blockType: 'content' as const,
      columns: [
        {
          size: 'full' as const,
          richText: {
            root: {
              type: 'root',
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
              children: [
                {
                  type: 'paragraph',
                  direction: 'ltr' as const,
                  format: '' as const,
                  indent: 0,
                  version: 1,
                  textFormat: 0,
                  children: [
                    { type: 'text', detail: 0, format: 0, mode: 'normal', style: '', text, version: 1 },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  ]
}

// --- Remove the earlier placeholder infrastructure catalog (checkpoint0) so it doesn't
// leave duplicate/orphaned tabs alongside the real catalog seeded below. ---
for (const staleSlug of [
  'managed-it-service',
  'network-infrastructure',
  'cybersecurity-solutions',
  'security-operations-center',
  'vulnerability-assessment',
]) {
  await deletePageIfExists(staleSlug)
}

// --- Real service catalog: 11 categories, ~128 sub-services, recovered from the
// pre-revert content (src/components/code3-home/serviceData.ts in git history). ---
const SERVICE_CATEGORIES: { key: string; label: string }[] = [
  { key: 'managed-it', label: 'Managed IT Service' },
  { key: 'it-infra', label: 'IT Infrastructure Service' },
  { key: 'cyber-security', label: 'Cyber Security' },
  { key: 'network', label: 'Network Infrastructure' },
  { key: 'cloud-ms', label: 'Cloud and Microsoft Solutions' },
  { key: 'backup-bc', label: 'Backup and Business Continuity' },
  { key: 'unified-comm', label: 'Unified Communication' },
  { key: 'av', label: 'Audio Visual Solutions' },
  { key: 'security-surveillance', label: 'Security and Surveillance' },
  { key: 'hw-sw', label: 'Hardware and Software Services' },
  { key: 'professional', label: 'Professional Services' },
]

const SERVICE_DATA: Record<string, [string, string][]> = {
  'managed-it': [
    ['IT AMC', 'Scheduled maintenance contracts that keep your IT systems running smoothly with fewer surprises and less downtime.'],
    ['On Call IT Support', 'On-demand expert help whenever an issue comes up, resolved without waiting for a scheduled visit.'],
    ['New Office IT Setup', 'End-to-end IT setup for new offices, from cabling to workstations, ready before your team moves in.'],
    ['IT Relocation', 'Plan and execute office IT relocations with minimal downtime, so systems are back online fast.'],
    ['IT Outsourcing', 'Hand off day-to-day IT management to our certified team and free your staff to focus on the business.'],
    ['Data Recovery', 'Fast, reliable recovery of lost or corrupted business data using proven recovery methods.'],
    ['Remote Support', 'Fast remote troubleshooting for everyday IT issues, resolved without an on-site visit.'],
    ['Desktop Support', 'Hands-on support for desktops and laptops, from setup through everyday troubleshooting.'],
    ['IT Asset Management', 'Track, maintain, and optimize every piece of IT hardware and software your business owns.'],
  ],
  'it-infra': [
    ['Server Installation', 'Professional installation and configuration of physical and virtual servers built for reliability.'],
    ['NAS Storage', 'Network-attached storage for centralized, secure, and easily shared business data.'],
    ['SAN Storage', 'High-performance storage area networks for enterprises with demanding data and application needs.'],
    ['VMware', 'Virtualization built on VMware to consolidate infrastructure and improve resource efficiency.'],
    ['Hyper V', 'Microsoft Hyper-V virtualization, deployed and managed for stable, scalable IT environments.'],
    ['Virtual Machines', 'Provisioning and ongoing management of virtual machines that scale with your workloads.'],
    ['Server Rack Installation', 'Organized, properly ventilated server rack installations for safer, more reliable hardware.'],
    ['Environmental Monitoring', 'Real-time monitoring of temperature, humidity, and power to protect critical infrastructure.'],
  ],
  'cyber-security': [
    ['Security Operations Center (SOC)', 'Round-the-clock monitoring and threat detection from our Security Operations Center.'],
    ['Email Security Solution-On Cloud', 'Cloud-based email security that filters phishing, malware, and spam before they reach the inbox.'],
    ['Vulnerability Assessment And Penetration Testing', 'Proactive testing that uncovers security weaknesses before attackers can exploit them.'],
    ['Cloud and Network Security', 'Layered security controls that protect your cloud and network infrastructure from evolving threats.'],
    ['Services Solution', "Tailored security services designed around your organization's specific risk profile."],
    ['Endpoint Protection, EDR, XDR & MDR', 'Advanced endpoint protection with detection and response across every device on your network.'],
    ['Secure Email (S/MIME)', 'Encrypted, authenticated email communication that protects sensitive business correspondence.'],
    ['Web Application Firewall (WAF)', 'Filters malicious traffic to your web applications before it can cause damage.'],
    ['Data Loss Prevention Solution', 'Controls that stop sensitive data from leaving your organization without authorization.'],
    ['Employee Monitoring', 'Visibility into user activity that helps identify risk and enforce policy.'],
    ['Mobile device management', 'Centralized control and security for every mobile device connected to your business.'],
    ['PAM / PIM Solutions', 'Privileged access management that limits and monitors who can reach critical systems.'],
    ['SASE Solution', 'Converged network and security architecture delivered securely from the cloud.'],
    ['SIEM Solution', 'Centralized log analysis and correlation that detects threats across your entire environment.'],
    ['SOAR Solution', 'Automated response workflows that speed up how your team handles security incidents.'],
    ['Intelligent Threat Detection', 'AI-driven detection that flags unusual activity before it becomes a breach.'],
    ['Anti Spoofing and Impersonation Solution', 'Protects your brand and people from email spoofing and impersonation attacks.'],
  ],
  network: [
    ['LAN and WAN', 'Reliable local and wide-area networks that connect every office and user securely.'],
    ['VPN', 'Secure remote access to your business network from anywhere.'],
    ['Enterprise Wi-fi', 'High-density, enterprise-grade Wi-Fi built for performance and coverage.'],
    ['Network Optimization', 'Tuning and upgrades that improve speed, stability, and network performance.'],
    ['Internet Load Balancing', 'Distributes internet traffic across multiple links for uptime and speed.'],
    ['Cat6/Cat6A Cabling', "Structured cabling built for today's bandwidth demands and tomorrow's growth."],
    ['Fiber Optic Cabling', 'High-speed fiber connections for data centers and long-distance links.'],
    ['Network Rack Installation', 'Clean, organized rack installations that simplify network management.'],
    ['Data Center Cabling', 'Precision cabling for data centers, built for density and reliability.'],
    ['Network Monitoring', 'Continuous visibility into network health, performance, and potential issues.'],
  ],
  'cloud-ms': [
    ['Microsoft 365', 'Deployment and management of Microsoft 365 for secure, modern collaboration.'],
    ['Microsoft Copilot', 'AI-powered productivity built into your Microsoft 365 workflows.'],
    ['Dynamics 365', 'Business applications for sales, service, and operations, tailored to your needs.'],
    ['Microsoft 365 Security', 'Advanced threat protection and compliance built around Microsoft 365.'],
    ['Microsoft SharePoint', 'Collaborative document management and intranet solutions on SharePoint.'],
    ['Security Consultation', 'Expert guidance to strengthen your cloud and Microsoft security posture.'],
    ['Microsoft 365 Migration', 'Smooth migration to Microsoft 365 with minimal disruption to your business.'],
    ['Microsoft Azure', 'Cloud infrastructure, apps, and services built on Microsoft Azure.'],
    ['AWS Cloud', 'Design, migration, and management of workloads on AWS.'],
    ['Cloud Migration', 'Structured migration of applications and data to the cloud.'],
    ['Cloud Backup', 'Automated, secure backup of your critical data to the cloud.'],
    ['Disaster Recovery', 'Cloud-based recovery plans that keep your business running after disruption.'],
    ['Cloud Security', 'Layered protection for your cloud environments and workloads.'],
    ['Google Cloud', 'Deployment and management of workloads on Google Cloud Platform.'],
  ],
  'backup-bc': [
    ['Cloud Backup', 'Offsite, automated backups that protect data against loss or disaster.'],
    ['Local Backup', 'On-premise backup for fast recovery of critical business data.'],
    ['Hybrid Backup', 'Combines local and cloud backup for speed and redundancy.'],
    ['Disaster Recovery Planning', 'A tested plan that gets your business back online after a disruption.'],
    ['Data Recovery', 'Fast recovery of lost, corrupted, or deleted business data.'],
    ['Ransom Recovery', 'Recovery strategies built specifically to respond to ransomware attacks.'],
    ['Business Continuity', 'Plans and systems that keep operations running through any disruption.'],
  ],
  'unified-comm': [
    ['IP Telephony', 'Modern voice communication delivered over your existing network.'],
    ['VOIP Solutions', 'Cost-effective voice calling built on internet protocol technology.'],
    ['Cloud PBX', 'A cloud-hosted phone system with enterprise features and no on-site hardware.'],
    ['Conference Phones', 'Clear, reliable audio conferencing hardware for meeting rooms.'],
    ['Call Center Solutions', 'Scalable platforms for managing high call volumes efficiently.'],
    ['Contact Center Solutions', 'Omnichannel customer engagement across voice, chat, and more.'],
    ['Call Recording and IVR', 'Call recording and automated menus that improve service and compliance.'],
    ['Collaboration Displays', 'Interactive displays that bring meeting rooms into the digital age.'],
  ],
  av: [
    ['Boardroom Solutions', 'Integrated AV systems designed for high-impact executive boardrooms.'],
    ['Meeting Room Solutions', 'Seamless video, audio, and display integration for meeting spaces.'],
    ['Interactive Displays', 'Touch-enabled displays that make presentations and collaboration effortless.'],
    ['Digital Signage', 'Dynamic, remotely managed displays for communication and branding.'],
    ['Casting Solutions', 'Wireless screen sharing for fast, cable-free presentations.'],
    ['Smart Classroom Solutions', 'AV technology that brings interactive learning into the classroom.'],
    ['Video Walls', 'High-impact video wall installations for lobbies, control rooms, and events.'],
    ['Projectors', 'Reliable projection systems for meeting rooms, halls, and auditoriums.'],
    ['Public address(PA) Solutions', 'Clear, reliable announcements across offices, campuses, and facilities.'],
    ['Background Music', 'Ambient audio systems for offices, retail, and hospitality spaces.'],
    ['Auditorium Solutions', 'Complete AV design and installation for auditoriums and large venues.'],
    ['Multi-room Audio', 'Synchronized audio across multiple rooms and zones.'],
    ['Speaker System', 'Professional-grade speaker systems built for clarity at any scale.'],
    ['AV Consultation', 'Expert guidance to plan the right AV solution for your space.'],
    ['AV Programming', 'Custom programming that makes complex AV systems simple to use.'],
    ['AV Design Services', 'Tailored AV system design built around your space and goals.'],
    ['Smart Building Solutions', 'Connected building technology that improves efficiency and experience.'],
  ],
  'security-surveillance': [
    ['CCTV Installations', 'Professional CCTV design and installation for complete site coverage.'],
    ['AI Cameras', 'Smart cameras with AI-powered detection and analytics.'],
    ['Access Control and Bio-metric attendance System', 'Secure entry and attendance tracking with biometric access control.'],
    ['Gate Barrier and Automations', 'Automated gates and barriers for controlled vehicle and pedestrian access.'],
    ['Intercom Systems', 'Reliable intercom systems for secure, convenient site communication.'],
    ['Visitor Management System', 'Digital check-in that tracks and manages visitor access securely.'],
    ['ANPR Systems', 'Automatic number plate recognition for vehicle access and monitoring.'],
  ],
  'hw-sw': [
    ['Servers', 'Enterprise-grade servers sourced, configured, and supported by our team.'],
    ['Desktop Computers', 'Reliable business desktops from leading global manufacturers.'],
    ['Business Laptops', 'Durable, secure laptops built for modern hybrid work.'],
    ['Workstations', 'High-performance workstations for demanding technical workloads.'],
    ['Printers', 'Business printers and MFPs supplied, installed, and supported.'],
    ['UPS Systems', 'Uninterruptible power supplies that protect equipment from outages.'],
    ['Routers', 'Enterprise routers configured for performance and security.'],
    ['Switches', 'Managed switches that keep your network fast and reliable.'],
    ['Firewalls', "Next-gen firewalls that protect your network's perimeter."],
    ['Wireless Access Points', 'Enterprise access points for strong, consistent Wi-Fi coverage.'],
    ['Network Cabinets', 'Secure, organized cabinets for networking and server equipment.'],
    ['Microsoft Licensing', 'Genuine Microsoft licensing sourced and managed for compliance.'],
    ['Adobe Licensing', 'Licensed Adobe software for your creative and business teams.'],
    ['Antivirus Licensing', 'Trusted antivirus licensing to keep endpoints protected.'],
    ['Windows Licensing', 'Genuine Windows licensing for every device in your business.'],
    ['Server Licensing', 'Properly licensed server software, sourced and managed for you.'],
  ],
  professional: [
    ['IT Consulting', 'Strategic guidance to align your technology with business goals.'],
    ['Digital Transformation', 'Roadmaps and execution support for modernizing how your business runs.'],
    ['Infrastructure Assessment', 'A full review of your current IT infrastructure and its gaps.'],
    ['Cloud Readiness Assessment', 'Evaluate whether your systems and data are ready to move to the cloud.'],
    ['Security Assessment', 'Identify security gaps and prioritize the fixes that matter most.'],
    ['Site Survey', 'On-site evaluation to plan infrastructure and connectivity needs accurately.'],
    ['Solution Design', 'Custom-designed technology solutions built around your requirements.'],
    ['Installation', 'Professional installation carried out by certified engineers.'],
    ['Configuration', 'Expert configuration that gets systems running securely and correctly.'],
    ['Migration', 'Careful migration of systems and data with minimal disruption.'],
    ['Commissioning', 'Thorough testing and commissioning before systems go live.'],
    ['User Training', 'Hands-on training that helps your team get the most from new systems.'],
    ['Administrator Training', 'In-depth training for IT admins managing new solutions.'],
    ['Documentation', 'Clear, thorough documentation for every system we deploy.'],
    ['Knowledge Transfer', 'Structured handover that keeps your team confident and self-sufficient.'],
  ],
}

const usedSlugs = new Set<string>()

for (const category of SERVICE_CATEGORIES) {
  const parentDoc = await upsertPage(category.key, {
    title: category.label,
    slug: category.key,
    slugLock: false,
    serviceCategory: 'infrastructure',
    _status: 'published',
    hero: { type: 'none', HeroText: category.label },
    layout: simpleContentLayout(`${category.label} — solutions from CODE3.`),
    meta: { title: category.label, description: `${category.label} services from CODE3.` },
  })
  usedSlugs.add(category.key)

  const services = SERVICE_DATA[category.key] || []
  for (const [title, description] of services) {
    let slug = slugify(title)
    if (usedSlugs.has(slug)) slug = `${slug}-${category.key}`
    usedSlugs.add(slug)

    await upsertPage(slug, {
      title,
      slug,
      slugLock: false,
      serviceCategory: 'infrastructure',
      parentService: parentDoc.id,
      _status: 'published',
      hero: { type: 'none', HeroText: title },
      layout: simpleContentLayout(description),
      meta: { title, description },
    })
  }
}

payload.logger.info('Checkpoint 2 (full service catalog) seeded successfully!')
process.exit(0)
