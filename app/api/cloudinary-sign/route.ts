import crypto from 'crypto';

import { auth } from '@/lib/auth';

export const POST = auth(async () => {
  try {
    const timestamp = Math.round(new Date().getTime() / 1000);

    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!apiSecret) {
      console.error('CLOUDINARY_API_SECRET is not defined');
      return Response.json({ message: 'Missing API Secret' }, { status: 500 });
    }

    const signature = crypto
      .createHash('sha256')
      .update(`timestamp=${timestamp}${apiSecret}`)
      .digest('hex');

    return Response.json({ signature, timestamp });
  } catch (error: any) {
    console.error('Cloudinary signature error:', error.message);
    return Response.json({ message: error.message }, { status: 500 });
  }
});
