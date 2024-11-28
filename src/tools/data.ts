import { DriveStep } from "driver.js";

export const chartColors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))']

export const noteTypes = [
    'Mechanical',
    'Electrical',
    'Oil Change',
    'Missing Operator',
    'Shift Change',
    'Repairs',
    'Production',
    'Quality Control',
    'Safety',
    'Cleaning',
    'Material Change',
    'Software Update',
    'Training',
    'Inspection',
    'Incident Report',
    'General Note',
    'Mechanical Breakdown',
    'Electrical Issue',
    'Maintenance Request',
    'Safety Concern',
    'Production Delay',
    'Material Shortage',
    'Equipment Malfunction',
    'Process Improvement Suggestion',
    'Training Need',
    'Shift Handover',
    'Environmental Concern',
    'Other'
]

export const baseColors = [
    { value: "#FF5733", label: "Cinnabar" },
    { value: "#33FF57", label: "Screamin' Green" },
    { value: "#3357FF", label: "Royal Blue" },
    { value: "#F5A623", label: "Sunset Orange" },
    { value: "#8B00FF", label: "Electric Violet" },
    { value: "#FF1493", label: "Deep Pink" },
    { value: "#00CED1", label: "Dark Turquoise" },
    { value: "#FFD700", label: "Gold" },
    { value: "#ADFF2F", label: "Green Yellow" },
    { value: "#FF4500", label: "Orange Red" },
    { value: "#4B0082", label: "Indigo" },
    { value: "#DC143C", label: "Crimson" },
    { value: "#00FA9A", label: "Medium Spring Green" },
    { value: "#FF6347", label: "Tomato" },
    { value: "#4682B4", label: "Steel Blue" },
    { value: "#DAA520", label: "Goldenrod" },
    { value: "#008080", label: "Teal" },
    { value: "#FF69B4", label: "Hot Pink" },
    { value: "#B22222", label: "Firebrick" },
    { value: "#7FFF00", label: "Chartreuse" },
    { value: "#CD5C5C", label: "Indian Red" },
    { value: "#6B8E23", label: "Olive Drab" },
    { value: "#FFA07A", label: "Light Salmon" },
    { value: "#808080", label: "Gray" },
    { value: "#FFDAB9", label: "Peach Puff" },
    { value: "#556B2F", label: "Dark Olive Green" },
    { value: "#FFB6C1", label: "Light Pink" },
    { value: "#7CFC00", label: "Lawn Green" },
    { value: "#8A2BE2", label: "Blue Violet" },
    { value: "#DA70D6", label: "Orchid" },
    { value: "#FF8C00", label: "Dark Orange" },
    { value: "#6495ED", label: "Cornflower Blue" },
    { value: "#7B68EE", label: "Medium Slate Blue" },
    { value: "#FF00FF", label: "Magenta" },
    { value: "#40E0D0", label: "Turquoise" },
    { value: "#F08080", label: "Light Coral" },
    { value: "#DB7093", label: "Pale Violet Red" },
    { value: "#9932CC", label: "Dark Orchid" },
    { value: "#EE82EE", label: "Violet" },
    { value: "#00FF00", label: "Lime" },
    { value: "#FF7F50", label: "Coral" },
    { value: "#8B4513", label: "Saddle Brown" },
    { value: "#FFD700", label: "Gold" },
    { value: "#B0E0E6", label: "Powder Blue" },
    { value: "#708090", label: "Slate Gray" },
    { value: "#FA8072", label: "Salmon" },
    { value: "#FFDEAD", label: "Navajo White" },
    { value: "#66CDAA", label: "Medium Aquamarine" },
    { value: "#8FBC8F", label: "Dark Sea Green" },
    { value: "#F5DEB3", label: "Wheat" }
];

