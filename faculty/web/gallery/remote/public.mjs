/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module allows access to features related to gallery, to users over the public web.
 */

import muser_common from "muser_common";
import GalleryController from "../controller.mjs";


export default class GalleryPublicMethods extends muser_common.UseridAuthProxy.createClass(GalleryController.prototype) {
    /**
     * 
     * @param {GalleryController} controller 
     */
    constructor(controller) {
        super(controller, ['getEvents', 'getRandomPhotos', 'getPhotos'])
    }
}