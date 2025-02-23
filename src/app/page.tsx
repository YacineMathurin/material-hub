"use client";
import React, { useState } from "react";
import {
  Search,
  Printer,
  LogIn,
  Plus,
  Minus,
  Trash2,
  Menu,
  X,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample data remains the same
const materials = [
  { id: 1, name: "Cement", price: 15.99, unit: "bag" },
  { id: 2, name: "Steel Rebar", price: 25.5, unit: "piece" },
  { id: 3, name: "Bricks", price: 0.75, unit: "piece" },
  { id: 4, name: "Lumber 2x4", price: 8.99, unit: "piece" },
  { id: 5, name: "Plywood Sheet", price: 32.99, unit: "sheet" },
];
const categories = [
  "Concrete Materials",
  "Steel Materials",
  "Wood Materials",
  "Masonry",
  "Other",
];
const MaterialsSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [tempItem, setTempItem] = useState(null);
  const [showCategoryDialog, setShowCategoryDialog] = useState(false);

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addItem = (material) => {
    setTempItem(material);
    setShowCategoryDialog(true);
    setShowResults(false);
    setSearchTerm("");
  };

  const confirmAddItem = (category) => {
    if (tempItem) {
      const existingItem = selectedItems.find(
        (item) => item.id === tempItem.id
      );
      if (existingItem) {
        setSelectedItems(
          selectedItems.map((item) =>
            item.id === tempItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        setSelectedItems([
          ...selectedItems,
          { ...tempItem, quantity: 1, category },
        ]);
      }
      setTempItem(null);
      setShowCategoryDialog(false);
      setSelectedCategory("");
    }
  };

  const updateQuantity = (id, change) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  const updateCategory = (id, newCategory) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id ? { ...item, category: newCategory } : item
      )
    );
  };

  // Group items by category and calculate category subtotals
  const groupedItems = selectedItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = {
        items: [],
        subtotal: 0,
      };
    }
    acc[category].items.push(item);
    acc[category].subtotal += item.price * item.quantity;
    return acc;
  }, {});

  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                Building Materials
              </h1>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <a href="#" className="text-gray-600 hover:text-gray-900">
                Home
              </a>
              <a href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a>
              <Button variant="outline" className="flex items-center gap-2">
                <LogIn className="h-4 w-4" /> Login
              </Button>
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </Button>
            </div>
          </div>

          {isMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <a
                href="#"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Home
              </a>
              <a
                href="/about"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                About
              </a>
              <a
                href="/contact"
                className="block px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Contact
              </a>
              <div className="px-4 pt-2">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <LogIn className="h-4 w-4" /> Login
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.2] bg-grid-8"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.2] to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white">
                  Find Your Building Materials with Ease
                </h1>
                <p className="text-lg md:text-xl text-white/90">
                  Search through our extensive catalog of high-quality
                  construction materials. Get instant pricing and availability
                  information.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-white/10 hover:bg-white/20 text-white border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Button>
                <Button
                  size="lg"
                  className="bg-black/20 hover:bg-black/30 text-white border-2 border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  Learn More
                </Button>
              </div>
            </div>
            {/* <div className="hidden md:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl transform hover:scale-105 transition-transform duration-300">
                <img
                  src="/api/placeholder/600/400"
                  alt="Construction materials"
                  className="rounded-lg w-full"
                />
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card className="border-0 shadow-none bg-card-none">
          <CardHeader className="pl-0">
            <CardTitle>Search Materials</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search materials..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(true);
                }}
                className="pl-10 h-12 bg-white/80 backdrop-blur-sm border-gray-200 rounded-xl 
                shadow-sm transition-all duration-300 ease-in-out
                hover:border-purple-400 hover:bg-white
                focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none
                placeholder:text-gray-400"
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />

              {showResults && searchTerm && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border">
                  {filteredMaterials.map((material) => (
                    <button
                      key={material.id}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between"
                      onClick={() => addItem(material)}
                    >
                      <span>{material.name}</span>
                      <span className="text-gray-600">
                        ${material.price}/{material.unit}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {showCategoryDialog && tempItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
              <h3 className="text-lg font-semibold mb-4">
                Select Category for {tempItem.name}
              </h3>
              <Select
                value={selectedCategory}
                onValueChange={(value) => setSelectedCategory(value)}
              >
                <SelectTrigger className="w-full mb-4">
                  <SelectValue placeholder="Choose a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowCategoryDialog(false);
                    setTempItem(null);
                    setSelectedCategory("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => confirmAddItem(selectedCategory)}
                  disabled={!selectedCategory}
                >
                  Add Item
                </Button>
              </div>
            </div>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Selected Materials by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {Object.entries(groupedItems).map(
                ([category, { items, subtotal }]) => (
                  <div
                    key={category}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {category}
                      </h3>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">
                          Category Subtotal
                        </p>
                        <p className="font-semibold">${subtotal.toFixed(2)}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <h3 className="font-medium">{item.name}</h3>
                            <p className="text-sm text-gray-600">
                              ${item.price}/{item.unit}
                            </p>
                            <p className="text-sm text-gray-600">
                              Subtotal: $
                              {(item.price * item.quantity).toFixed(2)}
                            </p>
                          </div>

                          <div className="flex flex-col md:flex-row items-center gap-4">
                            <Select
                              value={item.category}
                              onValueChange={(value) =>
                                updateCategory(item.id, value)
                              }
                            >
                              <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem key={category} value={category}>
                                    {category}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, -1)}
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <span className="w-12 text-center">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => updateQuantity(item.id, 1)}
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-red-500"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center border-t pt-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Total</p>
              <p className="text-2xl font-bold">${total.toFixed(2)}</p>
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={() =>
                window.open("http://localhost:5000/generate-pdf", "_blank")
              }
            >
              <Printer className="h-4 w-4" /> Generate PDF
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Footer Section */}
      <footer className="bg-white mt-auto mt-24">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">
                Building Materials
              </h3>
              <p className="text-gray-600">
                Your trusted source for construction materials and supplies.
              </p>
            </div>

            {/* Quick Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Quick Links</h3>
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Home
                </a>
                <a
                  href="/about"
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  About
                </a>
                <a
                  href="/contact"
                  className="text-gray-600 hover:text-gray-900 transition duration-200"
                >
                  Contact
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Contact</h3>
              <div className="flex flex-col space-y-2">
                <a
                  href="mailto:info@example.com"
                  className="text-gray-600 hover:text-gray-900 transition duration-200 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4" /> info@example.com
                </a>
                <p className="text-gray-600">123 Construction Ave</p>
                <p className="text-gray-600">Building City, BC 12345</p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-600 transition duration-200"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-400 transition duration-200"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 transition duration-200"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-blue-700 transition duration-200"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              © {new Date().getFullYear()} Building Materials. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MaterialsSearch;
