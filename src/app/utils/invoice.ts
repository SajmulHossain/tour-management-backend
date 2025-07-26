/* eslint-disable @typescript-eslint/no-explicit-any */
import PDFDocument from "pdfkit";
import AppError from "../errorHelpers/AppError";

export interface IInvoiceData {
  transactionId: string;
  bookingDate: Date;
  username: string;
  tourTitle: string;
  guestsCount: number;
  amount: number;
}

export const generatePdf = async (invoiceData: IInvoiceData): Promise<Buffer<ArrayBufferLike>> => {
  try {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: "A4", margin: 50 });
      const buffer: Uint8Array[] = [];
      doc.on("data", (chunk) => buffer.push(chunk));
      doc.on("end", () => resolve(Buffer.concat(buffer)));
      doc.on("error", (err) => reject(err));

      doc.fontSize(20).text("Invoice", { align: "center" });

      doc.moveDown();

      doc.fontSize(14).text("Transaction ID: " + invoiceData.transactionId);
      doc.text("Booking Date: " + invoiceData.bookingDate);
      doc.text("Booking Date: " + invoiceData.username);

      doc.moveDown();

      doc.text(`Tour: ${invoiceData.tourTitle}`);
      doc.text(`Guests: ${invoiceData.guestsCount}`);
      doc.text(`Total Amount: ${invoiceData.amount.toFixed(2)}`);

      doc.moveDown();

      doc.text("Thank You for booking with us!", { align: "center" });
      doc.end();
    });
  } catch (error: any) {
    throw new AppError(400, error.message || "PDF Making Error");
  }
};
