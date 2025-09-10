import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Lock, Mail, UserPlus } from "lucide-react";
import { loginAdmin, signupAdmin } from "../../utils/api";

interface AdminLoginProps {
  onLogin: (token: string, user: any) => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
    name: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isLogin) {
        const result = await loginAdmin(credentials.email, credentials.password);
        onLogin(result.access_token, result.user);
      } else {
        await signupAdmin(credentials.email, credentials.password, credentials.name);
        setIsLogin(true);
        setCredentials({ email: "", password: "", name: "" });
        setError("Account created successfully! Please log in.");
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="text-2xl font-bold mb-2">
            <span className="text-blue-600">Rainbow</span>
            <span className="text-orange-500">Properties</span>
          </div>
          <CardTitle>{isLogin ? "Admin Login" : "Create Admin Account"}</CardTitle>
          <p className="text-gray-600">
            {isLogin ? "Access the administrative dashboard" : "Set up your admin account"}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm mb-2">Full Name</label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    value={credentials.name}
                    onChange={(e) => setCredentials(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                    className="pl-10"
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            
            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="email"
                  value={credentials.email}
                  onChange={(e) => setCredentials(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter your email"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Enter your password"
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            {error && (
              <div className={`p-3 rounded-lg text-sm ${
                error.includes('successfully') 
                  ? 'bg-green-50 text-green-800' 
                  : 'bg-red-50 text-red-800'
              }`}>
                {error}
              </div>
            )}
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading 
                ? "Processing..." 
                : isLogin 
                  ? "Login to Admin Panel" 
                  : "Create Admin Account"
              }
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setCredentials({ email: "", password: "", name: "" });
              }}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              {isLogin 
                ? "Need to create an admin account? Sign up" 
                : "Already have an account? Log in"
              }
            </button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
            <strong>First time setup:</strong><br />
            Create an admin account to get started managing your properties.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}