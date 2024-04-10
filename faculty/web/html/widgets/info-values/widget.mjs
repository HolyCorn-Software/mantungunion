/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The info-values widget
 * This widget shows information about the organization's values
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";



export default class InfoValues extends Widget {


    constructor() {
        super();

        super.html = hc.spawn(
            {
                classes: InfoValues.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='title'>Our <highlight>values</highlight></div>
                        <div class='main'>
                            <div class='items'></div>
                            <div class='actions'>
                                <div class='more'>Read more about our values</div>
                            </div>
                        </div>
                    </div>
                `
            }
        );

        /** @type {string[]} */ this.items
        this.pluralWidgetProperty(
            {
                selector: ['', ...InfoValues.classList].join('.'),
                parentSelector: '.container >.main >.items',
                transforms: {
                    set: (input) => new InfoValues.Item({ label: input }).html,
                    get: html => html.widgetObject.label
                }
            },
            'items'
        );


        this.items = ['Love', 'Unity', 'Development']


    }


    /** @readonly */
    static classList = ['hc-mantungunion-info-values']


    static Item = class extends Widget {


        constructor({ label } = {}) {
            super();

            super.html = hc.spawn(
                {
                    classes: InfoValues.Item.classList,
                    innerHTML: `
                        <div class='container'>
                            <div class='img'></div>
                            <div class='label'></div>
                        </div>
                    `
                }
            );

            /** @type {string} */ this.label
            this.htmlProperty(':scope >.container >.label', 'label', 'innerHTML')

            this.label = label


            const icon = Symbol()
            this.defineImageProperty(
                {
                    selector: '.container >.img',
                    property: icon,
                    mode: 'inline',
                    cwd: import.meta.url
                }
            );
            this[icon] = './res/heart.svg'

        }

        /** @readonly */
        static classList = ['hc-mantungunion-info-values-item']

    }

}