// src/app/api/generate-pdf/route.js

import puppeteer from "puppeteer";
import QRCode from "qrcode";
import os from "os";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = process.env;

// Set up AWS S3 configuration for SDK v3
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Grouping items (sample data)
const groupedItems = {
  Concrete: {
    items: [
      {
        name: "Portland Cement",
        quantity: 50,
        unit: "Bags",
        price: 15.99,
        amount: 799.5,
      },
      {
        name: "Concrete Blocks",
        quantity: 500,
        unit: "Pieces",
        price: 2.75,
        amount: 1375.0,
      },
    ],
    subtotal: 2174.5,
  },
  Steel: {
    items: [
      {
        name: "Steel Rebar (12mm)",
        quantity: 100,
        unit: "Pieces",
        price: 25.5,
        amount: 2550.0,
      },
      {
        name: "Steel Wire Mesh",
        quantity: 20,
        unit: "Sheets",
        price: 45.0,
        amount: 900.0,
      },
    ],
    subtotal: 3450.0,
  },
};

// Function to calculate totals
const calculateTotals = (groupedItems) => {
  let subtotal = 0;
  Object.values(groupedItems).forEach((group) => {
    group.items.forEach((item) => {
      subtotal += item.amount;
    });
  });
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;
  return { subtotal, tax, total };
};

// Function to render grouped items to HTML
const renderItems = (groupedItems) => {
  let htmlContent = "";
  Object.keys(groupedItems).forEach((category) => {
    const group = groupedItems[category];
    htmlContent += `<tr class="category-header"><td colspan="5">${category} Materials</td></tr>`;
    group.items.forEach((item) => {
      htmlContent += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.unit}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>$${item.amount.toFixed(2)}</td>
        </tr>
      `;
    });
    htmlContent += `
      <tr class="category-subtotal">
        <td colspan="4">Subtotal</td>
        <td>$${group.subtotal.toFixed(2)}</td>
      </tr>
    `;
  });
  return htmlContent;
};

// Function to generate the final HTML content
const generateHTML = (groupedItems) => {
  const { subtotal, tax, total } = calculateTotals(groupedItems);
  const itemsHTML = renderItems(groupedItems);

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            body { min-height: 100vh; display: flex; padding: 2rem; background-color: #f5f5f5; }
            .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 2rem; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .invoice-1 { border-top: 5px solid #2563eb; border-radius: 4px; }
            .logo-container { display: flex; align-items: center; gap: 1rem; }
            .logo { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: #2563eb; color: white; }
            .header { display: flex; justify-content: space-between; padding-bottom: 2rem; border-bottom: 1px solid #e5e7eb; }
            .addresses { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 2rem 0; }
            .address-box { padding: 1rem; background: #f9fafb; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
            th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f3f4f6; font-weight: 600; }
            .category-header { background: #e5e7eb; font-weight: 600; color: #1f2937; }
            .category-subtotal { background: #f8fafc; font-weight: 500; }
            .total { text-align: right; padding-top: 1rem; border-top: 2px solid #e5e7eb; }
            .total p { margin: 0.5rem 0; }
            .total h3 { margin-top: 1rem; color: #1f2937; }
          </style>
        </head>
        <body>
          <div class="invoice">
            <div class="header">
              <div class="logo-container">
                <div class="logo">
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                  </svg>
                </div>
                <div>
                  <h1>BuildTech Materials</h1>
                  <p>Quality Construction Supplies</p>
                </div>
              </div>
              <div>
                <h2>INVOICE #BT-2024-001</h2>
                <p>Date: Feb 23, 2025</p>
                <p>Due: Mar 23, 2025</p>
              </div>
            </div>
  
            <div class="addresses">
              <div class="address-box">
                <h3>From:</h3>
                <p>BuildTech Materials Inc.</p>
                <p>123 Construction Ave</p>
                <p>Building City, BC 12345</p>
                <p>Tel: (555) 123-4567</p>
              </div>
              <div class="address-box">
                <h3>To:</h3>
                <p>Premier Contractors Ltd.</p>
                <p>456 Project Street</p>
                <p>Construction Town, CT 67890</p>
              </div>
            </div>
  
            <table>
              <thead>
                <tr>
                  <th>Material</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Price</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>
  
            <div class="total">
              <p>Subtotal: $${subtotal.toFixed(2)}</p>
              <p>Tax (10%): $${tax.toFixed(2)}</p>
              <h3>Total: $${total.toFixed(2)}</h3>
            </div>
          </div>
        </body>
      </html>
  `;
};

// Function to generate the PDF using Puppeteer
async function generatePDF(htmlTemplate) {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setContent(htmlTemplate, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
  } catch (error) {
    console.error("Error during PDF generation:", error);
    throw new Error("PDF generation failed");
  }
}

// Function to generate QR code for a URL as a data URL
async function generateQRCode(url) {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw new Error("QR Code generation failed");
  }
}

// API Route handler for generating PDF
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const title = searchParams.get("title");
    const content = searchParams.get("content");
    const groupedItems = searchParams.get("groupedItems");

    if (!title || !content) {
      return new Response('Missing "title" or "content" query parameter.', {
        status: 400,
      });
    }

    const qrCodeDataUrl = await generateQRCode(
      "http://property-hub-ne.s3-website.eu-west-3.amazonaws.com/check-it.html"
    );

    const pdfBuffer = await generatePDF(generateHTML(groupedItems));

    const hostname = os.hostname(); // e.g., "Johns-MacBook"

    const fileName = `${hostname}_generated.pdf`;
    const s3Params = {
      Bucket: AWS_BUCKET_NAME,
      Key: `pdfs/${fileName}`,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    };

    try {
      const command = new PutObjectCommand(s3Params);
      await s3.send(command);

      const pdfUrl = `https://${AWS_BUCKET_NAME}.s3.${AWS_REGION}.amazonaws.com/pdfs/${fileName}`;
      console.log(`File uploaded successfully at ${pdfUrl}`);

      // Return the S3 URL
      return new Response(JSON.stringify({ pdfUrl }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Error uploading file to S3:", err);
      return new Response("Error uploading PDF to S3.", { status: 500 });
    }
  } catch (error) {
    console.error("Error during PDF generation:", error);
    return new Response("Error generating PDF.", { status: 500 });
  }
}
