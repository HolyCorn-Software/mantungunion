/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (manager), allows an authorized personnel to manage information about the history of different regions of the union
 */

import WidgetSettingsManager from "../../widget-settings-manager/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";



/**
 * @extends WidgetSettingsManager<mantungunion.ui.info_history.AreaHistory>
 */
export default class HistoryManager extends WidgetSettingsManager {


    constructor() {

        super({
            title: `History`,
            idField: 'area',
            settingsKey: 'area_history',
            displayConfig: [
                {
                    name: 'area',
                    label: `Village`,
                    view: async (input) => {
                        const zones = await hcRpc.modernuser.zonation.getZones()
                        return zones.find(x => x.id == input)?.label || "Unknown village"
                    }
                },
                {
                    name: 'history',
                    label: `History`,
                    view: '::text'
                }
            ],
            form: [
                [
                    {
                        label: `Village`,
                        type: 'customWidget',
                        customWidgetUrl: "/$/modernuser/zonation/static/widgets/zone-input/widget.mjs",
                        name: 'area',
                    }
                ],
                [
                    {
                        label: 'History',
                        name: 'history',
                        type: 'textarea'
                    }
                ]
            ]
        })

    }


}