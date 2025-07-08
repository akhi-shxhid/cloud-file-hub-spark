
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, Upload, User, Files } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import FileUpload from './FileUpload';
import FileList from './FileList';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<'upload' | 'files'>('upload');

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
                <Files className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                CloudHub
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user?.email}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center gap-2"
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
            <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardHeader>
                <CardTitle className="text-2xl">
                  Welcome back, {user?.user_metadata?.full_name?.split(' ')[0] || 'User'}! 👋
                </CardTitle>
                <p className="text-blue-100">
                  Manage your files securely in the cloud
                </p>
              </CardHeader>
            </Card>
          </div>

          {/* Navigation Tabs */}
          <div className="animate-in slide-in-from-bottom duration-700">
            <div className="flex space-x-1 bg-white/60 backdrop-blur-sm p-1 rounded-lg border w-fit">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'upload'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Upload className="h-4 w-4 inline-block mr-2" />
                Upload Files
              </button>
              <button
                onClick={() => setActiveTab('files')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === 'files'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Files className="h-4 w-4 inline-block mr-2" />
                My Files
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="animate-in fade-in duration-500">
            {activeTab === 'upload' && <FileUpload />}
            {activeTab === 'files' && <FileList />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
