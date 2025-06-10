import { useQuery } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { useState } from "react";
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import ToolCard from "@/components/ToolCard";
import ToolModal from "@/components/ToolModal";
import AnimatedBackground from "@/components/AnimatedBackground";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Tool } from "@shared/schema";

export default function CategoryView() {
  const [, params] = useRoute("/category/:category");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const { data: tools = [], isLoading } = useQuery({
    queryKey: [`/api/tools/category/${params?.category}`],
    enabled: !!params?.category,
  });

  const categoryTitles: Record<string, string> = {
    protection: 'أقوى 20 برنامج في عالم الحماية جمعتهالك عالبارد 🔥',
    privacy: 'أقوى 20 برنامج في عالم الخصوصية جمعتهالك عالبارد 🔥',
    utility: 'أقوى 20 برنامج في عالم الأدوات المساعدة جمعتهالك عالبارد 🔥',
    operations: 'أقوى 20 برنامج في عالم العمليات الحية جمعتهالك عالبارد 🔥'
  };

  const filteredTools = tools.filter((tool: Tool) => {
    const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || tool.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <p className="text-xl text-gray-300">Loading tools...</p>
            </div>
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
          {/* Navigation and Search */}
          <div className="flex items-center justify-between mb-8">
            <Link href="/">
              <Button 
                variant="outline" 
                className="glass-strong hover:bg-purple-500/20 transition-all"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
            
            <div className="flex items-center space-x-4">
              <Input
                type="text"
                placeholder="Search tools..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-strong w-64 border-white/20 focus:border-purple-500"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="glass-strong w-48 border-white/20">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent className="glass-strong border-white/20">
                  <SelectItem value="all">All Tools</SelectItem>
                  <SelectItem value="active">Active Tools</SelectItem>
                  <SelectItem value="inactive">Inactive Tools</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Category Title */}
          <h2 className="text-4xl font-orbitron font-bold cyber-text mb-4">
            {categoryTitles[params?.category || ''] || 'Security Tools'}
          </h2>
          <p className="text-lg text-gray-300 mb-8">
            اضغط على كل أداة لتخصيصها وتشغيلها ومراقبتها في الوقت الفعلي.
          </p>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredTools.map((tool: Tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                onClick={() => setSelectedTool(tool)}
              />
            ))}
          </div>

          {filteredTools.length === 0 && !isLoading && (
            <div className="text-center py-12">
              <div className="glass-strong rounded-2xl p-8 max-w-md mx-auto">
                <i className="fas fa-search text-4xl text-gray-400 mb-4"></i>
                <h3 className="text-xl font-semibold mb-2">No tools found</h3>
                <p className="text-gray-400">
                  Try adjusting your search criteria or filters.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Tool Modal */}
      {selectedTool && (
        <ToolModal
          tool={selectedTool}
          isOpen={!!selectedTool}
          onClose={() => setSelectedTool(null)}
        />
      )}
    </div>
  );
}
