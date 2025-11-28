import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
interface ResultFormData {
  participantId: string;
  name: string;
  event: string;
  category: string;
  time: string;
  rank: string;
  points: string;
}
interface AddResultDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (result: ResultFormData) => void;
  editData?: ResultFormData & {
    id: string;
  };
}
export const AddResultDialog = ({
  open,
  onOpenChange,
  onConfirm,
  editData
}: AddResultDialogProps) => {
  const [formData, setFormData] = useState<ResultFormData>({
    participantId: editData?.participantId || "",
    name: editData?.name || "",
    event: editData?.event || "",
    category: editData?.category || "",
    time: editData?.time || "",
    rank: editData?.rank || "",
    points: editData?.points || ""
  });
  const handleChange = (field: keyof ResultFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
    handleClose();
  };
  const handleClose = () => {
    setFormData({
      participantId: "",
      name: "",
      event: "",
      category: "",
      time: "",
      rank: "",
      points: ""
    });
    onOpenChange(false);
  };
  const isValid = formData.participantId && formData.name && formData.event && formData.category;
  return <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{editData ? "Edit Result" : "Add New Result"}</DialogTitle>
          <DialogDescription>
            Enter the competition result details manually
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="participantId">Participant ID *</Label>
              <Input id="participantId" value={formData.participantId} onChange={e => handleChange("participantId", e.target.value)} required placeholder="e.g. BK1234" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Participant Name *</Label>
              <Input id="name" value={formData.name} onChange={e => handleChange("name", e.target.value)} placeholder="e.g. John Smith" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="event">Event *</Label>
              <Input id="event" value={formData.event} onChange={e => handleChange("event", e.target.value)} required placeholder="e.g. Bible Reading" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Input id="category" value={formData.category} onChange={e => handleChange("category", e.target.value)} required placeholder="e.g. LP, UP, HS, HSS, " />
            </div>

            

            <div className="space-y-2">
              <Label htmlFor="rank">Rank</Label>
              <Input id="rank" type="number" value={formData.rank} onChange={e => handleChange("rank", e.target.value)} placeholder="e.g. 1" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input id="points" type="number" value={formData.points} onChange={e => handleChange("points", e.target.value)} placeholder="e.g. 100" />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={!isValid}>
              <Plus className="h-4 w-4 mr-2" />
              {editData ? "Update Result" : "Add Result"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>;
};