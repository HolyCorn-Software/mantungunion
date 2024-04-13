/**
 * Copyright 2024 HolyCorn Software
 * The mantungunion Project
 * This widget (manage-gallery), allows an authorized personnel to manage the event gallery of the organization
 * 
 */

import hcRpc from "/$/system/static/comm/rpc/aggregate-rpc.mjs";
import { handle } from "/$/system/static/errors/error.mjs";
import { Widget, hc } from "/$/system/static/html-hc/lib/widget/index.mjs";
import FileExplorer from "/$/system/static/html-hc/widgets/file-explorer/widget.mjs";
import PopupForm from "/$/system/static/html-hc/widgets/popup-form/form.mjs";


export default class ManageGallery extends Widget {


    constructor() {
        super();

        super.html = hc.spawn({
            classes: ManageGallery.classList,
            innerHTML: `
                <div class='container'>
                    <div class='explorer'></div>
                </div>
            `
        });


        /** @type {FileExplorer} */ this.explorer
        this.widgetProperty({
            selector: ['', ...FileExplorer.classList].join('.'),
            parentSelector: ":scope >.container >.explorer",
            childType: 'widget'
        }, 'explorer')
        this.explorer = new FileExplorer([])

        this.blockWithAction(async () => {

            const stream = await hcRpc.web.gallery.getEvents();

            (async () => {
                for await (const event of stream) {
                    this.explorer.deleteItem(event.id)
                    addEventData(event);

                    const tryLoad = () => {

                        this.explorer.waitTillPath(event.id).then(async () => {
                            this.explorer.statedata.loading_items.push(event.id);
                            try {
                                for await (const photo of await hcRpc.web.gallery.getPhotos({ event: event.id })) {
                                    addPhotoData(photo, event)
                                }
                            } catch (e) {
                                handle(e)
                                setTimeout(() => tryLoad(), 10)
                            }
                            this.explorer.statedata.loading_items = this.explorer.statedata.loading_items.filter(x => x != event.id)

                        })
                    }

                    tryLoad()
                }

            })()

        });

        this.explorer.options.on_create_action = (item) => {

            if (item?.id == 'events') {

                return [
                    {
                        locations: ['global_root'],
                        label: `Create Event`,
                        onclick: async () => {
                            const popup = new PopupForm(
                                {
                                    title: `New Event`,
                                    caption: `Enter details of the event. After this, you can select photos`,
                                    form: [
                                        [
                                            {
                                                label: `Name`,
                                                name: 'label',
                                                type: 'text'
                                            }
                                        ],
                                        [
                                            {
                                                label: `Description`,
                                                name: 'description',
                                                type: 'textarea'
                                            }
                                        ],
                                        [
                                            {
                                                label: `Date`,
                                                name: 'date',
                                                type: 'date',
                                                valueProperty: 'valueAsNumber'
                                            }
                                        ]
                                    ],
                                    positive: `Create Event`,
                                    negative: `Cancel`,
                                    execute: async () => {
                                        const id = await hcRpc.web.gallery.createEvent({ data: popup.value })
                                        addEventData({ ...popup.value, id })
                                        setTimeout(() => popup.destroy(), 1200)
                                    }
                                }
                            )

                            popup.show()
                        }
                    }
                ]

            }

            if (item?.parent == 'events') {
                const eventId = JSON.parse(JSON.stringify(item.id))
                return [
                    {
                        locations: ['global_noneroot'],
                        label: `Add Photo`,
                        onclick: async () => {
                            const popupForm = new PopupForm(
                                {
                                    title: `Adding Photo`,
                                    caption: `You can upload the photo, or (even better), enter a link to the photo`,
                                    positive: `Add Photo`,
                                    negative: `Cancel`,
                                    form: [
                                        [
                                            {
                                                label: `Upload`,
                                                type: 'uniqueFileUpload',
                                                name: 'upload_url',
                                                url: '/$/uniqueFileUpload/upload'
                                            }
                                        ],
                                        [
                                            {
                                                label: `Link`,
                                                type: 'text',
                                                name: 'text_url',
                                            }
                                        ],
                                        [
                                            {
                                                label: `Caption`,
                                                name: `caption`
                                            }
                                        ]
                                    ],
                                    execute: async () => {
                                        const values = popupForm.value
                                        const url = values.text_url || values.upload_url
                                        if (!url) {
                                            throw new Error(`Either you enter a upload a photo, or enter a URL`)
                                        }
                                        await hcRpc.web.gallery.addPhoto({
                                            data: {
                                                event: eventId,
                                                caption: values.caption,
                                                url,
                                            }
                                        })

                                        addPhotoData({
                                            caption: values.caption,
                                            event: eventId,
                                            url,
                                        }, { id: eventId })
                                        
                                        setTimeout(() => popupForm.hide(), 1200)
                                    }
                                }
                            )

                            popupForm.show()

                        }
                    }
                ]
            }
        }


        const addEventData = (event) => {
            this.explorer.statedata.items.push(
                {
                    id: event.id,
                    label: event.label,
                    parent: 'events',
                    actions: [
                        {
                            label: `Edit`,
                            onclick: () => {

                            }
                        },
                        {
                            label: `Delete`,
                            onclick: () => {

                            }
                        }
                    ]
                }
            );
        }



        /**
         * 
         * @param {mantungunion.web.gallery.Photo} photo 
         * @param {mantungunion.web.gallery.PhysicalEventDBEntry} event
         */
        const addPhotoData = (photo, event) => {
            this.explorer.statedata.items.push(
                {
                    icon: photo.url,
                    id: `${event.id}_${photo.url}`,
                    label: photo.caption,
                    parent: event.id,
                    actions: [
                        {
                            label: `Delete`,
                            onclick: () => {

                            }
                        },
                    ]
                }
            )
        }


        this.waitTillDOMAttached().then(() => {

            this.explorer.statedata.items.push({
                label: `Events`,
                id: 'events',
                parent: '',
            })

            this.explorer.statedata.current_path = ''

            this.explorer.draw()
        })


    }

    /** @readonly */
    static classList = ['hc-mantungunion-manage-gallery']

}