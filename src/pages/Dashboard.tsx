import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { LogOut, Moon, Sun, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Chatbot from "@/components/Chatbot";
import Summarizer from "@/components/Summarizer";
import FileManager from "@/components/FileManager";
import Translator from "@/components/Translator";
import Calendar from "@/components/Calendar";
import GraphGenerator from "@/components/GraphGenerator";
import Notifications from "@/components/Notifications";

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isDark, setIsDark] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        navigate("/auth");
      } else if (session?.user) {
        setUser(session.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "See you soon! ✨",
    });
  };

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-gradient-primary/10 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center shadow-pastel">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Lovable AI
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full hover:bg-primary/10"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="rounded-full hover:bg-destructive/10 hover:text-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="chatbot" className="w-full">
          <TabsList className="grid w-full grid-cols-7 mb-8 bg-muted/50 p-1 rounded-xl">
            <TabsTrigger value="chatbot" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              Chatbot
            </TabsTrigger>
            <TabsTrigger value="summarizer" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              Summarizer
            </TabsTrigger>
            <TabsTrigger value="translator" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              Translator
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              Calendar
            </TabsTrigger>
            <TabsTrigger value="graphs" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              Graphs
            </TabsTrigger>
            <TabsTrigger value="files" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              Files
            </TabsTrigger>
            <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-gradient-primary data-[state=active]:text-primary-foreground">
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chatbot" className="mt-0">
            <Chatbot />
          </TabsContent>

          <TabsContent value="summarizer" className="mt-0">
            <Summarizer />
          </TabsContent>

          <TabsContent value="translator" className="mt-0">
            <Translator />
          </TabsContent>

          <TabsContent value="calendar" className="mt-0">
            <Calendar />
          </TabsContent>

          <TabsContent value="graphs" className="mt-0">
            <GraphGenerator />
          </TabsContent>

          <TabsContent value="files" className="mt-0">
            <FileManager />
          </TabsContent>

          <TabsContent value="notifications" className="mt-0">
            <Notifications />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
