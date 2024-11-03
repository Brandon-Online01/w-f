import { useFactoryStore } from "@/shared/state/endpoint";

export function generateFactoryEndpoint(requestedEndpoint: string): string {
    const baseURL = `${process.env.NEXT_PUBLIC_API_URL}`
    const factoryReferenceID = useFactoryStore.getState().factoryReferenceID;
    const derivedEndpoint = `${baseURL}/${requestedEndpoint}/${factoryReferenceID}`
    return derivedEndpoint;
}