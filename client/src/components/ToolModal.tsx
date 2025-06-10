import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X, Download } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { showToast, exportData } from "@/lib/utils";
import type { Tool } from "@shared/schema";

interface ToolModalProps {
  tool: Tool;
  isOpen: boolean;
  onClose: () => void;
}

export default function ToolModal({ tool, isOpen, onClose }: ToolModalProps) {
  const queryClient = useQueryClient();
  const [scanIntensity, setScanIntensity] = useState([5]);
  const [autoExecute, setAutoExecute] = useState(false);
  const [outputFormat, setOutputFormat] = useState("json");

  const configMutation = useMutation({
    mutationFn: async (config: any) => {
      return apiRequest("POST", `/api/tool-config`, {
        toolId: tool.id,
        userId: 1, // Mock user ID
        config: JSON.stringify(config),
      });
    },
    onSuccess: () => {
      showToast("Configuration updated successfully! 🚀");
    },
  });

  const handleSaveConfig = () => {
    const config = {
      scanIntensity: scanIntensity[0],
      autoExecute,
      outputFormat,
    };
    configMutation.mutate(config);
  };

  const handleExport = () => {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-strong max-w-4xl max-h-[90vh] overflow-y-auto border-white/20">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-3xl font-orbitron cyber-text">
              {tool.name}
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-red-500/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
          <div>
            <div className="w-32 h-32 mx-auto mb-6 glass rounded-2xl flex items-center justify-center cyber-gradient p-1">
              <div className="w-full h-full bg-cyber-purple rounded-2xl flex items-center justify-center">
                <i className={`${tool.icon} text-white text-4xl`}></i>
              </div>
            </div>
            
            <div className="text-gray-300 mb-6">
              <p className="mb-4">{tool.description}</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span>Status:</span>
                  <Badge 
                    variant={tool.status === 'active' ? 'default' : 'secondary'}
                    className={tool.status === 'active' 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-gray-500/20 text-gray-400'
                    }
                  >
                    {tool.status.charAt(0).toUpperCase() + tool.status.slice(1)}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Category:</span>
                  <Badge variant="outline" className="capitalize">
                    {tool.category}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last Updated:</span>
                  <span className="text-blue-400">
                    {new Date(tool.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Configuration Options</h3>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
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
                <label className="block text-sm text-gray-400 mb-2">Output Format</label>
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
            </div>
            
            <div className="flex space-x-4">
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
