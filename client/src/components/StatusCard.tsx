import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatusCardProps {
  title: string;
  icon: string;
  iconColor: string;
  className?: string;
  children: React.ReactNode;
}

export default function StatusCard({ 
  title, 
  icon, 
  iconColor, 
  className,
  children 
}: StatusCardProps) {
  return (
    <Card className={cn("glass-strong glow-border", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          <i className={cn(icon, iconColor, "mr-2")}></i>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
    </Card>
  );
}
