import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB_NAME || 'devphoenix';

export let hasMongoConfig = !!uri;

if (!hasMongoConfig) {
  console.warn(
    '⚠️ MONGODB_URI MISSING: Running in disconnected mode. Add MONGODB_URI to your .env.local to connect to MongoDB.'
  );
}

// ---------------------------------------------------------------------------
// Singleton MongoClient – reused across hot reloads in development
// ---------------------------------------------------------------------------

// Extend globalThis so the cached client survives Next.js HMR reloads
const globalWithMongo = globalThis as typeof globalThis & {
  _mongoClient?: MongoClient;
  _mongoClientPromise?: Promise<MongoClient>;
  _mongoOffline?: boolean;
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;
let isMongoOffline = false;

if (globalWithMongo._mongoOffline) {
  isMongoOffline = true;
  hasMongoConfig = false;
}

if (hasMongoConfig) {
  const mongoOptions = {
    serverSelectionTimeoutMS: 3000, // fail fast — 3 seconds max
    connectTimeoutMS: 3000,
    socketTimeoutMS: 5000,
  };

  if (process.env.NODE_ENV === 'development') {
    // In dev, reuse the client across hot reloads
    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, mongoOptions);
      globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
        console.warn("⚠️ MongoDB connection failed on startup. Disabling MongoDB mode:", err.message);
        globalWithMongo._mongoOffline = true;
        isMongoOffline = true;
        hasMongoConfig = false;
        throw err;
      });
      globalWithMongo._mongoClient = client;
      console.log('🍃 MongoDB client created (dev singleton)');
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    // In production, create a fresh client
    client = new MongoClient(uri, mongoOptions);
    clientPromise = client.connect().catch((err) => {
      console.warn("⚠️ MongoDB connection failed. Disabling MongoDB mode:", err.message);
      isMongoOffline = true;
      hasMongoConfig = false;
      throw err;
    });
    console.log('🍃 MongoDB client created (production)');
  }
}

/**
 * Returns the connected Db instance.
 * All service methods should call this to get the database handle.
 */
export async function getDb(): Promise<Db> {
  if (!hasMongoConfig || isMongoOffline) {
    throw new Error('MongoDB is not configured or is offline. Set MONGODB_URI in .env.local');
  }
  try {
    const connectedClient = await clientPromise!;
    return connectedClient.db(dbName);
  } catch (err: any) {
    isMongoOffline = true;
    hasMongoConfig = false;
    globalWithMongo._mongoOffline = true;
    throw err;
  }
}
