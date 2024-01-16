import axios from 'axios';
import { auth } from '../config/firebase';

interface ApiClientProps {
    path: string;
    method?: string;
    additionalHeaders?: any;
    body?: any;
}

// A client to make requests to the API with the idToken in the Authorization header
export async function apiClient({ path, method = 'GET', additionalHeaders = {}, body }: ApiClientProps) {
    try {
        const idToken = await auth.currentUser?.getIdToken();
        console.log("idToken:", idToken);
        if (!idToken) {
            throw new Error("User is not authenticated");
        }

        const headers = {
            Authorization: `Bearer ${idToken}`,
            ...additionalHeaders,
        };
        const url = "https://api.web.biso.no/api/" + path;
        console.log("url:", url);
        const response = await axios({
            method,
            url: url,
            data: body,
            headers,
        });
        console.log("response:", response);
        return response;
    } catch (error) {
        console.error("Error in apiClient:", error);
        throw error; // re-throw the error for the caller to handle
    }
}
