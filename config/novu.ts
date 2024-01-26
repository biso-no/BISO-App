import {
    Novu, PushProviderIdEnum,
  } from '@novu/node';
  
 export const novu = new Novu("b632d151551f0cc432b4e9b5d887839b", {
    backendUrl: "https://api.novu.com"
  });  

  export const setPushCredentials = async (userId: string, pushTokens: string[]) => {
    await novu.subscribers.setCredentials(userId, PushProviderIdEnum.EXPO, {
        deviceTokens: pushTokens
    });
    }