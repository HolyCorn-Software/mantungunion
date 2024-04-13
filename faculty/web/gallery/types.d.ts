/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module contains type definitions for the gallery module
 */

import { Collection } from "mongodb"


global {
    namespace mantungunion.web.gallery {
        interface PhysicalEvent {
            label: string
            description: string
            date: number
        }
        interface PhysicalEventDBEntry extends PhysicalEvent {
            id: string
        }

        interface Photo {
            event: string
            url: string
            caption: string
        }

        type PhotosCollection = Collection<Photo>
        type EventsCollection = Collection<PhysicalEventDBEntry>

        interface Collections {
            photos: PhotosCollection
            events: EventsCollection
        }
    }

    namespace modernuser.permission {
        interface AllPermissions {
            'permissions.mantungunion.web.gallery.manage': true
        }
    }
}