import { CollectionProxy } from "../../system/database/collection-proxy.js";

/** @type {mantungunion.donations.Collections} */
const collections = new CollectionProxy(
    {
        'data': 'data',
        'payment': 'payments'
    }
);

export default collections