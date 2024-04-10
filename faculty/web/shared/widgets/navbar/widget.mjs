/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget, is the navigation bar.
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import dictionary from "/$/system/static/lang/dictionary.mjs";



export default class Navbar extends Widget {


    constructor() {
        super();

        super.html = hc.spawn(
            {
                classes: Navbar.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='logo-section'>
                                <img src='/$/shared/static/logo.png'>
                                <div class='label'>Mantung</div>
                            </div>
                            <div class='trigger'></div>
                            <div class='content'></div>
                        </div>
                    </div>
                `
            }
        );

        const data = Symbol()

        /** @type {ehealthi.ui.navbar.Item[]} */ this.items
        this.pluralWidgetProperty(
            {
                selector: '.item',
                parentSelector: '.container >.main >.trigger',
                property: 'items',
                transforms: {
                    /**
                     * 
                     * @param {ehealthi.ui.navbar.Item} input 
                     * @returns 
                     */
                    set: (input) => {
                        const html = hc.spawn({
                            classes: ['item'],
                            innerHTML: `
                                <div class='label'>${input.label}</div>
                            `
                        });

                        html.addEventListener('click', () => {
                            if (input.href) {
                                const url = new URL(input.href, window.location.href)
                                if (url.pathname == window.location.pathname) {
                                    if (url.hash) {
                                        document.querySelector(url.hash)?.scrollIntoView({ behavior: 'smooth' })
                                    }
                                } else {
                                    window.location = url
                                }
                            }
                        })

                        html[data] = input
                        return html
                    },
                    get: html => html[data]
                }
            }
        );

        this.items = [
            {
                label: `Home`,
                href: '/'
            },
            {
                label: `Join Us`,
                href: '/signup/'
            },
            {
                label: `News`
            },
            {
                label: `Donate`,
                href: '/donate/'
            }
        ];

        // Disclaimer: !
        // Don't use blockWithAction(), because computed style :: position would be 'static' before the stylesheets load, and because of that, the
        // position would be updated to 'relative'. Relative position is bad for the navbar.
        this.waitTillDOMAttached().then(async () => {
            this.html.$('.container >.main >.logo-section >.label').innerHTML = await dictionary.get({ code: 'platform_name', nullValue: 'Mantung' })
        });

        window.addEventListener('scroll', () => {
            this.html.classList.toggle("prominent", document.scrollingElement.scrollTop > 4)
        })
    }

    /**
     * @readonly
     */
    static get classList() {
        return ['hc-ehealthi-navbar']
    }

}
