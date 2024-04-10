/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (news-listings), shows highlights of news (blog-posts).
 * The user can click on an item, and go to the news page
 */

import MantungButton from "../mantung-button/widget.mjs";
import StandardSlider from "../standard-slider/widget.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class NewsListings extends Widget {

    constructor() {
        super();

        super.html = hc.spawn({
            classes: NewsListings.classList,
            innerHTML: `
                <div class='container'>
                    <div class='title'>Announcements &amp; News</div>
                    <div class='main'>
                        <div class='items'></div>
                        <div class='more'>More News</div>
                    </div>
                </div>
            `
        });

        const slider = new StandardSlider();


        /** @type {mantungunion.ui.news_listings.Item[]} */ this.items
        slider.pluralWidgetProperty(
            {
                selector: ['', ...NewsListings.Item.classList].join('.'),
                parentSelector: '.container >.main >.items .hc-wide-slider >.container >.items',
                target: this,
                transforms: {
                    /**
                     * 
                     * @param {this['items'][number]} input 
                     */
                    set: (input) => {
                        return new NewsListings.Item(input).html
                    },
                    get: ({ widgetObject: widget }) => ({ image: widget.image, title: widget.title, caption: widget.caption, id: widget.id, })
                }
            },
            'items'
        )


        this.html.$('.container >.main >.items').appendChild(slider.html)

        this.waitTillDOMAttached().then(() => {
            this.items.push(
                {
                    id: '1',
                    title: `Mantung-born student graduates first in her batch`,
                    caption: `
                        On March 20th 2024, Adeline Nde graduated with high honours, effectively emerging overall best student of her batch. The union offered her a congratulatory prize
                    `,
                    image: '../hero/bg.png'
                },
                {
                    id: '2',
                    title: `Mantung-born student graduates first in her batch`,
                    caption: `
                        On March 20th 2024, Adeline Nde graduated with high honours, effectively emerging overall best student of her batch. The union offered her a congratulatory prize
                    `,
                    image: '../hero/bg.png'
                }
            )
        })

    }

    static Item = class extends Widget {


        /**
         * 
         * @param {NewsListings['items'][number]} data 
         */
        constructor(data) {
            super();

            super.html = hc.spawn({
                classes: NewsListings.Item.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='img'></div>
                        <div class='content'>
                            <div class='title'></div>
                            <div class='caption'></div>
                        </div>

                        <div class='actions'>
                            <div class='read-more'></div>
                        </div>
                    </div>
                `
            });

            /** @type {string} */ this.image
            this.defineImageProperty({
                selector: '.container >.img',
                property: 'image',
                mode: 'background',
                cwd: import.meta.url
            });

            /** @type {string} */ this.title
            this.htmlProperty('.container >.content >.title', 'title', 'innerHTML')

            /** @type {string} */ this.caption
            this.htmlProperty('.container >.content >.caption', 'caption', 'innerHTML')

            /** @type {string} */ this.id

            this.html.$('.container >.actions >.read-more').appendChild(
                new MantungButton(
                    {
                        content: `Read More`,
                        icon: './read-more.svg',
                        onclick: async () => {

                        }
                    }
                ).html
            );

            Object.assign(this, data)
        }


        /** @readonly */
        static classList = ['hc-mantungunion-news-listings-item']

    }

    /** @readonly */
    static classList = ['hc-mantungunion-news-listings']

}