"use client";
import React, { useState } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import {
  User,
  Building2,
  Phone,
  Mail,
  FileText,
  ImagePlus,
  Save,
  Eye,
} from "lucide-react";

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
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const UserProfile = () => {
  const { user, isLoading } = useUser();

  const [companyInfo, setCompanyInfo] = useState({
    name: "Your Company Name",
    description: "Company description goes here...",
    slogan: "Your company slogan",
    phone: "+1 234 567 890",
    email: "contact@company.com",
  });

  const [previewMode, setPreviewMode] = useState(false);

  // Sample invoice data
  const invoices = [
    { id: "INV-001", date: "2024-02-20", amount: 1250.0, status: "Paid" },
    { id: "INV-002", date: "2024-02-15", amount: 850.0, status: "Pending" },
    { id: "INV-003", date: "2024-02-10", amount: 2100.0, status: "Paid" },
  ];

  const handleInfoChange = (e) => {
    setCompanyInfo({
      ...companyInfo,
      [e.target.name]: e.target.value,
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.picture} alt={user?.name} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{user?.name}</h1>
              <p className="text-gray-600">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            {previewMode ? "Edit Mode" : "Preview Mode"}
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
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
                    <AvatarImage
                      src="/api/placeholder/100/100"
                      alt="Company Logo"
                    />
                    <AvatarFallback>CL</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" className="flex items-center gap-2">
                    <ImagePlus className="h-4 w-4" />
                    Upload Logo
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <Input
                  name="name"
                  value={companyInfo.name}
                  onChange={handleInfoChange}
                  disabled={previewMode}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  name="description"
                  value={companyInfo.description}
                  onChange={handleInfoChange}
                  disabled={previewMode}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Slogan</label>
                <Input
                  name="slogan"
                  value={companyInfo.slogan}
                  onChange={handleInfoChange}
                  disabled={previewMode}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    name="phone"
                    value={companyInfo.phone}
                    onChange={handleInfoChange}
                    disabled={previewMode}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    name="email"
                    value={companyInfo.email}
                    onChange={handleInfoChange}
                    disabled={previewMode}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" disabled={previewMode}>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </CardFooter>
          </Card>

          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle>Company Preview</CardTitle>
              <CardDescription>
                How your company information appears to others
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage
                    src="/api/placeholder/100/100"
                    alt="Company Logo"
                  />
                  <AvatarFallback>CL</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">{companyInfo.name}</h3>
                  <p className="text-gray-600 italic">{companyInfo.slogan}</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-gray-600">{companyInfo.description}</p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    {companyInfo.phone}
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    {companyInfo.email}
                  </div>
                </div>
              </div>
            </CardContent>
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
