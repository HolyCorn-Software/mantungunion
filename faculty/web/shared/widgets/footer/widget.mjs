/**
 * Copyright 2022 HolyCorn Software
 * The Donor Forms Project
 * This widget is the footer
 * Ported to the DeInstantWay Project
 */

import FooterSection from "./section.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import { Widget } from "/$/system/static/html-hc/lib/widget/index.mjs";
import MantungJoinButton from "/$/web/html/widgets/join-button/widget.mjs";



/**
 * @extends Widget<Footer>
 */
export default class Footer extends Widget {

    constructor() {
        super();

        this.html = hc.spawn({
            classes: ['hc-donorforms-footer'],
            innerHTML: `
                <div class='container'>
                    <div class='main'>
                        <div class='logo-section'>
                            <img src='/$/shared/static/logo.png'>
                            <div class='copyright'>&copy; 2024</div>
                        </div>

                        <div class='data-section'></div>
                        
                    </div>

                    <div class='community-button'></div>

                    <div class='author-info'><div class='label'>Carefully Engineered by</div> <div class='action' href='mailto:holycornsoftware@gmail.com'>HolyCorn Software</div></div>
                    
                </div>
            `
        });

        /** @type {[import("./types.js").FooterSectionData]} */ this.data
        this.pluralWidgetProperty({
            selector: '.hc-donorforms-footer-section',
            parentSelector: '.container >.main >.data-section',
            property: 'data',
            transforms: {
                /**
                 * 
                 * @param {import("./types.js").FooterSectionData} data 
                 */
                set: (data) => {
                    return new FooterSection(data).html
                },
                get: (html) => {
                    let widget = html?.widgetObject
                    return {
                        title: widget.title,
                        links: widget.links
                    }
                }
            }
        });


        this.data = [


            {
                title: `Contact Us`,
                links: [
                    {
                        label: `Email`,
                        href: '#'
                    },
                    {
                        label: `Facebook`,
                        href: `#`
                    },
                    {
                        label: `WhatsApp`,
                        href: `wa.me/237651449423`
                    },

                ]
            },

            {
                title: `Donate`,
                links: [

                ]
            },

            {
                title: `Explore`,
                links: [
                    {
                        label: `Our History`,
                        href: '/area-history/'
                    },
                    // {
                    //     label: `Our Values`
                    // },
                    {
                        label: `Event Gallery`,
                        href: '/gallery/'
                    }
                ]
            }

        ];

        this.html.$('.container >.community-button').appendChild(new MantungJoinButton().html)

        this.blockWithAction(async () => {
            const loadContacts = async () => {
                /** @type {ehealthi.ui.contact_us.SocialContact[]} */
                const contacts = (await hcRpc.system.settings.get({ faculty: 'web', name: 'organization_contacts', namespace: 'widgets' })) || []
                this.data[0] = {
                    title: `Contact Us`,
                    links: contacts
                }
            }

            const loadDonations = async () => {
                // TODO: Fetch donations

                const donations = await hcRpc.donations.data.getDonations()

                for await (const donation of donations) {
                    this.data[1].links.push(
                        {
                            label: donation.label,
                            href: `/donate/#${donation.id}`
                        }
                    );
                }

                // this.data[1

                // const services = (await hcRpc.system.settings.get({ faculty: 'web', name: 'organization_services', namespace: 'widgets' })) || [];

                // this.data[1] = {
                //     title: `Donate`,
                //     links: services.map(x => ({ label: x.title })),
                // }
            }

            const results = await Promise.allSettled([loadDonations(), loadContacts()])
            results.filter(x => x.status === 'rejected').forEach(stat => handle(stat.reason))
        })

    }

    static get classList() {
        return ['hc-donorforms-footer']
    }

}