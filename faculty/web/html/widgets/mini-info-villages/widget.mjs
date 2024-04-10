/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (mini-info-villages), shows minimal information about the villages that make up the association
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class MiniInfoVillages extends Widget {

    constructor() {

        super();

        super.html = hc.spawn(
            {
                classes: MiniInfoVillages.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='title'>We are <count>42</count> independent villages</div>
                        <div class='items'></div>
                    </div>
                `
            }
        );

        /** @type {mantungunion.ui.mini_info_villages.Item[]} */ this.items
        this.pluralWidgetProperty(
            {
                selector: '*',
                parentSelector: ':scope >.container >.items',
                transforms: {
                    set: (input) => {
                        const html = hc.spawn(
                            {
                                classes: ['item'],
                                innerHTML: input.label,
                                onclick: () => window.location = `/area-history/#${input.villageId}`
                            }
                        );
                        html.villageId = input.villageId
                        return html
                    },
                    get: html => ({ label: html.innerText, villageId: html.villageId })
                }
            },
            'items'
        );

        this.blockWithAction(async () => {
            const areas = await hcRpc.modernuser.zonation.getZones()
            this.html.$(':scope >.container >.title >count').innerText = areas.length
            this.items = areas.map(x => ({ label: x.label, villageId: x.id }))
        })


    }

    /** @readonly */
    static classList = ['hc-mantungunion-mini-info-villages']

}