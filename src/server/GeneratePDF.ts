import pdfkit from "pdfkit";
import blobstream from "blob-stream";
import QRCode from "qrcode";
import SVGtoPDF from "svg-to-pdfkit";

const doc = new pdfkit();

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-assignment
const stream = doc.pipe(blobstream())

const coupons = [
    {
        couponCode: "1010SS",
        couponWorth: 10,
    },
    {
        couponCode: "SSSDD",
        couponWorth: 12,
    }];

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

// eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
stream.on("finish", () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
    const blob = stream.toBlob("application/pdf");


})


//TODO: https://nextjs.org/docs/app/building-your-application/routing/route-handlers