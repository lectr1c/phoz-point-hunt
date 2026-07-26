"use server";
import QRCode from "qrcode";
import { PDFDocument } from "pdf-lib";
import { db } from "~/lib/db";
import { and, eq, inArray, isNull } from "drizzle-orm";
import { coupons, coupons as dbCoupons, points } from "~/lib/db/schema";
import { DOMParser } from "xmldom";
import { revalidatePath } from "next/cache";

export default async function GeneratePDFAction() {
  const couponsDB = await db
    .select({
      id: coupons.id,
      couponWorth: coupons.couponWorth,
      couponCode: coupons.couponCode,
      exported: coupons.exported,
    })
    .from(coupons)
    .leftJoin(points, eq(points.couponId, coupons.id))
    .where(and(eq(coupons.exported, false), isNull(points.id)))
    .limit(96);

  if (couponsDB.length === 0) {
    return {
      title: "Inga Kuponger",
      description: "Alla kuponger som finns i systemet ligger i ett pdf",
      success: false,
    };
  }

  const doc = await PDFDocument.create();

  let page = doc.addPage();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
  const parser = new DOMParser();

  couponsDB.map((coupon, index) => {
    QRCode.toString(
      "https://phoz-point-hunt.vercel.app/reg-points/" + coupon.couponCode,
      { type: "svg" },
      function (err, string) {
        const xIndex = index % 3;
        const yIndex = index / 3;

        if (yIndex >= 1 && yIndex % 8 === 0) {
          page = doc.addPage();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const svgElement = parser.parseFromString(string, "image/svg+xml");

        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
        const pathElement = svgElement.getElementsByTagName("path")[1];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const dAttribute = pathElement.getAttribute("d");

        const x = xIndex * 198.4 + 24;
        const y = Math.trunc(yIndex % 8) * 106 + 10;

        page.drawText("Poäng: " + coupon.couponWorth, {
          x: x + 75,
          y: y + 25,
          size: 13,
        });

        page.drawText("Kod: " + coupon.couponCode, {
          x: x + 75,
          y: y + 40,
          size: 13,
        });

        if (dAttribute != null) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          page.drawSvgPath(dAttribute, {
            x: x,
            y: y + 85,
            scale: 2,
          });
        }
      },
    );
  });

  const bytes = await doc.save({
    useObjectStreams: true,
  });

  const filename = `${couponsDB.length}-coupons-${Date.now()}.pdf`;

  await db
    .update(dbCoupons)
    .set({ exported: true })
    .where(
      inArray(
        dbCoupons.id,
        couponsDB.map((couponDB) => couponDB.id),
      ),
    );

  revalidatePath("/dashboard/ansvarig");

  return {
    title: "PDF genererad",
    description: "Filen laddas ner till din enhet",
    success: true,
    pdfBase64: Buffer.from(bytes).toString("base64"),
    filename,
  };
}
