import React, { useState } from "react";
import {
  Plus,
  X,
  Upload,
  Link as LinkIcon,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MultiImageUploadProps {
  value: string[];
  onChange: (images: string[]) => void;
  label?: string;
  maxImages?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  className?: string;
}

const MultiImageUpload: React.FC<MultiImageUploadProps> = ({
  value = [],
  onChange,
  label = "Product Images",
  maxImages = 10,
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  className = "",
}) => {
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!acceptedFormats.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: `Please upload ${acceptedFormats.join(", ")} files only`,
        variant: "destructive",
      });
      return false;
    }

    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSizeMB) {
      toast({
        title: "File too large",
        description: `Please upload files smaller than ${maxSizeMB}MB`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleFileUpload = async (files: FileList) => {
    if (value.length >= maxImages) {
      toast({
        title: "Maximum images reached",
        description: `You can only upload up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    const validFiles = Array.from(files).filter(validateFile);
    const remainingSlots = maxImages - value.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (filesToUpload.length === 0) return;

    try {
      setIsUploading(true);
      const newImageUrls: string[] = [];

      for (const file of filesToUpload) {
        // In a real app, you would upload to a cloud storage service
        // For demo purposes, we'll create a local URL
        const imageUrl = URL.createObjectURL(file);
        newImageUrls.push(imageUrl);
      }

      onChange([...value, ...newImageUrls]);

      toast({
        title: "Images uploaded",
        description: `${newImageUrls.length} image(s) uploaded successfully (demo mode)`,
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // Reset input value to allow selecting the same files again
    event.target.value = "";
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return;

    if (value.length >= maxImages) {
      toast({
        title: "Maximum images reached",
        description: `You can only have up to ${maxImages} images`,
        variant: "destructive",
      });
      return;
    }

    if (value.includes(urlInput.trim())) {
      toast({
        title: "Duplicate image",
        description: "This image URL has already been added",
        variant: "destructive",
      });
      return;
    }

    onChange([...value, urlInput.trim()]);
    setUrlInput("");

    toast({
      title: "Image URL added",
      description: "Image URL has been added successfully",
    });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorderImages = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {label && <Label className="text-base font-medium">{label}</Label>}

      {/* Image Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {value.map((imageUrl, index) => (
            <Card key={index} className="overflow-hidden group relative">
              <CardContent className="p-0">
                <div className="aspect-square relative">
                  <img
                    src={imageUrl}
                    alt={`Product image ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Handle broken image URLs
                      const target = e.target as HTMLImageElement;
                      target.src =
                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzA3YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJyb2tlbiBpbWFnZTwvdGV4dD48L3N2Zz4=";
                    }}
                  />

                  {/* Image number badge */}
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>

                  {/* Remove button */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>

                  {/* Main image indicator */}
                  {index === 0 && (
                    <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                      Main
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Area */}
      {value.length < maxImages && (
        <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* File Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-center">
                  <label className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-2 text-center">
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                      <div className="text-sm">
                        <span className="font-medium text-primary">
                          Click to upload
                        </span>
                        <span className="text-muted-foreground">
                          {" "}
                          or drag and drop
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Max {maxSizeMB}MB per file •{" "}
                        {acceptedFormats
                          .map((format) => format.split("/")[1].toUpperCase())
                          .join(", ")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {value.length}/{maxImages} images uploaded
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept={acceptedFormats.join(",")}
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    or
                  </span>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-2">
                <Label htmlFor="image-url" className="text-sm">
                  Add Image URL
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="image-url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                  />
                  <Button
                    type="button"
                    onClick={handleUrlSubmit}
                    disabled={!urlInput.trim()}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Helper text */}
      <div className="text-sm text-muted-foreground space-y-1">
        <p>• The first image will be used as the main product image</p>
        <p>• You can upload up to {maxImages} images per product</p>
        <p>
          • Supported formats:{" "}
          {acceptedFormats
            .map((format) => format.split("/")[1].toUpperCase())
            .join(", ")}
        </p>
        <p>• Maximum file size: {maxSizeMB}MB per image</p>
      </div>
    </div>
  );
};

export default MultiImageUpload;
