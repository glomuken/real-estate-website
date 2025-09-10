import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { CheckCircle, AlertCircle, User, Home } from "lucide-react";
import { projectId, publicAnonKey } from "../../utils/supabase/info";

export function InitialSetup() {
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{type: 'success' | 'error' | 'info', message: string}>>([]);

  const addMessage = (type: 'success' | 'error' | 'info', message: string) => {
    setMessages(prev => [...prev, { type, message }]);
  };

  const createDeveloperAccount = async () => {
    try {
      const response = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b/create-developer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();
      
      if (response.ok) {
        addMessage('success', `Developer account created! Email: developer@rainbowproperties.co.za, Password: RainbowDev2024!`);
      } else {
        addMessage('info', result.message || 'Developer account creation failed');
      }
    } catch (error) {
      addMessage('error', `Error creating developer account: ${error}`);
    }
  };

  const addSampleProperties = async () => {
    // First try to login with developer credentials
    try {
      const loginResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'developer@rainbowproperties.co.za',
          password: 'RainbowDev2024!'
        }),
      });

      if (!loginResponse.ok) {
        addMessage('error', 'Please create developer account first');
        return;
      }

      const loginData = await loginResponse.json();
      const token = loginData.access_token;

      // Now add sample properties
      const propertiesResponse = await fetch(`https://${projectId}.supabase.co/functions/v1/make-server-9fbf563b/add-sample-properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      const result = await propertiesResponse.json();
      
      if (propertiesResponse.ok) {
        addMessage('success', `Sample properties added successfully! Created ${result.propertiesCreated || 5} properties.`);
      } else {
        addMessage('info', result.message || 'Sample properties already exist or creation failed');
      }
    } catch (error) {
      addMessage('error', `Error adding sample properties: ${error}`);
    }
  };

  const runFullSetup = async () => {
    setLoading(true);
    setMessages([]);
    
    addMessage('info', 'Starting initial setup...');
    
    await createDeveloperAccount();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Small delay
    await addSampleProperties();
    
    addMessage('success', 'Setup complete! You can now use the admin panel.');
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Initial Setup - Rainbow Properties
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-sm text-gray-600">
            <p>This setup will create:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Developer admin account (developer@rainbowproperties.co.za)</li>
              <li>Sample properties for testing</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <Button onClick={runFullSetup} disabled={loading} className="flex-1">
              {loading ? 'Setting up...' : 'Run Full Setup'}
            </Button>
            <Button onClick={createDeveloperAccount} variant="outline" disabled={loading}>
              <User className="w-4 h-4 mr-2" />
              Create Developer Account Only
            </Button>
            <Button onClick={addSampleProperties} variant="outline" disabled={loading}>
              <Home className="w-4 h-4 mr-2" />
              Add Sample Properties
            </Button>
          </div>

          {messages.length > 0 && (
            <div className="space-y-2">
              {messages.map((msg, index) => (
                <Alert key={index} className={msg.type === 'error' ? 'border-red-500' : msg.type === 'success' ? 'border-green-500' : 'border-blue-500'}>
                  {msg.type === 'error' ? (
                    <AlertCircle className="h-4 w-4" />
                  ) : (
                    <CheckCircle className="h-4 w-4" />
                  )}
                  <AlertDescription className={msg.type === 'error' ? 'text-red-700' : msg.type === 'success' ? 'text-green-700' : 'text-blue-700'}>
                    {msg.message}
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium mb-2">Developer Login Credentials:</h4>
            <div className="text-sm space-y-1">
              <div><strong>Email:</strong> developer@rainbowproperties.co.za</div>
              <div><strong>Password:</strong> RainbowDev2024!</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}