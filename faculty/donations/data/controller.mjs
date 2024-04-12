/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Donations
 * This module (data), simply stores, and manages data about donations.
 * It is not directly involved with the collection of the funds
 */

import muser_common from "muser_common";
import collections from "../collections.mjs";
import shortUUID from "short-uuid";




export default class DonationsDataController {

    /**
     * This method creates a donation
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {mantungunion.donations.data.Donation} param0.data
     */
    async createDonation({ userid, data }) {
        await muser_common.whitelisted_permission_check({
            userid,
            permissions: ['permissions.donations.create']
        });

        const id = shortUUID.generate()
        await collections.data.insertOne({
            id,
            amount: {
                currency: data.amount.currency,
                value: (() => {
                    const v = Number(data.amount.value).valueOf()
                    if (!Number.isNaN(v) || v <= 0) {
                        return v
                    }
                    throw new Exception(`Please, enter a valid amount for the donation.`)
                })()
            },
            description: data.description,
            label: data.label,
            created: Date.now(),
            owner: userid,
        })

        return id
    }

    /**
     * This method gets donations stored in the system
     * @param {object} param0
     * @param {boolean} param0.includeEnded
     */
    async *getDonations({ includeEnded } = {}) {
        const client = arguments[0]
        includeEnded = arguments[1]?.includeEnded
        
        const isAdmin = (async () => {
            try {

                await muser_common.whitelisted_permission_check(
                    {
                        userid: (await muser_common.getUser(client)).id,
                        permissions: ['permissions.donations.supervise'],
                    }
                );

                return true

            } catch { }

        })()


        for await (const donation of collections.data.find(
            // Conditionally omit ended donations
            includeEnded ? {} : { ended: { $exists: false } },
            { sort: { ended: 'desc' } }
        )) {
            delete donation._id
            if (!isAdmin) {
                delete donation.owner
            }
            yield donation
        }
    }

    async getDonation({ id }) {
        const data = await collections.data.findOne({ id })
        return data || (() => {
            throw new Exception(`The donation with id '${id}', was not found.`)
        })()
    }

    /**
     * This method stops a donation
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {string} param0.id
     */
    async endDonation({ userid, id }) {
        if (
            !( // If there isn't a donation with the said id, or the one with the said id isn't owned by the user
                await collections.data.countDocuments({ id, owner: userid })
                // or the calling user has no right to modify donations created by others
                || await muser_common.whitelisted_permission_check({ userid, permissions: ['permissions.donations.supervise'], throwError: false })
            )
        ) {
            return; // Either the donation being ended doesn't exists, or the calling user doesn't have sufficient permissions.
        }
        await collections.data.updateOne({ id, ended: { $exists: false } }, { $set: { ended: Date.now() } })
    }

}