/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget, is a custom-made signup view.
 */

import CompleteRegistration from "../complete-registration/widget.mjs";
import MantungButton from "../mantung-button/widget.mjs";
import CAYOFEDOnboarding from "/$/modernuser/onboarding/static/widgets/onboarding/widget.mjs";
import LoginWidget from "/$/modernuser/static/widgets/login-widget/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HCTSBrandedPopup from "/$/system/static/html-hc/widgets/branded-popup/popup.mjs";
import { SlideContainer } from "/$/system/static/html-hc/widgets/slide-container/container.mjs";



export default class MantungSignup extends Widget {

    constructor() {
        super();

        super.html = hc.spawn({
            classes: MantungSignup.classList,
            attributes: { id: 'signup' },
            innerHTML: `
                <div class='container'>
                    <div class='main'>
                        <div class='terms'>
                            <div class='title'>Our code of <highlight>Conduct</highlight></div>
                            <div class='content'>

                                1. All members' voices are equal. Therefore do not
                                undermine anyone's opinion. <br>
                                
                                2. Members are expected to pay an annual fee of
                                2,000 XAF, especially for the upkeep of the union. <br>
                                
                                3. Bla bla bla, these are not really rules. The
                                Engineer is just testing the UI. We expect these
                                rules to come from the management. <br>
                                
                                4. Try to only click on what you understand. <br>
                                
                            </div>
                            <div class='read-more'></div>
                        </div>

                        <div class='auth'></div>
                        
                    </div>

                    <div class='warning'>By continuing, you agree to the code of conduct.</div>
                    
                </div>
            `
        });

        const slider = new SlideContainer()

        this.html.$('.container >.main >.auth').appendChild(
            slider.html
        )

        /** @type {string} */ this.terms
        this.htmlProperty(':scope >.container >.main >.terms >.content', 'terms', 'innerHTML')

        this.blockWithAction(async () => {
            const loginMain = new LoginWidget({
                custom: {
                    help: false,
                    navigation: false
                }
            });
            slider.screens.push(loginMain.html)



            loginMain.continue = async () => {

                await this.blockWithAction(async () => {
                    // In this case, if the user tries to continue, check if his membership is complete

                    const status = await hcRpc.membership.status.getMembershipStatus()
                    if (status.status) {
                        // Then just continue normally
                        LoginWidget.prototype.continue.apply(loginMain)
                        return;
                    }

                    const onboarding = new CAYOFEDOnboarding();

                    const payment = new CompleteRegistration();

                    // Over here, the membership isn't complete.
                    // Let's present the payment UI
                    // But first, onboarding

                    console.log(`About checking onboarding status`)
                    const onboarded = await hcRpc.modernuser.onboarding.checkMyOnboarding()



                    slider.screens.push(
                        ...(onboarded ? [] : [onboarding.html]),
                        payment.html
                    );

                    payment.addEventListener('complete', () => {
                        slider.index = 0;
                        setTimeout(() => LoginWidget.prototype.continue.apply(loginMain), 2000)
                    })

                    setTimeout(() => slider.index = 1, 50)

                    // After onboarding, comes payment
                    !onboarded ? onboarding.postOnboarding = () => slider.index = 2 : undefined
                })

            }

            this.terms = (await hcRpc.system.settings.get({ faculty: 'membership', namespace: 'membershipDefault', name: 'membership_terms' })) || this.terms
        });

        this.html.$(':scope >.container >.main >.terms >.read-more').appendChild(
            new MantungButton(
                {
                    content: `Read More`,
                    onclick: () => {
                        new HCTSBrandedPopup(
                            {
                                content: hc.spawn({ innerHTML: this.terms })
                            }
                        ).show()
                    }
                }
            ).html
        );


    }

    /** @readonly */
    static classList = ['hc-mantungunion-signup']


}