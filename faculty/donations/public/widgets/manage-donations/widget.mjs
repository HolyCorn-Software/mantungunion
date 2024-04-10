/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (manage-donations), allows an administrator to manage the donations that are ongoing in the system.
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import ListDataManager from "/$/system/static/html-hc/widgets/list-data-manager/widget.mjs";


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
                    }
                ],
                fetch: () => {
                    return hcRpc.donations.data.getDonations()
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
                        }
                    ]
                ],

                create: async (input) => {
                    for (const entry of input) {
                        entry.amount = {
                            value: entry['amount.value'],
                            currency: 'XAF'
                        }
                        delete entry['amount.value']
                    }

                    for (const entry of input) {
                        await hcRpc.donations.data.createDonation({
                            data: entry,
                        })
                    }

                    return input
                },
                edit: {
                    setForm: (input) => {
                        return {
                            ...input,
                            'amount.value': input.amount?.value,
                        }
                    }
                }
            }
        })
    }

}