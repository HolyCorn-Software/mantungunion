/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This module contains type definitions related to the management of history information of various areas.
 */


import ''

global {
    namespace mantungunion.ui.info_history {

        interface AreaHistory {
            area: string
            history: string
        }

    }

    namespace faculty.managedsettings {
        interface all {
            area_history: {
                namespace: 'widgets'
                faculty: 'web'
                data: mantungunion.ui.info_history.AreaHistory[]
            }
        }
    }
}