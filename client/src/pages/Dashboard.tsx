import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import StatusCard from "@/components/StatusCard";
import CategoryCard from "@/components/CategoryCard";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: systemStatus } = useQuery({
    queryKey: ["/api/system-status"],
  });

  const categories = [
    {
      id: 'protection',
      name: 'PROTECTION',
      description: 'Advanced security tools for system protection and malware defense',
      icon: 'fas fa-shield-alt',
      color: 'text-green-400'
    },
    {
      id: 'privacy',
      name: 'PRIVACY',
      description: 'Anonymity and privacy tools for secure communications',
      icon: 'fas fa-user-secret',
      color: 'text-blue-400'
    },
    {
      id: 'utility',
      name: 'UTILITY',
      description: 'Essential system utilities and performance tools',
      icon: 'fas fa-tools',
      color: 'text-cyan-400'
    },
    {
      id: 'operations',
      name: 'LIVE OPERATIONS',
      description: 'Real-time monitoring and incident response tools',
      icon: 'fas fa-satellite-dish',
      color: 'text-red-400'
    }
  ];

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      
      <div className="flex pt-20">
        <Sidebar />
        
        <main className="flex-1 ml-20 p-8 relative z-10">
          {/* Welcome Message */}
          <div className="mb-8">
            <h1 className="text-4xl font-orbitron font-bold cyber-text mb-2">
              Welcome, Knoux Master!
            </h1>
            <p className="text-xl text-gray-300">
              Ready to revolutionize your workflow? 🚀
            </p>
          </div>

          {/* System Status Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <StatusCard
              title="System Status"
              icon="fas fa-server"
              iconColor="text-purple-400"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="status-indicator status-active pl-4">Protection</span>
                  <span className="text-green-400 font-mono">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="status-indicator status-warning pl-4">Issues</span>
                  <span className="text-orange-400 font-mono">{systemStatus?.threatsDetected || 2} Detected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="status-indicator status-active pl-4">Updates</span>
                  <span className="text-green-400 font-mono">Up to Date</span>
                </div>
              </div>
            </StatusCard>

            <StatusCard
              title="Threat Detection"
              icon="fas fa-search"
              iconColor="text-red-400"
              className="scan-line"
            >
              <div className="text-center">
                <div className="text-sm text-gray-400 mb-2">REAL-TIME SCAN</div>
                <div className="w-full h-20 relative overflow-hidden rounded-lg glass mb-4">
                  <svg className="w-full h-full" viewBox="0 0 200 80">
                    <path 
                      d="M0,40 Q50,20 100,40 T200,40" 
                      stroke="url(#gradient)" 
                      strokeWidth="2" 
                      fill="none" 
                      className="animate-pulse"
                    >
                      <animate 
                        attributeName="d" 
                        dur="3s" 
                        repeatCount="indefinite" 
                        values="M0,40 Q50,20 100,40 T200,40;M0,40 Q50,60 100,40 T200,40;M0,40 Q50,20 100,40 T200,40"
                      />
                    </path>
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{stopColor:'#8B5CF6', stopOpacity:1}} />
                        <stop offset="50%" style={{stopColor:'#EC4899', stopOpacity:1}} />
                        <stop offset="100%" style={{stopColor:'#06B6D4', stopOpacity:1}} />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <div className="text-2xl font-bold text-green-400">Clean</div>
              </div>
            </StatusCard>

            <StatusCard
              title="AI Visual Filter"
              icon="fas fa-eye"
              iconColor="text-purple-400"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 glass rounded-xl flex items-center justify-center cyber-gradient p-0.5">
                  <div className="w-full h-full bg-cyber-purple rounded-xl flex items-center justify-center">
                    <i className="fas fa-crosshairs text-white text-2xl animate-pulse"></i>
                  </div>
                </div>
                <button className="w-full glass-strong rounded-lg py-2 px-4 text-sm font-semibold hover:bg-purple-500/20 transition-all duration-300">
                  SCAN
                </button>
              </div>
            </StatusCard>

            <StatusCard
              title="File Vault"
              icon="fas fa-lock"
              iconColor="text-blue-400"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 glass rounded-xl flex items-center justify-center">
                  <i className="fas fa-folder-lock text-blue-400 text-2xl"></i>
                </div>
                <div className="text-lg font-bold mb-2">
                  5.8 GB <span className="text-sm text-gray-400">Encrypted</span>
                </div>
                <button className="w-full glass-strong rounded-lg py-2 px-4 text-sm font-semibold hover:bg-blue-500/20 transition-all duration-300">
                  OPEN
                </button>
              </div>
            </StatusCard>
          </div>

          {/* Main Platforms Section */}
          <div className="mb-8">
            <h2 className="text-5xl font-orbitron font-black cyber-text mb-4 text-center">
              PLATFORMS
            </h2>
            <p className="text-lg text-gray-300 text-center max-w-4xl mx-auto mb-8">
              تصفح مجموعة منتقاة بعناية فائقة لأقوى الأدوات والمرافق عبر فئات مختلفة. 
              كل أداة تم فحصها، تحسينها، وتهيئتها من قبل خبراء Knoux لتمنحك الأداء الأمثل والكفاءة القصوى.
            </p>
          </div>

          {/* Security Categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.id}`}>
                <CategoryCard
                  title={category.name}
                  description={category.description}
                  icon={category.icon}
                  iconColor={category.color}
                />
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="glass-strong mt-16 p-6 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">
              MAX KNOX PLUS - قوة للمحترفين 🦾 — كل الحقوق محفوظة.
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-400">V.2.1.0</span>
            <button className="glass rounded-lg px-4 py-2 text-sm hover:bg-purple-500/20 transition-all">
              Quick Support
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
