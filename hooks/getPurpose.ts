import axios from 'axios';
import { Attachment } from '../types';

async function generatePurpose(uploadedAttachments: Attachment[], eventName?: string) {
  try {
    console.log('attachmentsArray', uploadedAttachments);
    console.log('eventName', eventName);

    const descriptionsArray = uploadedAttachments.map((attachment) => {
      return attachment.description;
    }
    );

    console.log('descriptionsArray', descriptionsArray);

    if (!eventName) {
      eventName = 'general';
    }

    const body = {
      descriptions: descriptionsArray,
      eventName: eventName,
      token: 'sdbashdb13123ksadjdsn'
    };

    const response = await axios.post('https://api.web.biso.no/generatePurpose', body);
    console.log('response', response);

    return response.data.purpose;
  } catch (error) {
    console.log(error);
  }
}

export default generatePurpose;