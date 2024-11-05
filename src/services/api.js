const API_BASE_URL = 'http://citizen-frontend-3ab160-d1c449-147-45-175-42.traefik.me/api';

export const getCitizens = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/citizens`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching citizens:', error);
    throw error;
  }
};

export const getCitizenById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/citizens/${id}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error(`Error fetching citizen with id ${id}:`, error);
    throw error;
  }
};