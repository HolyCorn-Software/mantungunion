/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This faculty (membership), handles functionality related to membership, such as registration fees, terms and conditions, etc.
 */

import MembershipPublicMethods from "./remote/public.mjs"
import MembershipStatusController from "./status/controller.mjs"



export default async function init() {


    const faculty = FacultyPlatform.get()

    const statusController = new MembershipStatusController()
    faculty.remote.public = new MembershipPublicMethods(
        {
            status: statusController
        }
    )

    statusController.init()

    console.log(`${faculty.descriptor.label.green}, is working!`)

}