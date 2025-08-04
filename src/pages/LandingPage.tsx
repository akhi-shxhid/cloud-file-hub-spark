import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  Upload, 
  Share2, 
  Shield, 
  Zap, 
  FileText, 
  Image, 
  Video, 
  Star,
  Check,
  ArrowRight,
  Users,
  Globe,
  Lock
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Navigation */}
      <nav className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <Cloud className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CloudHub
              </span>
            </motion.div>

            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Login</Link>
            </div>

            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 hover:opacity-90">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div 
              className="mb-8"
              variants={fadeIn}
            >
              <Badge variant="secondary" className="mb-4 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border-0">
                ✨ Modern Cloud Storage Platform
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6"
              variants={fadeIn}
            >
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Store, Share & Manage
              </span>
              <br />
              <span className="text-foreground">Your Files Securely</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto"
              variants={fadeIn}
            >
              The ultimate cloud storage solution with instant previews, secure sharing, 
              and seamless collaboration. Built for modern teams and individuals.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
              variants={fadeIn}
            >
              <Link to="/login">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0 hover:opacity-90 text-lg px-8 py-6">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                Watch Demo
                <Video className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>

            {/* Hero Image/Demo */}
            <motion.div 
              className="relative mx-auto max-w-5xl"
              variants={fadeIn}
            >
              <div className="rounded-2xl border bg-gradient-to-br from-background/50 to-muted/50 backdrop-blur-sm p-8 shadow-2xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <div className="h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                    <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Upload className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Drag & Drop Upload</p>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                    <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Instant Preview</p>
                  </div>
                  <div className="space-y-4">
                    <div className="h-3 bg-gradient-to-r from-pink-400 to-blue-400 rounded-full"></div>
                    <div className="h-20 bg-muted rounded-lg flex items-center justify-center">
                      <Share2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium">Secure Sharing</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to store, organize, and share your files securely in the cloud.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-level encryption with advanced security protocols to keep your files safe.",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Upload and access your files instantly with our optimized cloud infrastructure.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Globe,
                title: "Universal Access",
                description: "Access your files from anywhere, on any device, with seamless synchronization.",
                gradient: "from-pink-500 to-blue-500"
              },
              {
                icon: Image,
                title: "Rich Previews",
                description: "Preview images, PDFs, videos, and documents without downloading them.",
                gradient: "from-blue-500 to-purple-500"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Share files and folders with team members with granular permission controls.",
                gradient: "from-purple-500 to-pink-500"
              },
              {
                icon: Lock,
                title: "Secure Sharing",
                description: "Create secure, time-limited sharing links with custom permissions and expiration.",
                gradient: "from-pink-500 to-blue-500"
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="h-full border-0 bg-background/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.gradient} flex items-center justify-center mb-4`}>
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Start free and scale as you grow. No hidden fees, no surprises.
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              {
                name: "Starter",
                price: "Free",
                description: "Perfect for personal use",
                features: [
                  "5GB storage",
                  "Basic file sharing",
                  "Standard support",
                  "Mobile apps"
                ],
                popular: false,
                cta: "Get Started"
              },
              {
                name: "Pro",
                price: "$9/month",
                description: "Best for professionals",
                features: [
                  "100GB storage",
                  "Advanced sharing",
                  "Priority support",
                  "Team collaboration",
                  "Custom branding"
                ],
                popular: true,
                cta: "Start Free Trial"
              },
              {
                name: "Enterprise",
                price: "Custom",
                description: "For large organizations",
                features: [
                  "Unlimited storage",
                  "Enterprise security",
                  "24/7 support",
                  "Advanced analytics",
                  "Custom integrations"
                ],
                popular: false,
                cta: "Contact Sales"
              }
            ].map((plan, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className={`relative h-full ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'} bg-background/60 backdrop-blur-sm`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary mt-4">
                      {plan.price}
                    </div>
                    <CardDescription className="text-base">
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center gap-3">
                          <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Link to="/login" className="block">
                      <Button 
                        className={`w-full ${
                          plan.popular 
                            ? 'bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white border-0' 
                            : ''
                        }`}
                        variant={plan.popular ? 'default' : 'outline'}
                        size="lg"
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Transform Your File Management?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who trust CloudHub with their most important files.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6 bg-white text-blue-600 hover:bg-blue-50">
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-background/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CloudHub
              </span>
            </div>
            <p className="text-muted-foreground">
              © 2024 CloudHub by Shahid Afrid. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;