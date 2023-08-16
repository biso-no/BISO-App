import axios from 'axios';

export const getEvents = async () => {
    const { data } = await axios.get('https://biso.no/wp-json/tribe/events/v1/events');
    return data;
};
