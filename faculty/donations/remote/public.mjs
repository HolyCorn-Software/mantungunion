/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Donations
 * This module allows clients to access functionalities of the faculty over the public web
 */

import DonationsDataController from "../data/controller.mjs";
import DonationsDataPublicMethods from "../data/remote/public.mjs";
import DonationsPaymentController from "../payment/controller.mjs";
import DonationsPaymentPublicMethods from "../payment/remote/public.mjs";


export default class DonationsPublicMethods extends FacultyPublicMethods {

    /**
     * 
     * @param {object} _controllers 
     * @param {DonationsDataController} _controllers.data
     * @param {DonationsPaymentController} _controllers.payment
     */
    constructor(_controllers) {
        super()
        this.data = new DonationsDataPublicMethods(_controllers.data)
        this.payment = new DonationsPaymentPublicMethods(_controllers.payment)
    }


}