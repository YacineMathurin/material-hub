// src/app/api/company/route.js
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";

// MongoDB connection string
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get("uid");

  if (!uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("companyInfo");

    const companyInfo = await collection.findOne({ uid });

    return NextResponse.json(companyInfo || {}, { status: 200 });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}

export async function POST(request) {
  const companyData = await request.json();

  if (!companyData.uid) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("companyInfo");

    // Check if a document already exists for this user
    const existingDoc = await collection.findOne({ uid: companyData.uid });

    if (existingDoc) {
      // Update existing document
      await collection.updateOne(
        { uid: companyData.uid },
        { $set: companyData }
      );
    } else {
      // Insert new document
      await collection.insertOne(companyData);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("MongoDB Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await client.close();
  }
}
