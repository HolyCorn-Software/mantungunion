/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Donations
 * This module contains type definitions for the faculty.
 */



import { Collection } from "mongodb"
import DonationsPublicMethods from "./remote/public.mjs"

global {
    namespace mantungunion.donations {
        namespace data {

            interface Donation {
                label: string
                description: string
                amount: finance.Amount
            }

            interface DonationDetails extends Donation {
                id: string
                created: number
                owner: string
                ended: number
            }

            type DonationsCollection = Collection<DonationDetails>
        }


        namespace payment {
            interface DonationPayment {
                userid: string
                donation: string
                time: number
                completed: number
                payment: string
            }

            type PaymentCollection = Collection<DonationPayment>
        }


        interface Collections {
            data: data.DonationsCollection
            payment: payment.PaymentCollection
        }

        interface Events {
            'example-event': {
                parameter1: string
                param2: 'cat' | 'mouse'
                parambool: boolean
            }
        }
    }

    namespace modernuser.permission {
        interface AllPermissions {
            'permissions.donations.create': true
            'permissions.donations.supervise': true
        }
    }

    namespace faculty {
        interface faculties {
            donations: {
                remote: {
                    public: DonationsPublicMethods
                }
            }
        }
    }

}