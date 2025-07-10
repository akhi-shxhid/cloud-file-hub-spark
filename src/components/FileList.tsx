import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileText, Image, File, Download, Trash2, Search, Calendar, HardDrive, Share, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import ShareDialog from './ShareDialog';
import FilePreview from './FilePreview';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface FileData {
  id: string;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  uploaded_at: string;
}

const FileList = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewFileUrl, setPreviewFileUrl] = useState<string>('');

  const fileTypeIcons = {
    document: FileText,
    image: Image,
    other: File,
  };

  const fileTypeColors = {
    document: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    image: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    other: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('uploaded_files')
        .select('*')
        .eq('user_id', user?.id)
        .order('uploaded_at', { ascending: false });

      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
      toast({
        title: "Error loading files",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = async (file: FileData) => {
    try {
      const { data, error } = await supabase.storage
        .from('user-files')
        .download(file.storage_path);

      if (error) throw error;

      // Create download link
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download started",
        description: `${file.file_name} is downloading`,
      });
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Download failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const deleteFile = async (file: FileData) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('user-files')
        .remove([file.storage_path]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .delete()
        .eq('id', file.id);

      if (dbError) throw dbError;

      setFiles(prev => prev.filter(f => f.id !== file.id));
      
      toast({
        title: "File deleted",
        description: `${file.file_name} has been deleted`,
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const openShareDialog = (file: FileData) => {
    setSelectedFile(file);
    setShareDialogOpen(true);
  };

  const openPreviewDialog = async (file: FileData) => {
    try {
      const { data } = await supabase.storage
        .from('user-files')
        .createSignedUrl(file.storage_path, 3600); // 1 hour expiry

      if (data?.signedUrl) {
        setPreviewFileUrl(data.signedUrl);
        setSelectedFile(file);
        setPreviewDialogOpen(true);
      }
    } catch (error) {
      console.error('Error creating preview URL:', error);
      toast({
        title: "Preview failed",
        description: "Could not load file preview.",
        variant: "destructive",
      });
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.file_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || file.file_type === selectedType;
    return matchesSearch && matchesType;
  });

  const totalSize = files.reduce((sum, file) => sum + file.file_size, 0);
  const fileTypeCounts = files.reduce((acc, file) => {
    acc[file.file_type] = (acc[file.file_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-muted rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-bottom duration-500">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <File className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{files.length}</p>
                <p className="text-sm text-muted-foreground">Total Files</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{formatFileSize(totalSize)}</p>
                <p className="text-sm text-muted-foreground">Storage Used</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{fileTypeCounts.document || 0}</p>
                <p className="text-sm text-muted-foreground">Documents</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Image className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-foreground">{fileTypeCounts.image || 0}</p>
                <p className="text-sm text-muted-foreground">Images</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Files Section */}
      <Card className="animate-in slide-in-from-bottom duration-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <File className="h-5 w-5" />
            My Files
          </CardTitle>
          <CardDescription>
            Manage and download your uploaded files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search files..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              {['all', 'document', 'image', 'other'].map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className={selectedType === type ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </Button>
              ))}
            </div>
          </div>

          {/* File Grid */}
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <File className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground">No files found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Upload your first file to get started'}
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredFiles.map((file) => {
                const IconComponent = fileTypeIcons[file.file_type as keyof typeof fileTypeIcons] || File;
                return (
                  <div
                    key={file.id}
                    className="flex items-center gap-4 p-4 border rounded-lg bg-background/50 backdrop-blur-sm hover:shadow-md transition-all duration-200 animate-in slide-in-from-bottom"
                  >
                    <div className="flex-shrink-0">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/50 dark:to-purple-900/50">
                        <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-foreground">{file.file_name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-3 w-3" />
                          {formatFileSize(file.file_size)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDistanceToNow(new Date(file.uploaded_at), { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge className={fileTypeColors[file.file_type as keyof typeof fileTypeColors] || fileTypeColors.other}>
                        {file.file_type}
                      </Badge>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openPreviewDialog(file)}
                        className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:border-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openShareDialog(file)}
                        className="hover:bg-green-50 hover:border-green-200 dark:hover:bg-green-950 dark:hover:border-green-800"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => downloadFile(file)}
                        className="hover:bg-blue-50 hover:border-blue-200 dark:hover:bg-blue-950 dark:hover:border-blue-800"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteFile(file)}
                        className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 dark:hover:bg-red-950 dark:hover:border-red-800 dark:hover:text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Share Dialog */}
      {selectedFile && (
        <ShareDialog
          open={shareDialogOpen}
          onOpenChange={setShareDialogOpen}
          fileId={selectedFile.id}
          fileName={selectedFile.file_name}
        />
      )}

      {/* Preview Dialog */}
      {selectedFile && (
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">{selectedFile.file_name}</DialogTitle>
            </DialogHeader>
            {previewFileUrl && (
              <FilePreview
                fileName={selectedFile.file_name}
                fileType={selectedFile.file_type}
                fileUrl={previewFileUrl}
                permissions="download"
                showDownload={true}
              />
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default FileList;
