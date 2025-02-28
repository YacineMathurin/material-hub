// src/app/api/upload-logo/route.js
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Configure the AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Helper function to get file buffer from the form data
async function getFileBuffer(formData) {
  const file = formData.get("file");

  if (!file) {
    throw new Error("No file provided");
  }

  const arrayBuffer = await file.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const userId = formData.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Get the file from the form data
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Check file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 });
    }

    // Generate a unique file name to prevent overwriting
    const fileExtension = file.name.split(".").pop();
    const fileName = `${userId}/${uuidv4()}.${fileExtension}`;

    // Convert file to buffer
    const fileBuffer = await getFileBuffer(formData);

    // Set up the S3 upload parameters
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileName,
      Body: fileBuffer,
      ContentType: file.type,
      ACL: "public-read", // Make the file publicly accessible
    };

    // Upload the file to S3
    await s3Client.send(new PutObjectCommand(params));

    // Construct the public URL for the uploaded file
    const logoUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    return NextResponse.json(
      {
        success: true,
        logoUrl,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading to S3:", error);
    return NextResponse.json(
      {
        error: "File upload failed",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};
