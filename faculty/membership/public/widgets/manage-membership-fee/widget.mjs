/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Membership
 * This widget allows an authorized personnel to set the membership fee
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";
import PopupForm from "/$/system/static/html-hc/widgets/popup-form/form.mjs";


export default class ManageMembershipFee extends Widget {

    constructor() {
        super();

        super.html = hc.spawn({
            classes: ManageMembershipFee.classList,
            innerHTML: `
                <div class='container'>
                    <div class='main'>
                        <div class='info'>
                            Membership Fee: <amount></amount>
                        </div>

                        <div class='edit'></div>
                        
                    </div>
                </div>
            `
        });

        let fee;



        this.blockWithAction(async () => {
            fee = await hcRpc.membership.status.getMembershipFee()
            this.html.$(':scope >.container >.main >.info >amount').innerHTML = `${fee.value} ${fee.currency}`
        })

        this.html.$(':scope >.container >.main >.edit').appendChild(
            new ActionButton(
                {
                    content: `Edit`,
                    onclick: async () => {

                        let fee;

                        const popup = new PopupForm({
                            title: `Change Registration Fee`,
                            caption: `This change will apply to new members. Old members who already paid, would be left alone.`,
                            form: [
                                [
                                    {
                                        label: `Amount (XAF)`,
                                        name: 'amount.value',
                                        valueProperty: 'valueAsNumber',
                                        type: 'number'
                                    }
                                ]
                            ],

                            execute: async () => {
                                await hcRpc.engTerminal.faculty.settings.set('membership', {
                                    value: {
                                        currency: fee.currency,
                                        value: popup.value["amount.value"]
                                    },
                                    name: 'membership_fee',
                                    namespace: 'membershipDefault'
                                })


                                this.html.$(':scope >.container >.main >.info >amount').innerHTML = `${popup.value["amount.value"]} ${fee.currency}`


                            },
                            positive: `Update`,
                            negative: `Go back`

                        })

                        popup.show()

                        popup.blockWithAction(async () => {

                            fee = await hcRpc.membership.status.getMembershipFee()

                            popup.value = {
                                "amount.value": fee.value
                            }
                        })
                    }
                }
            ).html
        )


    }


    /** @readonly */
    static classList = ['hc-mantungunion-membership-manage-membership-fee']
}