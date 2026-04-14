//Default preset
export const presets = [
    {
        name: "Default",
        tasks: [
            { text: 'Wake up', completed: false, label: 'Physical', time: 5 },
            { text: 'Drink water', completed: false, label: 'Physical', time: 2 },
            { text: 'Stretch or light exercise', completed: false, label: 'Physical', time: 10 },
            { text: 'Meditate or reflect', completed: false, label: 'Spiritual', time: 10 },
            { text: 'Read or learn something new', completed: false, label: 'Intellectual', time: 15 },
            { text: 'Plan your day', completed: false, label: 'Intellectual', time: 10 },
            { text: 'Personal hygiene / get ready', completed: false, label: 'Physical', time: 15 }
        ]
    },
    {
        name: "Spiritual",
        tasks: [
            { text: 'Wake up', completed: false, label: 'Physical', time: 5 },
            {text: 'Morning prayer or meditation', completed: false, label: 'Spiritual', time: 10 },
            {text: 'Read a spiritual text or listen to a podcast', completed: false, label: 'Spiritual', time: 15 },
            { text: 'Drink water', completed: false, label: 'Physical', time: 2 },
            { text: 'Stretch or light exercise', completed: false, label: 'Physical', time: 10 },
            { text: 'Read or learn something new', completed: false, label: 'Intellectual', time: 15 },
            { text: 'Plan your day', completed: false, label: 'Intellectual', time: 10 },
            { text: 'Personal hygiene / get ready', completed: false, label: 'Physical', time: 15 }
        ]
    }
];