import axios from 'axios';

export const getEvents = async (campuses: string[]) => {
    const { data } = await axios.get('https://biso.no/wp-json/tribe/events/v1/events');
    
    //Return only data where the venue.venue is included in the campuses
    return data.filter((event) => campuses.includes(event.venue.venue));
};