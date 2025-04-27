
import { createContext, useContext, useState, ReactNode } from "react";
import { Document, mockDocuments } from "../data/mockData";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface DocumentContextType {
  documents: Document[];
  loading: boolean;
  uploadDocument: (file: File, sensitivity: 'high' | 'medium' | 'low') => Promise<void>;
  deleteDocument: (id: string) => void;
  getDocumentsBySensitivity: (sensitivity: 'high' | 'medium' | 'low') => Document[];
}

const DocumentContext = createContext<DocumentContextType | undefined>(undefined);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Filter documents by current user
  const userDocuments = user 
    ? documents.filter((doc) => doc.userId === user.id)
    : [];

  const uploadDocument = async (file: File, sensitivity: 'high' | 'medium' | 'low') => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload documents.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    
    // Simulate API call and processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newDocument: Document = {
      id: String(documents.length + 1),
      userId: user.id,
      name: file.name,
      type: file.type,
      size: file.size,
      sensitivity,
      uploadedAt: new Date().toISOString(),
      url: '/placeholder.svg',
    };

    setDocuments([...documents, newDocument]);
    setLoading(false);

    toast({
      title: "Document Uploaded",
      description: `"${file.name}" has been classified as ${sensitivity} sensitivity.`,
    });
  };

  const deleteDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    toast({
      title: "Document Deleted",
      description: "The document has been removed from your vault.",
    });
  };

  const getDocumentsBySensitivity = (sensitivity: 'high' | 'medium' | 'low') => {
    return userDocuments.filter((doc) => doc.sensitivity === sensitivity);
  };

  return (
    <DocumentContext.Provider 
      value={{
        documents: userDocuments,
        loading,
        uploadDocument,
        deleteDocument,
        getDocumentsBySensitivity,
      }}
    >
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (context === undefined) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}
