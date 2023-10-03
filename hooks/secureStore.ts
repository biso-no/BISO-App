import * as SecureStore from 'expo-secure-store';

export async function saveToSecureStore(key: string, value: string) {
    await SecureStore.setItemAsync(key, value);
}

export const getSecureStore = async (key: string) => {
    return await SecureStore.getItemAsync(key);
}