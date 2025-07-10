
import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Calendar, User, AlertCircle, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import FilePreview from '@/components/FilePreview';

interface SharedFile {
  id: string;
  file_id: string;
  permissions: 'view' | 'download';
  expires_at: string | null;
  created_at: string;
  uploaded_files: {
    file_name: string;
    file_type: string;
    file_size: number;
    storage_path: string;
    uploaded_at: string;
  };
}

const SharePage = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [sharedFile, setSharedFile] = useState<SharedFile | null>(null);
  const [fileUrl, setFileUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (!shareId) return;
    
    fetchSharedFile();
  }, [shareId]);

  const fetchSharedFile = async () => {
    try {
      setLoading(true);
      
      // Fetch shared link with file details
      const { data: sharedLinkData, error: linkError } = await supabase
        .from('shared_links')
        .select(`
          *,
          uploaded_files (
            file_name,
            file_type,
            file_size,
            storage_path,
            uploaded_at
          )
        `)
        .eq('id', shareId)
        .single();

      if (linkError) {
        setError('Share link not found or has expired');
        return;
      }

      // Check if link is expired
      if (sharedLinkData.expires_at && new Date(sharedLinkData.expires_at) < new Date()) {
        setError('This share link has expired');
        return;
      }

      // Cast the permissions to the correct type
      const typedSharedFile: SharedFile = {
        ...sharedLinkData,
        permissions: sharedLinkData.permissions as 'view' | 'download'
      };

      setSharedFile(typedSharedFile);

      // Get file URL from storage
      const { data: urlData } = await supabase.storage
        .from('user-files')
        .createSignedUrl(sharedLinkData.uploaded_files.storage_path, 3600); // 1 hour expiry

      if (urlData?.signedUrl) {
        setFileUrl(urlData.signedUrl);
      }
    } catch (error) {
      console.error('Error fetching shared file:', error);
      setError('Failed to load shared file');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (!shareId) {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading shared file...</p>
        </div>
      </div>
    );
  }

  if (error || !sharedFile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">File Not Available</h2>
              <p className="text-muted-foreground">{error}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="bg-background/60 backdrop-blur-md border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  CloudHub
                </h1>
                <p className="text-xs text-muted-foreground">Shared File</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* File Info Card */}
          <Card className="bg-background/60 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {sharedFile.uploaded_files.file_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{sharedFile.uploaded_files.file_type}</Badge>
                  <span className="text-muted-foreground">
                    {formatFileSize(sharedFile.uploaded_files.file_size)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>
                    Shared {formatDistanceToNow(new Date(sharedFile.created_at), { addSuffix: true })}
                  </span>
                </div>

                {sharedFile.expires_at && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Expires {formatDistanceToNow(new Date(sharedFile.expires_at), { addSuffix: true })}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Badge variant={sharedFile.permissions === 'download' ? 'default' : 'secondary'}>
                  {sharedFile.permissions === 'download' ? 'View & Download' : 'View Only'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* File Preview */}
          {fileUrl && (
            <Card className="bg-background/60 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <FilePreview
                  fileName={sharedFile.uploaded_files.file_name}
                  fileType={sharedFile.uploaded_files.file_type}
                  fileUrl={fileUrl}
                  permissions={sharedFile.permissions}
                  showDownload={true}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default SharePage;
