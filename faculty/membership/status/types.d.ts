/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Membership
 * This module contains type definitions for the status module
 */



import { Collection } from "mongodb"

global {
    namespace mantungunion.membership.status {
        interface StatusEntry {
            userid: string
            payment: string
            status: boolean
        }

        interface Collections {
            status: Collection<StatusEntry>
        }

        interface Fee extends finance.Amount { }
    }

    namespace faculty.managedsettings {
        interface all {
            membership_fee: {
                faculty: 'membership'
                namespace: 'status'
                data: mantungunion.membership.status.Fee
            }
        }
    }
}