'use server'

import {db} from "~/lib/db";
import { coupons } from "~/lib/db/schema";
import ShortUniqueId from "short-unique-id";

export default async function CreateCouponsAction(prevState: {title: string, description: string, success: boolean}, formData: FormData) {

    const { couponAmt, couponWorth} = {
        couponAmt: formData.get('couponAmt') as unknown as number,
        couponWorth: formData.get('couponWorth') as unknown as number,
    }

    if (couponAmt === 0)
        return { title: "Noll kuponger", description: `Skapade inga kuponger :(`, success: false };

    if (couponWorth === 0)
        return { title: "Värdelösa Kuponger", description: `oop 0 poäng???`, success: false };

    const idGenerator = new ShortUniqueId({
        dictionary: "alphanum_upper",
        length: 6
    });

    const newCoupons: {
        couponWorth: number,
        couponCode: string,
        exported: boolean,
    }[] = []

    for (let i = 0; i < couponAmt; i++) {
        newCoupons.push({
            couponWorth: couponWorth,
            couponCode: idGenerator.rnd(),
            exported: false,
        })
    }


    await db.insert(coupons).values(newCoupons);

    return { title: "Skapade Kuponger", description: `Skapade ${couponAmt} kuponger med värde ${couponWorth}`, success: true };
}