export const navigationTour: DriveStep[] = [
    {
        element: '#tour-example',
        popover: {
            title: 'Welcome to WareSense!',
            description: 'Discover how WareSense can help you improve your warehouse operations with real-time monitoring and smart insights.',
            side: "left",
            align: 'start'
        }
    },
    {
        element: '.live',
        popover: {
            title: 'Live Overview',
            description: 'See what\'s happening in real time across your warehouse, right here.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.management',
        popover: {
            title: 'Asset Management',
            description: 'Manage your machines, staff, and tools all in one place.',
            side: "bottom",
            align: 'start'
        }
    },
    {
        element: '.theme',
        popover: {
            title: 'Theme Preferences',
            description: 'Personalize the look of WareSense to fit your style.',
            side: "top",
            align: 'center'
        }
    },
    {
        element: '.factory',
        popover: {
            title: 'Factory Management',
            description: 'Pick a factory to start managing its activities and performance.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.signout',
        popover: {
            title: 'Logout',
            description: 'Ready to leave? Click here to log out safely.',
            side: "top",
            align: 'start'
        }
    },
    {
        popover: {
            title: 'Next Steps',
            description: 'Up next: learn how to read charts and explore the live production view.'
        }
    },
    {
        element: '.highlights',
        popover: {
            title: 'Machine Highlights',
            description: 'Get a quick summary of key machine statuses and recent activities.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.machines',
        popover: {
            title: 'Machines Overview',
            description: 'Check the current status of all your machines at a glance.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.machine-utilization',
        popover: {
            title: 'Machine Utilization',
            description: 'See how well each machine is performing to keep things productive.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.devices',
        popover: {
            title: 'Device Management',
            description: 'View and monitor which devices are in use or on standby.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.device-utilization',
        popover: {
            title: 'Device Utilization',
            description: 'Check device usage stats to maximize efficiency.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.reports',
        popover: {
            title: 'Shift Reports',
            description: 'Download reports from recent shifts to stay updated on factory progress.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.live-run',
        popover: {
            title: 'Live Production',
            description: 'Monitor real-time production stats for active machines.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.search-live',
        popover: {
            title: 'Search Live Run',
            description: 'Quickly find specific machines or parts by name or code.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.filter',
        popover: {
            title: 'Filter the Live Run View',
            description: 'Narrow down your live view to see machines that need attention.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.pagination',
        popover: {
            title: 'View More Machines',
            description: 'Scroll through all your machines with easy-to-use pagination.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.production-machine',
        popover: {
            title: 'Production Machine',
            description: 'View key info about machines actively producing.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.component-image',
        popover: {
            title: 'Component Image',
            description: 'Get a visual of the part currently being produced for easy reference.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.machine-name',
        popover: {
            title: 'Machine Name',
            description: 'Identify which machine is in action by its name.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.record-age',
        popover: {
            title: 'Record Age',
            description: 'See how recently each machine sent a status update.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.component-code',
        popover: {
            title: 'Component Code',
            description: 'Check the unique code for each component to stay organized.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.act-time',
        popover: {
            title: 'Actual Cycle Time',
            description: 'Track the latest cycle time to measure production speed.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.std-time',
        popover: {
            title: 'Standard Cycle Time',
            description: 'See the ideal target time for each production cycle.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.signal',
        popover: {
            title: 'Signal Strength',
            description: 'Monitor the signal to make sure your machines stay connected.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.first-check',
        popover: {
            title: 'First Check Status',
            description: 'See the initial health status for production with helpful icons.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.progress',
        popover: {
            title: 'Production Progress',
            description: 'Check the progress bar to see how production is tracking toward the goal.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.production-machine',
        popover: {
            title: 'View Production Metrics',
            description: 'Open a detailed view for cycle times, performance, and more by clicking on this card.',
            side: "top",
            align: 'start'
        }
    },
    {
        popover: {
            title: 'Enjoy WareSense!',
            description: 'Now you\'re ready to explore WareSense! Dive into the features, track operations, and reach out if you need help. Happy optimizing!',
            side: "top",
            align: 'center'
        }
    }
];


export const materials = [
    // Metal Components
    "Steel Plate", "Aluminum Sheet", "Copper Wire", "Brass Rod", "Stainless Steel Tube",

    // Fasteners
    "Hex Bolts", "Machine Screws", "Wood Screws", "Self-Tapping Screws",
    "Lock Washers", "Flat Washers", "Spring Washers",
    "Hex Nuts", "Lock Nuts", "Wing Nuts",
    "Rivets", "Anchors", "Thread Inserts",

    // Seals & Gaskets  
    "Rubber Gasket", "O-Rings", "Silicone Seals", "Cork Gasket",

    // Plastic Components
    "Plastic Cover", "Nylon Spacers", "PVC Pipe", "Plastic Bushings",

    // Electrical
    "Wire Connectors", "Cable Ties", "Heat Shrink Tubing", "Electrical Tape",

    // Tools & Consumables
    "Cutting Fluid", "Machine Oil", "Grinding Wheels", "Drill Bits",
    "Sanding Paper", "Welding Rod", "Safety Glasses", "Work Gloves"
]