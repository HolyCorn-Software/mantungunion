/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (read-area-history), allows a user to read about the history of an area in the union
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import SectionsThread from "/$/system/static/html-hc/widgets/sections-thread/widget.mjs";


const area = Symbol()


export default class ReadAreaHistory extends SectionsThread {

    constructor() {
        super();
        this.content.push(
            {
                label: `In the beginning`,
                html: hc.spawn({
                    innerHTML: `In the beginning, there was history.`
                })
            }
        );

        this.html.classList.add(...ReadAreaHistory.classList);

        /** @type {string} */ this.area
        Reflect.defineProperty(this, 'area', {
            set: (value) => {
                if (value != 0 && !value) return;

                this[area] = value;

                this.blockWithAction(async () => {
                    if (this.area != value) return;
                    console.log(`Reading history of `, value)

                    const history = await hcRpc.web.getAreaHistory(value)
                    this.content = []
                    this.content.push({
                        label: `History`,
                        html: hc.spawn({
                            direct: { innerText: history },
                            classes: ['history-content']
                        })
                    })
                })
            },
            get: () => this[area],
            configurable: true,
            enumerable: true
        })

    }

    /** @readonly */
    static classList = ['hc-mantungunion-read-area-history']

}


hc.importModuleCSS(import.meta.url)