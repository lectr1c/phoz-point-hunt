'use server'
import QRCode from "qrcode";
import {drive_v3, google} from "googleapis";
import {PDFDocument } from 'pdf-lib'
import {db} from "~/server/db";
import {eq} from "drizzle-orm";
import {coupons as dbCoupons} from "~/server/db/schema";
import stream from "stream";
import { DOMParser } from "xmldom";


export default async function GeneratePDFAction(prevState: {title: string, description: string, success: boolean}, formData: FormData) {

    const coupons = await db.query.coupons.findMany({
        where: eq(dbCoupons.exported, false)
    })

    const doc = await PDFDocument.create();
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

    let page = doc.addPage();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-call
    const parser = new DOMParser();


    coupons.map((coupon, index) => {
        QRCode.toString('https://phöz.com/reg-points/' + coupon.couponCode, { type: "svg"}, function (err, string) {

            const xIndex = index % 3;
            const yIndex = (index / 3);
            console.log(xIndex, Math.trunc(yIndex));

            if (yIndex >= 1 && yIndex%7 === 0) {
                page = doc.addPage();
            }


            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            const svgElement = parser.parseFromString(string, 'image/svg+xml');

            console.log(svgElement)
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
            const pathElement = svgElement.getElementsByTagName('path')[1];

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
            const dAttribute = pathElement.getAttribute('d');


            const x = (xIndex * 178.4) + 45;
            const y = (Math.trunc(yIndex%7) * 112) + 50;

            page.drawText("Poäng: " + coupon.couponWorth, {
                x: x + 75,
                y: y + 25,
                size: 13
            });

            page.drawText("Kod: " + coupon.couponCode, {
                x: x + 75,
                y: y + 40,
                size: 13
            })

            page.drawText('https://phöz.com/reg-points/' + coupon.couponCode, {
                x: x + 5,
                y: y + 5,
                size: 9,
            })

            if (dAttribute != null) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                page.drawSvgPath(dAttribute, {
                    x: x,
                    y: y + 85,
                    scale: 2
                })
            }
        })
    })

    const bytes = await doc.save({
        useObjectStreams: true,
    });

    const response = await drive.files.create({
        media: { body: new stream.PassThrough().end(bytes), mimeType: "application/pdf" },
        requestBody: {
            name: coupons.length + " coupons",
            mimeType: "application/pdf",
            driveId: "0AGqg92ZiFbLQUk9PVA",
            parents: ["0AGqg92ZiFbLQUk9PVA"]
        },
        supportsTeamDrives: true,
    })

    console.log(response);

    return {title: "string", description: "string", success: false};
}

//TODO: https://www.npmjs.com/package/pdf-lib