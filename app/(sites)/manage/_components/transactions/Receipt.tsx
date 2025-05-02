import React from "react";
import { format } from "date-fns";
import { PurchaseJobPlan } from "@prisma/client";
import Image from "next/image";

interface ReceiptProps {
  receipt: PurchaseJobPlan;
}

const Receipt = ({ receipt }: ReceiptProps) => {
  const formattedDate = format(new Date(receipt.createdAt), "PPP");
  return (
    <div className="page max-w-4xl mx-auto relative border border-gray-200 print:border-none bg-white p-12 print:py-12 print:px-4 shadow-lg print:shadow-none">
      <div className="md:flex print:flex md:justify-between print:justify-between md:items-center print:items-center mb-8">
        <div className="md:text-left print:text-left">
          <Image
            src={
              "https://res.cloudinary.com/dx0i37cyd/image/upload/v1723627737/veryHired_lo5n1w.png"
            }
            height={70}
            width={85}
            alt="Logo"
            title="Logo"
            className="rounded-sm"
            quality={100}
            priority={true}
          />
        </div>
        <div className="md:text-right print:text-right mb-4 md:mb-0 print:mb-0">
          <h1 className="font-bold text-3xl">Transaction Receipt</h1>
          <p suppressHydrationWarning className="text-sm mt-2">
            <strong>Transaction ID:</strong>
            {receipt.invoiceID}
            <br />
            <strong>Date of issue:</strong> {formattedDate}
            <br />
            <strong>Date paid:</strong> {formattedDate}
            <br />
            <strong>Gateway:</strong> External Payment
            <br />
          </p>
        </div>
      </div>

      <div className="mb-6">
        <p className="text-sm">
          Hired Jobs
          <br />
          2400 5th Avenue
          <br />
          90210, Nairobi, KE
          <br />
        </p>
      </div>

      <div className="mb-6">
        <p className="text-sm">
          {receipt.fullName}
          <br />
          {receipt.companyName}
          <br />
          {receipt.postal}-{receipt.zip} {receipt.town}
          <br />
          {receipt.county}
          <br />
        </p>
      </div>

      <div className="mb-6">
        <h1 suppressHydrationWarning className="text-xl font-bold mb-2">
          Kshs.{receipt.planPrice} received on {formattedDate}
        </h1>
        <p className="text-sm mb-4">Paid with ID: {receipt.invoiceID}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full table-auto mb-8">
          <thead className="text-left">
            <tr className="bg-gray-200">
              <th className="py-2 px-4">Description</th>
              <th className="py-2 px-4">Gateway</th>
              <th className="py-2 px-4">Reference</th>
              <th className="py-2 px-4">Units</th>
              <th className="py-2 px-4">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b text-base">
              <td className="py-2 px-4">{receipt.planName}</td>
              <td className="py-2 px-4">External Plan</td>
              <td className="py-2 px-4">{receipt.invoiceID}</td>
              <td className="py-2 px-4">{receipt.planUnits}</td>
              <td className="py-2 px-4">Kshs.{receipt.planPrice}.00</td>
            </tr>
            <tr className="border-b bg-gray-200">
              <td colSpan={3} className="py-2 px-4 text-right">
                Subtotal
              </td>
              <td className="py-2 px-4">Kshs.{receipt.planPrice}.00</td>
            </tr>
            <tr className="border-b font-semibold">
              <td colSpan={3} className="py-2 px-4 text-right">
                Amount paid
              </td>
              <td className="py-2 px-4">Kshs.{receipt.planPrice}.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Receipt;
