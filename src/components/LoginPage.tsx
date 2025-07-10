
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cloud, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { ThemeToggle } from '@/components/ThemeToggle';

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Sign In Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/10 flex flex-col items-center justify-center p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="text-center mb-12 animate-in slide-in-from-top duration-700">
        <div className="relative mb-8">
          <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl mx-auto w-fit animate-pulse">
            <Cloud className="h-16 w-16 text-white" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
        </div>
        
        <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
          CloudHub
        </h1>
        <p className="text-xl text-muted-foreground mb-2">
          Secure cloud storage for your files
        </p>
        <p className="text-sm text-muted-foreground">
          by Shahid Afrid
        </p>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md shadow-xl bg-background/60 backdrop-blur-md border-border/50 animate-in slide-in-from-bottom duration-700 delay-200">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-foreground">Welcome Back</CardTitle>
          <CardDescription className="text-muted-foreground">
            Sign in to access your secure cloud storage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Button 
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white border-0 shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-105"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin mr-2" />
            ) : (
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Signing In...' : 'Continue with Google'}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Secure authentication powered by Google
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl animate-in slide-in-from-bottom duration-700 delay-400">
        <div className="text-center p-6 rounded-xl bg-background/30 backdrop-blur-sm border border-border/50">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center mx-auto mb-4">
            <Cloud className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-semibold mb-2 text-foreground">Secure Storage</h3>
          <p className="text-sm text-muted-foreground">Your files are encrypted and stored securely</p>
        </div>
        
        <div className="text-center p-6 rounded-xl bg-background/30 backdrop-blur-sm border border-border/50">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2 text-foreground">Easy Sharing</h3>
          <p className="text-sm text-muted-foreground">Share files with anyone, anytime</p>
        </div>
        
        <div className="text-center p-6 rounded-xl bg-background/30 backdrop-blur-sm border border-border/50">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 flex items-center justify-center mx-auto mb-4">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 className="font-semibold mb-2 text-foreground">File Preview</h3>
          <p className="text-sm text-muted-foreground">Preview your files instantly in the browser</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
