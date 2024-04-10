/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (info-members), shows a few members of the union, and invites others to sign up
 */

import MantungJoinButton from "../join-button/widget.mjs";
import StandardSlider from "../standard-slider/widget.mjs";
import AlarmObject from "/$/system/static/html-hc/lib/alarm/alarm.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class InfoMembers extends Widget {


    constructor() {
        super();

        super.html = hc.spawn(
            {
                classes: InfoMembers.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='title'>Our Members are saying Hi</div>
                        <div class='slider'></div>
                        <div class='actions'>
                            <div class='more'>View more members</div>
                            <div class='join'></div>
                        </div>
                    </div>
                `
            }
        );

        const slider = new StandardSlider()

        this.html.$(':scope >.container >.slider').appendChild(slider.html)

        /** @type {htmlhc.lib.alarm.AlarmObject<{items: mantungunion.ui.info_members.Item[]}>} */ this.statedata = new AlarmObject()
        this.statedata.items = [];


        slider.pluralWidgetProperty(
            {
                selector: '*',
                parentSelector: '.container >.main >.hc-wide-slider >.container >.items',
                property: 'itemsData',
                transforms: {
                    set: (input) => {
                        return new InfoMembers.Item(input).html
                    },
                    get: html => {
                        /** @type {Item} */
                        const widget = html.widgetObject
                        return {
                            image: widget.image,
                            label: widget.label
                        }
                    }
                }
            }
        );


        /** @type {mantungunion.ui.info_members.Item[]} */ this.items
        Reflect.defineProperty(this, 'items', {
            get: () => slider?.itemsData,
            set: d => {
                slider.itemsData = d
            },
            configurable: true,
            enumerable: true
        });

        this.html.$(':scope >.container >.actions >.join').appendChild(
            new MantungJoinButton().html
        )


        const sampleNames = ["Voh Bryant", "Bonvomuk Cedrick", "Mbeh John", "Ambe Jacob"]

        for (let i = 0; i < 7; i++) {

            this.items.push(
                {
                    id: `sample-${i}`,
                    label: sampleNames[i % sampleNames.length],
                    image: new URL(`./res/sample${(i % 3) + 1}.jpg`, import.meta.url).href,
                }
            )
        }

    }

    static Item = class extends Widget {

        /**
         *  @param {InfoMembers['items'][number]} data 
        */
        constructor(data) {

            super();

            super.html = hc.spawn(
                {
                    classes: InfoMembers.Item.classList,
                    innerHTML: `
                        <div class='container'>
                            <div class='img'></div>
                            <div class='label'></div>
                        </div>
                    `
                }
            );

            /** @type {string} */ this.image
            this.defineImageProperty({
                selector: ':scope >.container >.img',
                property: 'image',
                mode: 'background'
            });

            /** @type {string} */ this.label
            this.htmlProperty(':scope >.container >.label', 'label', 'innerHTML')

            /** @type {string} */ this.id


            Object.assign(this, arguments[0])

        }

        /** @readonly */
        static classList = ['hc-mantungunion-info-members-item']

    }


    /** @readonly */
    static classList = ['hc-mantungunion-info-members']

}