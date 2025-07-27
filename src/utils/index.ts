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

export interface GenerateArgs {
  after_image: string; // Base64 encoded image
  before_image: string; // Optional Base64 encoded image
  requested_tasks: string; // Optional tasks to perform
}

// Interface for backend response from analyze_landscaping
export interface ReportResponse {
  report: string;
  before_analysis_text: string;
  original_tasks_text: string;
  error?: string; // Add optional error field
}

// ============================================================================
// HTTP POST Methods
// ============================================================================

// Route for http://10.132.122.162:5000/analyze_landscaping
// This method sends image data and tasks to the backend for AI analysis.
export const generateReport = async (args: GenerateArgs): Promise<ReportResponse> => {
  try {
    const response = await fetch('http://10.132.122.162:5000/analyze_landscaping', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(args)
    });

    if (!response.ok) {
      const errorData = await response.json();
      // Throw an error with the backend's message for better debugging
      throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
    }

    return response.json(); // Returns a Promise that resolves with the parsed JSON data
  } catch (error) {
    console.error("Error generating report:", error);
    throw error; // Re-throw to be caught by the calling function
  }
};

// Placeholder for a future POST method to add/update plant data on a backend server.
// This would require a corresponding Flask route (e.g., '/plants') in app.py.
// export const savePlantToServer = async (plant: Plant): Promise<Plant> => {
//   try {
//     const response = await fetch('http://10.132.122.162:5000/plants', {
//       method: 'POST', // Or PUT for updates
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(plant)
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.error || `HTTP error! Status: ${response.status}`);
//     }

//     return response.json(); // Returns the saved plant data from the server
//   } catch (error) {
//     console.error("Error saving plant to server:", error);
//     throw error;
//   }
// };

// ============================================================================
// Local Storage Utilities (Client-side only)
// ============================================================================

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

// ============================================================================
// Utility Functions
// ============================================================================

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
