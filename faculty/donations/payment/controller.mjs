/**
 * Copyright 2024 HolyCorn Software
 * The Faculty of Donations
 * This module (payment), deals with the direct collection of money for donations
 */

import collections from "../collections.mjs";
import DonationsDataController from "../data/controller.mjs";
import EventChannelServer from "../../../system/public/comm/rpc/json-rpc/event-channel/server/sever.mjs";


const controllers = Symbol()
const events = Symbol()


export default class DonationsPaymentController {

    /**
     * 
     * @param {object} _controllers 
     * @param {DonationsDataController} _controllers.data
     */
    constructor(_controllers) {
        this[controllers] = _controllers;

        this[events] = new EventChannelServer()

        this[events].register = () => ['default']
    }

    async registerEvents({ $client } = {}) {
        this[events].public.register($client) // With that, we can call the register() method
    }

    async init() {
        const finance = () => FacultyPlatform.get().connectionManager.overload.finance()

        await finance()

        /**
         * 
         * @param {string} paymentId 
         * @param {mantungunion.donations.payment.DonationPayment} donationPayment
         */
        const markComplete = async (paymentId, donationPayment) => {
            if ((await (await finance()).payment.getPayment({ id: paymentId })).done) {
                collections.payment.updateOne({ payment: paymentId }, { $set: { completed: Date.now() } })

                // After updating the database to include details of the donor, let's inform the frontend.
                try {
                    this[events].inform(['default'], new CustomEvent('mantungunion.donations.payment-new-donor', {
                        detail: {
                            profile: DonationsPaymentController.trimProfile(
                                await
                                    (await FacultyPlatform.get().connectionManager.overload.modernuser())
                                        .profile.get_profile({ id: donationPayment.userid })
                            )
                        }
                    }))
                } catch (e) {
                    console.warn(`Could not inform of a new donor for `, donationPayment.donation, ` because `, e)
                }
            }
        }

        FacultyPlatform.get().connectionManager.events.addListener('finance.payment-complete', async (id) => {
            const entry = await collections.payment.findOne({ payment: id })
            if (!entry) {
                return;
            }
            markComplete(id, entry)
        })

        const stream = await this[controllers].data.getDonations()

        for await (const donation of stream) {
            for await (const entry of collections.payment.find({ donation: donation.id, completed: { $exists: false }, payment: { $exists: true } })) {
                markComplete(entry.payment)
            }
        }
    }


    /**
     * This method gets a list of those who donated to the specified donation
     * @param {object} param0 
     * @param {string} param0.id
     * @param {string} param0.userid
     */
    async *getDonors({ id, userid }) {
        // Here is stored the user making the inquiry. If there's no user, the variable would be null

        if (!id) {
            throw new Exception(`Invalid input. 'id' of the donation is missing.`)
        }


        if (userid) {
            const selfEntry = await collections.payment.findOne({ userid, donation: id, completed: { $exists: true } })
            if (selfEntry) {
                yield await getProfile(userid)
            }
        }

        async function getProfile(id) {
            const profile = await (await FacultyPlatform.get().connectionManager.overload.modernuser()).profile.get_profile({ id })
            DonationsPaymentController.trimProfile(profile);
            return profile
        }

        const knownDonors = new Set()

        // TODO: Unblur the 'completed' field
        for await (const entry of collections.payment.find({ donation: id, userid: { [userid ? '$ne' : '$exists']: userid || true }, completed: { $exists: true } })) {
            if (!knownDonors.has(entry.userid)) {
                knownDonors.add(entry.userid)
                yield await (await FacultyPlatform.get().connectionManager.overload.modernuser()).profile.get_profile({ id: entry.userid })
            }

            // Prevent us from holding too much in memory at once
            if (knownDonors.size > 1024 * 10) {
                knownDonors = new Set([...knownDonors].slice(1024,))
            }
        }
    }


    /**
     * This method removes sensitive data from a user's profile
     * @param {modernuser.profile.UserProfileData} profile 
     */
    static trimProfile(profile) {
        delete profile.meta;
        delete profile.temporal;
        delete profile.time;
    }

    /**
     * This method is called by a user who wants to make a donation
     * @param {object} param0 
     * @param {string} param0.id
     * @param {string} param0.userid
     */
    async donate({ id, userid }) {
        if (!userid) {
            throw new Exception(`Please, login to continue.`)
        }

        if (!id) {
            throw new Exception(`Invalid parameters. The 'id' of the donation you're making wasn't passed.`)
        }

        const data = await this[controllers].data.getDonation({ id });

        // Before going ahead to accept a donation, first check if there's an existing payment
        // If so, just send back data to be used to complete the payment.
        const existing = await collections.payment.findOne({ userid, completed: { $exists: false }, donation: id, payment: { $exists: true } })
        if (existing) {
            // Check if the existing payment hasn't terminally faileld
            const paymentData = await (await FacultyPlatform.get().connectionManager.overload.finance()).payment.getPayment({ id: existing.payment })
            if (paymentData.failed?.fatal) {
                existing.payment = await createPayment()
                collections.payment.updateOne({ userid, donation: id, completed: { $exists: false } }, { $set: { payment: paymentData.id } })
            }
            return { payment: existing.payment }
        }

        const payment = await createPayment();

        await collections.payment.insertOne({
            userid,
            donation: id,
            time: Date.now(),
            payment
        })

        return { payment }

        async function createPayment() {
            return await (await FacultyPlatform.get().connectionManager.overload.finance()).payment.create({
                amount: data.amount,
                owners: [userid],
                type: 'invoice',
                meta: {
                    note: `Thank you for donating`,
                    reason: data.label,
                    product: {
                        category: 'other',
                        type: 'virtual',
                        name: data.label,
                        description: data.description,
                    }
                }
            });
        }
    }



}