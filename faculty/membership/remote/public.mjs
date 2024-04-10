/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Membership
 * This module provides the clients over the public web with features related to membership
 */

import muser_common from "muser_common";
import MembershipStatusController from "../status/controller.mjs";




export default class MembershipPublicMethods extends FacultyPublicMethods {

    /**
     * 
     * @param {object} controllers
     * @param {MembershipStatusController} controllers.status
     */
    constructor(controllers) {
        super()
        this.status = new (muser_common.UseridAuthProxy.createClass(MembershipStatusController.prototype))(controllers.status)
    }

}