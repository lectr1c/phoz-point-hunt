'use server'
import QRCode from "qrcode";
import SVGtoPDF from "svg-to-pdfkit";
import {drive_v3, google} from "googleapis";
import PDFKit from "pdfkit";
import {db} from "~/server/db";
import {eq} from "drizzle-orm";
import {coupons as dbCoupons} from "~/server/db/schema";


export default async function GeneratePDFAction(prevState: {title: string, description: string, success: boolean}, formData: FormData) {

    const coupons = await db.query.coupons.findMany({
        where: eq(dbCoupons.exported, false)
    })

    const doc = new PDFKit();
    const SCOPES = ['https://www.googleapis.com/auth/drive'];



    const auth = new google.auth.GoogleAuth({
        scopes: SCOPES,
        credentials: {
            private_key: process.env.PRIVATE_KEY,
            client_email: process.env.CLIENT_EMAIL,
        }
    })

    const drive: drive_v3.Drive = google.drive({
        version: 'v3',
        auth: auth,
    });

    coupons.map((coupon, index) => {
        QRCode.toString('https://phöz.com/reg-points/' + coupon.couponCode, {type: 'svg'}, function (err, string) {
            const xIndex = index % 3;
            const yIndex = (index / 3);
            console.log(xIndex, Math.trunc(yIndex));

            if (yIndex >= 1 && yIndex%8 === 0) {
                doc.addPage();
            }

            const x = (xIndex * 198.4) + 2;
            const y = (Math.trunc(yIndex%8) * 106) + 2;

            SVGtoPDF(doc, string, x, y, {width: 75, height: 75});
            doc.font('Courier-Bold').fontSize(13).text("Kod: " + coupon.couponCode, x + 75, y+20, { lineBreak: false });
            doc.font('Courier-Bold').fontSize(13).text("Poäng: " + coupon.couponWorth, x + 75, y+35, { lineBreak: false });

            doc.font('Courier').fontSize(9).text('https://phöz.com/reg-points/' + coupon.couponCode, x+5, y + 75, {
                lineBreak: false
            });
        })
    })

    doc.end();


    const response = await drive.files.create({
        media: { body: doc, mimeType: "application/pdf" },
        requestBody: {
            name: coupons.length + " coupons",
            mimeType: "application/pdf",
            driveId: "0AGqg92ZiFbLQUk9PVA",
            parents: ["0AGqg92ZiFbLQUk9PVA"]
        },
        supportsTeamDrives: true,
    })


    return {title: "string", description: "string", success: false};
}

//TODO: https://www.npmjs.com/package/pdf-lib