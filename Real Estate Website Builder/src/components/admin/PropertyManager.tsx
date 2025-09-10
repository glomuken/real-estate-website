import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Plus, Edit, Trash2, Eye, Upload, X } from "lucide-react";
import { Property, getProperties, createProperty, updateProperty, deleteProperty, uploadImage, PropertyImage } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface PropertyManagerProps {
  token: string;
}

export function PropertyManager({ token }: PropertyManagerProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [formData, setFormData] = useState<Partial<Property>>({
    images: [],
    features: []
  });
  const [uploading, setUploading] = useState(false);

  // Load properties on component mount
  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const data = await getProperties();
      setProperties(data);
    } catch (error: any) {
      console.error('Error loading properties:', error);
      toast.error(error.message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof Property, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => uploadImage(file, token));
      const uploadedImages = await Promise.all(uploadPromises);
      
      const newImageUrls = uploadedImages.map(img => img.url);
      const currentImages = formData.images || [];
      
      handleInputChange('images', [...currentImages, ...newImageUrls]);
      toast.success(`Uploaded ${uploadedImages.length} image(s)`);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const currentImages = formData.images || [];
    const updatedImages = currentImages.filter((_, i) => i !== index);
    handleInputChange('images', updatedImages);
  };

  const handleFeatureAdd = (feature: string) => {
    if (!feature.trim()) return;
    const currentFeatures = formData.features || [];
    if (!currentFeatures.includes(feature)) {
      handleInputChange('features', [...currentFeatures, feature]);
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = formData.features || [];
    const updatedFeatures = currentFeatures.filter((_, i) => i !== index);
    handleInputChange('features', updatedFeatures);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title?.trim()) {
      toast.error('Property title is required');
      return;
    }
    if (!formData.location?.trim()) {
      toast.error('Property location is required');
      return;
    }
    if (!formData.city?.trim()) {
      toast.error('City is required');
      return;
    }
    if (!formData.type?.trim()) {
      toast.error('Property type is required');
      return;
    }
    if (!formData.status?.trim()) {
      toast.error('Property status is required');
      return;
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Valid price is required');
      return;
    }

    try {
      if (editingProperty) {
        // Update existing property
        await updateProperty(editingProperty.id, formData, token);
        toast.success('Property updated successfully');
        setEditingProperty(null);
      } else {
        // Add new property
        const newProperty = {
          ...formData,
          title: formData.title || "",
          description: formData.description || "",
          price: formData.price || 0,
          location: formData.location || "",
          city: formData.city || "",
          area: formData.area || "",
          type: formData.type || "",
          bedrooms: formData.bedrooms || 0,
          bathrooms: formData.bathrooms || 0,
          sqft: formData.sqft || 0,
          images: formData.images || [],
          features: formData.features || [],
          status: (formData.status as Property["status"]) || "available"
        } as Omit<Property, 'id' | 'createdAt' | 'updatedAt'>;
        
        await createProperty(newProperty, token);
        toast.success('Property created successfully');
        setIsAddDialogOpen(false);
      }
      
      setFormData({ images: [], features: [] });
      loadProperties();
    } catch (error: any) {
      console.error('Error saving property:', error);
      toast.error(error.message || 'Failed to save property');
    }
  };

  const handleEdit = (property: Property) => {
    setEditingProperty(property);
    setFormData(property);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this property?')) return;
    
    try {
      await deleteProperty(id, token);
      toast.success('Property deleted successfully');
      loadProperties();
    } catch (error: any) {
      console.error('Error deleting property:', error);
      toast.error(error.message || 'Failed to delete property');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "pending":
        return "bg-yellow-500";
      case "sold":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const PropertyForm = () => {
    const [newFeature, setNewFeature] = useState("");
    
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">Title *</label>
            <Input
              value={formData.title || ""}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Property title"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Location *</label>
            <Input
              value={formData.location || ""}
              onChange={(e) => handleInputChange("location", e.target.value)}
              placeholder="Full address/location"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm mb-2">City *</label>
            <Input
              value={formData.city || ""}
              onChange={(e) => handleInputChange("city", e.target.value)}
              placeholder="City"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Area/Suburb</label>
            <Input
              value={formData.area || ""}
              onChange={(e) => handleInputChange("area", e.target.value)}
              placeholder="Area or suburb"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2">Price (R) *</label>
            <Input
              type="number"
              value={formData.price || ""}
              onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
              placeholder="Price"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Type *</label>
            <Select value={formData.type || ""} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="House">House</SelectItem>
                <SelectItem value="Apartment">Apartment</SelectItem>
                <SelectItem value="Townhouse">Townhouse</SelectItem>
                <SelectItem value="Flat">Flat</SelectItem>
                <SelectItem value="Land">Land</SelectItem>
                <SelectItem value="Commercial">Commercial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm mb-2">Status *</label>
            <Select value={formData.status || ""} onValueChange={(value) => handleInputChange("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-2">Bedrooms</label>
            <Input
              type="number"
              value={formData.bedrooms || ""}
              onChange={(e) => handleInputChange("bedrooms", parseInt(e.target.value) || 0)}
              placeholder="Number of bedrooms"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Bathrooms</label>
            <Input
              type="number"
              value={formData.bathrooms || ""}
              onChange={(e) => handleInputChange("bathrooms", parseInt(e.target.value) || 0)}
              placeholder="Number of bathrooms"
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Square Feet</label>
            <Input
              type="number"
              value={formData.sqft || ""}
              onChange={(e) => handleInputChange("sqft", parseInt(e.target.value) || 0)}
              placeholder="Property area in sqft"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2">Description</label>
          <Textarea
            value={formData.description || ""}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Property description"
            rows={4}
          />
        </div>

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm mb-2">Property Images</label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex flex-col items-center justify-center space-y-2"
            >
              <Upload className="h-8 w-8 text-gray-400" />
              <span className="text-sm text-gray-600">
                {uploading ? "Uploading..." : "Click to upload images or drag and drop"}
              </span>
            </label>
          </div>
          
          {formData.images && formData.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
              {formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Property image ${index + 1}`}
                    className="w-full h-24 object-cover rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features Section */}
        <div>
          <label className="block text-sm mb-2">Property Features</label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              placeholder="Add a feature (e.g., Swimming Pool)"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleFeatureAdd(newFeature);
                  setNewFeature('');
                }
              }}
            />
            <Button
              type="button"
              onClick={() => {
                handleFeatureAdd(newFeature);
                setNewFeature('');
              }}
            >
              Add
            </Button>
          </div>
          
          {formData.features && formData.features.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.features.map((feature, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {feature}
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X size={12} />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => {
            setIsAddDialogOpen(false);
            setEditingProperty(null);
            setFormData({ images: [], features: [] });
          }}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingProperty ? "Update" : "Add"} Property
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Property Management</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus size={16} className="mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
            </DialogHeader>
            <PropertyForm />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Properties ({properties.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {properties.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No properties found. Add your first property to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="font-medium">{property.title}</TableCell>
                      <TableCell>{property.city}, {property.area}</TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-ZA', {
                          style: 'currency',
                          currency: 'ZAR',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }).format(property.price)}
                      </TableCell>
                      <TableCell>{property.type}</TableCell>
                      <TableCell>
                        <Badge className={`${getStatusColor(property.status)} text-white border-none`}>
                          {property.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {property.bedrooms}BR • {property.bathrooms}BA • {property.sqft}sqft
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye size={14} />
                          </Button>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => handleEdit(property)}>
                                <Edit size={14} />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Property</DialogTitle>
                              </DialogHeader>
                              <PropertyForm />
                            </DialogContent>
                          </Dialog>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleDelete(property.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}