import { useState } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2 } from "lucide-react";

const SubmitAppeal = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    participantId: "",
    eventId: "",
    category: "",
    name: "",
    email: "",
    phone: "",
    reason: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Appeal Submitted Successfully",
        description: "Your appeal has been recorded. You will receive updates via email.",
        action: <CheckCircle2 className="h-5 w-5 text-success" />,
      });
      // Reset form
      setFormData({
        participantId: "",
        eventId: "",
        category: "",
        name: "",
        email: "",
        phone: "",
        reason: "",
      });
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Submit an Appeal</h1>
          <p className="text-muted-foreground">
            If you believe there's an error in your competition results, submit an appeal for review
          </p>
        </div>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Appeal Form</CardTitle>
            <CardDescription>All fields marked with * are required</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="participantId">
                    Participant ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="participantId"
                    name="participantId"
                    placeholder="e.g., P1234"
                    required
                    value={formData.participantId}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventId">
                    Event ID <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="eventId"
                    name="eventId"
                    placeholder="e.g., E100"
                    required
                    value={formData.eventId}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="category"
                  name="category"
                  placeholder="e.g., Under 18 Male"
                  required
                  value={formData.category}
                  onChange={handleChange}
                />
              </div>

              <div className="border-t border-border pt-6">
                <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Full Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="John Smith"
                      required
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">
                      Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="space-y-2 mt-4">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Reason for Appeal <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Please provide a detailed explanation of why you believe the results should be reviewed..."
                  required
                  rows={6}
                  value={formData.reason}
                  onChange={handleChange}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground">
                  Be specific and include any relevant details that support your appeal
                </p>
              </div>

              <div className="bg-muted p-4 rounded-lg flex gap-3">
                <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Important Information</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Appeals are reviewed by an independent committee</li>
                    <li>You will receive status updates via email</li>
                    <li>Review typically takes 3-5 business days</li>
                    <li>Final decisions are binding and conclusive</li>
                  </ul>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Appeal"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default SubmitAppeal;
