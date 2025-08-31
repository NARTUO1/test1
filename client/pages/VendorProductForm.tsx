import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, X, Plus, Save } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import MultiImageUpload from "@/components/MultiImageUpload";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { VendorLayout } from "@/components/VendorLayout";
import { productApi, categoryApi } from "@/lib/api-client";
import { Product, Category, CreateProductRequest } from "@shared/api";
import { useAuth } from "@/contexts/AuthContext";

const VendorProductForm: React.FC = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const isEditing = !!productId;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Partial<CreateProductRequest>>({
    name: "",
    description: "",
    price: 0,
    discountPrice: undefined,
    sku: "",
    stockQuantity: 0,
    categoryId: undefined,
    imageUrl: "",
    images: [],
    specifications: {},
  });

  const [specifications, setSpecifications] = useState<
    Array<{ key: string; value: string }>
  >([]);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecValue, setNewSpecValue] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);

  useEffect(() => {
    loadCategories();
    if (isEditing) {
      loadProduct();
    }
  }, [productId]);

  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAll();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Failed to load categories:", error);
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive",
      });
    }
  };

  const loadProduct = async () => {
    if (!productId) return;

    try {
      setIsLoading(true);
      const response = await productApi.getById(parseInt(productId));

      if (response.success && response.data) {
        const productData = response.data;
        setProduct({
          name: productData.name,
          description: productData.description || "",
          price: productData.price,
          discountPrice: productData.discountPrice,
          sku: productData.sku || "",
          stockQuantity: productData.stockQuantity,
          categoryId: productData.categoryId,
          imageUrl: productData.imageUrl || "",
          images: productData.images || [],
          specifications: productData.specifications || {},
        });

        setImageUrls(productData.images || []);
        setIsActive(productData.isActive);
        setIsFeatured(productData.featured);

        // Convert specifications object to array for editing
        const specsArray = Object.entries(productData.specifications || {}).map(
          ([key, value]) => ({
            key,
            value: String(value),
          }),
        );
        setSpecifications(specsArray);
      }
    } catch (error) {
      console.error("Failed to load product:", error);
      toast({
        title: "Error",
        description: "Failed to load product details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateProductRequest, value: any) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const addSpecification = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications((prev) => [
        ...prev,
        { key: newSpecKey.trim(), value: newSpecValue.trim() },
      ]);
      setNewSpecKey("");
      setNewSpecValue("");
    }
  };

  const removeSpecification = (index: number) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const addImageUrl = () => {
    if (newImageUrl.trim() && !imageUrls.includes(newImageUrl.trim())) {
      setImageUrls((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl("");
    }
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = (): boolean => {
    if (!product.name?.trim()) {
      toast({
        title: "Validation Error",
        description: "Product name is required",
        variant: "destructive",
      });
      return false;
    }

    if (!product.categoryId) {
      toast({
        title: "Validation Error",
        description: "Please select a category",
        variant: "destructive",
      });
      return false;
    }

    if (!product.price || product.price <= 0) {
      toast({
        title: "Validation Error",
        description: "Price must be greater than 0",
        variant: "destructive",
      });
      return false;
    }

    if (product.discountPrice && product.discountPrice >= product.price) {
      toast({
        title: "Validation Error",
        description: "Discount price must be less than regular price",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      setIsSaving(true);

      // Convert specifications array back to object
      const specsObject = specifications.reduce(
        (acc, spec) => {
          acc[spec.key] = spec.value;
          return acc;
        },
        {} as Record<string, any>,
      );

      const productData = {
        ...product,
        images: imageUrls,
        specifications: specsObject,
      };

      if (isEditing) {
        const updateData = {
          ...productData,
          isActive,
          featured: isFeatured,
        };
        await productApi.update(parseInt(productId!), updateData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await productApi.create(productData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }

      navigate("/vendor/products");
    } catch (error: any) {
      console.error("Failed to save product:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <VendorLayout activeTab="products">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </VendorLayout>
    );
  }

  return (
    <VendorLayout activeTab="products">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/vendor/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Update your product details"
                : "Create a new product listing"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    value={product.name || ""}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={product.categoryId?.toString() || ""}
                    onValueChange={(value) =>
                      handleInputChange("categoryId", parseInt(value))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem
                          key={category.id}
                          value={category.id.toString()}
                        >
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    value={product.sku || ""}
                    onChange={(e) => handleInputChange("sku", e.target.value)}
                    placeholder="Enter SKU (optional)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={product.stockQuantity || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "stockQuantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={product.description || ""}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Describe your product..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Regular Price *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.price || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "price",
                        parseFloat(e.target.value) || 0,
                      )
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discountPrice">Sale Price</Label>
                  <Input
                    id="discountPrice"
                    type="number"
                    step="0.01"
                    min="0"
                    value={product.discountPrice || ""}
                    onChange={(e) =>
                      handleInputChange(
                        "discountPrice",
                        e.target.value ? parseFloat(e.target.value) : undefined,
                      )
                    }
                    placeholder="0.00 (optional)"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                value={product.imageUrl || ""}
                onChange={(imageUrl) => handleInputChange("imageUrl", imageUrl)}
                label="Main Product Image"
                placeholder="Upload your main product image"
                aspectRatio="square"
              />

              <MultiImageUpload
                value={imageUrls}
                onChange={setImageUrls}
                label="Additional Product Images"
                maxImages={8}
              />
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Product Specifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {specifications.map((spec, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Badge variant="secondary" className="min-w-0 flex-shrink-0">
                    {spec.key}
                  </Badge>
                  <span className="flex-1">{spec.value}</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeSpecification(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  value={newSpecKey}
                  onChange={(e) => setNewSpecKey(e.target.value)}
                  placeholder="Specification name"
                />
                <Input
                  value={newSpecValue}
                  onChange={(e) => setNewSpecValue(e.target.value)}
                  placeholder="Specification value"
                />
                <Button
                  type="button"
                  onClick={addSpecification}
                  variant="outline"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Spec
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          {isEditing && (
            <Card>
              <CardHeader>
                <CardTitle>Product Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="active">Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Make this product visible to customers
                    </p>
                  </div>
                  <Switch
                    id="active"
                    checked={isActive}
                    onCheckedChange={setIsActive}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="featured">Featured</Label>
                    <p className="text-sm text-muted-foreground">
                      Show this product in featured sections
                    </p>
                  </div>
                  <Switch
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/vendor/products")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              <Save className="h-4 w-4 mr-2" />
              {isSaving
                ? "Saving..."
                : isEditing
                  ? "Update Product"
                  : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </VendorLayout>
  );
};

export default VendorProductForm;
