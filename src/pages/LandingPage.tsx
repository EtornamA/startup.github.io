import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Calendar, Brain, BookOpen, Users, Sparkles, TrendingUp } from "lucide-react";
import { FounderCard } from "@/components/FounderCard";

const LandingPage = () => {
  const baseUrl = import.meta.env.BASE_URL;
  
  const scrollToHero = () => {
    const hero = document.getElementById('hero');
    if (hero) {
      hero.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={scrollToHero}
            className="flex items-center space-x-2 hover:opacity-90 transition-opacity"
            aria-label="Back to top"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
              <span className="text-sm sm:text-base font-bold text-white">F</span>
            </div>
            <span className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              FUTR
            </span>
          </button>
          <div className="flex items-center gap-2 sm:gap-4">
            <Button variant="ghost" size="sm" className="text-sm px-3 sm:px-4" asChild>
              <Link to="/auth">Sign In</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="relative overflow-hidden bg-gradient-to-b from-background via-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
        <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-24 md:py-32 lg:py-40">
          <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight px-2">
              <span className="text-gradient">Transform Your</span>
              <br />
              Academic Journey
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4">
              The all-in-one platform that combines smart scheduling, AI-powered study guides, 
              and collaborative learning—all designed to help you excel.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-4 sm:pt-6 px-4">
              <Button 
                asChild 
                size="lg" 
                variant="outline"
                className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 h-auto border-2 w-full sm:w-auto"
              >
                <Link to="/app">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
              Everything You Need, <span className="text-gradient">All in One Place</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Powerful features designed to streamline your academic journey
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-7xl mx-auto">
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <Calendar className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Smart Calendar</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                AI-powered scheduling that syncs with your classes and optimizes your study time automatically
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">AI Study Guides</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Generate comprehensive study guides from your notes and course materials in seconds
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <BookOpen className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Integrated Notes</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Rich text editing, audio notes, and drawing capabilities all seamlessly integrated
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Study Groups</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Collaborate with classmates and organize group study sessions effortlessly
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Task Management</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Extract todos from notes and manage all your assignments with intelligent prioritization
              </p>
            </div>
            <div className="group p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 border-border bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Weekly Recaps</h3>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Track your progress and get actionable insights into your study patterns
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 px-4">
                Built by <span className="text-gradient">Passionate Innovators</span>
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
                A team dedicated to transforming education through innovative technology
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <FounderCard
                name="Fredre'Oni (Oni) Terrado"
                title="CEO & Co-Founder"
                image={`${baseUrl}oni.jpeg`}
                location="Woodbridge, Virginia, United States"
                currentRole="Clinical Research & Data Operations Assistant"
                currentCompany="Carolina Center for Neurostimulation"
                education="The University of North Carolina at Chapel Hill"
                educationDetails="Bachelor of Science - BS, Information science and Psychology with a minor in Entrepreneurship (2023-2027) • Morehead-Cain Scholar • Honors Carolina"
                keyAchievements={[
                  "Morehead-Cain Scholar – Fully-funded four-year scholarship awarded to <1% of each class",
                  "Led revitalization of Hazel Green Academy, mobilizing 160+ volunteers",
                  "Worked in Thailand supporting young women and refugees displaced by Myanmar War",
                  "Organizational Leadership & Program Strategy President at CUAB",
                  "Exploring transcranial alternating current stimulation research at Frohlich Lab"
                ]}
                skills={["Strategic Planning", "Research", "Leadership", "Data Analysis", "Community Building", "Psychology"]}
                linkedinUrl="https://www.linkedin.com/in/fredreoni-terrado"
              />
              <FounderCard
                name="Etornam Agbemabiese"
                title="COO & Co-Founder"
                image={`${baseUrl}etornam.jpeg`}
                location="High Point, North Carolina, United States"
                currentRole="Incoming Redwoods Summer Analyst"
                currentCompany="DaVita Kidney Care"
                education="The University of North Carolina at Chapel Hill"
                educationDetails="Business Administration and Computer Science Double Major (2023-2027) • MLT Scholar"
                keyAchievements={[
                  "Selected for DaVita's highly competitive Redwoods program",
                  "STAR Program Consultant at UNC Kenan-Flagler",
                  "VCIC Fellow - analyzing early-stage startups and venture capital",
                  "Durham Institute for Responsible Citizenship Fellow"
                ]}
                skills={["Venture Capital", "Startup Evaluation", "Management Consulting", "Strategy", "Product Development", "Data Analytics"]}
                linkedinUrl="https://www.linkedin.com/in/etornama"
              />
              <FounderCard
                name="Grace Odondi"
                title="CTO & Co-Founder"
                image={`${baseUrl}grace.jpeg`}
                location="Chapel Hill, North Carolina, United States"
                currentRole="Full Stack SWE Intern"
                currentCompany="Fidelity Investments"
                education="The University of North Carolina at Chapel Hill"
                educationDetails="Computer Science and Math (2023-2027) • ColorStack Member"
                keyAchievements={[
                  "Full Stack Software Engineer on Generative AI team at Fidelity",
                  "Computer Science Teaching Assistant at UNC-Chapel Hill",
                  "Vice President of Black in Technology @ UNC",
                  "Outreach Chair at TechX - 300% increase in engagement",
                  "Associate Director at Five Oaks Church Choir"
                ]}
                skills={["Full Stack Development", "Python", "Java", "Machine Learning", "Teaching", "Leadership"]}
                linkedinUrl="https://www.linkedin.com/in/grace-odondi"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 md:py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8 p-6 sm:p-8 md:p-12 lg:p-16 rounded-2xl sm:rounded-3xl border-2 border-primary/20 bg-gradient-to-br from-card to-card/50 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight px-2">
              Ready to Transform Your <span className="text-gradient">Study Experience?</span>
            </h2>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 md:py-16 border-t bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div>
              <div className="flex items-center space-x-2 mb-3 sm:mb-4">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                <span className="text-lg sm:text-xl font-bold">FUTR</span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                The all-in-one platform for academic success
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Product</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link to="/app" className="hover:text-foreground transition-colors">Features</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Pricing</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Demo</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Company</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link to="/app" className="hover:text-foreground transition-colors">About</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Blog</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Careers</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm text-muted-foreground">
                <li><Link to="/app" className="hover:text-foreground transition-colors">Help Center</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Contact</Link></li>
                <li><Link to="/app" className="hover:text-foreground transition-colors">Privacy</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-6 sm:pt-8 border-t text-center text-xs sm:text-sm text-muted-foreground px-4">
            <p>© 2024 FUTR. All rights reserved. Built with passion for students everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

