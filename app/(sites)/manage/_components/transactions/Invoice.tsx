import React from "react";
import { format } from "date-fns";
import "@/lib/suppressHydration"
import { PurchaseJobPlan } from "@prisma/client";
interface InvoiceProps {
  purchase: PurchaseJobPlan;
}

const Invoice = ({ purchase}: InvoiceProps) => {

  const formattedDate = format(new Date(purchase.createdAt), "PPP");

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
            <h1 className="font-bold text-3xl">Invoice</h1>
            <p className="text-sm mt-2">
              <strong>Invoice number:</strong>
              {purchase.invoiceID}
              <br />
              <strong>Date of issue:</strong> {formattedDate}
              <br />
              <strong>Date paid:</strong> {formattedDate}
              <br />
              <strong>Plan Name:</strong> {purchase.planName}
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
            <strong>Invoiced to:</strong>
            <br />
            {purchase.fullName}
            <br />
            {purchase.companyName}
            <br />
            {purchase.postal}-{purchase.zip}{" "}{purchase.town}
            <br />
            {purchase.county}-Kenya
            <br />
          </p>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-bold mb-2">
            Ksh.{purchase.planPrice} used to purchase {purchase.planUnits} units
            on {formattedDate}
          </h1>
          {
            <p className="text-sm mb-4">Paid with ID {purchase.invoiceID}</p>}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full table-auto mb-8">
            <thead className="text-left">
              <tr className="bg-slate-200">
                <th className="py-2 px-4">Description</th>
                <th className="py-2 px-4">Unit</th>
                <th className="py-2 px-4">Unit price</th>
                <th className="py-2 px-4">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2 px-4">{purchase.planName}</td>
                <td className="py-2 px-4">{purchase.planUnits}</td>
                <td className="py-2 px-4">Ksh. {purchase.planPrice}</td>
                <td className="py-2 px-4">Ksh. {purchase.planPrice}.00</td>
              </tr>
              <tr className="border-b bg-slate-200">
                <td colSpan={3} className="py-2 px-4 text-right">
                  Subtotal
                </td>
                <td className="py-2 px-4">
                  Ksh. {purchase.planPrice}.00
                </td>
              </tr>
              <tr className="border-b font-semibold">
                <td colSpan={3} className="py-2 px-4 text-right">
                  Amount paid
                </td>
                <td className="py-2 px-4">Ksh.{purchase.planPrice}.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
