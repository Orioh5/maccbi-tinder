export const runtime = 'edge';

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

type UserData = {
  couponCode: string;
  productInfo: any;
  redeemedAt?: string;
  upStashTable?: string;
};

export async function POST(request: Request) {
  try {
    const { anonymousToken } = await request.json();
    
    // Fast validation - return early if token missing
    if (!anonymousToken || typeof anonymousToken !== 'string') {
      return Response.json(
        { hasCoupon: false, message: 'Missing anonymous token.' },
        { status: 400 }
      );
    }

    // Construct key once - O(1) operation
    const userKey = `user:${anonymousToken}`;
    
    // Single Redis GET operation - O(1) complexity, fetches entire user object
    // Upstash Redis automatically deserializes JSON, so no manual parsing needed
    const userData = await redis.get<UserData>(userKey);

    // Fast path: no coupon exists
    if (!userData) {
      return Response.json({ hasCoupon: false });
    }

    // Validate required fields exist
    if (!userData.couponCode) {
      return Response.json({ hasCoupon: false });
    }

    // Return only required data (code and productInfo)
    // Single Redis GET is optimal: O(1) complexity, minimal data transfer
    return Response.json({ 
      hasCoupon: true, 
      code: userData.couponCode,
      productInfo: userData.productInfo
    });
  } catch (error) {
    console.error('Check coupon error:', error);
    return Response.json(
      { hasCoupon: false, message: 'Internal error' },
      { status: 500 }
    );
  }
} 