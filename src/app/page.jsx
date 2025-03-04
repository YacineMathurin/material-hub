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
  LogOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Label } from "@/components/ui/label";

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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import UnauthenticatedNotice from "@/components/UnauthenticatedNotice";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [errorMargin, setErrorMargin] = useState(0);
  const [servicePrice, setServicePrice] = useState(0);
  const [categoryServicePrices, setCategoryServicePrices] = useState({});
  const [isClientSectionExpanded, setIsClientSectionExpanded] = useState(true);
  const [clientInfo, setClientInfo] = useState({
    lastName: "",
    firstName: "",
    phone: "",
    email: "",
    address: "",
  });

  const { currentUser, logout } = useAuth();

  const toggleClientSection = () => {
    setIsClientSectionExpanded(!isClientSectionExpanded);
  };

  const handleClientInfoChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const filteredMaterials = materials.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateItemQuantity = (id, newQuantity) => {
    setSelectedItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const generatePDF = async () => {
    setIsGenerating(true);
    setPdfUrl(null);
    setError(null);

    console.log({ groupedItems });
    try {
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: "title",
          content: "content",
          groupedItems,
          errorMargin,
          categoryServicePrices,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("PDF generated:", data);
        setPdfUrl(data.pdfUrl);
      } else {
        console.error("Failed to generate PDF", response);
        setError("Failed to generate PDF. Please try again.");
      }
    } catch (error) {
      console.error("Error during request:", error);
      setError("An error occurred while generating the PDF.");
    } finally {
      // We keep the modal open even after generation completes
      // It will only close when user clicks Close or Open PDF
    }
  };

  const handleOpenPDF = () => {
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  const handleClose = () => {
    setIsGenerating(false);
  };

  // Function to update service price for a specific category
  const updateCategoryServicePrice = (category, price) => {
    setCategoryServicePrices((prev) => ({
      ...prev,
      [category]: price,
    }));
  };

  // Helper function to parse formatted price string to number
  const parsePriceToNumber = (priceString) => {
    if (!priceString) return 0;
    return parseFloat(priceString.replace(/\s/g, ""));
  };

  // Function to calculate total including service prices
  const calculateTotal = () => {
    const materialsTotal = total;
    const servicePricesTotal = Object.values(categoryServicePrices).reduce(
      (sum, price) => sum + parsePriceToNumber(price),
      0
    );

    return materialsTotal + servicePricesTotal;
  };

  // Helper function to format price with thousand separators
  const formatPrice = (price) => {
    return price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  };

  //

  // After searching for material, allow adding to multiple categories
  const addItem = (material) => {
    setTempItem(material);
    setShowCategoryDialog(true);
    setShowResults(false);
    setSearchTerm("");
  };

  // Modify the confirmAddItem function to create a new unique ID for each category-item combination
  const confirmAddItem = (category) => {
    if (tempItem) {
      // Create a new unique ID that combines the material ID and category
      const newItemId = `${tempItem.id}-${category}`;

      // Check if this exact item-category combination already exists
      const existingItem = selectedItems.find(
        (item) => item.originalId === tempItem.id && item.category === category
      );

      if (existingItem) {
        // If this item already exists in this category, just update quantity
        setSelectedItems(
          selectedItems.map((item) =>
            item.originalId === tempItem.id && item.category === category
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        );
      } else {
        // Otherwise add as a new item with the original ID reference
        setSelectedItems([
          ...selectedItems,
          {
            ...tempItem,
            id: newItemId,
            originalId: tempItem.id,
            quantity: 1,
            category,
          },
        ]);
      }
      setTempItem(null);
      setShowCategoryDialog(false);
      setSelectedCategory("");
    }
  };

  // Update the updateQuantity function to handle the new ID structure
  const updateQuantity = (id, change) => {
    setSelectedItems(
      selectedItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  // Update the removeItem function to work with the new ID structure
  const removeItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.id !== id));
  };

  // The updateCategory function can be simplified as items now have fixed categories
  // and would need to be removed and re-added to change categories
  const updateCategory = (id, newCategory) => {
    const itemToUpdate = selectedItems.find((item) => item.id === id);

    if (itemToUpdate) {
      // First remove the item from its current category
      const updatedItems = selectedItems.filter((item) => item.id !== id);

      // Create a new ID for the item in its new category
      const newItemId = `${itemToUpdate.originalId}-${newCategory}`;

      // Check if the item already exists in the target category
      const existingItemInCategory = selectedItems.find(
        (item) =>
          item.originalId === itemToUpdate.originalId &&
          item.category === newCategory
      );

      if (existingItemInCategory) {
        // If it exists, increase quantity in the target category
        updatedItems.map((item) =>
          item.id === existingItemInCategory.id
            ? { ...item, quantity: item.quantity + itemToUpdate.quantity }
            : item
        );
      } else {
        // Otherwise add it as a new item in the new category
        updatedItems.push({
          ...itemToUpdate,
          id: newItemId,
          category: newCategory,
        });
      }

      setSelectedItems(updatedItems);
    }
  };

  // Group items by category and calculate category subtotals
  // This function remains mostly the same but now works with the new ID structure
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

  // The total calculation remains the same
  const total = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  //
  const router = useRouter();

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
              {/* <a href="/about" className="text-gray-600 hover:text-gray-900">
                About
              </a>
              <a href="/contact" className="text-gray-600 hover:text-gray-900">
                Contact
              </a> */}
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={
                  currentUser ? () => logout() : () => router.push("/login")
                }
              >
                {currentUser ? (
                  <>
                    <LogOut className="h-4 w-4" /> Logout
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" /> Login
                  </>
                )}
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
              {/* <a
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
              </a> */}
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
      <div className="bg-gradient-to-br from-blue-700 via-blue-500 to-teal-400 relative overflow-hidden">
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

      <div className="max-w-4xl mx-auto p-4 space-y-6 min-h-screen">
        <UnauthenticatedNotice />

        {/* Main */}
        {currentUser && (
          <div className="max-w-4xl mx-auto p-4 space-y-6 min-h-screen">
            {/* Client Information Card */}
            <Card className="border border-gray-200 shadow-sm bg-white overflow-hidden">
              <CardHeader
                className="pb-2 flex flex-row items-center justify-between cursor-pointer"
                onClick={toggleClientSection}
              >
                <CardTitle>Client Information</CardTitle>
                <Button variant="ghost" size="sm" className="p-1">
                  {isClientSectionExpanded ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 transition-transform duration-300" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 transition-transform duration-300" />
                  )}
                </Button>
              </CardHeader>

              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isClientSectionExpanded
                    ? "max-h-128 md:max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <CardContent className="py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={clientInfo.lastName}
                        onChange={handleClientInfoChange}
                        placeholder="Smith"
                        className="border-gray-200 h-10 rounded-lg
                  hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={clientInfo.firstName}
                        onChange={handleClientInfoChange}
                        placeholder="John"
                        className="border-gray-200 h-10 rounded-lg
                  hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={clientInfo.phone}
                        onChange={handleClientInfoChange}
                        placeholder="(555) 123-4567"
                        className="border-gray-200 h-10 rounded-lg
                  hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={clientInfo.email}
                        onChange={handleClientInfoChange}
                        placeholder="john.smith@example.com"
                        className="border-gray-200 h-10 rounded-lg
                  hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={clientInfo.address}
                        onChange={handleClientInfoChange}
                        placeholder="123 Main St, Anytown, ST 12345"
                        className="border-gray-200 h-10 rounded-lg
                  hover:border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Search Materials Card */}
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
                        <div className="mb-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {category}
                          </h3>
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
                                  {formatPrice(item.price * item.quantity)}
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
                                      <SelectItem
                                        key={category}
                                        value={category}
                                      >
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
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => {
                                      const value =
                                        parseInt(e.target.value) || 1;
                                      updateItemQuantity(item.id, value);
                                    }}
                                    min="1"
                                    className="w-16 text-center border rounded p-1"
                                  />
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
                        <div className="mt-4 p-4 rounded-lg border bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                Service Price:
                              </span>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                  $
                                </span>
                                <input
                                  type="text"
                                  value={categoryServicePrices[category] || ""}
                                  onChange={(e) => {
                                    // Remove all non-numeric characters
                                    const value = e.target.value.replace(
                                      /[^\d]/g,
                                      ""
                                    );
                                    // Format with spaces for thousands
                                    const formattedValue = value
                                      ? parseInt(value)
                                          .toLocaleString("en-US")
                                          .replace(/,/g, " ")
                                      : "";
                                    updateCategoryServicePrice(
                                      category,
                                      formattedValue
                                    );
                                  }}
                                  className="w-32 border rounded p-2 pl-6"
                                  placeholder="0"
                                />
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="space-y-1">
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Materials:
                                  </span>
                                  <span className="font-medium">
                                    ${formatPrice(subtotal)}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-sm text-gray-600">
                                    Service:
                                  </span>
                                  <span className="font-medium">
                                    $
                                    {formatPrice(
                                      parsePriceToNumber(
                                        categoryServicePrices[category]
                                      ) || 0
                                    )}
                                  </span>
                                </div>
                                <div className="pt-1 border-t mt-1">
                                  <div className="flex justify-between">
                                    <span className="text-sm font-medium">
                                      Category Total:
                                    </span>
                                    <span className="font-semibold">
                                      $
                                      {formatPrice(
                                        subtotal +
                                          (parsePriceToNumber(
                                            categoryServicePrices[category]
                                          ) || 0)
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row justify-between items-center border-t pt-6 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Total</p>
                  <p className="text-2xl font-bold">
                    ${formatPrice(calculateTotal())}
                  </p>
                  {errorMargin > 0 && (
                    <p className="text-sm text-gray-600">
                      With {errorMargin}% margin: $
                      {formatPrice(calculateTotal() * (1 + errorMargin / 100))}
                    </p>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm">Error Margin:</span>
                    <Select
                      value={errorMargin.toString()}
                      onValueChange={(value) => setErrorMargin(parseInt(value))}
                    >
                      <SelectTrigger className="w-24">
                        <SelectValue placeholder="0%" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0%</SelectItem>
                        <SelectItem value="5">5%</SelectItem>
                        <SelectItem value="10">10%</SelectItem>
                        <SelectItem value="15">15%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="flex items-center gap-2"
                    onClick={generatePDF}
                  >
                    <Printer className="h-4 w-4" /> Generate PDF
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        )}

        <Dialog open={isGenerating} onOpenChange={setIsGenerating}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {!pdfUrl && !error
                  ? "Generating PDF..."
                  : error
                  ? "Error"
                  : "PDF Generated"}
              </DialogTitle>
            </DialogHeader>

            <div className="py-4">
              {!pdfUrl && !error && (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2">
                    Please wait while we generate your PDF...
                  </span>
                </div>
              )}

              {error && <div className="text-red-500">{error}</div>}

              {pdfUrl && (
                <div className="text-green-500">
                  Your PDF has been successfully generated!
                </div>
              )}
            </div>

            <DialogFooter className="sm:justify-between">
              <Button
                variant="outline"
                onClick={handleClose}
                className="mt-2 sm:mt-0"
              >
                Close
              </Button>

              {pdfUrl && (
                <Button onClick={handleOpenPDF} className="mt-2 sm:mt-0">
                  Open PDF
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
