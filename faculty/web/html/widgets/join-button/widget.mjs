/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (join-button), is specially designed to attract the user to signup.
 */

import MantungButton from "../mantung-button/widget.mjs";
import MantungSignup from "../signup/widget.mjs";


export default class MantungJoinButton extends MantungButton {

    constructor() {
        super(
            {
                hoverAnimate: false,
                content: `Join us`,
                icon: './res/heart.svg',
                onclick: async () => {
                    const path = '/signup/'
                    if (window.location.pathname != path) {
                        window.location = path
                    } else {
                        document.querySelector(`${['', ...MantungSignup.classList].join('.')}`)?.scrollIntoView({ behavior: 'smooth', block: 'end' })
                    }
                }
            }
        );
    }


}