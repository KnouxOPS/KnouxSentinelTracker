import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Settings } from "lucide-react";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { showToast, exportData } from "@/lib/utils";

export default function ToolDetail() {
  const [, params] = useRoute("/tool/:id");
  const queryClient = useQueryClient();
  const [scanIntensity, setScanIntensity] = useState([5]);
  const [autoExecute, setAutoExecute] = useState(false);
  const [outputFormat, setOutputFormat] = useState("json");

  const { data: tool, isLoading } = useQuery({
    queryKey: [`/api/tools/${params?.id}`],
    enabled: !!params?.id,
  });

  const statusMutation = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest("PATCH", `/api/tools/${params?.id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/tools/${params?.id}`] });
      showToast("بيضتها يا سيد السكربتات! ✅");
    },
  });

  const configMutation = useMutation({
    mutationFn: async (config: any) => {
      return apiRequest("POST", `/api/tool-config`, {
        toolId: parseInt(params?.id || '0'),
        userId: 1, // Mock user ID
        config: JSON.stringify(config),
      });
    },
    onSuccess: () => {
      showToast("Configuration updated successfully! 🚀");
    },
  });

  const handleStatusToggle = () => {
    if (tool) {
      const newStatus = tool.status === 'active' ? 'inactive' : 'active';
      statusMutation.mutate(newStatus);
    }
  };

  const handleSaveConfig = () => {
    const config = {
      scanIntensity: scanIntensity[0],
      autoExecute,
      outputFormat,
    };
    configMutation.mutate(config);
  };

  const handleExport = () => {
    if (tool) {
      const data = {
        tool,
        configuration: {
          scanIntensity: scanIntensity[0],
          autoExecute,
          outputFormat,
        },
        exportedAt: new Date().toISOString(),
      };
      exportData(data, `${tool.name.replace(/\s+/g, '_')}_config`, outputFormat as 'json');
      showToast("حمّلها ياباشا 🦾");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <Header />
        <div className="flex pt-20">
          <Sidebar />
          <main className="flex-1 ml-20 p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-xl text-gray-300">Loading tool details...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen relative">
        <AnimatedBackground />
        <Header />
        <div className="flex pt-20">
          <Sidebar />
          <main className="flex-1 ml-20 p-8 flex items-center justify-center">
            <Card className="glass-strong max-w-md">
              <CardContent className="pt-6 text-center">
                <i className="fas fa-exclamation-triangle text-4xl text-yellow-400 mb-4"></i>
                <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
                <p className="text-gray-400 mb-4">The requested tool could not be found.</p>
                <Link href="/">
                  <Button variant="outline">Return to Dashboard</Button>
                </Link>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Header />
      
      <div className="flex pt-20">
        <Sidebar />
        
        <main className="flex-1 ml-20 p-8 relative z-10">
          {/* Navigation */}
          <div className="flex items-center justify-between mb-8">
            <Link href={`/category/${tool.category}`}>
              <Button 
                variant="outline" 
                className="glass-strong hover:bg-purple-500/20 transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to {tool.category.charAt(0).toUpperCase() + tool.category.slice(1)}
              </Button>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Badge 
                variant={tool.status === 'active' ? 'default' : 'secondary'}
                className={tool.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}
              >
                {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
              </Badge>
              <Switch
                checked={tool.status === 'active'}
                onCheckedChange={handleStatusToggle}
                disabled={statusMutation.isPending}
              />
            </div>
          </div>

          {/* Tool Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tool Information */}
            <Card className="glass-strong">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 glass rounded-xl flex items-center justify-center cyber-gradient p-0.5">
                    <div className="w-full h-full bg-cyber-purple rounded-xl flex items-center justify-center">
                      <i className={`${tool.icon} text-white text-2xl`}></i>
                    </div>
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-orbitron cyber-text">
                      {tool.name}
                    </CardTitle>
                    <p className="text-sm text-gray-400 capitalize">
                      {tool.category} Tool
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-6">{tool.description}</p>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Category:</span>
                    <Badge variant="outline" className="capitalize">
                      {tool.category}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Last Updated:</span>
                    <span className="text-sm text-blue-400">
                      {new Date(tool.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Professional Grade:</span>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      Enterprise
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Configuration Panel */}
            <Card className="glass-strong">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Configuration Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm text-gray-400 mb-3">
                    Scan Intensity: {scanIntensity[0]}
                  </label>
                  <Slider
                    value={scanIntensity}
                    onValueChange={setScanIntensity}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="text-sm text-gray-400">Auto-Execute</label>
                  <Switch
                    checked={autoExecute}
                    onCheckedChange={setAutoExecute}
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Output Format
                  </label>
                  <Select value={outputFormat} onValueChange={setOutputFormat}>
                    <SelectTrigger className="glass border-white/20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass-strong border-white/20">
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="xml">XML</SelectItem>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="pdf">PDF Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleExport}
                    className="flex-1 cyber-gradient hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    حمّلها ياباشا 🦾
                  </Button>
                  <Button
                    onClick={handleSaveConfig}
                    variant="outline"
                    className="flex-1 glass-strong hover:bg-blue-500/20 transition-all"
                    disabled={configMutation.isPending}
                  >
                    فصّل الشغل ✨
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Real-time Monitoring Section */}
          <Card className="glass-strong mt-8">
            <CardHeader>
              <CardTitle>Real-time Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">98.5%</div>
                  <div className="text-sm text-gray-400">System Health</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">1.2GB</div>
                  <div className="text-sm text-gray-400">Memory Usage</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">45ms</div>
                  <div className="text-sm text-gray-400">Response Time</div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-400">Processing Activity</span>
                  <span className="text-sm text-green-400">Live</span>
                </div>
                <div className="h-2 glass rounded-full overflow-hidden">
                  <div className="h-full progress-bar" style={{ width: '75%' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
