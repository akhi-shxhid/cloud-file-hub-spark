
import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Image, File, X, Check } from 'lucide-react';
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
        i === index ? { ...f, status: 'uploading' } : f
      ));

      const fileName = `${Date.now()}-${fileData.file.name}`;
      const filePath = `${user.id}/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('user-files')
        .upload(filePath, fileData.file, {
          onUploadProgress: (progress) => {
            const percentage = (progress.loaded / progress.total) * 100;
            setFiles(prev => prev.map((f, i) => 
              i === index ? { ...f, progress: percentage } : f
            ));
          }
        });

      if (uploadError) throw uploadError;

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
    const pendingFiles = files.filter(f => f.status === 'pending');
    
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
    <div className="space-y-6">
      <Card className="animate-in slide-in-from-bottom duration-500">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </CardTitle>
          <CardDescription>
            Drag and drop files here or click to select. Max file size: 50MB
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragging 
                ? 'border-blue-500 bg-blue-50/50 scale-105' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-lg font-medium">Drop files here or click to browse</p>
                <p className="text-sm text-muted-foreground">
                  Supports: Images, PDFs, Documents, Spreadsheets
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mx-auto"
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
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Selected Files ({files.length})</h3>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSuccessfulUploads}
                    disabled={!files.some(f => f.status === 'success')}
                  >
                    Clear Uploaded
                  </Button>
                  <Button
                    onClick={uploadAllFiles}
                    disabled={!files.some(f => f.status === 'pending') || files.some(f => f.status === 'uploading')}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    Upload All
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                {files.map((fileData, index) => {
                  const Icon = fileTypes.find(t => t.value === fileData.type)?.icon || File;
                  return (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-white/50 backdrop-blur-sm">
                      <div className="flex-shrink-0">
                        <div className="p-2 rounded-lg bg-gray-100">
                          <Icon className="h-5 w-5" />
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{fileData.file.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(fileData.file.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        
                        {fileData.status === 'uploading' && (
                          <Progress value={fileData.progress} className="mt-2 h-2" />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Select
                          value={fileData.type}
                          onValueChange={(value) => updateFileType(index, value)}
                          disabled={fileData.status !== 'pending'}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {fileTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <div className="flex items-center gap-1">
                          {fileData.status === 'success' && (
                            <div className="p-1 rounded-full bg-green-100">
                              <Check className="h-4 w-4 text-green-600" />
                            </div>
                          )}
                          
                          {fileData.status === 'error' && (
                            <div className="p-1 rounded-full bg-red-100">
                              <X className="h-4 w-4 text-red-600" />
                            </div>
                          )}

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                            disabled={fileData.status === 'uploading'}
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
