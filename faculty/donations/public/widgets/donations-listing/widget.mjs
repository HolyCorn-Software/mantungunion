/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (donations-listing), shows a list of donations that are ongoing, so that the user can contribute to them
 */

import DonationsEventClient from "../../event-client.mjs";
import InlineUserProfile from "/$/modernuser/static/widgets/inline-profile/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import MantungButton from "/$/web/html/widgets/mantung-button/widget.mjs";


export default class DonationsListing extends Widget {

    constructor() {

        super();

        super.html = hc.spawn({
            classes: DonationsListing.classList,
            innerHTML: `
                <div class='container'>
                    <div class='items'></div>
                </div>
            `
        });


        /** @type {mantungunion.donations.data.DonationDetails[]} */ this.items
        this.pluralWidgetProperty(
            {
                selector: ['', ...DonationsListing.Item.classList].join('.'),
                parentSelector: ':scope >.container >.items',
                transforms: {
                    set: (input) => {
                        return new DonationsListing.Item(input).html
                    },
                    get: ({ widgetObject: widget }) => ({
                        id: widget.id,
                        label: widget.label,
                        description: widget.description,
                        amount: widget.amount,
                    })
                }
            },
            'items'
        )

        this.blockWithAction(async () => {
            const stream = await hcRpc.donations.data.getDonations();
            (async () => {
                for await (const item of stream) {
                    this.items.push(item)
                    // if (true) return // TODO: Remove this
                }
            })()
        })

    }

    static Item = class extends Widget {

        /**
         * 
         * @param {DonationsListing['items'][number]} data 
         */
        constructor(data) {
            super();

            super.html = hc.spawn({
                attributes: {
                    id: data.id
                },
                classes: DonationsListing.Item.classList,
                innerHTML: `
                    <div class='container'>
                        <div class='label'></div>
                        <div class='description'></div>
                        <div class='action'></div>
                        <div class='donors'>
                            <div class='title'>Donors</div>
                            <div class='items'></div>
                        </div>
                    </div>
                `
            });

            /** @type {string} */ this.description
            /** @type {string} */ this.label
            for (const property of ['description', 'label']) {
                this.htmlProperty(`:scope >.container >.${property}`, property, 'innerText')
            }

            /** @type {string} */ this.id
            /** @type {mantungunion.donations.data.Donation['amount']} */ this.amount

            /** @type {modernuser.profile.UserProfileData[]} */ this.donors
            this.pluralWidgetProperty({
                selector: "*",
                parentSelector: ':scope >.container >.donors >.items',
                transforms: {
                    set: (input) => new InlineUserProfile(input).html,
                    get: ({ widgetObject: wdg }) => ({ id: wdg.id, label: wdg.label, icon: wdg.icon })
                }
            }, 'donors')

            this.blockWithAction(async () => {
                const donors = await hcRpc.donations.payment.getDonors({ id: this.id });
                (async () => {
                    for await (const donor of donors) {
                        this.donors.push(donor)

                    }
                })();

                const client = await DonationsEventClient.get()
                client.events.addEventListener('mantungunion.donations.payment-new-donor', ({ detail }) => {
                    const first = this.donors.shift()
                    this.donors.unshift(first, detail.profile)
                })
            })

            this.html.$(':scope >.container >.action').appendChild(
                new MantungButton({
                    content: `Donate ${data.amount.value} ${data.amount.currency}`,
                    icon: './donate.svg',
                    onclick: async () => {
                        const details = await hcRpc.donations.payment.donate({ id: this.id })
                        window.location = `/$/finance/payment/static/settle-payment/?id=${details.payment}`
                    }
                }).html
            )

            Object.assign(this, data)

        }

        /** @readonly */
        static classList = ['hc-mantungunion-donations-listing-item']
    }



    /** @readonly */
    static classList = ['hc-mantungunion-donations-listing']

}