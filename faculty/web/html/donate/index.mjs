/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This script controls the donate page
 */

import Footer from "/$/shared/static/widgets/footer/widget.mjs";
import Hero from "../widgets/hero/widget.mjs";
import DonationsListing from "/$/donations/static/widgets/donations-listing/widget.mjs";
import Navbar from "/$/shared/static/widgets/navbar/widget.mjs";


document.body.appendChild(
    new Navbar().html
)

const hero = new Hero()
document.body.appendChild(hero.html)

hero.title = `Make a donation`
hero.caption = `Promote the change you want to see.`

hero.actions = []

document.body.appendChild(
    new DonationsListing().html
)

document.body.appendChild(
    new Footer().html
)