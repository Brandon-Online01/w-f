export interface ComboboxItem {
    value: string;
    label: string;
    image?: string;
}

export interface ComboboxProps {
    items: ComboboxItem[];
}