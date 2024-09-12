import React from "react";
import { format } from "date-fns";
import { Payment} from "@prisma/client";
interface ReceiptProps {
  receipt: Payment;
}

const Receipt = ({ receipt}: ReceiptProps) => {
  const formattedDate = format(new Date(receipt.createdAt), "PPP");
  return (
    <div>
      <div className="page max-w-4xl mx-auto relative border border-gray-200 print:border-none bg-white p-12 print:py-12 print:px-4 shadow-lg print:shadow-none">
        <div className="md:flex print:flex md:justify-between print:justify-between md:items-center print:items-center mb-8">
          <div className="md:text-left print:text-left">
            <img
              className="w-32 md:w-64 mb-4 md:mb-0"
              src="https://remoteok.io/assets/remoteok-logo.png"
              alt="Your Logo"
            />
          </div>
          <div className="md:text-right print:text-right mb-4 md:mb-0 print:mb-0">
            <h1 className="font-bold text-3xl">MPesa Receipt</h1>
            <p suppressHydrationWarning className="text-sm mt-2">
              <strong>MPesa ID:</strong>
              {receipt.mPesaID}
              <br />
              <strong>Date of issue:</strong> {formattedDate}
              <br />
              <strong>Date paid:</strong> {formattedDate}
              <br />
              <strong>Gateway:</strong> Lipa Na MPesa
              <br />
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-sm">
            Hired - Kenya
            <br />
            2400 5th Avenue
            <br />
            90210, Los Angeles, CA
            <br />
            Company Reg. No.: L0L0L0L
            <br />
          </p>
        </div>

        <div className="mb-6">
          <p className="text-sm">
            {receipt.fullName}
            <br />
            {receipt.companyName}
            <br />
            {receipt.postal}-{receipt.zip}{" "}{receipt.town}
            <br />
            {receipt.county}-Kenya
            <br />
          </p>
        </div>

        <div className="mb-6">
          <h1 suppressHydrationWarning className="text-xl font-bold mb-2">
            Ksh.{receipt.amount} received on {formattedDate}
          </h1>
            <p className="text-sm mb-4">Paid with ID: {receipt.mPesaID}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto mb-8">
            <thead className="text-left">
              <tr className="bg-slate-200">
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Payment Gateway</th>
                <th className="py-2 px-4">MPesa ID</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b text-base">
                <td className="py-2 px-4">MPesa wallet top up</td>
                <td className="py-2 px-4">Lipa Na MPesa</td>
                <td className="py-2 px-4">{receipt.mPesaID}</td>
                <td className="py-2 px-4">Ksh. {receipt.amount}.00</td>
              </tr>
              <tr className="border-b bg-slate-200">
                <td colSpan={3} className="py-2 px-4 text-right">
                  Subtotal
                </td>
                <td className="py-2 px-4">
                  Ksh. {receipt.amount}.00
                </td>
              </tr>
              <tr className="border-b font-semibold">
                <td colSpan={3} className="py-2 px-4 text-right">
                  Amount paid
                </td>
                <td className="py-2 px-4">Ksh.{receipt.amount}.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Receipt;
