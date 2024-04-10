/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Donations
 * This faculty allows people to donate money to the organization
 */

import DonationsDataController from "./data/controller.mjs"
import DonationsPaymentController from "./payment/controller.mjs"
import DonationsPublicMethods from "./remote/public.mjs"



export default async function donations() {

    const faculty = FacultyPlatform.get()

    const dataController = new DonationsDataController()
    const paymentController = new DonationsPaymentController(
        {
            data: dataController
        }
    )
    faculty.remote.public = new DonationsPublicMethods(
        {
            data: dataController,
            payment: paymentController
        }
    );

    paymentController.init()

    console.log(`${faculty.descriptor.label.cyan} running.`)
}