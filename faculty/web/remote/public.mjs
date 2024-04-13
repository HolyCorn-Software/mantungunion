/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module allows other components to access some features over the public web.
 * This features are particularly related to content, and non-standard features
 */

import GalleryController from "../gallery/controller.mjs";
import GalleryPublicMethods from "../gallery/remote/public.mjs";


export default class WebPublicMethods extends FacultyPublicMethods {

    /**
     * 
     * @param {object} controllers 
     * @param {GalleryController} controllers.gallery
     */
    constructor(controllers) {
        super();

        this.gallery = new GalleryPublicMethods(controllers.gallery)
    }

    /**
     * This method returns history of a give area.
     * 
     * This is particularly important as history write-ups are long.
     * So, this sends only the history of a specific area
     * @param {string} id 
     */
    async getAreaHistory(id) {
        id = arguments[1]
        if (id != 0 && !id) {
            throw new Exception(`Please, pass an 'id', for the area whose history you want to get.`)
        }
        /** @type {mantungunion.ui.info_history.AreaHistory[]} */
        const allHistory = await FacultyPlatform.get().settings.get({
            namespace: 'widgets',
            name: 'area_history'
        });

        return (allHistory?.find(x => x.area == id))?.history || (() => {
            console.warn(`There's no history for area `, id)
        })()

    }

}