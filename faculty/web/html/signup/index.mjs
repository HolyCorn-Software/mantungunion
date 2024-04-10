/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This script controls the signup page
 */

import Footer from "/$/shared/static/widgets/footer/widget.mjs";
import Hero from "../widgets/hero/widget.mjs";
import MantungSignup from "../widgets/signup/widget.mjs";
import Navbar from "/$/shared/static/widgets/navbar/widget.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";


document.body.appendChild(
    new Navbar().html
);

const hero = new Hero();

hero.title = `Welcome to the Family`
hero.caption = `Signup, and become part of the union.`
hero.actions = []
hero.html.style.setProperty(`--bg-image`, `url('${new URL('./signup-bg.png', import.meta.url).href}')`)

document.body.appendChild(
    hero.html
)

document.body.appendChild(
    new MantungSignup().html
)

document.body.appendChild(
    new Footer().html
)

hc.importModuleCSS(import.meta.url);