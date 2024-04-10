/**
 * Copyright 2023 HolyCorn Software
 * DeInstantWay Project
 * This script controls the home page
 */

import Navbar from "/$/shared/static/widgets/navbar/widget.mjs";
import Footer from "/$/shared/static/widgets/footer/widget.mjs";
import Hero from "./widgets/hero/widget.mjs";
import ContactUs from "./widgets/contact-us/widget.mjs";
import MiniInfoVillages from "./widgets/mini-info-villages/widget.mjs";
import InfoValues from "./widgets/info-values/widget.mjs";
import InfoHistory from "./widgets/info-history/widget.mjs";
import InfoMembers from "./widgets/info-members/widget.mjs";
import NewsListings from "./widgets/news-listings/widget.mjs";
import InfoDonate from "./widgets/info-donate/widget.mjs";
import PeekGallery from "./widgets/peek-gallery/widget.mjs";



document.body.appendChild(new Navbar().html)

document.body.appendChild(
    new Hero().html
)

document.body.appendChild(
    new MiniInfoVillages().html
)

document.body.appendChild(
    new InfoValues().html
)

document.body.appendChild(
    new InfoHistory().html
)

document.body.appendChild(
    new InfoMembers().html
)


document.body.appendChild(
    new NewsListings().html
)

document.body.appendChild(
    new InfoDonate().html
)

document.body.appendChild(
    new PeekGallery().html
)


document.body.appendChild(
    new Footer().html
)
