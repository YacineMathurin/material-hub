// src/app/api/generate-pdf/route.js

import puppeteer from "puppeteer";
import os from "os";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";
import chromium from "@sparticuz/chromium";

dotenv.config();

const {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
} = process.env;

console.log({
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_REGION,
  AWS_BUCKET_NAME,
});

// Set up AWS S3 configuration for SDK v3
const s3 = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Function to calculate totals
const calculateTotals = (groupedItems, errorMargin) => {
  let subtotal = 0;

  // Loop through each category group
  Object.values(groupedItems).forEach((group) => {
    // Loop through each item in the group
    group.items.forEach((item) => {
      const amount = item.price * item.quantity; // Calculate the amount
      subtotal += amount;
    });
  });

  // Calculate tax and total
  const tax = subtotal * 0.1; // 10% tax
  const withMargin = (subtotal + tax) * (errorMargin / 100);
  // const total = subtotal + tax;
  const total = subtotal + withMargin + tax;

  return { subtotal, tax, withMargin, total };
};

// Function to render grouped items to HTML
const renderItems = (groupedItems) => {
  let htmlContent = "";
  Object.keys(groupedItems).forEach((category) => {
    const group = groupedItems[category];
    htmlContent += `<tr class="category-header"><td colspan="5">${category} </td></tr>`;
    group.items.forEach((item) => {
      htmlContent += `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>${item.unit}</td>
          <td>$${item.price.toFixed(2)}</td>
        </tr>
      `;
    });
    htmlContent += `
      <tr class="category-subtotal">
        <td colspan="4">Subtotal</td>
        <td>$${group.subtotal.toFixed(2)}</td>
      </tr>
      <br>
    `;
  });
  return htmlContent;
};

// Function to generate the final HTML content
const generateHTML = (groupedItems, errorMargin) => {
  const { subtotal, tax, withMargin, total } = calculateTotals(
    groupedItems,
    errorMargin
  );
  const itemsHTML = renderItems(groupedItems);

  return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
            .invoice { max-width: 800px; margin: 0 auto; background: white; padding: 3rem 4rem;  }
            .invoice-1 { border-top: 5px solid #2563eb; border-radius: 4px; }
            .logo-container { display: flex; align-items: center; gap: 1rem; }
            .logo { width: 50px; height: 50px; display: flex; align-items: center; justify-content: center; border-radius: 8px; background: #2563eb; color: white; }
            .header { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 2rem 0; padding-bottom: 2rem; border-bottom: 1px solid #e5e7eb; }
            .addresses { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin: 2rem 0; }
            .address-box { padding: 1rem; background: #f9fafb; border-radius: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
            th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #e5e7eb; }
            th { background: #f3f4f6; font-weight: 600; }
            .category-header { background: #e5e7eb; font-weight: 600; color: #1f2937; }
            .category-subtotal { background: #f8fafc; font-weight: 500; border-spacing: 0 20px; }
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
                  <h1>BuildTech</h1>
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
              <p>Error Marge ($${errorMargin}%): $${withMargin.toFixed(2)}</p>
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
    const browser = await puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(), // Vercel-friendly
      headless: true, // Ensure headless mode
    });

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

// Adapted route handler to accept POST request
export async function POST(req) {
  try {
    const data = await req.json(); // Get the JSON body from the request

    // Extract data from request body
    const { title, content, groupedItems, errorMargin } = data;

    // Validate required parameters
    if (!title || !content || !groupedItems) {
      return new Response("Missing required parameters in the request body.", {
        status: 400,
      });
    }

    console.log({ groupedItems });

    // Generate PDF from the provided HTML
    const pdfBuffer = await generatePDF(
      generateHTML(groupedItems, errorMargin)
    );

    // Get the hostname to use in the filename
    const hostname = os.hostname(); // e.g., "Johns-MacBook"
    const fileName = `${hostname}_generated.pdf`;

    // Set up S3 parameters for uploading the PDF
    const s3Params = {
      Bucket: "demo-s3-trainning",
      Key: `pdfs/${fileName}`,
      Body: pdfBuffer,
      ContentType: "application/pdf",
    };

    try {
      // Upload the PDF to S3
      const command = new PutObjectCommand(s3Params);
      await s3.send(command);

      // Construct the S3 URL for the uploaded PDF
      const pdfUrl = `https://${"demo-s3-trainning"}.s3.${AWS_REGION}.amazonaws.com/pdfs/${fileName}`;
      console.log(`File uploaded successfully at ${pdfUrl}`);

      // Return the PDF URL in the response
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
