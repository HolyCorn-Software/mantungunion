/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module contains type definitions for the Faculty of Donations 
 */


import ''
import DonationsPaymentController from "../controller.mjs"

global {
    namespace mantungunion.donations.payment {
        var PublicMethods: {
            new(controller: DonationsPaymentController): muser_common_types.RemoveSensitiveParams<DonationsPaymentController>
        }
    }

    namespace mantungunion.donations {
        interface Events {
            'mantungunion.donations.payment-new-donor': {
                profile: modernuser.profile.UserProfileData
            }
        }
    }
}