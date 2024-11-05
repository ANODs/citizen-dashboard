import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001';

export const getCitizens = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/citizens`);
    return response.data;
  } catch (error) {
    console.error('Error fetching citizens:', error);
    throw error;
  }
};

export const getCitizenById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/citizens/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching citizen with id ${id}:`, error);
    throw error;
  }
};
