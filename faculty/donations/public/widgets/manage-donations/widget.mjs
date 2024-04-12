/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (manage-donations), allows an administrator to manage the donations that are ongoing in the system.
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import BrandedBinaryPopup from "/$/system/static/html-hc/widgets/branded-binary-popup/widget.mjs";
import ListDataManager from "/$/system/static/html-hc/widgets/list-data-manager/widget.mjs";


hc.importModuleCSS(import.meta.url)


/**
 * @extends {ListDataManager<mantungunion.donations.data.DonationDetails>}
 */
export default class ManageDonations extends ListDataManager {

    constructor() {
        super({
            title: `Manage Donations`,
            config: {
                display: [
                    {
                        label: `Name`,
                        name: 'label',
                        view: '::text'
                    },
                    {
                        label: `Description`,
                        name: `description`,
                        view: '::text'
                    },
                    {
                        label: `Amount (XAF)`,
                        name: 'amount.value',
                        view: '::text'
                    },
                    {
                        label: `Status`,
                        name: 'ended',
                        view: (ended, input) => `<div class='hc-mantungunion-donations-item-status ${ended ? 'ended' : ''}'>${ended ? `From ${new Date(input.created).toDateString()} to ${new Date(ended).toDateString()}` : `Since ${new Date(input.created).toDateString()}`}</div>`
                    }
                ],
                fetch: () => {
                    return hcRpc.donations.data.getDonations({ includeEnded: true })
                },
                input: [
                    [
                        {
                            label: "Name",
                            type: "text",
                            name: "label",
                        }
                    ],
                    [
                        {
                            label: "Description",
                            type: "textarea",
                            name: "description"
                        }
                    ],
                    [
                        {
                            type: 'number',
                            label: "Amount (XAF)",
                            name: "amount.value",
                            valueProperty: 'valueAsNumber'
                        }
                    ]
                ],

                create: async (input) => {

                    for (const entry of input) {
                        entry.amount.currency = "XAF"
                        await hcRpc.donations.data.createDonation({
                            data: entry,
                        })
                    }

                    return input
                },
                actions: async (input) => {
                    if (!input.ended) {
                        return [

                            // Button for terminating a donation.
                            (() => {
                                const widget = new Widget();
                                widget.html = hc.spawn({
                                    innerHTML: `
                                        <div class='container'></div>
                                    `
                                });

                                const icon = Symbol()
                                widget[
                                    widget.defineImageProperty({
                                        selector: ':scope >.container',
                                        mode: 'inline',
                                        property: icon,
                                        cwd: import.meta.url
                                    })
                                ] = './cancel.svg'

                                widget.html.addEventListener('click', () => {
                                    new BrandedBinaryPopup({
                                        title: `Stop Donation`,
                                        question: `Do you want to permanently stop this donation?`,
                                        positive: `Stop Permanently`,
                                        negative: `Go back`,
                                        execute: async () => {
                                            await hcRpc.donations.data.endDonation({
                                                id: input.id
                                            })
                                            input.ended = true
                                            widget.destroy()
                                        }
                                    }).show()
                                })

                                return widget.html
                            })()
                        ]
                    }
                }
            }
        })
    }

}