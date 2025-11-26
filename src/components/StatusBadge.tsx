import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "new" | "in_review" | "accepted" | "rejected";
  className?: string;
}

const statusConfig = {
  new: {
    label: "New",
    className: "bg-muted text-muted-foreground border-border",
  },
  in_review: {
    label: "In Review",
    className: "bg-warning/10 text-warning border-warning/20",
  },
  accepted: {
    label: "Accepted",
    className: "bg-success/10 text-success border-success/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(config.className, "font-medium", className)}
    >
      {config.label}
    </Badge>
  );
};
