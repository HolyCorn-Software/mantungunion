/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module makes it easy to access collections related to gallery functionality
 */

import { CollectionProxy } from "../../../system/database/collection-proxy.js";



/** @type {mantungunion.web.gallery.Collections} */
const collections = new CollectionProxy({
    'photos': 'gallery.photos',
    'events': 'gallery.events'
})


export default collections