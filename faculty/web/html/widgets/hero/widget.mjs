/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project.
 * This widget (hero), serves as a giant introduction to the website, featuring an image, and some actions.
 */


import MantungJoinButton from "../join-button/widget.mjs";
import MantungButton from "../mantung-button/widget.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs"



export default class Hero extends Widget {

    constructor() {
        super()
        super.html = hc.spawn(
            {
                classes: Hero.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='main'>
                            <div class='text'>
                                <div class='title'>Mantung Youth Union</div>
                                <div class='caption'>Together, we go far</div>
                            </div>

                            <div class='actions'></div>
                        </div>
                    </div>
                `
            }
        );

        /** @type {string} */ this.title
        /** @type {string} */ this.caption
        for (const property of ['title', 'caption']) {
            this.htmlProperty(`:scope >.container >.main >.text >.${property}`, property, 'innerHTML')
        }

        /** @type {HTMLElement[]} */ this.actions
        this.pluralWidgetProperty(
            {
                selector: '*',
                parentSelector: ':scope >.container >.main >.actions',
                childType: 'html'
            },
            'actions'
        );

        const goto = (path) => {
            if (window.location.pathname != path) {
                window.location = path
            }
        }

        this.actions.push(
            new MantungJoinButton().html,
            new MantungButton(
                {
                    content: `Support Us`,
                    icon: '../info-donate/donate.svg',
                    onclick: async () => {
                        goto`/donate/`

                    }
                }
            ).html
        )


    }

    /**
     * @readonly
     * @returns {string[]}
     */
    static get classList() {
        return ['hc-mantungunion-hero']
    }

}
