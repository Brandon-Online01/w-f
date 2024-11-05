import { useSessionStore } from "@/providers/session.provider";
import { useFactoryToggler } from "@/shared/state/factory-toggler";

export function generateFactoryEndpoint(requestedEndpoint: string): string {
    const baseURL = `${process.env.NEXT_PUBLIC_API_URL}`;
    const factoryReferenceID = useFactoryToggler.getState().factoryReferenceID || useSessionStore?.getState()?.user?.factoryReferenceID;
    const derivedEndpoint = `${baseURL}/${requestedEndpoint}/${factoryReferenceID}`
    return derivedEndpoint;
}
