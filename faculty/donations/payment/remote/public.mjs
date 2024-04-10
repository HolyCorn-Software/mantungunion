/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module allows access to donation features that directly deal with the collection of funds
 */

import muser_common from "muser_common";
import DonationsPaymentController from "../controller.mjs";


/**
 * @extends mantungunion.donations.payment.PublicMethods
 */
export default class DonationsPaymentPublicMethods extends FunctionProxy {

    /**
     * 
     * @param {DonationsPaymentController} controller 
     */
    constructor(controller) {
        super(
            controller,
            {
                arguments: async (_data, ...args) => {
                    // Try to authenticate the user
                    // If not, still allow the user to access the method.
                    // It's up to the method to decide whether to deauth the user or not
                    try {
                        const userid = (await muser_common.getUser(args[0])).id
                        const input = { ...args[1], userid };
                        Reflect.defineProperty(input, '$client', { value: args[0], enumerable: false, writable: false })
                        return [input]
                    } catch { }
                    return [{ ...args[1], $client: args[0] }, ...args.slice(1)]
                }
            }
        );

    }

}