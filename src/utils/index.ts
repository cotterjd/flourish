// Garden App utilities

export interface Plant {
  id: string;
  name: string;
  species?: string;
  plantedDate?: Date;
  lastWatered?: Date;
  lastFertilized?: Date;
  notes?: string;
  location?: string;
}

export const storage = {
  // Save data to localStorage
  save: (key: string, value: any): void => {
    localStorage.setItem(key, JSON.stringify(value));
  },

  // Get data from localStorage
  get: (key: string): any => {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  },

  // Remove item from localStorage
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  // Get all keys from localStorage
  keys: (): string[] => {
    return Object.keys(localStorage);
  },

  // Clear all localStorage
  clear: (): void => {
    localStorage.clear();
  }
};

export const plantStorage = {
  // Save plants array
  savePlants: (plants: Plant[]): void => {
    storage.save('garden-plants', plants);
  },

  // Get plants array
  getPlants: (): Plant[] => {
    return storage.get('garden-plants') || [];
  },

  // Add a new plant
  addPlant: (plant: Plant): void => {
    const plants = plantStorage.getPlants();
    plants.push(plant);
    plantStorage.savePlants(plants);
  },

  // Update a plant
  updatePlant: (updatedPlant: Plant): void => {
    const plants = plantStorage.getPlants();
    const index = plants.findIndex(p => p.id === updatedPlant.id);
    if (index !== -1) {
      plants[index] = updatedPlant;
      plantStorage.savePlants(plants);
    }
  },

  // Delete a plant
  deletePlant: (plantId: string): void => {
    const plants = plantStorage.getPlants();
    const filteredPlants = plants.filter(p => p.id !== plantId);
    plantStorage.savePlants(filteredPlants);
  }
};

// Utility function to generate unique IDs
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Date formatting utilities
export const formatDate = (date: Date): string => {
  return date.toLocaleDateString();
};

export const daysSince = (date: Date): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
