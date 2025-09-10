import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Home, Image, TrendingUp, Banknote, Users } from "lucide-react";
import { getDashboardStats, DashboardStats as StatsType, addSampleProperties } from "../../utils/api";
import { toast } from "sonner@2.0.3";

interface DashboardStatsProps {
  token: string;
}

export function DashboardStats({ token }: DashboardStatsProps) {
  const [stats, setStats] = useState<StatsType | null>(null);
  const [loading, setLoading] = useState(true);
  const [addingProperties, setAddingProperties] = useState(false);

  useEffect(() => {
    loadStats();
  }, [token]);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getDashboardStats(token);
      setStats(data);
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSampleProperties = async () => {
    try {
      setAddingProperties(true);
      await addSampleProperties(token);
      toast.success('Sample properties added successfully!');
      loadStats(); // Refresh stats
    } catch (error: any) {
      console.error('Error adding sample properties:', error);
      toast.error(error.message || 'Failed to add sample properties');
    } finally {
      setAddingProperties(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">Failed to load dashboard statistics</p>
      </div>
    );
  }

  const dashboardCards = [
    {
      title: "Total Properties",
      value: stats.totalProperties.toString(),
      icon: Home,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Site Images",
      value: stats.totalImages.toString(),
      icon: Image,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Average Price",
      value: stats.avgPrice > 0 ? new Intl.NumberFormat('en-ZA', {
        style: 'currency',
        currency: 'ZAR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(stats.avgPrice) : "R 0",
      icon: Banknote,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Admin Users",
      value: stats.totalAdmins?.toString() || "1",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardCards.map((card, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold">{card.value}</p>
                </div>
                <div className={`p-3 rounded-full ${card.bgColor} ${card.color}`}>
                  <card.icon size={24} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Property Types Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Property Types</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(stats.propertyTypes).length === 0 ? (
              <p className="text-gray-600 text-center py-4">No properties added yet</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(stats.propertyTypes).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{type}</span>
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-200 rounded-full px-2 py-1">
                        <span className="text-xs font-semibold text-blue-800">{count}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats && stats.totalProperties === 0 && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-blue-900">Get Started</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Add some sample properties to get started quickly
                      </p>
                    </div>
                    <Button
                      onClick={handleAddSampleProperties}
                      disabled={addingProperties}
                      size="sm"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {addingProperties ? 'Adding...' : 'Add Sample Data'}
                    </Button>
                  </div>
                </div>
              )}
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900">Add Property</h4>
                <p className="text-sm text-green-700 mt-1">
                  Click the "Add Property" button in the Properties tab to add your listings
                </p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900">Upload Images</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Use the Images tab to upload and manage site images
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-900">Site Management</h4>
                <p className="text-sm text-purple-700 mt-1">
                  Use Settings tab to customize site appearance and manage users
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">SEO & Analytics</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Optimize your site for search engines and track performance
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Info */}
      <Card>
        <CardHeader>
          <CardTitle>System Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalProperties}</div>
              <div className="text-sm text-gray-600">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.totalImages}</div>
              <div className="text-sm text-gray-600">Images Uploaded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(stats.propertyTypes).length}
              </div>
              <div className="text-sm text-gray-600">Property Categories</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}