import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Medal, FileText, Upload, LogOut, Edit } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data
const mockAppeals = [
  { id: "1", participantId: "P1234", name: "John Smith", event: "100m Sprint", status: "new" as const, submittedDate: "2025-11-24" },
  { id: "2", participantId: "P1235", name: "Sarah Johnson", event: "Long Jump", status: "in_review" as const, submittedDate: "2025-11-23" },
  { id: "3", participantId: "P1236", name: "Mike Davis", event: "High Jump", status: "accepted" as const, submittedDate: "2025-11-20" },
];

const mockResults = [
  { id: "1", participantId: "P1234", name: "John Smith", event: "100m Sprint", score: "10.5s", rank: 1, lastUpdated: "2025-11-25" },
  { id: "2", participantId: "P1235", name: "Sarah Johnson", event: "100m Sprint", score: "11.2s", rank: 2, lastUpdated: "2025-11-25" },
];

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Medal className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Results & Appeals Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Administrator
              </Badge>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-3 mb-8">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>Total Results</CardDescription>
              <CardTitle className="text-4xl">247</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Across 12 events</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>Pending Appeals</CardDescription>
              <CardTitle className="text-4xl text-warning">8</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Require review</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>Resolved Appeals</CardDescription>
              <CardTitle className="text-4xl text-success">15</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="appeals" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="appeals">Appeals Management</TabsTrigger>
            <TabsTrigger value="results">Results Management</TabsTrigger>
          </TabsList>

          <TabsContent value="appeals" className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Appeals Queue</CardTitle>
                    <CardDescription>Review and manage submitted appeals</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockAppeals.map((appeal) => (
                        <TableRow key={appeal.id}>
                          <TableCell className="font-medium">{appeal.participantId}</TableCell>
                          <TableCell>{appeal.name}</TableCell>
                          <TableCell>{appeal.event}</TableCell>
                          <TableCell>
                            <StatusBadge status={appeal.status} />
                          </TableCell>
                          <TableCell className="text-muted-foreground">{appeal.submittedDate}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4 mr-2" />
                              Review
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="space-y-4">
            <Card className="shadow-md">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Competition Results</CardTitle>
                    <CardDescription>Manage and update competition results</CardDescription>
                  </div>
                  <Button>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Results
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Participant ID</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Event</TableHead>
                        <TableHead>Score</TableHead>
                        <TableHead>Rank</TableHead>
                        <TableHead>Last Updated</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockResults.map((result) => (
                        <TableRow key={result.id}>
                          <TableCell className="font-medium">{result.participantId}</TableCell>
                          <TableCell>{result.name}</TableCell>
                          <TableCell>{result.event}</TableCell>
                          <TableCell>{result.score}</TableCell>
                          <TableCell>
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                              {result.rank}
                            </span>
                          </TableCell>
                          <TableCell className="text-muted-foreground">{result.lastUpdated}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
