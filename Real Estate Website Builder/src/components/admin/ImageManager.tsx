import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Trash2, Upload, Image as ImageIcon, Copy, Check } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { getImages, uploadImage, deleteImage, PropertyImage } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface ImageManagerProps {
  token: string;
}

export function ImageManager({ token }: ImageManagerProps) {
  const [images, setImages] = useState<PropertyImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await getImages(token);
      setImages(data);
    } catch (error: any) {
      console.error('Error loading images:', error);
      toast.error(error.message || 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, token));
      const uploadedImages = await Promise.all(uploadPromises);
      
      toast.success(`Successfully uploaded ${uploadedImages.length} image(s)`);
      loadImages(); // Refresh the list
      setIsAddDialogOpen(false);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async (fileName: string, imageName: string) => {
    if (!confirm(`Are you sure you want to delete "${imageName}"?`)) return;
    
    try {
      await deleteImage(fileName, token);
      toast.success('Image deleted successfully');
      loadImages(); // Refresh the list
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast.error(error.message || 'Failed to delete image');
    }
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrl(url);
      toast.success('Image URL copied to clipboard');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => setCopiedUrl(null), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to copy URL');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading images...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Image Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Upload Images
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Images</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Upload Images</h3>
                  <p className="text-sm text-gray-600">
                    Select multiple image files to upload to your property gallery
                  </p>
                </div>
                <div className="mt-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
                      uploading 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    {uploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload size={16} className="mr-2" />
                        Choose Files
                      </>
                    )}
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Supports JPEG, PNG, GIF files up to 10MB each
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg mb-2">No images uploaded</h3>
            <p className="text-gray-600 mb-4">
              Upload your first images to get started with your property gallery.
            </p>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus size={16} className="mr-2" />
              Upload Your First Images
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Image Gallery ({images.length} images)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {images.map((image) => (
                  <Card key={image.id} className="overflow-hidden">
                    <div className="relative aspect-square">
                      <ImageWithFallback
                        src={image.url}
                        alt={image.originalName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => copyToClipboard(image.url)}
                          className="p-1 h-8 w-8 bg-white/90 hover:bg-white"
                        >
                          {copiedUrl === image.url ? (
                            <Check size={14} className="text-green-600" />
                          ) : (
                            <Copy size={14} />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image.fileName, image.originalName)}
                          className="p-1 h-8 w-8 bg-red-500/90 hover:bg-red-600"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium mb-1 truncate text-sm">{image.originalName}</h3>
                      <div className="space-y-1 text-xs text-gray-600">
                        <p>Size: {formatFileSize(image.size)}</p>
                        <p>Uploaded: {formatDate(image.uploadedAt)}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Usage Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>How to Use Images</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2">
                  <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">TIP</div>
                  <p>Click the copy icon on any image to copy its URL for use in property listings.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">INFO</div>
                  <p>Images are automatically optimized and stored securely in the cloud.</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">NOTE</div>
                  <p>When adding properties, you can upload images directly or use existing ones from this gallery.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}