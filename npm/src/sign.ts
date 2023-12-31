import { signJWT } from "./globals.js";
import crypto from 'crypto';

export default async function sign(body: object, params: string | null, private_key: string) {
    let keys: string[] = [];
    let unsorted_data: { [key: string]: any } = {};

    let params_object: object = {};
    if (params && params.length > 0) {
        params_object = Object.fromEntries(new URLSearchParams(params))
    }

    unsorted_data = {
        ...params_object,
        ...body
    };
    keys = Object.keys(unsorted_data).sort();

    let data: { [key: string]: any } = {};
    await keys.forEach((key) => {
        data[key] = unsorted_data[key];
    });

    const hash = crypto.createHash('sha512');
    hash.update(JSON.stringify(data));
    const output_sha512_checksum: string = hash.digest('hex');

    console.log("OUTPUT CHECKSUM", output_sha512_checksum, "OUTPUT DATA", JSON.stringify(data));

    data = {
        checksum: output_sha512_checksum
    }

    let jwt = await signJWT(data, private_key);

    return jwt; 
}