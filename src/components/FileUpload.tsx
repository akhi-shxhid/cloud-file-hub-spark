
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Image, File, X, Check, CloudUpload } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface UploadedFile {
  file: File;
  type: string;
  progress: number;
  status: 'pending' | 'uploading' | 'success' | 'error';
}

const FileUpload = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileTypes = [
    { value: 'document', label: 'Document', icon: FileText },
    { value: 'image', label: 'Image', icon: Image },
    { value: 'other', label: 'Other', icon: File },
  ];

  const allowedMimeTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword', 'text/plain', 'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    addFiles(droppedFiles);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      addFiles(selectedFiles);
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > 50 * 1024 * 1024) { // 50MB limit
        toast({
          title: "File too large",
          description: `${file.name} exceeds 50MB limit`,
          variant: "destructive"
        });
        return false;
      }
      if (!allowedMimeTypes.includes(file.type)) {
        toast({
          title: "File type not allowed",
          description: `${file.name} is not a supported file type`,
          variant: "destructive"
        });
        return false;
      }
      return true;
    });

    const uploadFiles = validFiles.map(file => ({
      file,
      type: getFileType(file.type),
      progress: 0,
      status: 'pending' as const
    }));

    setFiles(prev => [...prev, ...uploadFiles]);
  };

  const getFileType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('word')) return 'document';
    return 'other';
  };

  const updateFileType = (index: number, newType: string) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, type: newType } : file
    ));
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFile = async (fileData: UploadedFile, index: number) => {
    if (!user) return;

    try {
      // Update status to uploading
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'uploading', progress: 20 } : f
      ));

      const fileName = `${Date.now()}-${fileData.file.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((f, i) => 
          i === index && f.status === 'uploading' ? { ...f, progress: Math.min(f.progress + 10, 80) } : f
        ));
      }, 200);

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, fileData.file);

      clearInterval(progressInterval);

      if (uploadError) throw uploadError;

      // Update progress to 90%
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, progress: 90 } : f
      ));

      // Save metadata to database
      const { error: dbError } = await supabase
        .from('uploaded_files')
        .insert({
          user_id: user.id,
          file_name: fileData.file.name,
          file_type: fileData.type,
          file_size: fileData.file.size,
          storage_path: filePath
        });

      if (dbError) throw dbError;

      // Update status to success
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'success', progress: 100 } : f
      ));

      toast({
        title: "Upload successful",
        description: `${fileData.file.name} has been uploaded`,
      });

    } catch (error) {
      console.error('Upload error:', error);
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, status: 'error' } : f
      ));
      toast({
        title: "Upload failed",
        description: `Failed to upload ${fileData.file.name}`,
        variant: "destructive"
      });
    }
  };

  const uploadAllFiles = async () => {
    for (let i = 0; i < files.length; i++) {
      if (files[i].status === 'pending') {
        await uploadFile(files[i], i);
      }
    }
  };

  const clearSuccessfulUploads = () => {
    setFiles(prev => prev.filter(f => f.status !== 'success'));
  };

  return (
    <div className="space-y-8">
      <Card className="animate-in slide-in-from-bottom duration-500 bg-background/50 backdrop-blur-sm border-border/50 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-2xl">
            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
              <CloudUpload className="h-6 w-6 text-white" />
            </div>
            Upload Files
          </CardTitle>
          <CardDescription className="text-base">
            Drag and drop files here or click to select. Max file size: 50MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 scale-[1.02] shadow-lg' 
                : 'border-border/50 hover:border-border bg-background/30 hover:bg-background/50'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-6">
              <div className="relative mx-auto w-16 h-16">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse opacity-20"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center w-16 h-16">
                  <Upload className="h-8 w-8 text-white" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xl font-semibold">Drop files here or click to browse</p>
                <p className="text-muted-foreground">
                  Supports: Images, PDFs, Documents, Spreadsheets
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto bg-background/60 backdrop-blur-sm border-border/50 hover:bg-background/80 transition-all duration-200"
                size="lg"
              >
                Choose Files
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept={allowedMimeTypes.join(',')}
          />

          {/* File List */}
          {files.length > 0 && (
            <div className="space-y-6 animate-in slide-in-from-bottom duration-500 delay-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Selected Files ({files.length})</h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSuccessfulUploads}
                    disabled={!files.some(f => f.status === 'success')}
                    className="bg-background/60 backdrop-blur-sm border-border/50 hover:bg-background/80"
                  >
                    Clear Uploaded
                  </Button>
                  <Button
                    onClick={uploadAllFiles}
                    disabled={!files.some(f => f.status === 'pending') || files.some(f => f.status === 'uploading')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    size="sm"
                  >
                    Upload All
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {files.map((fileData, index) => {
                  const Icon = fileTypes.find(t => t.value === fileData.type)?.icon || File;
                  return (
                    <div key={index} className="flex items-center gap-4 p-5 border border-border/50 rounded-xl bg-background/30 backdrop-blur-sm hover:bg-background/50 transition-all duration-200 animate-in slide-in-from-left delay-100">
                      <div className="flex-shrink-0">
                        <div className="p-3 rounded-lg bg-muted">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0 space-y-2">
                        <p className="font-medium truncate text-lg">{fileData.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(fileData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        
                        {fileData.status === 'uploading' && (
                          <Progress value={fileData.progress} className="h-2" />
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <Select
                          value={fileData.type}
                          onValueChange={(value) => updateFileType(index, value)}
                          disabled={fileData.status !== 'pending'}
                        >
                          <SelectTrigger className="w-36 bg-background/60 backdrop-blur-sm border-border/50">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-background/95 backdrop-blur-sm border-border/50">
                            {fileTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                          {fileData.status === 'success' && (
                            <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/30 animate-in zoom-in duration-300">
                              <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                            </div>
                          )}
                          
                          {fileData.status === 'error' && (
                            <div className="p-1.5 rounded-full bg-red-100 dark:bg-red-900/30 animate-in zoom-in duration-300">
                              <X className="h-4 w-4 text-red-600 dark:text-red-400" />
                            </div>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={fileData.status === 'uploading'}
                            className="hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUpload;
