/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (section), is part of the gallery-view widget.
 * This widget represents a single event, and it's photos.
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class GallerySection extends Widget {


    /**
     * 
     * @param {object} param0 
     * @param {mantungunion.web.gallery.PhysicalEventDBEntry} param0.event
     */
    constructor({ event } = {}) {
        super();

        super.html = hc.spawn({
            classes: GallerySection.classList,
            innerHTML: `
                <div class='container'>
                    <div class='top'>
                        <div class='title'></div>
                    </div>

                    <div class='content'></div>
                    
                </div>
            `
        });

        this.event = event

        this.blockWithAction(async () => {
            const data = await hcRpc.web.gallery.getPhotos({ event: this.event.id });

            this.html.$(':scope >.container >.top >.title').innerText = this.event.label

            const consume = async () => {
                for await (const item of data) {
                    this.html.$(':scope >.container >.content').appendChild(
                        new GallerySection.Item(item).html
                    )
                }
            }

            consume()

        })

    }

    static Item = class extends Widget {


        /**
         * 
         * @param {mantungunion.web.gallery.Photo} photo 
         */
        constructor(photo) {
            super();

            super.html = hc.spawn({
                classes: GallerySection.Item.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='image'></div>
                        <div class='caption'></div>
                    </div>
                `
            });

            this.data = photo
            this[
                (this.defineImageProperty({
                    selector: ':scope >.container >.image',
                    property: Symbol(),
                    mode: 'inline',
                }))
            ] = photo.url

            this.html.$(".container >.caption").innerText = photo.caption


        }

        /** @readonly */
        static classList = ['hc-mantungunion-gallery-view-section-item']
    }


    /** @readonly */
    static classList = ['hc-mantungunion-gallery-view-section']

}