import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
const AdminLogin = () => {
  const navigate = useNavigate();
  const {
    toast
  } = useToast();
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [credentials, setCredentials] = useState({
    email: "",
    password: ""
  });
  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const {
        data: {
          session
        }
      } = await supabase.auth.getSession();
      if (session) {
        // Check if user has admin role
        const {
          data: roles
        } = await supabase.from('user_roles').select('role').eq('user_id', session.user.id).eq('role', 'admin').maybeSingle();
        if (roles) {
          navigate("/admin/dashboard");
        }
      }
    };
    checkAuth();
  }, [navigate]);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isSignUp) {
        // Sign up new user
        const {
          data,
          error
        } = await supabase.auth.signUp({
          email: credentials.email,
          password: credentials.password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin/dashboard`
          }
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "You can now sign in with your credentials."
        });
        setIsSignUp(false);
      } else {
        // Sign in existing user
        const {
          data,
          error
        } = await supabase.auth.signInWithPassword({
          email: credentials.email,
          password: credentials.password
        });
        if (error) throw error;

        // Check if user has admin role
        const {
          data: roles
        } = await supabase.from('user_roles').select('role').eq('user_id', data.user.id).eq('role', 'admin').maybeSingle();
        if (!roles) {
          await supabase.auth.signOut();
          throw new Error("Access denied. Admin privileges required.");
        }
        toast({
          title: "Welcome back!",
          description: "Successfully signed in to admin portal."
        });
        navigate("/admin/dashboard");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: error.message || "Please check your credentials and try again."
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16 max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl">
                {isSignUp ? "Create Admin Account" : "Admin Login"}
              </CardTitle>
              <CardDescription>
                {isSignUp ? "Create a new admin account to access the portal" : "Access the administrative portal to manage results and appeals"}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" required value={credentials.email} onChange={e => setCredentials(prev => ({
                ...prev,
                email: e.target.value
              }))} placeholder="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={credentials.password} onChange={e => setCredentials(prev => ({
                ...prev,
                password: e.target.value
              }))} placeholder="password" />
              </div>
              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
              </Button>
              
            </form>
          </CardContent>
        </Card>
      </main>
    </div>;
};
export default AdminLogin;