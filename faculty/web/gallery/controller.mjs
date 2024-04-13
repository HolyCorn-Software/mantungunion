/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module allows us to remember events that happened in real life, and store pictures of them
 */

import muser_common from "muser_common";
import collections from "./collections.mjs";
import shortUUID from "short-uuid";



export default class GalleryController {


    /**
     * This method returns events according to order of recency.
     */
    async *getEvents() {
        const cursor = collections.events.find({}, { sort: { date: 'desc' } })
        for await (const item of cursor) {
            delete item._id
            yield item
        }
    }

    /**
     * This method returns random photos of various events
     */
    async *getRandomPhotos() {
        const MAX = 10; // Maximum number of random photos
        const count = await collections.photos.estimatedDocumentCount()
        const realMax = Math.min(MAX, count)

        const skips = new Set()

        const indices = new Set()

        function random(min, max) {
            return Math.floor((Math.random() * 2000) % (max - min)) + min
        }

        const cursor = collections.photos.find();

        /**
         * 
         * This algorithm is based on constantly skipping a random number of photos
         * 
         */

        for (let progress = 0; progress < realMax;) {

            const skip = await (async () => {
                let example;
                let iterations = 0;

                // While the random number we know, is already known...
                while (
                    skips.has(
                        example = random(0, realMax)
                    )
                    &&
                    skips.size < realMax - 2
                    && iterations < (realMax * 10)
                ) {
                    // Just keep iterating
                    // console.log(`${example}, is not what we're looking for. We already have `, [...skips])
                    await new Promise(x => setTimeout(x, Math.random() * 10))
                }
                return example || 0

            })()


            if (skip < realMax) {
                const chunkLength = Math.min(Math.floor(realMax / 3), realMax - skip)

                for (let i = 0, p = 0; (i < realMax) && (p < chunkLength); i++) {
                    if (indices.has(skip + i)) continue;

                    await cursor.rewind()
                    await cursor.skip(skip + i)

                    if (await cursor.hasNext()) {
                        yield await cursor.next()
                        indices.add(skip + i)
                        progress++
                        p++
                    }

                }

                skips.add(skip)
            }
        }



    }

    /**
     * This method returns an orderly list of photos for a given event.
     * @param {object} param0 
     * @param {string} param0.event
     */
    async *getPhotos({ event }) {
        event = arguments[1]?.event
        soulUtils.checkArgs(arguments[1], { event: 'string' }, 'input')
        for await (const item of collections.photos.find({ event })) {
            delete item._id
            delete item.event
            yield item
        }
    }

    /**
     * This method creates a new event
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {mantungunion.web.gallery.PhysicalEvent} param0.data
     */
    async createEvent({ userid, data }) {
        soulUtils.checkArgs(data, {
            date: 'number',
            description: 'string',
            label: 'string'
        }, 'data', undefined, ['exclusive'])

        await muser_common.whitelisted_permission_check(
            {
                userid,
                permissions: ['permissions.mantungunion.web.gallery.manage']
            }
        );

        const id = shortUUID.generate()
        collections.events.insertOne({
            ...data,
            id
        })
        return id
    }

    /**
     * This method adds a photo to the event gallery
     * @param {object} param0 
     * @param {string} param0.userid
     * @param {mantungunion.web.gallery.Photo} param0.data
     */
    async addPhoto({ userid, data }) {
        soulUtils.checkArgs(data, {
            caption: 'string',
            event: 'string',
            url: 'string'
        })

        await muser_common.whitelisted_permission_check(
            {
                userid,
                permissions: ['permissions.mantungunion.web.gallery.manage']
            }
        )

        collections.photos.updateOne({ url: data.url }, { $set: data }, { upsert: true })
    }


}