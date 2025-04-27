
import { useState } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { File, Trash2, Eye, Upload, AlertTriangle, FileCheck, FileLock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { documents, deleteDocument, getDocumentsBySensitivity } = useDocuments();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [viewDocument, setViewDocument] = useState<string | null>(null);

  const highSensitivityDocs = getDocumentsBySensitivity("high");
  const mediumSensitivityDocs = getDocumentsBySensitivity("medium");
  const lowSensitivityDocs = getDocumentsBySensitivity("low");

  const handleDelete = (id: string) => {
    deleteDocument(id);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getSensitivityIcon = (sensitivity: string) => {
    switch (sensitivity) {
      case "high":
        return <AlertTriangle className="text-sensitivity-high" size={16} />;
      case "medium":
        return <FileLock className="text-sensitivity-medium" size={16} />;
      case "low":
        return <FileCheck className="text-sensitivity-low" size={16} />;
      default:
        return <File size={16} />;
    }
  };

  const documentToDisplay = documents.find(doc => doc.id === viewDocument);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Document Vault</h1>
            <p className="text-gray-500">
              {documents.length} document{documents.length !== 1 && "s"} in your vault
            </p>
          </div>
          <Button
            onClick={() => navigate("/upload")}
            className="bg-vault-primary hover:bg-vault-secondary"
          >
            <Upload className="mr-2" size={16} />
            Upload Document
          </Button>
        </div>

        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8 w-full md:w-auto">
            <TabsTrigger value="all">All ({documents.length})</TabsTrigger>
            <TabsTrigger value="high">
              High ({highSensitivityDocs.length})
            </TabsTrigger>
            <TabsTrigger value="medium">
              Medium ({mediumSensitivityDocs.length})
            </TabsTrigger>
            <TabsTrigger value="low">
              Low ({lowSensitivityDocs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {documents.length === 0 ? (
              <EmptyState />
            ) : (
              <DocumentTable
                documents={documents}
                onView={setViewDocument}
                onDelete={handleDelete}
                getSensitivityIcon={getSensitivityIcon}
                formatBytes={formatBytes}
              />
            )}
          </TabsContent>

          <TabsContent value="high" className="space-y-4">
            {highSensitivityDocs.length === 0 ? (
              <EmptyState sensitivity="high" />
            ) : (
              <DocumentTable
                documents={highSensitivityDocs}
                onView={setViewDocument}
                onDelete={handleDelete}
                getSensitivityIcon={getSensitivityIcon}
                formatBytes={formatBytes}
              />
            )}
          </TabsContent>

          <TabsContent value="medium" className="space-y-4">
            {mediumSensitivityDocs.length === 0 ? (
              <EmptyState sensitivity="medium" />
            ) : (
              <DocumentTable
                documents={mediumSensitivityDocs}
                onView={setViewDocument}
                onDelete={handleDelete}
                getSensitivityIcon={getSensitivityIcon}
                formatBytes={formatBytes}
              />
            )}
          </TabsContent>

          <TabsContent value="low" className="space-y-4">
            {lowSensitivityDocs.length === 0 ? (
              <EmptyState sensitivity="low" />
            ) : (
              <DocumentTable
                documents={lowSensitivityDocs}
                onView={setViewDocument}
                onDelete={handleDelete}
                getSensitivityIcon={getSensitivityIcon}
                formatBytes={formatBytes}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Document Viewer Dialog */}
      <Dialog open={!!viewDocument} onOpenChange={() => setViewDocument(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{documentToDisplay?.name}</DialogTitle>
            <DialogDescription>
              {documentToDisplay && (
                <div className="flex items-center gap-2 mt-2">
                  {getSensitivityIcon(documentToDisplay.sensitivity)}
                  <span className="capitalize">{documentToDisplay.sensitivity}</span> Sensitivity
                </div>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-100 rounded-md p-4 flex items-center justify-center h-96">
            <img
              src={documentToDisplay?.url || "/placeholder.svg"}
              alt="Document preview"
              className="max-h-full"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setViewDocument(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppLayout>
  );
}

function EmptyState({ sensitivity }: { sensitivity?: string }) {
  return (
    <Card className="border-dashed">
      <CardContent className="p-8 flex flex-col items-center justify-center text-center">
        <File className="text-gray-400 mb-4" size={48} />
        <h3 className="text-lg font-medium mb-2">No documents found</h3>
        <p className="text-gray-500 mb-4">
          {sensitivity
            ? `You don't have any ${sensitivity} sensitivity documents yet.`
            : "You haven't uploaded any documents yet."}
        </p>
      </CardContent>
    </Card>
  );
}

function DocumentTable({
  documents,
  onView,
  onDelete,
  getSensitivityIcon,
  formatBytes,
}: {
  documents: any[];
  onView: (id: string) => void;
  onDelete: (id: string) => void;
  getSensitivityIcon: (sensitivity: string) => JSX.Element;
  formatBytes: (bytes: number) => string;
}) {
  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 text-sm">
            <tr>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Sensitivity</th>
              <th className="py-3 px-4 text-left">Size</th>
              <th className="py-3 px-4 text-left">Uploaded</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm">
                  <div className="flex items-center">
                    <File className="mr-2 text-gray-500" size={16} />
                    <span className="font-medium">{doc.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex items-center">
                    {getSensitivityIcon(doc.sensitivity)}
                    <span
                      className={`ml-1 capitalize ${
                        doc.sensitivity === "high"
                          ? "text-sensitivity-high"
                          : doc.sensitivity === "medium"
                          ? "text-sensitivity-medium"
                          : "text-sensitivity-low"
                      }`}
                    >
                      {doc.sensitivity}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm">{formatBytes(doc.size)}</td>
                <td className="py-3 px-4 text-sm">
                  {formatDistanceToNow(new Date(doc.uploadedAt), {
                    addSuffix: true,
                  })}
                </td>
                <td className="py-3 px-4 text-sm">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onView(doc.id)}
                    >
                      <Eye size={14} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(doc.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
