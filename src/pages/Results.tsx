import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText } from "lucide-react";
import { Link } from "react-router-dom";

interface Result {
  id: string;
  participant_id: string;
  participant_name: string;
  event: string;
  category: string;
  time: string | null;
  rank: number | null;
  points: number | null;
  status: string;
}

const Results = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResults();
  }, [searchTerm, selectedEvent, selectedCategory]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedEvent) params.append('event', selectedEvent);
      if (selectedCategory) params.append('category', selectedCategory);

      const queryString = params.toString();
      const baseUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-results`;
      const url = queryString ? `${baseUrl}?${queryString}` : baseUrl;

      const response = await fetch(url, {
        headers: {
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch results');
      
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error('Error fetching results:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

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
              {loading ? 'Loading...' : `${results.length} result(s) found`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading results...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Participant ID</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Event</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Rank</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {results.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.participant_id}</TableCell>
                        <TableCell>{result.participant_name}</TableCell>
                        <TableCell>{result.event}</TableCell>
                        <TableCell>{result.category}</TableCell>
                        <TableCell>{result.time || '-'}</TableCell>
                        <TableCell>
                          {result.rank ? (
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                              {result.rank}
                            </span>
                          ) : '-'}
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
