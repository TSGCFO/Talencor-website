import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare, 
  Bug, 
  User, 
  Calendar,
  Search,
  RefreshCw,
  ExternalLink,
  Archive
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

interface SentryIssue {
  id: string;
  title: string;
  shortId: string;
  status: string;
  level: string;
  permalink: string;
  metadata?: any;
  type: "issue" | "feedback";
  count?: number;
  firstSeen?: string;
  lastSeen?: string;
  culprit?: string;
}

interface SentryFeedback {
  id: string;
  name: string;
  email: string;
  comments: string;
  dateCreated: string;
  eventId: string;
  url?: string;
}

interface FeedbackSummary {
  organization: string;
  project: string;
  projectId: string;
  userFeedback: {
    total: number;
    open: number;
    resolved: number;
    reports: SentryFeedback[];
  };
  status: string;
}

export function SentryDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIssues, setSelectedIssues] = useState<Set<string>>(new Set());
  const [resolveComment, setResolveComment] = useState("");

  // Fetch actual Sentry issues
  const { data: issuesData, isLoading: issuesLoading, refetch: refetchIssues } = useQuery({
    queryKey: ["/api/sentry/actual/issues"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Fetch feedback summary
  const { data: feedbackData, isLoading: feedbackLoading, refetch: refetchFeedback } = useQuery({
    queryKey: ["/api/sentry/feedback-summary"],
    refetchInterval: 30000,
  });

  // Resolve single issue mutation
  const resolveIssueMutation = useMutation({
    mutationFn: async ({ issueId, comment }: { issueId: string; comment?: string }) => {
      return apiRequest(`/api/sentry/actual/issues/${issueId}/resolve`, {
        method: "PATCH",
        body: JSON.stringify({ status: "resolved", comment }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sentry/actual/issues"] });
      setSelectedIssues(new Set());
      setResolveComment("");
    },
  });

  // Bulk resolve mutation
  const bulkResolveMutation = useMutation({
    mutationFn: async ({ issueIds, comment }: { issueIds: string[]; comment?: string }) => {
      return apiRequest("/api/sentry/actual/issues/bulk-resolve", {
        method: "POST",
        body: JSON.stringify({ issueIds, comment }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sentry/actual/issues"] });
      setSelectedIssues(new Set());
      setResolveComment("");
    },
  });

  const issues = issuesData?.issues || [];
  const feedback = feedbackData as FeedbackSummary;

  // Filter issues based on search
  const filteredIssues = issues.filter((issue: SentryIssue) =>
    issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    issue.shortId?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const unresolvedIssues = filteredIssues.filter((issue: SentryIssue) => issue.status === "unresolved");
  const feedbackIssues = filteredIssues.filter((issue: SentryIssue) => issue.type === "feedback");
  const errorIssues = filteredIssues.filter((issue: SentryIssue) => issue.type === "issue");

  const handleToggleSelect = (issueId: string) => {
    const newSelected = new Set(selectedIssues);
    if (newSelected.has(issueId)) {
      newSelected.delete(issueId);
    } else {
      newSelected.add(issueId);
    }
    setSelectedIssues(newSelected);
  };

  const handleBulkResolve = () => {
    if (selectedIssues.size > 0) {
      bulkResolveMutation.mutate({
        issueIds: Array.from(selectedIssues),
        comment: resolveComment,
      });
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "error": return "destructive";
      case "warning": return "warning";
      case "info": return "info";
      default: return "default";
    }
  };

  if (issuesLoading || feedbackLoading) {
    return (
      <div className="container mx-auto py-8 px-4 space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sentry Dashboard</h1>
            <p className="text-muted-foreground">Monitor and manage issues and user feedback</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                refetchIssues();
                refetchFeedback();
              }}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            {selectedIssues.size > 0 && (
              <Button
                onClick={handleBulkResolve}
                disabled={bulkResolveMutation.isPending}
                size="sm"
              >
                <Archive className="h-4 w-4 mr-2" />
                Resolve {selectedIssues.size} Issues
              </Button>
            )}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Issues</CardTitle>
              <Bug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{issues.length}</div>
              <p className="text-xs text-muted-foreground">
                {unresolvedIssues.length} unresolved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Error Issues</CardTitle>
              <AlertCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{errorIssues.length}</div>
              <p className="text-xs text-muted-foreground">Application errors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">User Feedback</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedbackIssues.length}</div>
              <p className="text-xs text-muted-foreground">User reports</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Feedback Reports</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{feedback?.userFeedback?.total || 0}</div>
              <p className="text-xs text-muted-foreground">Total user reports</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search issues by title or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          {selectedIssues.size > 0 && (
            <div className="flex gap-2 items-end">
              <Textarea
                placeholder="Add a comment for resolution..."
                value={resolveComment}
                onChange={(e) => setResolveComment(e.target.value)}
                className="min-w-[300px] h-10"
                rows={1}
              />
            </div>
          )}
        </div>

        {/* Issues and Feedback Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">All Issues ({filteredIssues.length})</TabsTrigger>
            <TabsTrigger value="errors">Errors ({errorIssues.length})</TabsTrigger>
            <TabsTrigger value="feedback">Feedback ({feedbackIssues.length})</TabsTrigger>
            <TabsTrigger value="reports">User Reports ({feedback?.userFeedback?.total || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredIssues.length === 0 ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>No issues found</AlertTitle>
                <AlertDescription>
                  {searchTerm ? "No issues match your search criteria." : "Great! No issues to display."}
                </AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {filteredIssues.map((issue: SentryIssue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isSelected={selectedIssues.has(issue.id)}
                    onToggleSelect={handleToggleSelect}
                    onResolve={(id) => resolveIssueMutation.mutate({ issueId: id })}
                    getLevelColor={getLevelColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="errors" className="space-y-4">
            {errorIssues.length === 0 ? (
              <Alert>
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>No error issues</AlertTitle>
                <AlertDescription>No application errors to display.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {errorIssues.map((issue: SentryIssue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isSelected={selectedIssues.has(issue.id)}
                    onToggleSelect={handleToggleSelect}
                    onResolve={(id) => resolveIssueMutation.mutate({ issueId: id })}
                    getLevelColor={getLevelColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-4">
            {feedbackIssues.length === 0 ? (
              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertTitle>No feedback issues</AlertTitle>
                <AlertDescription>No user feedback issues to display.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-2">
                {feedbackIssues.map((issue: SentryIssue) => (
                  <IssueCard
                    key={issue.id}
                    issue={issue}
                    isSelected={selectedIssues.has(issue.id)}
                    onToggleSelect={handleToggleSelect}
                    onResolve={(id) => resolveIssueMutation.mutate({ issueId: id })}
                    getLevelColor={getLevelColor}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            {!feedback?.userFeedback?.reports || feedback.userFeedback.reports.length === 0 ? (
              <Alert>
                <MessageSquare className="h-4 w-4" />
                <AlertTitle>No user reports</AlertTitle>
                <AlertDescription>No user feedback reports have been submitted.</AlertDescription>
              </Alert>
            ) : (
              <div className="space-y-4">
                {feedback.userFeedback.reports.map((report: SentryFeedback) => (
                  <Card key={report.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{report.name || "Anonymous"}</CardTitle>
                          <CardDescription className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            {report.email || "No email provided"}
                            <span className="text-muted-foreground">•</span>
                            <Calendar className="h-3 w-3" />
                            {format(new Date(report.dateCreated), "PPp")}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">User Report</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-2">{report.comments}</p>
                      {report.url && (
                        <p className="text-xs text-muted-foreground">
                          Page: <a href={report.url} className="underline">{report.url}</a>
                        </p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

interface IssueCardProps {
  issue: SentryIssue;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onResolve: (id: string) => void;
  getLevelColor: (level: string) => string;
}

function IssueCard({ issue, isSelected, onToggleSelect, onResolve, getLevelColor }: IssueCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className={`transition-all ${isSelected ? "ring-2 ring-primary" : ""}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => onToggleSelect(issue.id)}
                className="mt-1"
              />
              <div className="flex-1">
                <CardTitle className="text-base leading-tight">{issue.title}</CardTitle>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <Badge variant={getLevelColor(issue.level)}>
                    {issue.level}
                  </Badge>
                  <Badge variant="outline">{issue.type}</Badge>
                  {issue.shortId && (
                    <span className="text-xs text-muted-foreground">ID: {issue.shortId}</span>
                  )}
                  {issue.culprit && (
                    <span className="text-xs text-muted-foreground">{issue.culprit}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {issue.permalink && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(issue.permalink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              )}
              {issue.status === "unresolved" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onResolve(issue.id)}
                >
                  Resolve
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        {(issue.firstSeen || issue.lastSeen || issue.count) && (
          <CardContent className="pt-0">
            <div className="flex gap-4 text-xs text-muted-foreground">
              {issue.count && <span>Occurrences: {issue.count}</span>}
              {issue.firstSeen && <span>First seen: {format(new Date(issue.firstSeen), "PP")}</span>}
              {issue.lastSeen && <span>Last seen: {format(new Date(issue.lastSeen), "PP")}</span>}
            </div>
          </CardContent>
        )}
      </Card>
    </motion.div>
  );
}