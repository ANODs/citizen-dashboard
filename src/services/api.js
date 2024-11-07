const API_BASE_URL = 'http://citizen-backend-658002-ff9dbd-147-45-175-42.traefik.me/api';

export async function getCitizenById(id) {
  const response = await fetch(`${API_BASE_URL}/citizens/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch citizen');
  }
  return response.json();
}

export async function getCitizensSlice(start, end) {
  try {
    const response = await fetch(`${API_BASE_URL}/citizens/slice/${start}/${end}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching citizens slice:', error);
    throw error;
  }
}

export async function createCitizen(citizenData) {
  const response = await fetch(`${API_BASE_URL}/citizens`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(citizenData),
  });
  if (!response.ok) {
    throw new Error('Failed to create citizen');
  }
  return response.json();
}

export async function updateCitizen(id, citizenData) {
  const response = await fetch(`${API_BASE_URL}/citizens/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(citizenData),
  });
  if (!response.ok) {
    throw new Error('Failed to update citizen');
  }
  return response.json();
}

export async function getStatistics() {
  const response = await fetch(`${API_BASE_URL}/statistics`);
  if (!response.ok) {
    throw new Error('Failed to fetch statistics');
  }
  return response.json();
}

export async function searchCitizens(filters) {
  try {
    const response = await fetch(`${API_BASE_URL}/citizens/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(filters),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching citizens:', error);
    throw error;
  }
}

export default {
  getCitizenById,
  getCitizensSlice,
  createCitizen,
  updateCitizen,
  getStatistics,
  searchCitizens,
};