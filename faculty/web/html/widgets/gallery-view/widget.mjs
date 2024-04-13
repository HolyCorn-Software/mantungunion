/**
 * Copyright 2024 HolyCorn Software
 * the mantungunion Project
 * This widget (gallery-view), is where users view the gallery of the system
 */

import GallerySection from "./section.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class GalleryView extends Widget {


    constructor() {
        super();
        super.html = hc.spawn({
            classes: GalleryView.classList,

            innerHTML: `
                <div class='container'>
                    <div class='sections'></div>
                </div>
            `
        });

        this.blockWithAction(async () => {
            const stream = await hcRpc.web.gallery.getEvents();
            const populate = async () => {
                for await (const anEvent of stream) {
                    this.html.$(':scope >.container >.sections').appendChild(
                        new GallerySection({
                            event: anEvent
                        }).html
                    )
                }
            }

            populate()
        })
    }


    /** @readonly */
    static classList = ['hc-mantungunion-gallery-view']

}