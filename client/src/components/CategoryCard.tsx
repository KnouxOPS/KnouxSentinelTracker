import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: string;
  iconColor: string;
  className?: string;
}

export default function CategoryCard({ 
  title, 
  description, 
  icon, 
  iconColor,
  className 
}: CategoryCardProps) {
  return (
    <Card className={cn("tool-card glass-strong cursor-pointer group", className)}>
      <CardContent className="p-8 text-center">
        <div className="w-20 h-20 mx-auto mb-6 glass rounded-2xl flex items-center justify-center cyber-gradient p-0.5">
          <div className="w-full h-full bg-cyber-purple rounded-2xl flex items-center justify-center">
            <i className={cn(icon, "text-white text-3xl group-hover:animate-pulse")}></i>
          </div>
        </div>
        <h3 className="text-2xl font-orbitron font-bold mb-3 cyber-text">{title}</h3>
        <p className="text-gray-300 mb-4">{description}</p>
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-green-400">20 Tools Available</span>
          <i className="fas fa-arrow-right text-purple-400 group-hover:translate-x-1 transition-transform"></i>
        </div>
      </CardContent>
    </Card>
  );
}
