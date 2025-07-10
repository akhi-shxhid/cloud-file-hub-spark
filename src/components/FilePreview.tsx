
import { useState } from 'react';
import { FileText, Image, Video, Music, Download, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FilePreviewProps {
  fileName: string;
  fileType: string;
  fileUrl: string;
  permissions?: 'view' | 'download';
  showDownload?: boolean;
}

const FilePreview = ({ fileName, fileType, fileUrl, permissions = 'download', showDownload = true }: FilePreviewProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const getFileCategory = (type: string, name: string) => {
    const extension = name.toLowerCase().split('.').pop();
    
    if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension || '')) {
      return 'image';
    }
    if (type === 'document' || ['pdf'].includes(extension || '')) {
      return 'pdf';
    }
    if (['mp4', 'webm', 'ogg', 'mov'].includes(extension || '')) {
      return 'video';
    }
    if (['mp3', 'wav', 'ogg', 'm4a'].includes(extension || '')) {
      return 'audio';
    }
    return 'other';
  };

  const category = getFileCategory(fileType, fileName);

  const renderPreview = () => {
    switch (category) {
      case 'image':
        return (
          <div className="relative">
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted rounded-lg">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        );

      case 'pdf':
        return (
          <div className="w-full h-96 border rounded-lg overflow-hidden">
            <iframe
              src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`}
              className="w-full h-full"
              title={fileName}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-muted">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}
          </div>
        );

      case 'video':
        return (
          <video
            controls
            className="max-w-full max-h-96 mx-auto rounded-lg shadow-lg"
            onLoadedData={() => setLoading(false)}
            onError={() => {
              setLoading(false);
              setError(true);
            }}
          >
            <source src={fileUrl} type={`video/${fileName.split('.').pop()}`} />
            Your browser does not support the video tag.
          </video>
        );

      case 'audio':
        return (
          <div className="w-full max-w-md mx-auto">
            <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
              <Music className="h-8 w-8 text-primary" />
              <div className="flex-1">
                <audio
                  controls
                  className="w-full"
                  onLoadedData={() => setLoading(false)}
                  onError={() => {
                    setLoading(false);
                    setError(true);
                  }}
                >
                  <source src={fileUrl} type={`audio/${fileName.split('.').pop()}`} />
                  Your browser does not support the audio tag.
                </audio>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">Preview not available</p>
            <p className="text-muted-foreground">
              {showDownload && permissions === 'download' 
                ? 'Please download the file to view its contents.' 
                : 'This file type cannot be previewed in the browser.'}
            </p>
          </div>
        );
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <p className="text-lg font-medium">Failed to load preview</p>
        <p className="text-muted-foreground">There was an error loading the file preview.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5" />
          <h3 className="font-medium">File Preview</h3>
        </div>
        {showDownload && permissions === 'download' && (
          <Button onClick={handleDownload} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        )}
      </div>
      
      <div className="border rounded-lg p-4 bg-background/50">
        {renderPreview()}
      </div>
    </div>
  );
};

export default FilePreview;
