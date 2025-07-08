
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Shield, Zap } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const LoginPage = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="space-y-8 animate-in slide-in-from-left duration-700">
          <div className="space-y-4">
            <h1 className="text-4xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              CloudHub
            </h1>

<p className="text-xl text-muted-foreground">
              By Shahid Afrid
           </p>

            <p className="text-xl text-muted-foreground">
              Your secure cloud storage solution for all your files
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
              <div className="p-2 rounded-full bg-blue-100">
                <Upload className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold">Easy File Upload</h3>
                <p className="text-sm text-muted-foreground">Drag & drop or click to upload</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
              <div className="p-2 rounded-full bg-green-100">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold">Secure Storage</h3>
                <p className="text-sm text-muted-foreground">Your files are encrypted and safe</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/50 backdrop-blur-sm border">
              <div className="p-2 rounded-full bg-purple-100">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">Quick access to all your files</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Login card */}
        <div className="animate-in slide-in-from-right duration-700">
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader className="text-center space-y-2">
              <div className="mx-auto p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 w-fit">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Welcome Back</CardTitle>
              <CardDescription>
                Sign in to access your secure file storage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </div>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </>
                )}
              </Button>

              <div className="text-center text-sm text-muted-foreground">
                By signing in, you agree to our Terms of Service and Privacy Policy
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
