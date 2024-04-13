/*
Copyright 2021 HolyCorn Software
The HCTS Project
The web faculty
*/

import GalleryController from "./gallery/controller.mjs"
import WebPublicMethods from "./remote/public.mjs"


export default async function init() {

    try {

        FacultyPlatform.get().remote.public = new WebPublicMethods({
            gallery: new GalleryController()
        })
        console.log(`${`${platform.descriptor.label}`.yellow} HTTP running`)
    } catch (e) {
        console.log(e)
    }
}
