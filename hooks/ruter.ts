import axios from 'axios';

const RUTER_API_URL = 'https://api.entur.io/journey-planner/v3/graphql';

interface PlanTripProps {
    from: { name: string; coordinates: { latitude: number; longitude: number; } };
    to: { place: string; name: string };
    date: string;
}

interface NearbyStopsProps {
    coordinates: { latitude: number; longitude: number; };
}

export const planTrip = async ({ from, to, date }: PlanTripProps) => {
    const queryBody = `
    query PlanTrip($from: InputPlace!, $to: InputPlace!, $date: String!) {
        trip(
          from: $from
          to: $to
          numTripPatterns: 3
          dateTime: $date
          walkSpeed: 1.3
          arriveBy: false
        ) {
          tripPatterns {
            expectedStartTime
            duration
            walkDistance
            legs {
              mode
              distance
              line {
                id
                publicCode
              }
            }
          }
        }
      }
    `;
    const variables = {
        from: {
            name: from.name,
            coordinates: {
                latitude: from.coordinates.latitude,
                longitude: from.coordinates.longitude
            }
        },
        to: {
            place: to.place,
            name: to.name
        },
        date: date
    };
    try {
        const response = await axios.post(RUTER_API_URL, {
            query: queryBody,
            variables: variables
        });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}

