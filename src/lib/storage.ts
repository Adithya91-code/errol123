import { Crop } from '../types';

const STORAGE_KEYS = {
  CROPS: 'farmchain_crops',
  USERS: 'farmchain_users',
  CURRENT_USER: 'current_user'
};

export const storage = {
  getCrops(userId: string): Crop[] {
    const crops = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (!crops) return [];

    try {
      const allCrops = JSON.parse(crops);
      return allCrops.filter((crop: Crop) => crop.user_id === userId);
    } catch {
      return [];
    }
  },

  addCrop(crop: Crop): Crop {
    const crops = localStorage.getItem(STORAGE_KEYS.CROPS);
    const allCrops = crops ? JSON.parse(crops) : [];
    allCrops.push(crop);
    localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(allCrops));
    return crop;
  },

  updateCrop(cropId: string, cropData: Partial<Crop>): void {
    const crops = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (!crops) return;

    try {
      const allCrops = JSON.parse(crops);
      const index = allCrops.findIndex((c: Crop) => c.id === cropId);
      if (index !== -1) {
        allCrops[index] = { ...allCrops[index], ...cropData };
        localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(allCrops));
      }
    } catch (error) {
      console.error('Error updating crop:', error);
    }
  },

  deleteCrop(cropId: string): void {
    const crops = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (!crops) return;

    try {
      const allCrops = JSON.parse(crops);
      const filtered = allCrops.filter((c: Crop) => c.id !== cropId);
      localStorage.setItem(STORAGE_KEYS.CROPS, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  },

  findCrop(cropId: string): Crop | null {
    const crops = localStorage.getItem(STORAGE_KEYS.CROPS);
    if (!crops) return null;

    try {
      const allCrops = JSON.parse(crops);
      return allCrops.find((c: Crop) => c.id === cropId) || null;
    } catch {
      return null;
    }
  },

  addUser(user: any): any {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    const allUsers = users ? JSON.parse(users) : [];

    let farmerId = user.farmer_id;
    let distributorId = user.distributor_id;

    if (user.role === 'farmer' && !farmerId) {
      farmerId = String(Math.floor(Math.random() * 900) + 100);
    }
    if (user.role === 'distributor' && !distributorId) {
      distributorId = String(Math.floor(Math.random() * 900) + 100);
    }

    const newUser = { ...user, farmer_id: farmerId, distributor_id: distributorId };
    allUsers.push(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(allUsers));
    return newUser;
  },

  findUser(email: string, password: string): any {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!users) return null;

    try {
      const allUsers = JSON.parse(users);
      return allUsers.find((u: any) => u.email === email && u.password === password);
    } catch {
      return null;
    }
  },

  userExists(email: string): boolean {
    const users = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!users) return false;

    try {
      const allUsers = JSON.parse(users);
      return allUsers.some((u: any) => u.email === email);
    } catch {
      return false;
    }
  },

  getCurrentUser(): any {
    const user = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user: any): void {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
  },

  clearCurrentUser(): void {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
  }
};
