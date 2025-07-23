import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AlertCircle, Bug, Clock, Users } from "lucide-react";
import { format } from "date-fns";

interface SentryIssue {
  id: string;
  title: string;
  culprit: string;
  level: string;
  status: string;
  platform: string;
  isUnhandled: boolean;
  count: string;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  metadata: {
    value: string;
    type: string;
    filename?: string;
    function?: string;
  };
  project: {
    name: string;
    slug: string;
  };
  permalink: string;
}

interface SentryResponse {
  userFeedback: any[];
  unresolvedIssues: SentryIssue[];
  summary: {
    totalFeedback: number;
    totalIssues: number;
  };
}

export default function SentryIssues() {
  const { data, isLoading, error, refetch } = useQuery<SentryResponse>({
    queryKey: ["/api/sentry-feedback"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Sentry Issues Dashboard</h1>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to fetch Sentry issues. Please check your Sentry credentials.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  const { userFeedback, unresolvedIssues, summary } = data;

  // Group issues by type/error
  const groupedIssues = unresolvedIssues.reduce((acc, issue) => {
    const key = issue.metadata.type || 'unknown';
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(issue);
    return acc;
  }, {} as Record<string, SentryIssue[]>);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Sentry Issues Dashboard</h1>
        <p className="text-gray-600">Monitor and resolve user-reported bugs and system errors</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalIssues}</div>
            <p className="text-xs text-muted-foreground">Unresolved errors</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Feedback</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalFeedback}</div>
            <p className="text-xs text-muted-foreground">Reported by users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Updated</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{new Date().toLocaleTimeString()}</div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => refetch()}
            >
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* User Feedback Section */}
      {userFeedback.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">User Feedback</h2>
          <div className="grid gap-4">
            {userFeedback.map((feedback: any) => (
              <Card key={feedback.id}>
                <CardHeader>
                  <CardTitle>{feedback.name || 'Anonymous'}</CardTitle>
                  <CardDescription>{feedback.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{feedback.comments}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Issues Section */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Unresolved Issues</h2>
        
        {Object.entries(groupedIssues).map(([errorType, issues]) => (
          <div key={errorType} className="mb-6">
            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
              <Badge variant="outline">{errorType}</Badge>
              <span className="text-sm text-gray-500">({issues.length} issues)</span>
            </h3>
            
            <div className="grid gap-4">
              {issues.map((issue) => (
                <Card key={issue.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{issue.title}</CardTitle>
                        <CardDescription className="mt-1">
                          <span className="block">{issue.culprit}</span>
                          {issue.metadata.filename && (
                            <span className="block text-xs mt-1">
                              File: {issue.metadata.filename}
                              {issue.metadata.function && ` | Function: ${issue.metadata.function}`}
                            </span>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={issue.level === 'error' ? 'destructive' : 'secondary'}>
                          {issue.level}
                        </Badge>
                        {issue.isUnhandled && (
                          <Badge variant="outline">Unhandled</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Occurrences:</span>
                        <span className="block font-medium">{issue.count}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Users affected:</span>
                        <span className="block font-medium">{issue.userCount}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">First seen:</span>
                        <span className="block font-medium">
                          {format(new Date(issue.firstSeen), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last seen:</span>
                        <span className="block font-medium">
                          {format(new Date(issue.lastSeen), 'MMM d, yyyy')}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(issue.permalink, '_blank')}
                      >
                        View in Sentry
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}