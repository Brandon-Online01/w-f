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
            description: 'Empower your warehouse operations with real-time monitoring, actionable insights, and performance tracking. Let’s get started on optimizing your workflows for smarter decision-making!',
            side: "left",
            align: 'start'
        }
    },
    {
        element: '.live',
        popover: {
            title: 'Live Overview',
            description: 'Here, you can see real-time updates about your activities.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.management',
        popover: {
            title: 'Asset Management',
            description: 'Manage your machines, staff, and moulds from this section.',
            side: "bottom",
            align: 'start'
        }
    },
    {
        element: '.theme',
        popover: {
            title: 'Theme Preferences',
            description: 'Personalize your app experience by choosing a theme that you like.',
            side: "top",
            align: 'center'
        }
    },
    {
        element: '.factory',
        popover: {
            title: 'Factory Management',
            description: 'Choose a factory to manage its operations easily.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.signout',
        popover: {
            title: 'Logout',
            description: 'When you are done, click here to safely log out of your account.',
            side: "top",
            align: 'start'
        }
    },
    { popover: { title: 'Next Steps', description: 'You are now going to the next steps, which will help you understand how to read charts and understand the live run view.' } },
    {
        element: '.highlights',
        popover: {
            title: 'Machine Highlights',
            description: 'This section showcases the highlights of machine runs, displaying status indicators and quick summaries.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.machines',
        popover: {
            title: 'Machines Overview',
            description: 'Explore the list of registered machines to see which are running, stopped, or idle at a glance.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.machine-utilization',
        popover: {
            title: 'Machine Utilization',
            description: 'Get insights into machine performance and utilization rates, ensuring optimal productivity.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.devices',
        popover: {
            title: 'Device Management',
            description: 'View all registered devices and monitor which are actively in use and which are currently idle.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.device-utilization',
        popover: {
            title: 'Device Utilization',
            description: 'Track device usage over time to make sure you’re maximizing resource availability.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.reports',
        popover: {
            title: 'Shift Reports',
            description: 'Download reports from the last four shifts to stay up-to-date with the latest factory insights.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.live-run',
        popover: {
            title: 'Live Production',
            description: 'Monitor real-time production metrics for machines currently active in the factory.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.search-live',
        popover: {
            title: 'Search Live Run',
            description: 'Quickly locate specific machines or components in your live run. Just type in the machine name or component code to zero in on the exact information you need without scrolling through the list.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.filter',
        popover: {
            title: 'Filter the Live Run View',
            description: 'Easily narrow down your live run view by selecting specific machine statuses, like “Running” or “Stopped.” This filter lets you focus on what’s important right now, making it simple to monitor the machines that need the most attention.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.pagination',
        popover: {
            title: 'View More Machines',
            description: 'See more of your machines at a glance! Use the pagination feature to scroll through your list, viewing additional machines as needed. It’s an easy way to navigate through larger setups without overwhelming your screen.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.production-machine',
        popover: {
            title: 'Production Machine',
            description: 'This card represents a machine actively engaged in the production line, showcasing its current state.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.component-image',
        popover: {
            title: 'Component Image',
            description: 'Here, you can see the image of the component being produced, providing a visual reference for identification.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.machine-name',
        popover: {
            title: 'Machine Name',
            description: 'The name of the machine helps you identify which equipment is in operation.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.record-age',
        popover: {
            title: 'Record Age',
            description: 'This shows how long ago the machine last sent a status update, helping you monitor its activity frequency.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.component-code',
        popover: {
            title: 'Component Code',
            description: 'Each component is assigned a unique code for easy tracking and reference during production.',
            side: "left",
            align: 'center'
        }
    },
    {
        element: '.act-time',
        popover: {
            title: 'Actual Cycle Time',
            description: 'Monitor the latest cycle time from the machine to gauge its current production efficiency.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.std-time',
        popover: {
            title: 'Standard Cycle Time',
            description: 'This represents the target time for completing a production cycle for the component.',
            side: "top",
            align: 'start'
        }
    },
    {
        element: '.signal',
        popover: {
            title: 'Signal Strength',
            description: 'Check the signal strength of the device installed on the machine to ensure connectivity and data transmission.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.first-check',
        popover: {
            title: 'First Check Status',
            description: 'This is the initial status report indicating production health or status, represented with relevant icons.',
            side: "right",
            align: 'start'
        }
    },
    {
        element: '.progress',
        popover: {
            title: 'Production Progress',
            description: 'This progress bar shows current production levels compared to the expected target for the current shift.',
            side: "bottom",
            align: 'center'
        }
    },
    {
        element: '.production-machine',
        popover: {
            title: 'View Production Metrics',
            description: 'Click here to open a modal displaying detailed production metrics, including cycle times, variances, warnings, performance, and materials usage. You can also manage live runs and add notes for your reference.',
            side: "top",
            align: 'start'
        }
    },
    {
        popover: {
            title: 'Enjoy WareSense!',
            description: 'You are now equipped with the knowledge to navigate WareSense effectively. Explore the features, monitor your operations in real-time, and leverage insights to enhance your warehouse performance. If you have any questions, feel free to reach out to our support team. Happy optimizing!',
            side: "top",
            align: 'center'
        }
    }
];
