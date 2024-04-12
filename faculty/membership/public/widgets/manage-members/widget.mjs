/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Membership
 * This widget (manage-members), allows an authorized personnel to view those who successfully enrolled as members
 */

import ManageMembershipFee from "../manage-membership-fee/widget.mjs";
import InlineUserProfile from "/$/modernuser/static/widgets/inline-profile/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ListDataManager from "/$/system/static/html-hc/widgets/list-data-manager/widget.mjs";




/**
 * @extends ListDataManager<mantungunion.membership.status.ExtendedStatusEntry>
 */
export default class ManageMembers extends ListDataManager {

    constructor() {

        super(
            {

                title: `Members`,
                config: {
                    display: [
                        {
                            label: `Member`,
                            name: 'profile',
                            view: (input) => new InlineUserProfile(input).html
                        },
                        {
                            label: `Registration Date`,
                            name: 'accepted',
                            view: (input) => `${new Date(input).toDateString()}`
                        }
                    ],
                    fetch: () => hcRpc.membership.status.getMembers(),
                    topActions: [
                        new ManageMembershipFee().html
                    ]
                }

            }
        )

    }

}