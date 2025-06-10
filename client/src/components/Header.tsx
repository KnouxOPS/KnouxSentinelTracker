import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { apiRequest } from "@/lib/queryClient";

export default function Header() {
  const queryClient = useQueryClient();
  
  const { data: systemStatus } = useQuery({
    queryKey: ["/api/system-status"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (updates: any) => {
      return apiRequest("PATCH", "/api/system-status", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/system-status"] });
    },
  });

  const handleToggle = (field: string, value: boolean) => {
    updateStatusMutation.mutate({ [field]: value });
  };

  return (
    <header className="glass-strong fixed top-0 left-0 right-0 z-50 p-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <img 
            src="https://i.postimg.cc/ZRyJgdM0/Chat-GPT-Image-May-27-2025-02-30-45-AM-removebg-preview.png" 
            alt="KNOX Security Plus Logo" 
            className="w-12 h-12 animate-pulse-glow"
          />
          <div>
            <h1 className="text-2xl font-orbitron font-bold cyber-text">KNOX</h1>
            <p className="text-sm text-gray-300">Security Plus</p>
          </div>
        </div>

        {/* Smart Toggles */}
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">🤖 Autopilot</span>
            <Switch
              checked={systemStatus?.autopilot || false}
              onCheckedChange={(checked) => handleToggle('autopilot', checked)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-purple-500 data-[state=checked]:to-pink-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">🌐 VPN</span>
            <Switch
              checked={systemStatus?.vpn || false}
              onCheckedChange={(checked) => handleToggle('vpn', checked)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-blue-500 data-[state=checked]:to-cyan-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-300">⚡ Max Mode</span>
            <Switch
              checked={systemStatus?.maxMode || false}
              onCheckedChange={(checked) => handleToggle('maxMode', checked)}
              className="data-[state=checked]:bg-gradient-to-r data-[state=checked]:from-orange-500 data-[state=checked]:to-red-500"
            />
          </div>
        </div>

        {/* User Avatar */}
        <Avatar className="glass glow-border">
          <AvatarFallback className="bg-transparent">
            <i className="fas fa-user-astronaut text-purple-400 text-xl"></i>
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
