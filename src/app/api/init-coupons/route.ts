export const runtime = 'edge';

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Generate random alphanumeric code
function generateRandomCode(length: number = 12): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate unique coupon codes
function generateUniqueCodes(count: number): string[] {
  const codes = new Set<string>();
  while (codes.size < count) {
    codes.add(generateRandomCode());
  }
  return Array.from(codes);
}

export async function POST(request: Request) {
  try {
    // Table names from the DB upStashTable values
    const tableNames = ['airpods', 'dji', 'nintendo', 'ps5', 'xbox', 'ipad', 'tablet'];
    const results = {};

    // Generate and add 200 unique coupons to each Redis Set
    for (const tableName of tableNames) {
      // Clear existing coupons first
      await redis.del(tableName);
      
      // Generate 200 unique coupon codes
      const coupons = generateUniqueCodes(200);
      
      // Add coupons to Redis Set (using sadd to ensure uniqueness)
      // Add in batches to avoid TypeScript spread issues
      const batchSize = 50;
      for (let i = 0; i < coupons.length; i += batchSize) {
        const batch = coupons.slice(i, i + batchSize);
        await redis.sadd(tableName, ...(batch as [string, ...string[]]));
      }
      
      results[tableName] = coupons.length;
    }

    return Response.json({ 
      success: true, 
      message: `Initialized 200 coupon codes for all product tables`,
      results: results
    });
  } catch (error) {
    console.error('Init coupons error:', error);
    return Response.json(
      { success: false, message: 'Internal error' },
      { status: 500 }
    );
  }
}
