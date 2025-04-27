
import { useState, useRef } from "react";
import { useDocuments } from "@/contexts/DocumentContext";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Upload, File, AlertTriangle, FileLock, FileCheck } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [sensitivity, setSensitivity] = useState<"high" | "medium" | "low">("medium");
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const { uploadDocument } = useDocuments();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
    
    // Simulate processing and classification
    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);
      
      await uploadDocument(selectedFile, sensitivity);
      
      setTimeout(() => {
        setIsUploading(false);
        navigate("/");
      }, 500);
    }, 3000);
  };

  const getSensitivityDescription = (level: string) => {
    switch (level) {
      case "high":
        return "For highly confidential documents (e.g., Aadhaar, passports, medical records)";
      case "medium":
        return "For sensitive documents (e.g., utility bills, bank statements)";
      case "low":
        return "For non-sensitive documents (e.g., public certificates, brochures)";
      default:
        return "";
    }
  };

  const getSensitivityIcon = (level: string) => {
    switch (level) {
      case "high":
        return <AlertTriangle className="text-sensitivity-high" size={16} />;
      case "medium":
        return <FileLock className="text-sensitivity-medium" size={16} />;
      case "low":
        return <FileCheck className="text-sensitivity-low" size={16} />;
      default:
        return null;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Upload Document</h1>
          <p className="text-gray-500">
            Upload a document to be classified and securely stored
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <Card>
              <CardContent className="p-6">
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center ${
                    isDragging ? "border-vault-primary bg-blue-50" : "border-gray-200"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="application/pdf,image/*"
                  />

                  {selectedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <File className="text-vault-primary" size={48} />
                      </div>
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-gray-500">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                      >
                        Change file
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center">
                        <Upload className="text-gray-400" size={48} />
                      </div>
                      <div>
                        <p className="font-medium">Click or drag file to upload</p>
                        <p className="text-sm text-gray-500">
                          Supports PDF, JPG, PNG files
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {isUploading && (
                  <div className="mt-6 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <Progress value={uploadProgress} className="h-2" />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h3 className="font-medium mb-2">Document Sensitivity</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Select the sensitivity level for this document
                  </p>

                  <RadioGroup
                    value={sensitivity}
                    onValueChange={(value) => setSensitivity(value as "high" | "medium" | "low")}
                    className="space-y-4"
                  >
                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="high" id="high" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label 
                          htmlFor="high" 
                          className="flex items-center gap-1 text-sensitivity-high font-medium"
                        >
                          <AlertTriangle size={14} /> High Sensitivity
                        </Label>
                        <p className="text-sm text-gray-500">
                          {getSensitivityDescription("high")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="medium" id="medium" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label 
                          htmlFor="medium" 
                          className="flex items-center gap-1 text-sensitivity-medium font-medium"
                        >
                          <FileLock size={14} /> Medium Sensitivity
                        </Label>
                        <p className="text-sm text-gray-500">
                          {getSensitivityDescription("medium")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-2">
                      <RadioGroupItem value="low" id="low" className="mt-1" />
                      <div className="grid gap-1.5">
                        <Label 
                          htmlFor="low" 
                          className="flex items-center gap-1 text-sensitivity-low font-medium"
                        >
                          <FileCheck size={14} /> Low Sensitivity
                        </Label>
                        <p className="text-sm text-gray-500">
                          {getSensitivityDescription("low")}
                        </p>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleUpload}
                  className="w-full bg-vault-primary hover:bg-vault-secondary"
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? "Processing..." : "Upload Document"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
