export const imagePathGenerator = (imageUrl: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const imageURl = `${baseUrl}${imageUrl}`
    return imageURl;
}