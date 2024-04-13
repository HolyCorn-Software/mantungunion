/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (peek-gallery) allows a user to peek (view a few items of) the organization's gallery
 */

import MantungButton from "../mantung-button/widget.mjs";
import StandardSlider from "../standard-slider/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class PeekGallery extends Widget {


    constructor() {
        super()
        super.html = hc.spawn({
            classes: PeekGallery.classList,
            innerHTML: `
                <div class='container'>
                    <div class='title'>Event Gallery</div>
                    <div class='items'></div>
                    <div class='actions'>
                        <div class='more'></div>
                    </div>
                </div>
            `
        });

        this.html.$('.container >.actions >.more').appendChild(
            new MantungButton({
                content: `View More`,
                icon: './view-more.svg',
                onclick: () => window.location = '/gallery/'
            }).html
        );

        const slider = new StandardSlider();

        this.html.$('.container >.items').appendChild(slider.html)

        /** @type {mantungunion.ui.peek_gallery.Item[]} */ this.items
        this.pluralWidgetProperty({
            selector: ['', ...PeekGallery.Item.classList].join('.'),
            parentSelector: '.hc-wide-slider >.container >.items',
            target: this,
            transforms: {
                set: (input) => new PeekGallery.Item(input).html,
                get: ({ widgetObject: widget }) => ({ galleryEventLabel: widget.galleryEventLabel, image: widget.image, caption: widget.caption })
            }
        }, 'items')

        this.blockWithAction(async () => {

            const photoStream = await hcRpc.web.gallery.getRandomPhotos();

            (async () => {
                for await (const item of photoStream) {
                    this.items.push({
                        image: item.url,
                        caption: item.caption,
                    })
                }
            })()
        })
    }

    static Item = class extends Widget {

        /**
         * 
         * @param {PeekGallery['items'][number]} data 
         */
        constructor(data) {
            super();

            super.html = hc.spawn({
                classes: PeekGallery.Item.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='image'></div>
                        <div class='galleryEventLabel'></div>
                        <div class='caption'></div>
                    </div>
                `
            })

            /** @type {string} */ this.id

            /** @type {string} */ this.galleryEventLabel
            /** @type {string} */ this.caption
            for (
                const property of
                [
                    'galleryEventLabel',
                    'caption',
                ]
            ) {
                this.htmlProperty(`.container >.${property}`, property, 'innerHTML')
            }

            /** @type {string} */ this.image
            this.defineImageProperty({
                selector: '.container >.image',
                property: 'image',
                mode: "background",
                cwd: import.meta.url,
            });

            Object.assign(this, data)
        }


        /** @readonly */
        static classList = ['hc-mantungunion-peek-gallery-item']

    }



    /** @readonly */
    static classList = ['hc-mantungunion-peek-gallery']

}