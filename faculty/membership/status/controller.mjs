/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module (status), deals with the direct checks of whether a particular user is a member
 */

import muser_common from "muser_common";
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
            if (record.accepted) {
                return; // The membership was already paid
            }

            const paymentData = await (await finance()).payment.getPayment({ id });
            if (paymentData.done) {
                await collections.status.updateOne({ userid: record.userid, payment: record.payment }, { $set: { accepted: paymentData.settled_time || Date.now() } })
            }

        })


        // Right now, we're checking the registration records that are unpaid, to see if any were paid while the system had shutdown
        for await (const record of collections.status.find({ accepted: { $exists: false } })) {

            const paymentData = await (await finance()).payment.getPayment({ id: record.payment });
            // And if paid...
            if (paymentData.done) {
                // We mark registration as complete
                await collections.status.updateOne({ userid: record.userid, payment: record.payment }, { $set: { accepted: paymentData.settled_time || Date.now() } })
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
            status: entry.accepted,
            payment: entry.accepted ? undefined : entry.payment
        }
    }

    /**
     * This method makes sure there's a membership record for the given user, and then returns it
     * @param {object} param0 
     * @param {string} param0.userid
     */
    async getMembershipRecord({ userid }) {

        const createPayment = async () => {
            return await (await FacultyPlatform.get().connectionManager.overload.finance()).payment.create({
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
            });
        }
        // If there's no membership record for the given user, create one with the default false values
        return await (async existing => {
            if (!existing) return

            if (!existing.accepted) {
                // In case there's a membership record with a failed payment...
                const status = await (await FacultyPlatform.get().connectionManager.overload.finance()).payment.getPayment({ id: existing.payment })
                if (status.failed?.fatal || status.failed?.reason_code?.startsWith('canceled')) {
                    existing.payment = await createPayment()
                    collections.status.updateOne({ userid }, { $set: { payment: existing.payment } })
                }
            }

            return existing
        })((await collections.status.findOne({ userid }))) || await (async () => {
            /** @type {mantungunion.membership.status.StatusEntry} */
            const data = {
                userid,
                payment: await createPayment(),
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
        const currentAmount = await FacultyPlatform.get().settings.get({ name: 'membership_fee', namespace: 'membershipDefault' })
        // For the sake of peace, if there's no amount, set the default to 1 XAF
        if (!currentAmount || !currentAmount.currency) {
            const def = { value: 1, currency: 'XAF' }
            await FacultyPlatform.get().settings.set({
                value: def,
                name: 'membership_fee',
                namespace: 'membershipDefault'
            });

            return def
        }

        return currentAmount
    }


    /**
     * This method returns all successfully accepted members.
     * @param {object} param0.userid
     * @returns {AsyncGenerator<mantungunion.membership.status.ExtendedStatusEntry>}
     */
    async *getMembers({ userid }) {

        await muser_common.whitelisted_permission_check({
            userid,
            permissions: ['permissions.mantungunion.membership.manage'],
        })


        for await (const item of collections.status.find({ accepted: { $exists: true } }, { sort: { accepted: 'desc' } })) {
            yield {
                ...item,
                profile: (x => {
                    delete x.time
                    delete x.temporal
                    delete x.meta
                    delete x.id
                    return x
                })(await (await FacultyPlatform.get().connectionManager.overload.modernuser()).profile.get_profile({ id: item.userid })),
            }
        }
    }

}