import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Palette, Users, Settings, Video, Plus, Trash2, Edit } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { getSiteSettings, updateSiteSettings, getAdminUsers, createAdminUser } from "../../utils/api";

interface SiteSettingsProps {
  token: string;
}

interface SiteConfig {
  siteName: string;
  siteDescription: string;
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  heroVideoUrl: string;
  contactWhatsapp: string;
  contactEmail: string;
}

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'developer' | 'super_admin' | 'admin';
  permissions: string[];
  createdAt: string;
}

export function SiteSettings({ token }: SiteSettingsProps) {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    siteName: "Rainbow Properties",
    siteDescription: "Your trusted partner in real estate",
    primaryColor: "#030213",
    secondaryColor: "#e9ebef",
    fontFamily: "Inter",
    heroVideoUrl: "",
    contactWhatsapp: "+27123456789",
    contactEmail: "info@rainbowproperties.co.za"
  });
  
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: "",
    name: "",
    password: "",
    role: "admin" as AdminUser['role'],
    permissions: [] as string[]
  });

  const availablePermissions = [
    "manage_properties",
    "manage_images", 
    "manage_seo",
    "manage_users",
    "manage_settings",
    "view_analytics",
    "manage_communications"
  ];

  const roleHierarchy = {
    developer: ["manage_properties", "manage_images", "manage_seo", "manage_users", "manage_settings", "view_analytics", "manage_communications"],
    super_admin: ["manage_properties", "manage_images", "manage_seo", "manage_users", "view_analytics", "manage_communications"],
    admin: ["manage_properties", "manage_images", "view_analytics"]
  };

  useEffect(() => {
    loadSettings();
    loadAdminUsers();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await getSiteSettings(token);
      setSiteConfig(prev => ({ ...prev, ...data }));
    } catch (error) {
      console.error('Error loading site settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAdminUsers = async () => {
    try {
      const users = await getAdminUsers(token);
      setAdminUsers(users || []);
    } catch (error) {
      console.error('Error loading admin users:', error);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      await updateSiteSettings(siteConfig, token);
      toast.success('Site settings saved successfully!');
      
      // Apply color changes to CSS variables
      document.documentElement.style.setProperty('--primary', siteConfig.primaryColor);
      document.documentElement.style.setProperty('--secondary', siteConfig.secondaryColor);
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleAddUser = async () => {
    try {
      await createAdminUser(newUserData, token);
      toast.success('Admin user created successfully!');
      setIsAddUserOpen(false);
      setNewUserData({ email: "", name: "", password: "", role: "admin", permissions: [] });
      loadAdminUsers();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
    }
  };

  const handleRoleChange = (role: AdminUser['role']) => {
    setNewUserData(prev => ({
      ...prev,
      role,
      permissions: roleHierarchy[role]
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl">Site Settings</h2>
        <Button onClick={saveSettings} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette size={16} />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings size={16} />
            General
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <Video size={16} />
            Media
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users size={16} />
            Users
          </TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme & Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Primary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={siteConfig.primaryColor}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={siteConfig.primaryColor}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, primaryColor: e.target.value }))}
                      placeholder="#030213"
                      className="flex-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="secondaryColor">Secondary Color</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={siteConfig.secondaryColor}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      className="w-16 h-10 p-1 border rounded"
                    />
                    <Input
                      value={siteConfig.secondaryColor}
                      onChange={(e) => setSiteConfig(prev => ({ ...prev, secondaryColor: e.target.value }))}
                      placeholder="#e9ebef"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
              <div>
                <Label htmlFor="fontFamily">Font Family</Label>
                <Select value={siteConfig.fontFamily} onValueChange={(value) => setSiteConfig(prev => ({ ...prev, fontFamily: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Poppins">Poppins</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Site Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteName">Site Name</Label>
                <Input
                  id="siteName"
                  value={siteConfig.siteName}
                  onChange={(e) => setSiteConfig(prev => ({ ...prev, siteName: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea
                  id="siteDescription"
                  value={siteConfig.siteDescription}
                  onChange={(e) => setSiteConfig(prev => ({ ...prev, siteDescription: e.target.value }))}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="contactWhatsapp">WhatsApp Number</Label>
                <Input
                  id="contactWhatsapp"
                  value={siteConfig.contactWhatsapp}
                  onChange={(e) => setSiteConfig(prev => ({ ...prev, contactWhatsapp: e.target.value }))}
                  placeholder="+27123456789"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={siteConfig.contactEmail}
                  onChange={(e) => setSiteConfig(prev => ({ ...prev, contactEmail: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero Section Media</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="heroVideoUrl">Hero Video URL (YouTube/Vimeo)</Label>
                <Input
                  id="heroVideoUrl"
                  value={siteConfig.heroVideoUrl}
                  onChange={(e) => setSiteConfig(prev => ({ ...prev, heroVideoUrl: e.target.value }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="mt-1"
                />
                <p className="text-sm text-gray-600 mt-1">
                  Add a video URL to display in the hero section. Leave empty to use the default image.
                </p>
              </div>
              {siteConfig.heroVideoUrl && (
                <div className="mt-4">
                  <Label>Preview</Label>
                  <div className="mt-1 aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-600">Video will be embedded here</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Admin Users</h3>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Admin User</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="newUserEmail">Email</Label>
                    <Input
                      id="newUserEmail"
                      type="email"
                      value={newUserData.email}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, email: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUserName">Name</Label>
                    <Input
                      id="newUserName"
                      value={newUserData.name}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUserPassword">Password</Label>
                    <Input
                      id="newUserPassword"
                      type="password"
                      value={newUserData.password}
                      onChange={(e) => setNewUserData(prev => ({ ...prev, password: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newUserRole">Role</Label>
                    <Select value={newUserData.role} onValueChange={handleRoleChange}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Permissions</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {newUserData.permissions.map(permission => (
                        <Badge key={permission} variant="secondary">
                          {permission.replace('_', ' ')}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleAddUser}>
                      Add User
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <Card>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'developer' ? 'default' : user.role === 'super_admin' ? 'secondary' : 'outline'}>
                          {user.role.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit size={14} />
                          </Button>
                          <Button size="sm" variant="outline" className="text-red-600">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}