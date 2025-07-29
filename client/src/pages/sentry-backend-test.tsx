import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function SentryBackendTest() {
  const [testResults, setTestResults] = useState<{
    success?: any;
    error?: any;
    loading?: boolean;
  }>({});

  const testBackendSentry = async (endpoint: string) => {
    setTestResults({ loading: true });
    
    try {
      const response = await fetch(`/api/sentry/${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setTestResults({ success: data });
      } else {
        setTestResults({ error: data });
      }
    } catch (error) {
      setTestResults({ error: { message: (error as Error).message } });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Backend Sentry Integration Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Success Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Tests successful event capture to talencor-backend Sentry project
            </p>
            <Button 
              onClick={() => testBackendSentry('backend-test')}
              disabled={testResults.loading}
              className="w-full"
            >
              {testResults.loading ? 'Testing...' : 'Test Success Event'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Error Test</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Tests error capture to talencor-backend Sentry project
            </p>
            <Button 
              onClick={() => testBackendSentry('backend-test-error')}
              disabled={testResults.loading}
              variant="destructive"
              className="w-full"
            >
              {testResults.loading ? 'Testing...' : 'Test Error Event'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {testResults.success && (
        <Alert className="mt-6 border-green-200 bg-green-50">
          <AlertDescription>
            <strong>Success!</strong> Backend Sentry integration is working correctly.
            <pre className="mt-2 text-xs bg-white p-2 rounded border">
              {JSON.stringify(testResults.success, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      {testResults.error && (
        <Alert className="mt-6 border-red-200 bg-red-50">
          <AlertDescription>
            <strong>Test Result:</strong> Error event sent to backend Sentry project.
            <pre className="mt-2 text-xs bg-white p-2 rounded border">
              {JSON.stringify(testResults.error, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )}

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click the buttons above to test the backend Sentry integration</li>
            <li>Check your Sentry dashboard for the talencor-backend project (ID: 4509576795521024)</li>
            <li>Success events will appear as messages in the Issues section</li>
            <li>Error events will appear as errors in the Issues section</li>
            <li>Both should contain detailed context about the backend environment</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}