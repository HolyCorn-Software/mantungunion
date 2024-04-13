/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This script controls the gallery page, where users can view images of past events
 */

import Footer from "/$/shared/static/widgets/footer/widget.mjs";
import Navbar from "/$/shared/static/widgets/navbar/widget.mjs";
import GalleryView from "../widgets/gallery-view/widget.mjs";
import Hero from "../widgets/hero/widget.mjs";

document.body.appendChild(new Navbar().html)

document.body.appendChild(
    (() => {
        const hero = new Hero()
        hero.title = `Event Gallery`
        hero.caption = `Enjoy warm memories of past events.`
        return hero.html
    })()
)

document.body.appendChild(
    new GalleryView().html
)

document.body.appendChild(
    new Footer().html
)