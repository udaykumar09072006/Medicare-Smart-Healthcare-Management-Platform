#!/usr/bin/env node
/**
 * Safe script to replace http://localhost:4000 in imageUrl fields with the
 * deployed backend URL. Run locally with MONGO_URI set in your environment.
 *
 * Usage:
 *   MONGO_URI="your_mongo_uri" node updateImageUrls.js https://your-backend
 */
import mongoose from 'mongoose';
import 'dotenv/config';
import Doctor from '../models/Doctor.js';
import Service from '../models/Service.js';

const newBase = process.argv[2];
if (!newBase) {
  console.error('Usage: node updateImageUrls.js <newBaseUrl>');
  process.exit(1);
}

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not set in environment. Aborting.');
  process.exit(1);
}

async function run() {
  await mongoose.connect(uri, { dbName: 'Medicare' });
  console.log('Connected to DB');

  const replaceLocal = async (Model, name) => {
    const docs = await Model.find({ imageUrl: /http:\/\/localhost:4000/ }).lean();
    console.log(`${name}: found ${docs.length} documents to update`);
    for (const doc of docs) {
      const newUrl = doc.imageUrl.replace('http://localhost:4000', newBase);
      await Model.updateOne({ _id: doc._id }, { $set: { imageUrl: newUrl } });
      console.log(`Updated ${name} ${doc._id}`);
    }
  };

  await replaceLocal(Doctor, 'Doctor');
  await replaceLocal(Service, 'Service');

  console.log('Done');
  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
