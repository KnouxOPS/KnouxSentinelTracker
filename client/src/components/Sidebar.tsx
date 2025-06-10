import { useState } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const sidebarItems = [
  { id: 'dashboard', icon: 'fas fa-th-large', label: 'Dashboard', href: '/', color: 'text-purple-400' },
  { id: 'protection', icon: 'fas fa-shield-alt', label: 'Protection', href: '/category/protection', color: 'text-green-400' },
  { id: 'privacy', icon: 'fas fa-user-secret', label: 'Privacy', href: '/category/privacy', color: 'text-blue-400' },
  { id: 'utility', icon: 'fas fa-cogs', label: 'Utility', href: '/category/utility', color: 'text-cyan-400' },
  { id: 'operations', icon: 'fas fa-radar', label: 'Live Operations', href: '/category/operations', color: 'text-red-400' },
  { id: 'updates', icon: 'fas fa-download', label: 'Updates', href: '#', color: 'text-yellow-400' },
  { id: 'support', icon: 'fas fa-headset', label: 'Support', href: '#', color: 'text-pink-400' },
];

export default function Sidebar() {
  const [location] = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return location === '/';
    return location.startsWith(href);
  };

  return (
    <aside className="glass-strong fixed left-0 top-20 bottom-0 w-20 flex flex-col items-center py-6 space-y-6 z-40">
      <nav className="flex flex-col space-y-4">
        {sidebarItems.map((item) => (
          <Tooltip key={item.id}>
            <TooltipTrigger asChild>
              <Link href={item.href}>
                <div className={cn(
                  "sidebar-icon w-12 h-12 glass rounded-xl flex items-center justify-center cursor-pointer transition-all duration-300",
                  isActive(item.href) && "glow-border"
                )}>
                  <i className={cn(item.icon, item.color, "text-xl")}></i>
                </div>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="glass-strong border-white/20">
              <p>{item.label} - Try me, ya knoux!</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </nav>
      
      <div className="mt-auto">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="sidebar-icon w-12 h-12 glass rounded-xl flex items-center justify-center cursor-pointer">
              <i className="fas fa-cog text-gray-400 text-xl"></i>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="glass-strong border-white/20">
            <p>Settings - Try me, ya knoux!</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </aside>
  );
}
