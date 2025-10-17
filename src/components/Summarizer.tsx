import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { FileText, Loader2, Volume2 } from "lucide-react";

const Summarizer = () => {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { toast } = useToast();

  const summarizeText = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to summarize",
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
          <h2 className="text-2xl font-bold">Text Summarizer</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter your text</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              className="min-h-[200px] resize-none"
            />
          </div>

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
              "Generate Summary"
            )}
          </Button>

          {summary && (
            <div className="mt-6 space-y-3">
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
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-wrap">{summary}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Summarizer;
