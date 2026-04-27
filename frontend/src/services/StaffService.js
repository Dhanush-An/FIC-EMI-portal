import axios from 'axios';
import API_BASE_URL from '../config';

const API_URL = `${API_BASE_URL}/api/staff`;

export const onboardCandidate = async (candidateData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/onboard`, candidateData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || 'Failed to onboard candidate';
  }
};

export const getAssignedApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch applications';
    }
};

export const getCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/candidates`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || 'Failed to fetch candidates';
    }
};
