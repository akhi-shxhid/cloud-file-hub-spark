
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Upload, User, Files, Cloud, BarChart3, Settings, Home } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';
import DashboardStats from './DashboardStats';
import FileUpload from './FileUpload';
import FileList from './FileList';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'files'>('overview');

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        title: "Sign Out Failed",
        description: "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 transition-colors duration-300">
      {/* Header */}
      <header className="bg-background/60 dark:bg-background/60 backdrop-blur-md border-b border-border/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3 animate-in slide-in-from-left duration-500">
              <div className="relative">
                <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg animate-pulse">
                  <Cloud className="h-6 w-6 text-white" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl blur-md opacity-20 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  CloudHub
                </h1>
                <p className="text-xs text-muted-foreground">by Shahid Afrid</p>
              </div>
            </div>

            <div className="flex items-center gap-4 animate-in slide-in-from-right duration-500">
              <ThemeToggle />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline max-w-40 truncate">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-background/50 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="animate-in slide-in-from-top duration-700">
            <Card className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/5 dark:via-purple-500/5 dark:to-pink-500/5 border-0 shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-3xl flex items-center gap-3">
                  <span className="animate-in zoom-in duration-500">👋</span>
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}!
                  </span>
                </CardTitle>
                <p className="text-lg text-muted-foreground animate-in slide-in-from-bottom duration-700 delay-200">
                  Manage your files securely in the cloud with advanced features
                </p>
              </CardHeader>
            </Card>
          </div>

          {/* Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <DashboardStats />
          </motion.div>

          {/* Navigation Tabs */}
          <div className="animate-in slide-in-from-bottom duration-700 delay-100">
            <div className="flex space-x-1 bg-background/60 dark:bg-background/40 backdrop-blur-md p-1 rounded-xl border border-border/50 w-fit shadow-lg">
              <button
                onClick={() => setActiveTab('overview')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'overview'
                    ? 'bg-background shadow-md text-foreground border border-border/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <BarChart3 className="h-4 w-4 inline-block mr-2" />
                Overview
              </button>
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'upload'
                    ? 'bg-background shadow-md text-foreground border border-border/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Upload className="h-4 w-4 inline-block mr-2" />
                Upload Files
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  activeTab === 'files'
                    ? 'bg-background shadow-md text-foreground border border-border/50'
                    : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
                }`}
              >
                <Files className="h-4 w-4 inline-block mr-2" />
                My Files
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="animate-in fade-in duration-500 delay-200">
            {activeTab === 'overview' && <DashboardStats />}
            {activeTab === 'upload' && <FileUpload />}
            {activeTab === 'files' && <FileList />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
