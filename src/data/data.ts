import axios from "axios";

export const userList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/users/`;

        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const componentList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/components`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const mouldList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/moulds`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const machineList = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/machines`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const latestReports = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/reports`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}

export const allFactories = async (token: string) => {
    try {
        const config = { headers: { 'token': token } };
        const url = `${process.env.NEXT_PUBLIC_API_URL}/factories`
        const { data } = await axios.get(url, config)
        return data;
    } catch (error) {
        console.log(error)
    }
}


export const colors = [
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