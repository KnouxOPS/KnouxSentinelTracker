import { users, tools, systemStatus, toolConfigurations, type User, type InsertUser, type Tool, type InsertTool, type SystemStatus, type InsertSystemStatus, type ToolConfiguration, type InsertToolConfiguration } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllTools(): Promise<Tool[]>;
  getToolsByCategory(category: string): Promise<Tool[]>;
  getTool(id: number): Promise<Tool | undefined>;
  createTool(tool: InsertTool): Promise<Tool>;
  updateToolStatus(id: number, status: string): Promise<Tool | undefined>;
  
  getSystemStatus(): Promise<SystemStatus | undefined>;
  updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus>;
  
  getToolConfiguration(toolId: number, userId: number): Promise<ToolConfiguration | undefined>;
  saveToolConfiguration(config: InsertToolConfiguration): Promise<ToolConfiguration>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tools: Map<number, Tool>;
  private systemStatus: SystemStatus | undefined;
  private toolConfigurations: Map<string, ToolConfiguration>;
  private currentUserId: number;
  private currentToolId: number;
  private currentSystemStatusId: number;
  private currentConfigId: number;

  constructor() {
    this.users = new Map();
    this.tools = new Map();
    this.toolConfigurations = new Map();
    this.currentUserId = 1;
    this.currentToolId = 1;
    this.currentSystemStatusId = 1;
    this.currentConfigId = 1;
    
    // Initialize with default system status
    this.systemStatus = {
      id: 1,
      protection: true,
      vpn: true,
      maxMode: false,
      autopilot: true,
      threatsDetected: 2,
      lastScan: new Date(),
    };
    
    // Initialize with security tools data
    this.initializeTools();
  }

  private initializeTools() {
    const toolsData = [
      // Protection Category
      { name: 'Wireshark', description: 'Network protocol analyzer for deep packet inspection', category: 'protection', icon: 'fas fa-network-wired', status: 'active' },
      { name: 'Nmap', description: 'Network discovery and security auditing tool', category: 'protection', icon: 'fas fa-search', status: 'active' },
      { name: 'Metasploit', description: 'Penetration testing framework for security assessment', category: 'protection', icon: 'fas fa-bug', status: 'inactive' },
      { name: 'Burp Suite', description: 'Web application security testing platform', category: 'protection', icon: 'fas fa-globe', status: 'active' },
      { name: 'OWASP ZAP', description: 'Web application security scanner', category: 'protection', icon: 'fas fa-shield-alt', status: 'active' },
      { name: 'Nikto', description: 'Web server vulnerability scanner', category: 'protection', icon: 'fas fa-server', status: 'active' },
      { name: 'Aircrack-ng', description: 'Wireless network security auditing tool suite', category: 'protection', icon: 'fas fa-wifi', status: 'inactive' },
      { name: 'John the Ripper', description: 'Password security auditing and recovery tool', category: 'protection', icon: 'fas fa-key', status: 'active' },
      { name: 'Hashcat', description: 'Advanced password recovery and hash cracking tool', category: 'protection', icon: 'fas fa-lock-open', status: 'active' },
      { name: 'Sqlmap', description: 'Automatic SQL injection and database takeover tool', category: 'protection', icon: 'fas fa-database', status: 'active' },
      { name: 'Nessus', description: 'Comprehensive vulnerability assessment solution', category: 'protection', icon: 'fas fa-eye', status: 'active' },
      { name: 'OpenVAS', description: 'Open-source vulnerability assessment tool', category: 'protection', icon: 'fas fa-search-plus', status: 'active' },
      { name: 'Snort', description: 'Network intrusion detection and prevention system', category: 'protection', icon: 'fas fa-bell', status: 'active' },
      { name: 'Suricata', description: 'High-performance network security monitoring engine', category: 'protection', icon: 'fas fa-tachometer-alt', status: 'active' },
      { name: 'ClamAV', description: 'Open-source antivirus engine for malware detection', category: 'protection', icon: 'fas fa-virus-slash', status: 'active' },
      { name: 'YARA', description: 'Pattern matching engine for malware researchers', category: 'protection', icon: 'fas fa-dna', status: 'active' },
      { name: 'Volatility', description: 'Advanced memory forensics framework', category: 'protection', icon: 'fas fa-memory', status: 'inactive' },
      { name: 'Autopsy', description: 'Digital forensics platform for investigation', category: 'protection', icon: 'fas fa-search-location', status: 'active' },
      { name: 'TheHive', description: 'Scalable security incident response platform', category: 'protection', icon: 'fas fa-hive', status: 'active' },
      { name: 'MISP', description: 'Malware information sharing platform', category: 'protection', icon: 'fas fa-share-alt', status: 'active' },
      
      // Privacy Category
      { name: 'Tor Browser', description: 'Anonymous web browsing through encrypted relay network', category: 'privacy', icon: 'fas fa-user-secret', status: 'active' },
      { name: 'Tails OS', description: 'Amnesic incognito live operating system', category: 'privacy', icon: 'fas fa-compact-disc', status: 'active' },
      { name: 'Qubes OS', description: 'Security-focused desktop operating system', category: 'privacy', icon: 'fas fa-cubes', status: 'active' },
      { name: 'Signal', description: 'End-to-end encrypted messaging application', category: 'privacy', icon: 'fas fa-comments', status: 'active' },
      { name: 'ProtonMail', description: 'Encrypted email service with zero-access encryption', category: 'privacy', icon: 'fas fa-envelope-open-text', status: 'active' },
      { name: 'Whonix', description: 'Anonymous operating system preventing IP leaks', category: 'privacy', icon: 'fas fa-mask', status: 'active' },
      { name: 'I2P', description: 'Anonymous network layer for secure communications', category: 'privacy', icon: 'fas fa-route', status: 'inactive' },
      { name: 'Freenet', description: 'Decentralized peer-to-peer platform', category: 'privacy', icon: 'fas fa-project-diagram', status: 'active' },
      { name: 'Ricochet', description: 'Anonymous instant messaging over Tor', category: 'privacy', icon: 'fas fa-paper-plane', status: 'inactive' },
      { name: 'OnionShare', description: 'Secure and anonymous file sharing tool', category: 'privacy', icon: 'fas fa-share', status: 'active' },
      { name: 'Veracrypt', description: 'Strong disk encryption software', category: 'privacy', icon: 'fas fa-lock', status: 'active' },
      { name: 'GnuPG', description: 'Complete and free implementation of OpenPGP standard', category: 'privacy', icon: 'fas fa-fingerprint', status: 'active' },
      { name: 'KeePass', description: 'Secure password manager with strong encryption', category: 'privacy', icon: 'fas fa-key', status: 'active' },
      { name: 'Bitwarden', description: 'Open-source password management solution', category: 'privacy', icon: 'fas fa-shield-alt', status: 'active' },
      { name: 'Little Snitch', description: 'Network monitor for outgoing connections', category: 'privacy', icon: 'fas fa-eye', status: 'active' },
      { name: 'Ghostery', description: 'Privacy-focused web browser extension', category: 'privacy', icon: 'fas fa-ghost', status: 'active' },
      { name: 'uBlock Origin', description: 'Efficient ad and tracker blocker', category: 'privacy', icon: 'fas fa-ban', status: 'active' },
      { name: 'Pi-hole', description: 'Network-wide ad blocking DNS server', category: 'privacy', icon: 'fas fa-filter', status: 'active' },
      { name: 'Mullvad VPN', description: 'Privacy-focused VPN service', category: 'privacy', icon: 'fas fa-globe-americas', status: 'active' },
      { name: 'Privoxy', description: 'Non-caching web proxy with filtering capabilities', category: 'privacy', icon: 'fas fa-filter', status: 'active' },
      
      // Utility Category
      { name: 'Kali Linux', description: 'Penetration testing and ethical hacking distribution', category: 'utility', icon: 'fab fa-linux', status: 'active' },
      { name: 'Parrot Security OS', description: 'GNU/Linux distribution for security and development', category: 'utility', icon: 'fas fa-feather-alt', status: 'active' },
      { name: 'BlackArch Linux', description: 'Arch Linux-based penetration testing distribution', category: 'utility', icon: 'fas fa-terminal', status: 'active' },
      { name: 'VMware Workstation', description: 'Desktop hypervisor for running virtual machines', category: 'utility', icon: 'fas fa-layer-group', status: 'active' },
      { name: 'VirtualBox', description: 'Cross-platform virtualization application', category: 'utility', icon: 'fas fa-box', status: 'active' },
      { name: 'Docker', description: 'Containerization platform for application deployment', category: 'utility', icon: 'fab fa-docker', status: 'active' },
      { name: 'Kubernetes', description: 'Container orchestration system for automating deployment', category: 'utility', icon: 'fas fa-dharmachakra', status: 'active' },
      { name: 'Ansible', description: 'IT automation tool for configuration management', category: 'utility', icon: 'fas fa-cogs', status: 'active' },
      { name: 'Terraform', description: 'Infrastructure as code software tool', category: 'utility', icon: 'fas fa-cube', status: 'active' },
      { name: 'Git', description: 'Distributed version control system', category: 'utility', icon: 'fab fa-git-alt', status: 'active' },
      { name: 'Jenkins', description: 'Open-source automation server for CI/CD', category: 'utility', icon: 'fas fa-robot', status: 'active' },
      { name: 'Nagios', description: 'Computer system, network and infrastructure monitoring', category: 'utility', icon: 'fas fa-heartbeat', status: 'active' },
      { name: 'Zabbix', description: 'Enterprise-class monitoring solution', category: 'utility', icon: 'fas fa-chart-line', status: 'active' },
      { name: 'Splunk', description: 'Platform for searching, monitoring and analyzing data', category: 'utility', icon: 'fas fa-search', status: 'active' },
      { name: 'ELK Stack', description: 'Elasticsearch, Logstash, and Kibana for log analysis', category: 'utility', icon: 'fas fa-chart-bar', status: 'active' },
      { name: 'Grafana', description: 'Multi-platform open-source analytics and monitoring', category: 'utility', icon: 'fas fa-chart-area', status: 'active' },
      { name: 'Prometheus', description: 'Systems monitoring and alerting toolkit', category: 'utility', icon: 'fas fa-fire', status: 'active' },
      { name: 'pfSense', description: 'Open-source firewall and router platform', category: 'utility', icon: 'fas fa-shield-alt', status: 'active' },
      { name: 'OPNsense', description: 'Open-source firewall and routing platform', category: 'utility', icon: 'fas fa-network-wired', status: 'active' },
      { name: 'Advanced IP Scanner', description: 'Network scanner for IP address and port scanning', category: 'utility', icon: 'fas fa-network-wired', status: 'active' },
      
      // Operations Category
      { name: 'SIEM Splunk', description: 'Security information and event management platform', category: 'operations', icon: 'fas fa-search', status: 'active' },
      { name: 'IBM QRadar', description: 'Security intelligence platform for threat detection', category: 'operations', icon: 'fas fa-brain', status: 'active' },
      { name: 'ArcSight ESM', description: 'Enterprise security manager for correlation', category: 'operations', icon: 'fas fa-eye', status: 'active' },
      { name: 'LogRhythm', description: 'Security intelligence and analytics platform', category: 'operations', icon: 'fas fa-chart-line', status: 'active' },
      { name: 'Phantom SOAR', description: 'Security orchestration, automation and response', category: 'operations', icon: 'fas fa-robot', status: 'active' },
      { name: 'Demisto SOAR', description: 'Security orchestration and incident response', category: 'operations', icon: 'fas fa-cogs', status: 'active' },
      { name: 'Carbon Black', description: 'Endpoint detection and response platform', category: 'operations', icon: 'fas fa-desktop', status: 'active' },
      { name: 'CrowdStrike Falcon', description: 'Cloud-delivered endpoint protection platform', category: 'operations', icon: 'fas fa-cloud', status: 'active' },
      { name: 'SentinelOne', description: 'Autonomous endpoint protection platform', category: 'operations', icon: 'fas fa-shield-alt', status: 'active' },
      { name: 'Cylance Protect', description: 'AI-driven advanced threat prevention', category: 'operations', icon: 'fas fa-brain', status: 'active' },
      { name: 'FireEye HX', description: 'Endpoint security and threat intelligence', category: 'operations', icon: 'fas fa-fire', status: 'active' },
      { name: 'Tanium', description: 'Endpoint management and security platform', category: 'operations', icon: 'fas fa-network-wired', status: 'active' },
      { name: 'Rapid7 InsightIDR', description: 'Incident detection and response solution', category: 'operations', icon: 'fas fa-tachometer-alt', status: 'active' },
      { name: 'AlienVault OSSIM', description: 'Open-source security information management', category: 'operations', icon: 'fas fa-alien-monster', status: 'active' },
      { name: 'Security Onion', description: 'Linux distribution for threat hunting', category: 'operations', icon: 'fas fa-layer-group', status: 'active' },
      { name: 'RTIR', description: 'Request tracker for incident response', category: 'operations', icon: 'fas fa-ticket-alt', status: 'active' },
      { name: 'Maltego', description: 'Open-source intelligence and graphical link analysis', category: 'operations', icon: 'fas fa-project-diagram', status: 'active' },
      { name: 'Shodan', description: 'Search engine for Internet-connected devices', category: 'operations', icon: 'fas fa-satellite', status: 'active' },
      { name: 'VirusTotal', description: 'Online service for analyzing suspicious files', category: 'operations', icon: 'fas fa-virus', status: 'active' },
      { name: 'Hybrid Analysis', description: 'Free malware analysis service', category: 'operations', icon: 'fas fa-dna', status: 'active' }
    ];

    toolsData.forEach(tool => {
      const newTool: Tool = {
        id: this.currentToolId++,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        icon: tool.icon,
        status: tool.status,
        lastUpdated: new Date(),
      };
      this.tools.set(newTool.id, newTool);
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllTools(): Promise<Tool[]> {
    return Array.from(this.tools.values());
  }

  async getToolsByCategory(category: string): Promise<Tool[]> {
    return Array.from(this.tools.values()).filter(tool => tool.category === category);
  }

  async getTool(id: number): Promise<Tool | undefined> {
    return this.tools.get(id);
  }

  async createTool(insertTool: InsertTool): Promise<Tool> {
    const id = this.currentToolId++;
    const tool: Tool = { 
      ...insertTool, 
      id,
      lastUpdated: new Date()
    };
    this.tools.set(id, tool);
    return tool;
  }

  async updateToolStatus(id: number, status: string): Promise<Tool | undefined> {
    const tool = this.tools.get(id);
    if (tool) {
      const updatedTool = { 
        ...tool, 
        status,
        lastUpdated: new Date()
      };
      this.tools.set(id, updatedTool);
      return updatedTool;
    }
    return undefined;
  }

  async getSystemStatus(): Promise<SystemStatus | undefined> {
    return this.systemStatus;
  }

  async updateSystemStatus(status: InsertSystemStatus): Promise<SystemStatus> {
    this.systemStatus = {
      id: this.systemStatus?.id || this.currentSystemStatusId++,
      ...status,
    };
    return this.systemStatus;
  }

  async getToolConfiguration(toolId: number, userId: number): Promise<ToolConfiguration | undefined> {
    const key = `${toolId}-${userId}`;
    return this.toolConfigurations.get(key);
  }

  async saveToolConfiguration(config: InsertToolConfiguration): Promise<ToolConfiguration> {
    const id = this.currentConfigId++;
    const configuration: ToolConfiguration = {
      ...config,
      id,
      createdAt: new Date(),
    };
    const key = `${config.toolId}-${config.userId}`;
    this.toolConfigurations.set(key, configuration);
    return configuration;
  }
}

export const storage = new MemStorage();
