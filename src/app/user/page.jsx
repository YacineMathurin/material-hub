"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { Phone, Mail, FileText, ImagePlus, Save, Loader2 } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// import { toast } from "@/components/ui/use-toast";

const UserProfile = () => {
  const { currentUser } = useAuth();
  const fileInputRef = useRef(null);

  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    description: "",
    slogan: "",
    phone: "",
    email: "",
    siret: "",
    logoUrl: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formComplete, setFormComplete] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Sample invoice data
  const invoices = [
    { id: "INV-001", date: "2024-02-20", amount: 1250.0, status: "Paid" },
    { id: "INV-002", date: "2024-02-15", amount: 850.0, status: "Pending" },
    { id: "INV-003", date: "2024-02-10", amount: 2100.0, status: "Paid" },
  ];

  // Load existing company info from MongoDB on component mount
  useEffect(() => {
    if (currentUser?.sub) {
      fetchCompanyInfo();
    }
  }, [currentUser]);

  // Check if all fields are filled
  useEffect(() => {
    const requiredFields = [
      "name", 
      "description", 
      "slogan", 
      "phone", 
      "email", 
      "siret"
    ];
    
    const allFieldsFilled = requiredFields.every(field => 
      companyInfo[field] && companyInfo[field].trim() !== ""
    );
    
    setFormComplete(allFieldsFilled);
  }, [companyInfo]);

  const fetchCompanyInfo = async () => {
    try {
      const response = await fetch(`/api/company?sub=${currentUser.sub}`);
      if (response.ok) {
        const data = await response.json();
        if (data && Object.keys(data).length > 0) {
          setCompanyInfo(data);
        }
      }
    } catch (error) {
      console.error("Error fetching company info:", error);
    }
  };

  const handleInfoChange = (e) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogoClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      console.error("Please select a valid image file");
      
      // toast({
      //   title: "Error",
      //   description: "Please select a valid image file",
      //   variant: "destructive",
      // });
      return;
    }

    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      console.log("File size should be less than 5MB");
      
      // toast({
      //   title: "Error",
      //   description: "File size should be less than 5MB",
      //   variant: "destructive",
      // });
      return;
    }

    // Upload to S3
    setIsUploading(true);
    
    try {
      // First, get a pre-signed URL from our API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', currentUser.sub);
      
      const uploadResponse = await fetch('/api/upload-logo', {
        method: 'POST',
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        throw new Error('Failed to upload logo');
      }
      
      const { logoUrl } = await uploadResponse.json();
      
      // Update state with the S3 URL
      setCompanyInfo({
        ...companyInfo,
        logoUrl,
      });
      
      console.log("Logo uploaded successfully");
      
      // toast({
      //   title: "Success",
      //   description: "Logo uploaded successfully",
      // });
    } catch (error) {
      console.error("Error uploading logo:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to upload logo",
      //   variant: "destructive",
      // });
    } finally {
      setIsUploading(false);
    }
  };

  const saveCompanyInfo = async () => {
    if (!formComplete) return;
    
    setIsSubmitting(true);
    
    try {
      const dataToSave = {
        ...companyInfo,
        sub: currentUser.sub,
      };
      
      const response = await fetch('/api/company', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });
      
      if (response.ok) {
        console.log("Company information saved successfully");
        
        // toast({
        //   title: "Success",
        //   description: "Company information saved successfully",
        // });
      } else {
        throw new Error('Failed to save data');
      }
    } catch (error) {
      console.error("Error saving company info:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to save company information",
      //   variant: "destructive",
      // });
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (isLoading)
  //   return (
  //     <div className="flex justify-center items-center min-h-screen">
  //       Loading...
  //     </div>
  //   );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={currentUser?.picture} alt={currentUser?.name} />
              <AvatarFallback>{currentUser?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
              <p className="text-gray-600">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          {/* Company Information Form */}
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
              <CardDescription>
                Update your company details and branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Logo</label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    {isUploading ? (
                      <div className="flex items-center justify-center w-full h-full bg-gray-100">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        <AvatarImage
                          src={companyInfo.logoUrl || "/api/placeholder/100/100"}
                          alt="Company Logo"
                        />
                        <AvatarFallback>CL</AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={handleLogoClick}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ImagePlus className="h-4 w-4" />
                    )}
                    {isUploading ? "Uploading..." : "Upload Logo"}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name*</label>
                <Input
                  name="name"
                  value={companyInfo.name}
                  onChange={handleInfoChange}
                  placeholder="Enter company name"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description*</label>
                <Textarea
                  name="description"
                  value={companyInfo.description}
                  onChange={handleInfoChange}
                  placeholder="Enter company description"
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slogan*</label>
                <Input
                  name="slogan"
                  value={companyInfo.slogan}
                  onChange={handleInfoChange}
                  placeholder="Enter company slogan"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">SIRET*</label>
                <Input
                  name="siret"
                  value={companyInfo.siret}
                  onChange={handleInfoChange}
                  placeholder="Enter SIRET number"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone*</label>
                  <Input
                    name="phone"
                    value={companyInfo.phone}
                    onChange={handleInfoChange}
                    placeholder="Enter phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email*</label>
                  <Input
                    name="email"
                    value={companyInfo.email}
                    onChange={handleInfoChange}
                    placeholder="Enter email address"
                    required
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                disabled={!formComplete || isSubmitting}
                onClick={saveCompanyInfo}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice History</CardTitle>
            <CardDescription>Track all your generated invoices</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {invoice.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <FileText className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserProfile;