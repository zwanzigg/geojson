import axios from "axios";

const STREET_API_URL = 'https://www.openstreetmap.org/api/0.6/map';

export const fetchStreetMapDetails = async (coordinates: Array<number>): Promise<any> => {
  const [left, bottom, right, top] = coordinates;
  const url = `${STREET_API_URL}?bbox=${left},${bottom},${right},${top}`;
  return await axios.get(url, {});
}
