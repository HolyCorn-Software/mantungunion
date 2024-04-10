/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The info-history widget
 * This widget just invites the user to read more about the organization's history, by presenting a beautiful front.
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";



export default class InfoHistory extends Widget {



    constructor() {
        super();

        super.html = hc.spawn({
            classes: InfoHistory.classList,
            innerHTML: `
                <div class='container'>
                    <div class='main'></div>
                </div>
            `
        });

        this.html.$('.container >.main').appendChild(
            new ActionButton(
                {
                    content: `Get to know our History`,
                    hoverAnimate: false,
                    onclick: async () => {
                        window.location = '/area-history/'
                    }
                }
            ).html
        )

    }

    /** @readonly */
    static classList = ['hc-mantungunion-info-history']

}