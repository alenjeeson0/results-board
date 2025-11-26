import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";

// Mock data - will be replaced with real database queries
const mockResults = [
  { id: "1", participantId: "P1234", name: "John Smith", event: "100m Sprint", category: "Under 18 Male", score: "10.5s", rank: 1 },
  { id: "2", participantId: "P1235", name: "Sarah Johnson", event: "100m Sprint", category: "Under 18 Female", score: "11.2s", rank: 2 },
  { id: "3", participantId: "P1236", name: "Mike Davis", event: "Long Jump", category: "Under 16 Male", score: "6.5m", rank: 1 },
];

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const filteredResults = mockResults.filter(result => {
    const matchesSearch = result.participantId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEvent = !selectedEvent || result.event === selectedEvent;
    const matchesCategory = !selectedCategory || result.category === selectedCategory;
    return matchesSearch && matchesEvent && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Competition Results</h1>
          <p className="text-muted-foreground">Search for participant results by ID, name, event, or category</p>
        </div>

        <Card className="mb-8 shadow-md">
          <CardHeader>
            <CardTitle>Search Results</CardTitle>
            <CardDescription>Enter participant ID or name to find results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Participant ID or Name</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="event">Event (Optional)</Label>
                <Input
                  id="event"
                  placeholder="e.g., 100m Sprint"
                  value={selectedEvent}
                  onChange={(e) => setSelectedEvent(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category (Optional)</Label>
                <Input
                  id="category"
                  placeholder="e.g., Under 18 Male"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              {filteredResults.length} result(s) found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredResults.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.participantId}</TableCell>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>{result.event}</TableCell>
                        <TableCell>{result.category}</TableCell>
                        <TableCell>{result.score}</TableCell>
                        <TableCell>
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                            {result.rank}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No results found. Try adjusting your search.</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Disagree with your results?</p>
          <Button asChild>
            <Link to="/submit-appeal">Submit an Appeal</Link>
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Results;
