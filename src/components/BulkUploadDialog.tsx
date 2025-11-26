import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, AlertCircle, CheckCircle, X } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import Papa from "papaparse";
import * as XLSX from "xlsx";

interface ResultRow {
  participantId: string;
  name: string;
  event: string;
  score: string;
  rank: number;
  errors?: string[];
}

interface BulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (results: ResultRow[]) => void;
}

export const BulkUploadDialog = ({ open, onOpenChange, onConfirm }: BulkUploadDialogProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ResultRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [step, setStep] = useState<"upload" | "preview">("upload");

  const validateRow = (row: any, index: number): { data: ResultRow | null; errors: string[] } => {
    const rowErrors: string[] = [];
    
    if (!row.participantId?.trim()) rowErrors.push(`Row ${index + 1}: Participant ID is required`);
    if (!row.name?.trim()) rowErrors.push(`Row ${index + 1}: Name is required`);
    if (!row.event?.trim()) rowErrors.push(`Row ${index + 1}: Event is required`);
    if (!row.score?.trim()) rowErrors.push(`Row ${index + 1}: Score is required`);
    if (!row.rank || isNaN(Number(row.rank))) rowErrors.push(`Row ${index + 1}: Valid rank number is required`);

    if (rowErrors.length > 0) {
      return { data: null, errors: rowErrors };
    }

    return {
      data: {
        participantId: row.participantId.trim(),
        name: row.name.trim(),
        event: row.event.trim(),
        score: row.score.trim(),
        rank: Number(row.rank),
      },
      errors: [],
    };
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setErrors([]);
    setParsedData([]);

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();

    if (fileExtension === "csv") {
      parseCSV(selectedFile);
    } else if (fileExtension === "xlsx" || fileExtension === "xls") {
      parseExcel(selectedFile);
    } else {
      setErrors(["Unsupported file format. Please upload a CSV or Excel file."]);
    }
  };

  const parseCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        processData(results.data);
      },
      error: (error) => {
        setErrors([`CSV parsing error: ${error.message}`]);
      },
    });
  };

  const parseExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet);
        processData(jsonData);
      } catch (error) {
        setErrors([`Excel parsing error: ${(error as Error).message}`]);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const processData = (data: any[]) => {
    const validData: ResultRow[] = [];
    const allErrors: string[] = [];

    data.forEach((row, index) => {
      const { data: validRow, errors: rowErrors } = validateRow(row, index);
      if (validRow) {
        validData.push(validRow);
      }
      if (rowErrors.length > 0) {
        allErrors.push(...rowErrors);
      }
    });

    if (validData.length === 0 && allErrors.length > 0) {
      setErrors(allErrors);
      return;
    }

    setParsedData(validData);
    setErrors(allErrors);
    setStep("preview");
  };

  const handleConfirm = () => {
    onConfirm(parsedData);
    handleClose();
  };

  const handleClose = () => {
    setFile(null);
    setParsedData([]);
    setErrors([]);
    setStep("upload");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Bulk Upload Results</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file with competition results. Required columns: participantId, name, event, score, rank
          </DialogDescription>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm font-medium mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">CSV or Excel files only</p>
              </label>
            </div>

            {file && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  Processing: {file.name}
                </AlertDescription>
              </Alert>
            )}

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-2">Validation Errors:</div>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {errors.slice(0, 10).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                    {errors.length > 10 && (
                      <li className="text-muted-foreground">... and {errors.length - 10} more errors</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-xs">
              <p className="font-semibold text-foreground">Expected Format:</p>
              <code className="block bg-background p-2 rounded">
                participantId, name, event, score, rank<br />
                P1234, John Smith, 100m Sprint, 10.5s, 1<br />
                P1235, Sarah Johnson, Long Jump, 6.2m, 2
              </code>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Alert className="flex-1">
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  {parsedData.length} valid records found
                  {errors.length > 0 && ` (${errors.length} rows with errors were skipped)`}
                </AlertDescription>
              </Alert>
            </div>

            {errors.length > 0 && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-1">Skipped rows with errors:</div>
                  <ul className="list-disc list-inside space-y-1 text-xs max-h-20 overflow-y-auto">
                    {errors.slice(0, 5).map((error, i) => (
                      <li key={i}>{error}</li>
                    ))}
                    {errors.length > 5 && (
                      <li className="text-muted-foreground">... and {errors.length - 5} more</li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            <ScrollArea className="h-[300px] rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Participant ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Event</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Rank</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {parsedData.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.participantId}</TableCell>
                      <TableCell>{row.name}</TableCell>
                      <TableCell>{row.event}</TableCell>
                      <TableCell>{row.score}</TableCell>
                      <TableCell>{row.rank}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => setStep("upload")}>
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleConfirm}>
                <Upload className="h-4 w-4 mr-2" />
                Import {parsedData.length} Results
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
