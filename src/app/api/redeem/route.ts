export const runtime = 'edge';

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { anonymousToken, upStashTable, productInfo } = await request.json();

    if (!anonymousToken) {
      return Response.json(
        { success: false, message: 'Missing anonymous token.' },
        { status: 400 }
      );
    }

    if (!upStashTable) {
      return Response.json(
        { success: false, message: 'Missing Upstash table name.' },
        { status: 400 }
      );
    }

    const userKey = `user:${anonymousToken}`;

    // Check if this anonymous token already redeemed a coupon
    const existingUserData = await redis.get(userKey);
    if (existingUserData) {
      // Upstash Redis auto-parses JSON, but handle both cases for safety
      const userData = typeof existingUserData === 'string' 
        ? JSON.parse(existingUserData) 
        : existingUserData as { couponCode: string; productInfo: any };
      return Response.json(
        {
          success: false,
          message: 'User already redeemed a coupon.',
          code: userData.couponCode,
        },
        { status: 200 }
      );
    }

    // Get a coupon code from the specific Upstash table (using Set - SPOP removes and returns a random member)
    let couponCode: string | null = null;
    try {
      // spop without count returns a single random member from the set and removes it
      couponCode = await redis.spop<string>(upStashTable) as string | null;
    } catch (error) {
      console.error(`Error accessing Upstash table ${upStashTable}:`, error);
      return Response.json(
        { success: false, message: `Error accessing coupon table: ${upStashTable}` },
        { status: 500 }
      );
    }
    
    if (!couponCode) {
      return Response.json(
        { success: false, message: 'No more coupon codes available for this product.' },
        { status: 400 }
      );
    }


    // Store all user data in a single key
    const userData = {
      couponCode: couponCode,
      productInfo: productInfo,
      redeemedAt: new Date().toISOString(),
      upStashTable: upStashTable
    };

    await redis.set(userKey, JSON.stringify(userData));

    // Set expiration (1 year)
    const ttl = 365 * 24 * 60 * 60;
    await redis.expire(userKey, ttl);

    return Response.json({ success: true, code: couponCode });
  } catch (error) {
    console.error('Redeem error:', error);
    return Response.json(
      { success: false, message: 'Internal error' },
      { status: 500 }
    );
  }
}
