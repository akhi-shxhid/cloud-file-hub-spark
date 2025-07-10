
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Copy, Link, Calendar } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fileId: string;
  fileName: string;
}

const ShareDialog = ({ open, onOpenChange, fileId, fileName }: ShareDialogProps) => {
  const [permissions, setPermissions] = useState<'view' | 'download'>('view');
  const [expiresIn, setExpiresIn] = useState<string>('never');
  const [shareLink, setShareLink] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const generateShareLink = async () => {
    try {
      setLoading(true);
      
      let expiresAt = null;
      if (expiresIn !== 'never') {
        const hours = parseInt(expiresIn);
        expiresAt = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
      }

      const { data, error } = await supabase
        .from('shared_links')
        .insert({
          file_id: fileId,
          permissions,
          expires_at: expiresAt,
        })
        .select()
        .single();

      if (error) throw error;

      const link = `${window.location.origin}/share/${data.id}`;
      setShareLink(link);
      
      toast({
        title: "Share link created",
        description: "Link copied to clipboard",
      });
    } catch (error) {
      console.error('Error creating share link:', error);
      toast({
        title: "Failed to create share link",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    toast({
      title: "Copied!",
      description: "Share link copied to clipboard",
    });
  };

  const resetDialog = () => {
    setShareLink('');
    setPermissions('view');
    setExpiresIn('never');
  };

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) resetDialog();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Share File
          </DialogTitle>
          <DialogDescription>
            Create a shareable link for "{fileName}"
          </DialogDescription>
        </DialogHeader>

        {!shareLink ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="permissions">Permissions</Label>
              <Select value={permissions} onValueChange={(value: 'view' | 'download') => setPermissions(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View Only</SelectItem>
                  <SelectItem value="download">View & Download</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expires" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Expires
              </Label>
              <Select value={expiresIn} onValueChange={setExpiresIn}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="24">24 hours</SelectItem>
                  <SelectItem value="168">1 week</SelectItem>
                  <SelectItem value="720">1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generateShareLink} disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Share Link"}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Share Link</Label>
              <div className="flex gap-2">
                <Input value={shareLink} readOnly className="flex-1" />
                <Button onClick={copyToClipboard} size="icon" variant="outline">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Anyone with this link can {permissions === 'view' ? 'view' : 'view and download'} the file
              {expiresIn !== 'never' && ` for ${expiresIn === '1' ? '1 hour' : expiresIn === '24' ? '24 hours' : expiresIn === '168' ? '1 week' : '1 month'}`}.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShareDialog;
