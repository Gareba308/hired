'use client';

import React from 'react'
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { trpc } from '@/app/_trpc/client';

const CallBack = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const reference = searchParams.get('reference');
    const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
    const [errorMessage, setErrorMessage] = useState('');
    const { mutate: verifyPay } = trpc.verifyEmployerPayment.useMutation({
        onSuccess: () => {
          setStatus('success');
          setTimeout(() => {
            router.push('/manage/transactions');
          }, 500);
        },
        onError: (error) => {
          console.error("❌ Payment verification error:", error);
          setErrorMessage(error.message || 'Something went wrong during payment verification.');
          setStatus('error');
        },
      });
  
    useEffect(() => {
      if (reference) {
        verifyPay({ reference });
      }
    }, [reference]);
  return (
    <div className="p-6 text-center">
    {status === 'verifying' && <p>Verifying your payment...</p>}
    {status === 'success' && <p>✅ Payment successful! Redirecting to dashboard...</p>}
    {status === 'error' && (
      <>
        <p>❌ Payment failed or could not be verified.</p>
        <p className="mt-2 text-sm text-red-500">{errorMessage}</p>
      </>
    )}
  </div>
  )
}

export default CallBack