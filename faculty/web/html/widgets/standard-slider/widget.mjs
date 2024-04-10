/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (standard-slider), abstracts the functionality of listing several items in a horizontally-scrollable fashion
 */

import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import WideSlider from "/$/system/static/html-hc/widgets/wide-slider/widget.mjs";



export default class StandardSlider extends Widget {


    constructor() {
        super();

        super.html = hc.spawn(
            {
                classes: StandardSlider.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='navigation'>
                            <div offset="-1">&lt;</div>
                            <div offset="1">&gt;</div>
                        </div>
                        <div class='main'></div>
                    </div>
                `
            }
        );

        const slider = new WideSlider()

        this.html.$(':scope >.container >.main').appendChild(slider.html)

        this.html.$(':scope >.container >.navigation').addEventListener('click', (event) => {
            slider.index = slider.leastVisibleElementIndex + new Number(event.target?.getAttribute?.("offset")).valueOf()
        })

    }

    /** @readonly */
    static classList = ['hc-mantungunion-standard-slider']

}