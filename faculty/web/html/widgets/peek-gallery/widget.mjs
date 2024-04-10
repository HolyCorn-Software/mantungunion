/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (peek-gallery) allows a user to peek (view a few items of) the organization's gallery
 */

import MantungButton from "../mantung-button/widget.mjs";
import StandardSlider from "../standard-slider/widget.mjs";
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
                icon: './view-more.svg'
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
                get: ({ widgetObject: widget }) => ({ galleryEventLabel: widget.galleryEventLabel, image: widget.image, caption: widget.caption, id: widget.id })
            }
        }, 'items')

        this.waitTillDOMAttached().then(() => {
            const sampleEventLabels = [
                'African Youth Festival 2028',
                'Miss Culture Cameroon 2035',
                'Mantung Day 2026'
            ]

            const sampleEventCaptions = [
                ''
            ]

            const sampleImgRange = { min: 1, max: 4 }
            this.items = []

            for (let i = 0; i < 5; i++) {

                this.items.push(
                    {
                        id: `sample-${i}`,
                        galleryEventLabel: sampleEventLabels[i % sampleEventLabels.length],
                        caption: sampleEventCaptions[i % sampleEventCaptions.length],
                        image: `./res/sample${(i % (sampleImgRange.max - sampleImgRange.min + 1)) + sampleImgRange.min}.jpeg`
                    }
                );
            }
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