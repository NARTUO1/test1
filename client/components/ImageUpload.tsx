import React, { useState, useRef } from "react";
import {
  Upload,
  X,
  Image as ImageIcon,
  Camera,
  Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value?: string;
  onChange: (imageUrl: string) => void;
  onRemove?: () => void;
  label?: string;
  placeholder?: string;
  aspectRatio?: "square" | "landscape" | "portrait" | "auto";
  maxSizeMB?: number;
  acceptedFormats?: string[];
  showUrlInput?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onRemove,
  label = "Image",
  placeholder = "Upload an image",
  aspectRatio = "auto",
  maxSizeMB = 5,
  acceptedFormats = ["image/jpeg", "image/png", "image/webp"],
  showUrlInput = true,
  className = "",
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square":
        return "aspect-square";
      case "landscape":
        return "aspect-video";
      case "portrait":
        return "aspect-[3/4]";
      default:
        return "aspect-auto min-h-[200px]";
    }
  };

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

  const handleFileUpload = async (file: File) => {
    if (!validateFile(file)) return;

    try {
      setIsUploading(true);

      // In a real app, you would upload to a cloud storage service
      // For demo purposes, we'll create a local URL
      const imageUrl = URL.createObjectURL(file);
      onChange(imageUrl);

      toast({
        title: "Image uploaded",
        description: "Image has been uploaded successfully (demo mode)",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      toast({
        title: "Image URL added",
        description: "Image URL has been added successfully",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove();
    } else {
      onChange("");
    }
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label>{label}</Label>}

      {value ? (
        // Image Preview
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className={`relative ${getAspectRatioClass()}`}>
              <img
                src={value}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Handle broken image URLs
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzY5NzA3YiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkJyb2tlbiBpbWFnZTwvdGV4dD48L3N2Zz4=";
                }}
              />
              <div className="absolute top-2 right-2">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleRemove}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Upload Area
        <Card
          className={`border-2 border-dashed transition-colors ${
            dragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25"
          }`}
        >
          <CardContent className="p-6">
            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
                {showUrlInput && (
                  <TabsTrigger value="url" className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Image URL
                  </TabsTrigger>
                )}
              </TabsList>

              <TabsContent value="upload" className="mt-4">
                <div
                  className={`${getAspectRatioClass()} flex flex-col items-center justify-center text-center cursor-pointer transition-colors hover:bg-muted/50 rounded-lg p-8`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-3">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
                    ) : (
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto" />
                    )}

                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        {isUploading ? "Uploading..." : placeholder}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Drag and drop or click to browse
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Max {maxSizeMB}MB •{" "}
                        {acceptedFormats
                          .map((format) => format.split("/")[1].toUpperCase())
                          .join(", ")}
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={acceptedFormats.join(",")}
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                  />
                </div>
              </TabsContent>

              {showUrlInput && (
                <TabsContent value="url" className="mt-4">
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="image-url">Image URL</Label>
                      <Input
                        id="image-url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <Button
                      onClick={handleUrlSubmit}
                      disabled={!urlInput.trim()}
                      className="w-full"
                    >
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Add Image URL
                    </Button>
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ImageUpload;
