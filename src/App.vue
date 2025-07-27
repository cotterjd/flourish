<template>
  <div class="app">
    <!-- AR Camera Component -->
    <ARCamera v-if="showAR" @close="closeAR" @photo-uploaded="onPhotoUploaded" @analysis-complete="onAnalysisComplete" />
    
    <header>
      <h1>🌱 Flourish</h1>
      <p>Gardening dreams coming true and staying true</p>
    </header>
    
    <main>
      <div class="welcome">
        <h2>Welcome to your digital garden!</h2>
        <p>Start by adding a photo of a place you want help with</p>
        
        <div class="actions">
          <button class="btn-secondary" @click="viewGarden">View Projects</button>
          <button class="btn-ar" @click="openAR">Add Photo</button>
        </div>
        
        <div class="features">
          <div class="feature-card">
            <h3>🌿 Plant Tracking</h3>
            <p>Keep track of your plants' growth and health</p>
          </div>
          <div class="feature-card">
            <h3>💧 Care Reminders</h3>
            <p>Never forget to water or fertilize your plants</p>
          </div>
          <div class="feature-card">
            <h3>🔍 AR Experience</h3>
            <p>See virtual plants in your real environment</p>
          </div>
        </div>
      </div>
    </main>
    
    <footer>
      <p>Version {{ version }}</p>
    </footer>
  </div>
</template>

<script>
import packageJson from "../package.json";
import ARCamera from "./components/ARCamera.vue";
import { generateReport } from "./utils"

export default {
  name: 'App',
  components: {
    ARCamera
  },
  data() {
    return {
      version: packageJson.version,
      showAR: false,
      uploadedPhotos: [],
      analysisResults: []
    }
  },
  methods: {
    async viewGarden() {
      const foo = await generateReport(); 
      console.log(`foo`, foo);
    },
    openAR() {
      // call generateReport in utils
      // Check if device supports camera
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.showAR = true;
      } else {
        alert('Camera access is not supported on this device');
      }
    },
    closeAR() {
      this.showAR = false;
    },
    async onPhotoUploaded(photoData) {
      console.log('Photo uploaded:', photoData);
      const foo = await generateReport(); 
      // this.uploadedPhotos.push(photoData);
      // You can add logic here to display the photo or save it to a backend
      alert(`Photo uploaded successfully! Total photos: ${this.uploadedPhotos.length}`);
    }
  }
}
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

header {
  background: linear-gradient(135deg, #4CAF50, #2E7D32);
  color: white;
  padding: 2rem;
  text-align: center;
}

header h1 {
  margin: 0;
  font-size: 2.5rem;
  font-weight: 300;
}

header p {
  margin: 0.5rem 0 0 0;
  opacity: 0.9;
}

main {
  flex: 1;
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.welcome {
  text-align: center;
  padding: 2rem 0;
}

.welcome h2 {
  color: #2E7D32;
  margin-bottom: 1rem;
}

.welcome p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-bottom: 3rem;
}

.btn-primary, .btn-secondary, .btn-ar {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background: #45a049;
  transform: translateY(-2px);
}

.btn-secondary {
  background: transparent;
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.btn-secondary:hover {
  background: #4CAF50;
  color: white;
  transform: translateY(-2px);
}

.btn-ar {
  background: linear-gradient(135deg, #FF6B6B, #FF8E53);
  color: white;
  border: 2px solid transparent;
}

.btn-ar:hover {
  background: linear-gradient(135deg, #FF5252, #FF7043);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.feature-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.feature-card h3 {
  color: #2E7D32;
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.feature-card p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
  line-height: 1.5;
}

footer {
  background: #f5f5f5;
  padding: 1rem;
  text-align: center;
  color: #666;
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  header {
    padding: 1.5rem;
  }
  
  header h1 {
    font-size: 2rem;
  }
  
  main {
    padding: 1rem;
  }
  
  .actions {
    flex-direction: column;
    align-items: center;
  }
  
  .btn-primary, .btn-secondary, .btn-ar {
    width: 100%;
    max-width: 250px;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
