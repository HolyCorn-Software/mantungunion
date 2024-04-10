/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (complete-registration), allows the user to complete his registration (membership), by paying the membership_fee
 */

import InlinePaymentSettle from "/$/finance/payment/static/widgets/inline-payment-settle/debit.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import HCTSBrandedPopup from "/$/system/static/html-hc/widgets/branded-popup/popup.mjs";


export default class CompleteRegistration extends Widget {


    constructor() {
        super();

        super.html = hc.spawn({
            classes: CompleteRegistration.classList,
            innerHTML: `
                <div class='container'>

                    <div class='info'>
                        <div class='title'>Complete <highlight>Registration</highlight></div>
                        <div class='content'>Make a payment of <amount>1 XAF</amount> to become a full member of the union</div>
                    </div>

                    <div class='payment'></div>
                    
                </div>
            `
        });

        /** @type {(event: 'complete', cb: (CustomEvent)=> void, opts?: AddEventListenerOptions)} */ this.addEventListener
        const done = () => {
            this.dispatchEvent(new CustomEvent('complete'))
        }

        /** @type {InlinePaymentSettle} */ this.paymentView
        this.widgetProperty({
            selector: ['', ...InlinePaymentSettle.classList].join('.'),
            parentSelector: ':scope >.container >.payment',
            childType: 'widget'
        }, 'paymentView')

        this.blockWithAction(async () => {
            const status = await hcRpc.membership.status.getMembershipStatus()
            if (status.status) {
                return done()
            }

            this.paymentView ||= new InlinePaymentSettle()

            this.paymentView.state_data.payment_data.id = status.payment
            this.paymentView.state_data.$0.addEventListener('payment_data.amount-change', () => {
                this.html.$('.container >.info >.content >amount').innerHTML = `${this.paymentView.state_data.payment_data.amount.value} ${this.paymentView.state_data.payment_data.amount.currency}`
            });

            this.paymentView.state_data.$0.addEventListener('stage-change', () => {
                if (this.paymentView.state_data.payment_data.done) {
                    const popup = new HCTSBrandedPopup(
                        {
                            content: hc.spawn({
                                innerHTML: `Welcome to the union. You are now a full member.\n<br>Close this dialog to continue.`
                            })
                        }
                    );
                    // Say Welcome,
                    popup.show()
                    popup.addEventListener('hide', () => {
                        done()
                    })
                    // Then continue
                }
            });


            // TODO: Remove this test line of code
            setTimeout(() => {
                this.paymentView.state_data.payment_data.done = true
                this.paymentView.state_data.stage = 'success'
            }, 10_000)

        })

    }

    /** @readonly */
    static classList = ['hc-mantungunion-complete-registration']
}