import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import crypto from 'crypto';
import cryptoRandomString from 'crypto-random-string';
import { db } from '@/db';

const secret = process.env.PAYSTACK_TEST_SECRET_KEY!;

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const hash = crypto
    .createHmac('sha512', secret)
    .update(rawBody)
    .digest('hex');

  const paystackSignature = req.headers.get('x-paystack-signature');

  if (hash !== paystackSignature) {
    return new NextResponse('Invalid signature', { status: 401 });
  }

  const event = JSON.parse(rawBody);
  console.log('📩 Paystack Webhook Event:', event);

  if (event.event === 'charge.success') {
    const { reference, metadata, amount } = event.data;
    const { userId, planID, email } = metadata;

    try {
      const dbUser = await db.user.findFirst({ where: { id: userId } });
      if (!dbUser || dbUser.email !== email) {
        console.error("❌ Email mismatch in webhook");
        return new NextResponse('Invalid user/email', { status: 400 });
      }

      const isEmployer = await db.employers.findFirst({ where: { employerEmail: email } });
      if (!isEmployer) return new NextResponse('Employer not found', { status: 400 });

      const company = await db.company.findFirst({
        where: { userId, isEmployerID: isEmployer.id }
      });
      if (!company) return new NextResponse('Company profile not found', { status: 400 });

      const plan = await db.employerPlans.findFirst({ where: { id: planID } });
      if (!plan) return new NextResponse('Plan not found', { status: 400 });

      const accountBalanced = await db.accountBalance.findFirst({
        where: { userEmail: email, isEmployerID: isEmployer.id },
        select: { id: true }
      });

      if (!accountBalanced) return new NextResponse('Account balance not setup', { status: 400 });

      const existingPurchase = await db.purchaseJobPlan.findFirst({
        where: { userId, planID, invoiceID: reference }
      });

      if (existingPurchase) {
        console.log("⚠️ Duplicate webhook call ignored");
        return new NextResponse('Already handled', { status: 200 });
      }

      const invoiceID = reference || '#HG' + cryptoRandomString({ length: 8, type: 'alphanumeric' }).toUpperCase();

      await db.purchaseJobPlan.create({
        data: {
          userId,
          fullName: dbUser.name!,
          isEmployerID: isEmployer.id,
          planID: plan.id,
          county: company.county!,
          town: company.town,
          postal: company.postal,
          zip: company.zip,
          companyName: company.company_name!,
          companyID: company.id,
          invoiceID,
          planName: plan.name,
          planPrice: plan.price,
          planUnits: plan.unit,
        },
      });

      await db.accountBalance.update({
        where: { id: accountBalanced.id },
        data: {
          units: { increment: plan.unit },
          balance: { increment: plan.price },
        },
      });

      console.log('✅ Payment confirmed via webhook for:', reference);
    } catch (error) {
      console.error('❌ Webhook processing error:', error);
      return new NextResponse('Webhook error', { status: 500 });
    }
  }

  return new NextResponse('OK');
}
