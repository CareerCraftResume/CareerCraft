// Mock profile service
const STORAGE_KEY = 'user_profile';

// Get profile from localStorage or return default profile
export const getProfile = async () => {
  try {
    const storedProfile = localStorage.getItem(STORAGE_KEY);
    if (storedProfile) {
      return JSON.parse(storedProfile);
    }
    // Return default profile if none exists
    const defaultProfile = {
      name: '',
      email: '',
      bio: '',
      avatar: '',
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  } catch (error) {
    console.error('Error getting profile:', error);
    throw new Error('Failed to get profile');
  }
};

// Update profile in localStorage
export const updateProfile = async (profileData) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profileData));
    return true;
  } catch (error) {
    console.error('Error updating profile:', error);
    throw new Error('Failed to update profile');
  }
};
