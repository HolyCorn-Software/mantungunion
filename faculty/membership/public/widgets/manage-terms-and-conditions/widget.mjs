/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * The Faculty of Membership
 * This widget allows an administrator to manage the (code of conduct), technically known as the terms and conditions.
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import ActionButton from "/$/system/static/html-hc/widgets/action-button/button.mjs";


export default class ManageTermsAndConditions extends Widget {

    constructor() {

        super();

        super.html = hc.spawn({
            classes: ManageTermsAndConditions.classList,
            innerHTML: `
                <div class='container'>
                    <div class='top'>
                        <div class='title'>Code of Conduct</div>
                        <div class='actions'>
                            <div class='pre-edit'></div>
                            <div class='post-edit'></div>
                        </div>
                    </div>

                    <div class='content' contentEditable=false></div>
                </div>
            `
        });

        /** @type {boolean} */ this.editMode
        this.htmlProperty(undefined, 'editMode', 'class', () => {
            setTimeout(() => this.html.$(':scope >.container >.content').toggleAttribute('contentEditable', this.editMode), 1000)
        });

        /** @type {string} */ this.content
        this.htmlProperty(':scope >.container >.content', 'content', 'innerHTML')

        this.html.$(':scope >.container >.top >.actions >.pre-edit').appendChild(
            new ActionButton(
                {
                    content: `Edit`,
                    onclick: () => this.editMode = true
                }
            ).html
        );

        for (const item of [
            new ActionButton({
                content: `Save`,
                onclick: async () => {
                    await hcRpc.engTerminal.faculty.settings.set('membership', { name: 'membership_terms', namespace: 'membershipDefault', value: this.content })
                    this.editMode = false
                }
            }).html,
            new ActionButton({
                content: `Cancel`,
                onclick: async () => {
                    await loadDefault()
                    this.editMode = false
                }
            }).html
        ]) {

            this.html.$(':scope >.container >.top >.actions >.post-edit').appendChild(item)
        }

        const loadDefault = async () => {
            this.content = await hcRpc.system.settings.get({ faculty: 'membership', name: 'membership_terms', namespace: 'membershipDefault' })
        }

        this.blockWithAction(loadDefault)

    }

    /** @readonly */
    static classList = ['hc-mantungunion-membership-manage-terms-and-conditions']

}