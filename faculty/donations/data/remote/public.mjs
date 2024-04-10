/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Donations
 * This module is specifically meant to allow access to features related to storing data about donations
 */

import muser_common from "muser_common";
import DonationsDataController from "../controller.mjs";


export default class DonationsDataPublicMethods extends muser_common.UseridAuthProxy.createClass(DonationsDataController.prototype) {

    /**
     * 
     * @param {DonationsDataController} controller 
     */
    constructor(controller) {
        return super(
            controller,
            [
                // These methods should not be touched, as they normally do not require authentication.
                'getDonations',
                'getDonation',
            ]
        )
    }


}