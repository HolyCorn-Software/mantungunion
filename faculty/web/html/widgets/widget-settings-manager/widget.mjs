/**
 * Copyright 2023 HolyCorn Software
 * The eHealthi Project
 * This widget permits easy management of frontend settings, especially for widgets such as frequently-asked-questions, and info-services.
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import uuid from "/$/system/static/comm/uuid/uuid.mjs";
import ListDataManager from "/$/system/static/html-hc/widgets/list-data-manager/widget.mjs";



/**
 * @template T
 * @extends ListDataManager<T>
 */
export default class WidgetSettingsManager extends ListDataManager {

    /**
     * @template SettingsKey
     * @param {object} param0
     * @param {htmlhc.widget.list_data_manager.Display<T&faculty.managedsettings.all[SettingsKey]['data']>} param0.displayConfig 
     * @param {htmlhc.widget.multiflexform.MultiFlexFormDefinitionData} param0.form 
     * @param {SettingsKey|(keyof faculty.managedsettings.all)} param0.settingsKey
     * @param {string} param0.title
     * @param {keyof T} param0.idField
     */
    constructor({ displayConfig, form, settingsKey, title, idField = 'id' }) {
        super(
            {
                title,
                config: {
                    fetch: async () => {
                        return (async function* () {
                            const data = (await hcRpc.system.settings.get({ faculty: 'web', namespace: 'widgets', name: settingsKey })) || [];
                            for (const item of data) {
                                yield item
                            }
                        })()
                    },
                    display: displayConfig,
                    input: form,
                    create: async (input) => {
                        // To make this method serve both for create, and update, we need to only work with new items that are truly new (that don't have ids)
                        const updates = input.filter(x => (typeof x[idField]) != 'undefined')
                        const nw = input.filter(x => (typeof x[idField]) == 'undefined').map(x => ({ [idField]: uuid(), ...x, }))
                        const old = this.content.filter(x => updates.findIndex(u => u[idField] == x[idField]) == -1)
                        const items = [...old, ...updates, ...nw]
                        await hcRpc.engTerminal.faculty.settings.set('web', { namespace: 'widgets', name: settingsKey, value: items })
                    },
                    delete: async (input) => {
                        const items = this.content.filter(x => input.findIndex(y => x[idField] == y[idField]) == -1)
                        await hcRpc.engTerminal.faculty.settings.set('web', { namespace: 'widgets', name: settingsKey, value: items })
                    },
                    edit: {

                    }
                }
            }
        )
    }

}