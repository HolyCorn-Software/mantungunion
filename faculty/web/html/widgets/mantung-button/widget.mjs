/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (mantung-button), is specially designed standard button for most views in this project
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";


export default class MantungButton extends ActionButton {


    /**
     * 
     * @param {object} param0 
     * @param {MantungButton['content']} param0.content
     * @param {MantungButton['onclick']} param0.onclick
     * @param {MantungButton['icon']} param0.icon
     */
    constructor({ content, onclick, icon } = {}) {
        super(
            {
                hoverAnimate: false,

            }
        );
        const widget = new Widget();

        widget.html = hc.spawn({
            classes: ['hc-mantungunion-button-content'],
            innerHTML: `
            <div class='container'>
                <div class='text'>Click Here</div>
                <div class='icon'></div>
            </div>`,
        });


        /** @type {string} */ this.icon

        super.content = widget.html;
        this.defineImageProperty({ selector: `:scope >.container >.content > ${['', ...widget.html.classList].join('.')}> .container >.icon`, property: 'icon', cwd: hc.getCaller(2), mode: 'inline' });


        Object.assign(this, arguments[0])
    }

    /**
     * @param {string} text
     */
    set content(text) {
        super.content.querySelector('.container >.text').innerHTML = text
    }

    /** @returns {string} */
    get content() {
        return super.content.querySelector('.container >.text').innerHTML
    }


}


hc.importModuleCSS(import.meta.url)