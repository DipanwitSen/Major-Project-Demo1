import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Bot, FileText, Languages, Calendar, BarChart3, Bell, ArrowRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigate("/dashboard");
      } else {
        setIsChecking(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-accent">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Sparkles className="w-8 h-8 text-primary-foreground" />
          </div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Bot,
      title: "AI Chatbot",
      description: "Voice-enabled conversations with intelligent responses",
      gradient: "from-pastel-pink to-pastel-lavender"
    },
    {
      icon: FileText,
      title: "Smart Summarizer",
      description: "Upload documents or paste text for instant summaries",
      gradient: "from-pastel-lavender to-pastel-mint"
    },
    {
      icon: Languages,
      title: "Translator",
      description: "Translate to multiple languages instantly",
      gradient: "from-pastel-mint to-pastel-sky"
    },
    {
      icon: Calendar,
      title: "Calendar",
      description: "Manage events and reminders effortlessly",
      gradient: "from-pastel-peach to-pastel-pink"
    },
    {
      icon: BarChart3,
      title: "Graph Generator",
      description: "Visualize data with intelligent analysis",
      gradient: "from-pastel-sky to-pastel-lavender"
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay updated with smart alerts",
      gradient: "from-pastel-lavender to-pastel-peach"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-accent">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16">
        <div className="text-center max-w-4xl mx-auto mb-16 animate-fade-in">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center shadow-glow">
              <Sparkles className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Welcome to Lovable AI
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your all-in-one AI platform for productivity, creativity, and intelligent assistance
          </p>
          
          <div className="flex gap-4 justify-center flex-wrap">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:opacity-90 text-lg px-8 py-6 shadow-pastel"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth")}
              className="text-lg px-8 py-6 border-2 border-primary/20 hover:border-primary/40"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="p-6 hover:shadow-glow transition-all duration-300 hover:-translate-y-1 animate-scale-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '600ms' }}>
          <Card className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/10">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
            <p className="text-muted-foreground mb-6">
              Join thousands of users leveraging AI for smarter, faster work
            </p>
            <Button 
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-primary hover:opacity-90 text-lg px-10 py-6"
            >
              Start Free Today
            </Button>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20 py-8 bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Lovable AI. Powered by cutting-edge AI technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
