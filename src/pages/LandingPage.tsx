import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Brain, BookOpen, Users, Sparkles, ArrowRight } from "lucide-react";

const LandingPage = () => {
  const baseUrl = import.meta.env.BASE_URL;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              <span className="text-gradient">The Future of</span>
              <br />
              Academic Success
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              An AI study calendar tool that combines everything you need to excel academically
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button 
                asChild 
                size="lg" 
                className="text-lg px-8 py-6 h-auto glow-primary"
              >
                <Link to="/app">
                  Want to try a demo
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold">Our Mission</h2>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              We're building an AI study calendar tool that combines everything students need 
              in one powerful platform. From scheduling and task management to note-taking, 
              study guides, and collaborative learning—we're creating the all-in-one solution 
              for academic success.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Everything You Need, <span className="text-gradient">All in One Place</span>
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-all hover:border-primary/30">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Calendar</h3>
              <p className="text-muted-foreground">
                AI-powered scheduling that syncs with your classes and optimizes your study time
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-all hover:border-primary/30">
              <Brain className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">AI Study Guides</h3>
              <p className="text-muted-foreground">
                Generate comprehensive study guides from your notes and course materials
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-all hover:border-primary/30">
              <BookOpen className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Integrated Notes</h3>
              <p className="text-muted-foreground">
                Rich text editing, audio notes, and drawing capabilities all in one place
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-all hover:border-primary/30">
              <Users className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Study Groups</h3>
              <p className="text-muted-foreground">
                Collaborate with classmates and organize group study sessions
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-all hover:border-primary/30">
              <Sparkles className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Task Management</h3>
              <p className="text-muted-foreground">
                Extract todos from notes and manage all your assignments efficiently
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card/50 hover:bg-card transition-all hover:border-primary/30">
              <Calendar className="w-12 h-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Weekly Recaps</h3>
              <p className="text-muted-foreground">
                Track your progress and get insights into your study patterns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 md:py-32 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
              Created By
            </h2>
            <p className="text-center text-muted-foreground mb-12 text-lg">
              A team of passionate innovators dedicated to transforming education
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg border border-border bg-card/50">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-primary/20">
                  <img 
                    src={`${baseUrl}oni.jpeg`}
                    alt="Fredre'Oni (Oni) Terrado" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">Fredre'Oni (Oni) Terrado</h3>
                <p className="text-muted-foreground">CEO & Co-Founder</p>
              </div>
              <div className="text-center p-6 rounded-lg border border-border bg-card/50">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-primary/20">
                  <img 
                    src={`${baseUrl}etornam.jpeg`}
                    alt="Etornam Agbemabiese" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">Etornam Agbemabiese</h3>
                <p className="text-muted-foreground">COO & Co-Founder</p>
              </div>
              <div className="text-center p-6 rounded-lg border border-border bg-card/50">
                <div className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4 ring-2 ring-primary/20">
                  <img 
                    src={`${baseUrl}grace.jpeg`}
                    alt="Grace Odondi" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">Grace Odondi</h3>
                <p className="text-muted-foreground">CTO & Co-Founder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-8 p-12 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <h2 className="text-4xl md:text-5xl font-bold">
              Ready to Transform Your Study Experience?
            </h2>
            <p className="text-xl text-muted-foreground">
              Experience the future of academic organization and success
            </p>
            <Button 
              asChild 
              size="lg" 
              className="text-lg px-8 py-6 h-auto glow-primary"
            >
              <Link to="/app">
                Try the Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 AI Study Calendar. Built with passion for students everywhere.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

