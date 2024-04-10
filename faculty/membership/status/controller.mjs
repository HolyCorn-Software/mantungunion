/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module (status), deals with the direct checks of whether a particular user is a member
 */

import { CollectionProxy } from "../../../system/database/collection-proxy.js";



/** @type {mantungunion.membership.status.Collections} */
const collections = new CollectionProxy(
    {
        'status': 'status'
    }
)

export default class MembershipStatusController {


    async init() {
        const faculty = FacultyPlatform.get()

        const finance = FacultyPlatform.get().connectionManager.overload.finance


        // We just want that whenever someone completes a payment, we receive the event, and if need be, mark his registration as complete
        faculty.connectionManager.events.addListener('finance.payment-complete', async (id) => {
            const record = await collections.status.findOne({ payment: id })
            if (!record) {
                return console.log(`No member registration was found with payment id `, id)
            }
            if (record.status) {
                return; // The membership was already paid
            }

            if ((await (await finance()).payment.getPayment({ id })).done) {
                await collections.status.updateOne({ userid: record.userid, payment: record.payment }, { $set: { status: true } })
            }

        })


        // Right now, we're checking the registration records that are unpaid, to see if any were paid while the system had shutdown
        for await (const record of collections.status.find({ $or: [{ status: false }, { status: { $exists: false } }] })) {

            // And if paid...
            if ((await (await finance()).payment.getPayment({ id: record.payment })).done) {
                // We mark registration as complete
                await collections.status.updateOne({ userid: record.userid, payment: record.payment }, { $set: { status: true } })
            }
        }

    }


    /**
     * This method checks if the user is a full member
     * @param {object} param0 
     * @param {string} param0.userid
     */
    async getMembershipStatus({ userid }) {
        const entry = await this.getMembershipRecord({ userid });
        return {
            status: entry.status,
            payment: entry.status ? undefined : entry.payment
        }
    }

    /**
     * This method makes sure there's a membership record for the given user, and then returns it
     * @param {object} param0 
     * @param {string} param0.userid
     */
    async getMembershipRecord({ userid }) {
        // If there's no membership record for the given user, create one with the default false values
        return (await collections.status.findOne({ userid })) || await (async () => {
            /** @type {mantungunion.membership.status.StatusEntry} */
            const data = {
                status: false,
                userid,
                payment: await (await FacultyPlatform.get().connectionManager.overload.finance()).payment.create({
                    owners: [userid],
                    amount: await this.getMembershipFee(),
                    type: 'invoice',
                    meta: {
                        note: `Registration Fee`,
                        reason: `Registration Fee`,
                        product: {
                            category: 'other',
                            type: 'virtual',
                            name: 'Registration Fee',
                            description: 'registration fee.'
                        }
                    }
                }),
            }

            await collections.status.updateOne({ userid }, { $set: data }, { upsert: true })
            return data
        })()
    }



    /**
     * This method returns the amount required to paid before becoming a full member
     */
    async getMembershipFee() {
        /** @type {mantungunion.membership.status.Fee} */
        const currentAmount = await FacultyPlatform.get().settings.get({ name: 'membership_fee', namespace: 'status' })
        // For the sake of peace, if there's no amount, set the default to 1 XAF
        if (!currentAmount || !currentAmount.currency) {
            const def = { value: 1, currency: 'XAF' }
            await FacultyPlatform.get().settings.set({
                value: def,
                name: 'membership_fee',
                namespace: 'status'
            });

            return def
        }

        return currentAmount
    }

}