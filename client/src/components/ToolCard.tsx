import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Tool } from "@shared/schema";

interface ToolCardProps {
  tool: Tool;
  onClick: () => void;
  className?: string;
}

export default function ToolCard({ tool, onClick, className }: ToolCardProps) {
  const statusColor = tool.status === 'active' ? 'text-green-400' : 'text-gray-400';
  const statusIcon = tool.status === 'active' ? 'fas fa-circle' : 'far fa-circle';

  return (
    <Card 
      className={cn("tool-card glass-strong cursor-pointer group", className)}
      onClick={onClick}
    >
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 glass rounded-xl flex items-center justify-center cyber-gradient p-0.5">
          <div className="w-full h-full bg-cyber-purple rounded-xl flex items-center justify-center">
            <i className={cn(tool.icon, "text-white text-2xl group-hover:animate-pulse")}></i>
          </div>
        </div>
        
        <h3 className="text-lg font-semibold mb-2 cyber-text">{tool.name}</h3>
        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{tool.description}</p>
        
        <div className="flex items-center justify-center space-x-2">
          <i className={cn(statusIcon, statusColor, "text-xs")}></i>
          <Badge 
            variant={tool.status === 'active' ? 'default' : 'secondary'}
            className={cn(
              "text-xs capitalize",
              tool.status === 'active' 
                ? 'bg-green-500/20 text-green-400' 
                : 'bg-gray-500/20 text-gray-400'
            )}
          >
            {tool.status}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
