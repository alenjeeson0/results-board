import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Medal, Plus, LogOut, Edit, Trash2 } from "lucide-react";
import { AddResultDialog } from "@/components/AddResultDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<any>(null);
  const [deletingResultId, setDeletingResultId] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    const checkAdminAccess = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session) {
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "Please sign in to access the admin portal."
          });
          navigate("/admin");
          return;
        }

        // Check if user has admin role
        const {
          data: roles,
          error
        } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'admin').maybeSingle();
        if (error || !roles) {
          await supabase.auth.signOut();
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "Admin privileges required."
          });
          navigate("/admin");
          return;
        }
        setIsAdmin(true);
        fetchResults();
      } catch (error) {
        console.error("Auth check error:", error);
        navigate("/admin");
      } finally {
        setIsLoading(false);
      }
    };
    checkAdminAccess();

    // Listen for auth changes
    const {
      data: {
        subscription
      }
    } = supabase.auth.onAuthStateChange(event => {
      if (event === 'SIGNED_OUT') {
        navigate("/admin");
      }
    });
    return () => subscription.unsubscribe();
  }, [navigate, toast]);
  const fetchResults = async () => {
    const {
      data,
      error
    } = await supabase.from('results').select('*').order('created_at', {
      ascending: false
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load results."
      });
      return;
    }
    setResults(data || []);
  };
  const handleAddResult = async (formData: any) => {
    const {
      error
    } = await supabase.from('results').insert({
      participant_id: formData.participantId,
      participant_name: formData.name,
      event: formData.event,
      category: formData.category,
      time: formData.time || null,
      rank: formData.rank ? parseInt(formData.rank) : null,
      points: formData.points ? parseInt(formData.points) : null,
      status: 'confirmed'
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add result."
      });
      return;
    }
    toast({
      title: "Success",
      description: "Result added successfully."
    });
    fetchResults();
  };
  const handleEditResult = async (formData: any) => {
    if (!editingResult) return;
    const {
      error
    } = await supabase.from('results').update({
      participant_id: formData.participantId,
      participant_name: formData.name,
      event: formData.event,
      category: formData.category,
      time: formData.time || null,
      rank: formData.rank ? parseInt(formData.rank) : null,
      points: formData.points ? parseInt(formData.points) : null
    }).eq('id', editingResult.id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update result."
      });
      return;
    }
    toast({
      title: "Success",
      description: "Result updated successfully."
    });
    setEditingResult(null);
    fetchResults();
  };
  const handleDeleteResult = async (id: string) => {
    const {
      error
    } = await supabase.from('results').delete().eq('id', id);
    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete result."
      });
      return;
    }
    toast({
      title: "Success",
      description: "Result deleted successfully."
    });
    setDeletingResultId(null);
    fetchResults();
  };
  const openEditDialog = (result: any) => {
    setEditingResult({
      id: result.id,
      participantId: result.participant_id,
      name: result.participant_name,
      event: result.event,
      category: result.category,
      time: result.time || "",
      rank: result.rank?.toString() || "",
      points: result.points?.toString() || ""
    });
    setDialogOpen(true);
  };
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed out",
      description: "You have been signed out successfully."
    });
    navigate("/admin");
  };
  if (isLoading) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>;
  }
  if (!isAdmin) {
    return null;
  }
  return <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Medal className="h-8 w-8 text-primary" />
              <div>
              <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Results Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                Administrator
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>Total Results</CardDescription>
              <CardTitle className="text-4xl">{results.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Competition results stored</p>
            </CardContent>
          </Card>
          <Card className="shadow-md">
            <CardHeader className="pb-3">
              <CardDescription>Recent Updates</CardDescription>
              <CardTitle className="text-4xl text-primary">
                {results.filter(r => {
                const date = new Date(r.created_at);
                const today = new Date();
                return date.toDateString() === today.toDateString();
              }).length}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Added today</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Competition Results</CardTitle>
                <CardDescription>Manage and update competition results</CardDescription>
              </div>
              <Button onClick={() => {
              setEditingResult(null);
              setDialogOpen(true);
            }}>
                <Plus className="h-4 w-4 mr-2" />
                Add Result
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
                    <TableHead>Category</TableHead>
                    
                    <TableHead>Rank</TableHead>
                    <TableHead>Points</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.length === 0 ? <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No results yet. Click "Add Result" to get started.
                      </TableCell>
                    </TableRow> : results.map(result => <TableRow key={result.id}>
                        <TableCell className="font-medium">{result.participant_id}</TableCell>
                        <TableCell>{result.participant_name}</TableCell>
                        <TableCell>{result.event}</TableCell>
                        <TableCell>{result.category}</TableCell>
                        <TableCell>{result.time || "-"}</TableCell>
                        <TableCell>
                          {result.rank ? <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                              {result.rank}
                            </span> : "-"}
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={() => openEditDialog(result)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => setDeletingResultId(result.id)} className="text-destructive hover:text-destructive">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <AddResultDialog open={dialogOpen} onOpenChange={open => {
      setDialogOpen(open);
      if (!open) setEditingResult(null);
    }} onConfirm={editingResult ? handleEditResult : handleAddResult} editData={editingResult} />

      <AlertDialog open={!!deletingResultId} onOpenChange={() => setDeletingResultId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Result</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this result? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deletingResultId && handleDeleteResult(deletingResultId)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};
export default AdminDashboard;