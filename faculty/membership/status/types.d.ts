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
            /** When the registration fee was paid, and the membership was accepted */
            accepted: number
        }

        interface Collections {
            status: Collection<StatusEntry>
        }

        interface Fee extends finance.Amount { }

        interface ExtendedStatusEntry extends StatusEntry {
            profile: Omit<modernuser.profile.UserProfileData, "id" | "time" | "temporal" | "meta">
        }
    }

    namespace faculty.managedsettings {
        interface all {
            membership_fee: {
                faculty: 'membership'
                namespace: 'membershipDefault'
                data: mantungunion.membership.status.Fee
            }
            membership_terms: {

                faculty: 'membership'
                namespace: 'membershipDefault'
                data: string
            }
        }
    }

    namespace modernuser.permission {
        interface AllPermissions {
            'permissions.mantungunion.membership.manage': true
        }
    }
}