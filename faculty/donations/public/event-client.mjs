/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Donations
 * This module facilitates the reception of events sent by the server, to the frontend
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs"
import ClientJSONRPC from "/$/system/static/comm/rpc/websocket-rpc.mjs";



/** @type {DonationsEventClient} */
let instance;

/**
 * @extends JSONRPC.EventChannel.Client<mantungunion.donations.Events>
 */
export default class DonationsEventClient extends ClientJSONRPC.EventChannel.Client {

    /**
     * @deprecated Don't directly instantiate. Use 
     * ```js
     *  DonationsEventClient.get()
     * ```
     * @param {undefined} param0
     */
    constructor(jsonrpc, init, symbol) {
        if (symbol !== authSymbol) {
            throw new Error(`Use the DonationsEventClient.get() method`)
        }
        super(jsonrpc, init)
    }

    static async get() {
        if (instance) {
            return instance
        }
        await realInit()

        return instance = new this(hcRpc.donations.$jsonrpc, async () => {
            if (skipFirstCall) { // If we're to skip the first call (because the events.register() has already been called during the get() method.)
                skipFirstCall = false
                return
            }
            await realInit()
        }, authSymbol)

        function realInit() {
            return hcRpc.donations.payment.registerEvents()
        }
    }

}

const authSymbol = Symbol()