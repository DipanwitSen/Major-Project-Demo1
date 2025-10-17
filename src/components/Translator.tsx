import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Languages, Loader2 } from "lucide-react";

const Translator = () => {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const languages = [
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
  ];

  const translateText = async () => {
    if (!text.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to translate",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate", {
        body: { text, targetLanguage },
      });

      if (error) throw error;

      setTranslatedText(data.translation);
      toast({
        title: "Translation complete! 🌍",
        description: "Your text has been translated.",
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

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="p-6 shadow-glow">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-pastel-mint rounded-full flex items-center justify-center">
            <Languages className="w-5 h-5 text-foreground" />
          </div>
          <h2 className="text-2xl font-bold">Translator</h2>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Text to translate</label>
            <Textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter text to translate..."
              className="min-h-[150px] resize-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Target Language</label>
            <Select value={targetLanguage} onValueChange={setTargetLanguage}>
              <SelectTrigger>
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={translateText}
            disabled={isLoading || !text.trim()}
            className="w-full bg-pastel-mint hover:opacity-90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Translating...
              </>
            ) : (
              "Translate"
            )}
          </Button>

          {translatedText && (
            <div className="mt-6">
              <label className="text-sm font-medium mb-2 block">Translation</label>
              <div className="p-4 bg-muted rounded-lg">
                <p className="whitespace-pre-wrap">{translatedText}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Translator;
