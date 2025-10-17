import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Volume2, Upload, Type } from "lucide-react";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['text/plain', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a TXT, PDF, or DOC file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      // For text files, read directly
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (event) => {
          const content = event.target?.result as string;
          setText(content);
          toast({
            title: "File loaded! 📄",
            description: "Your text is ready to summarize.",
          });
          setIsUploading(false);
        };
        reader.onerror = () => {
          toast({
            title: "Error reading file",
            variant: "destructive",
          });
          setIsUploading(false);
        };
        reader.readAsText(file);
      } else {
        // For PDF/DOC files, you would need a backend function to process
        toast({
          title: "Processing document...",
          description: "Extracting text from your file.",
        });
        
        // Here you would call an edge function to extract text from PDF/DOC
        // For now, we'll show a placeholder message
        toast({
          title: "Feature coming soon!",
          description: "PDF/DOC processing will be available soon. Please use TXT files or paste text directly.",
        });
        setIsUploading(false);
      }
    } catch (error: any) {
      toast({
        title: "Upload error",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    } finally {
      e.target.value = "";
    }
  };

  const summarizeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text or upload a file to summarize",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("summarize", {
        body: { text },
      });

      if (error) throw error;

      setSummary(data.summary);
      toast({
        title: "Summary generated! ✨",
        description: "Your text has been summarized.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const speakSummary = () => {
    if (!summary) return;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(summary);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 shadow-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
            <FileText className="w-5 h-5 text-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Smart Summarizer</h2>
        </div>

        <Tabs defaultValue="text" className="mb-4">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="text" className="gap-2">
              <Type className="h-4 w-4" />
              Paste Text
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload File
            </TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Enter your text</label>
              <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your text here..."
                className="min-h-[250px] resize-none"
              />
            </div>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground mb-4">
                Upload a document to summarize (TXT, PDF, DOC)
              </p>
              <Input
                type="file"
                onChange={handleFileUpload}
                disabled={isUploading}
                className="hidden"
                id="file-upload-summarizer"
                accept=".txt,.pdf,.doc,.docx"
              />
              <Button
                onClick={() => document.getElementById("file-upload-summarizer")?.click()}
                disabled={isUploading}
                variant="outline"
                className="mb-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Choose File
                  </>
                )}
              </Button>
              {uploadedFileName && (
                <p className="text-sm text-primary mt-2">📄 {uploadedFileName}</p>
              )}
            </div>

            {text && (
              <div>
                <label className="text-sm font-medium mb-2 block">Extracted Text</label>
                <div className="p-4 bg-muted rounded-lg max-h-[200px] overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">{text}</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <Button
          onClick={summarizeText}
          disabled={isLoading || !text.trim()}
          className="w-full bg-gradient-secondary hover:opacity-90"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Summarizing...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Summary
            </>
          )}
        </Button>

        {summary && (
          <div className="mt-6 space-y-3 animate-fade-in">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Summary</label>
              <Button
                variant="outline"
                size="sm"
                onClick={speakSummary}
                disabled={isSpeaking}
                className="gap-2"
              >
                <Volume2 className="h-4 w-4" />
                {isSpeaking ? "Speaking..." : "Listen"}
              </Button>
            </div>
            <div className="p-4 bg-gradient-to-br from-secondary/20 to-accent/20 rounded-lg border border-secondary/30">
              <p className="whitespace-pre-wrap leading-relaxed">{summary}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z" fill="currentColor"/>
    <path d="M19 14L19.5 16.5L22 17L19.5 17.5L19 20L18.5 17.5L16 17L18.5 16.5L19 14Z" fill="currentColor"/>
    <path d="M6 14L6.5 16.5L9 17L6.5 17.5L6 20L5.5 17.5L3 17L5.5 16.5L6 14Z" fill="currentColor"/>
  </svg>
);

export default Summarizer;
