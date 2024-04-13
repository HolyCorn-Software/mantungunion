/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (info-donate), shows information about ongoing donations, and a button linking to the donation page
 */

import MantungButton from "../mantung-button/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


export default class InfoDonate extends Widget {

    constructor() {

        super()

        super.html = hc.spawn({
            classes: InfoDonate.classList,
            innerHTML: `
                <div class='container'>
                    <div class='main'>
                        <div class='title'>Donate</div>
                        <div class='caption'>to make a change</div>
                        <div class='summary'>
                            There are <count>3</count> ongoing donations.
                            Choose the one that touches you
                            the most, and this could be your
                            opportunity to be part of the
                            change you want to see.
                        </div>
                        <div class='action'></div>
                    </div>
                </div>
            `
        });


        this.html.$('.container >.main >.action').appendChild(
            new MantungButton({
                content: `Show kindness`,
                icon: './donate.svg',
                onclick: () => {
                    window.location = '/donate/'
                }
            }).html
        );

        this.blockWithAction(async () => {
            this.html.$(':scope >.container >.main >.summary >count').innerText = await hcRpc.donations.data.countOngoingDonations()
        })


    }

    /** @readonly */
    static classList = ['hc-mantungunion-info-donate']

}