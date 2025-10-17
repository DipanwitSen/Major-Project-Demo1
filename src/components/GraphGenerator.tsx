import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const GraphGenerator = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const formData = new FormData();
      formData.append("file", file);

      // Here you would call an edge function to process the CSV
      // and generate graphs using ML analysis
      toast({
        title: "Processing CSV...",
        description: "Analyzing your data and generating graphs.",
      });

      // Placeholder for graph generation
      setGraphData({
        type: "scatter",
        message: "Graph generation would be implemented here with actual ML analysis",
      });

      toast({
        title: "Analysis complete! 📊",
        description: "Your graphs have been generated.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 shadow-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-pastel-sky rounded-full flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Graph Generator</h2>
        </div>

        <div className="space-y-6">
          <div className="text-center py-8 border-2 border-dashed border-border rounded-lg">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 text-primary" />
            <p className="mb-4 text-muted-foreground">
              Upload a CSV file to generate analysis and graphs
            </p>
            <Input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              disabled={isUploading}
              className="hidden"
              id="csv-upload"
            />
            <Button
              onClick={() => document.getElementById("csv-upload")?.click()}
              disabled={isUploading}
              className="bg-pastel-sky hover:opacity-90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload CSV
                </>
              )}
            </Button>
          </div>

          {graphData && (
            <div className="p-6 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Analysis Results</h3>
              <p className="text-muted-foreground">{graphData.message}</p>
              <div className="mt-4 h-64 bg-background rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Graph visualization would appear here</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default GraphGenerator;
