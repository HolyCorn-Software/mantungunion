/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This script controls the area-history page, where users can read about the history of various areas of the union
 */

import Footer from "/$/shared/static/widgets/footer/widget.mjs";
import Hero from "../widgets/hero/widget.mjs";
import ReadAreaHistory from "../widgets/read-area-history/widget.mjs";
import Navbar from "/$/shared/static/widgets/navbar/widget.mjs";
import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { hc } from "/$/system/static/html-hc/lib/widget/index.mjs";

hc.importModuleCSS(import.meta.url)

document.body.appendChild(new Navbar().html)

const hero = new Hero()

hero.title = `History`
hero.caption = `Know about us`

const history = new ReadAreaHistory()

hero.blockWithAction(async () => {
    const areas = await hcRpc.modernuser.zonation.getZones()
    const targetArea = (window.location.hash || '#0').split('#')[1] || '0'
    const areaData = areas.find(x => x.id == targetArea) || areas.find(x => x.id == '0')
    hero.caption = `History of ${areaData.label}`
    history.area = targetArea
})

document.body.appendChild(hero.html)


document.body.appendChild(
    history.html
);

document.body.appendChild(
    new Footer().html
)