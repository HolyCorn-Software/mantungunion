/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Membership
 * This module contains type definitions that are useful to the faculty as a whole
 */


import MembershipPublicMethods from "./remote/public.mjs"


global {
    namespace faculty {
        interface faculties {
            membership: {
                remote: {
                    public: MembershipPublicMethods
                    internal: {}
                }
            }
        }
    }
}