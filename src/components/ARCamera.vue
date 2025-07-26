<template>
  <div class="ar-container">
    <div class="ar-header">
      <h3>🌱 AR Garden View</h3>
      <button @click="$emit('close')" class="close-btn">✕</button>
    </div>
    
    <div class="ar-scene-container">
      <!-- AR.js Scene -->
      <a-scene
        ref="arScene"
        embedded
        ar-mode
        device-orientation-permission-ui="enabled: false"
        gesture-detector
        loading-screen="enabled: false"
        arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
        style="height: 100%; width: 100%;"
      >
        <!-- Camera -->
        <a-camera
          gps-camera
          rotation-reader
          look-controls-enabled="false"
          arjs-look-controls="smoothingFactor: 0.1"
        ></a-camera>
        
        <!-- AR Content - Floating Plant -->
        <a-entity
          id="plantModel"
          position="0 0 -3"
          scale="0.5 0.5 0.5"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 10000"
          gesture-handler="minScale: 0.25; maxScale: 10"
        >
          <!-- Simple 3D Plant using A-Frame primitives -->
          <!-- Pot -->
          <a-cylinder
            position="0 0 0"
            radius="0.8"
            height="1"
            color="#8B4513"
            material="metalness: 0.2; roughness: 0.8"
          ></a-cylinder>
          
          <!-- Soil -->
          <a-cylinder
            position="0 0.4 0"
            radius="0.75"
            height="0.2"
            color="#654321"
          ></a-cylinder>
          
          <!-- Plant Stem -->
          <a-cylinder
            position="0 1.5 0"
            radius="0.05"
            height="2"
            color="#228B22"
          ></a-cylinder>
          
          <!-- Leaves -->
          <a-sphere
            position="-0.3 2.2 0"
            radius="0.3"
            color="#32CD32"
            material="metalness: 0; roughness: 0.9"
          ></a-sphere>
          <a-sphere
            position="0.3 2.5 0"
            radius="0.35"
            color="#228B22"
            material="metalness: 0; roughness: 0.9"
          ></a-sphere>
          <a-sphere
            position="0 2.8 0.2"
            radius="0.25"
            color="#32CD32"
            material="metalness: 0; roughness: 0.9"
          ></a-sphere>
          
          <!-- Floating Info Panel -->
          <a-plane
            position="0 3.5 0"
            width="2"
            height="0.8"
            color="#ffffff"
            material="opacity: 0.9"
            look-at="[camera]"
          >
            <a-text
              value="Virtual Plant\nTap to interact!"
              position="0 0 0.01"
              align="center"
              color="#333333"
              font="dejavu"
              width="6"
            ></a-text>
          </a-plane>
        </a-entity>
        
        <!-- Floating Garden Tips -->
        <a-entity
          position="2 1 -2"
          animation="property: position; to: 2 1.5 -2; dir: alternate; loop: true; dur: 3000"
        >
          <a-plane
            width="1.5"
            height="1"
            color="#4CAF50"
            material="opacity: 0.8"
            look-at="[camera]"
          >
            <a-text
              value="💡 Tip:\nWater regularly!"
              align="center"
              color="white"
              position="0 0 0.01"
              width="8"
            ></a-text>
          </a-plane>
        </a-entity>
        
        <!-- Interactive Watering Can -->
        <a-entity
          id="wateringCan"
          position="-2 0.5 -2"
          scale="0.3 0.3 0.3"
          animation="property: rotation; to: 0 360 0; loop: true; dur: 15000"
          gesture-handler
        >
          <!-- Watering Can Body -->
          <a-cylinder
            position="0 0 0"
            radius="0.5"
            height="1"
            color="#4169E1"
          ></a-cylinder>
          
          <!-- Spout -->
          <a-cylinder
            position="0.7 0.3 0"
            radius="0.1"
            height="0.8"
            rotation="0 0 45"
            color="#4169E1"
          ></a-cylinder>
          
          <!-- Handle -->
          <a-torus
            position="-0.4 0.2 0"
            radius="0.3"
            radius-tubular="0.05"
            color="#4169E1"
            rotation="90 0 0"
          ></a-torus>
          
          <!-- Label -->
          <a-plane
            position="0 1.2 0"
            width="1"
            height="0.3"
            color="white"
            material="opacity: 0.9"
            look-at="[camera]"
          >
            <a-text
              value="Watering Can"
              align="center"
              color="#333"
              position="0 0 0.01"
              width="12"
            ></a-text>
          </a-plane>
        </a-entity>
        
        <!-- Ambient Light -->
        <a-light type="ambient" color="#ffffff" intensity="0.6"></a-light>
        
        <!-- Directional Light -->
        <a-light type="directional" position="2 4 2" color="#ffffff" intensity="0.8"></a-light>
      </a-scene>
    </div>
    
    <div class="ar-controls">
      <div class="ar-instructions">
        <p>📱 Move your device around to see AR objects!</p>
        <p>👆 Tap objects to interact with them</p>
      </div>
      
      <div class="ar-buttons">
        <button @click="togglePlant" class="ar-btn">
          {{ showPlant ? 'Hide Plant' : 'Show Plant' }}
        </button>
        <button @click="addWaterEffect" class="ar-btn">
          💧 Water Plant
        </button>
        <button @click="changePlantSize" class="ar-btn">
          🔄 Change Size
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ARCamera',
  emits: ['close'],
  data() {
    return {
      showPlant: true,
      isARSupported: false,
      plantScale: 0.5
    }
  },
  async mounted() {
    // Import A-Frame and AR.js
    await this.loadARLibraries();
    
    // Check if AR is supported
    this.checkARSupport();
    
    // Initialize gesture controls
    this.initializeGestures();
  },
  methods: {
    async loadARLibraries() {
      try {
        // Load A-Frame
        if (!window.AFRAME) {
          const aframeScript = document.createElement('script');
          aframeScript.src = 'https://aframe.io/releases/1.4.0/aframe.min.js';
          document.head.appendChild(aframeScript);
          
          await new Promise(resolve => {
            aframeScript.onload = resolve;
          });
        }
        
        // Load AR.js
        if (!window.THREEx) {
          const arScript = document.createElement('script');
          arScript.src = 'https://cdn.jsdelivr.net/gh/AR-js-org/AR.js@3.4.0/aframe/build/aframe-ar.min.js';
          document.head.appendChild(arScript);
          
          await new Promise(resolve => {
            arScript.onload = resolve;
          });
        }
        
        // Load gesture controls
        const gestureScript = document.createElement('script');
        gestureScript.src = 'https://cdn.jsdelivr.net/gh/donmccurdy/aframe-extras@v6.1.1/dist/aframe-extras.controls.min.js';
        document.head.appendChild(gestureScript);
        
      } catch (error) {
        console.error('Failed to load AR libraries:', error);
      }
    },
    
    checkARSupport() {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        this.isARSupported = true;
      } else {
        console.warn('AR not supported on this device');
      }
    },
    
    initializeGestures() {
      // Register gesture component for A-Frame
      if (window.AFRAME) {
        AFRAME.registerComponent('gesture-handler', {
          schema: {
            enabled: { default: true },
            rotationFactor: { default: 5 },
            minScale: { default: 0.3 },
            maxScale: { default: 8 },
          },
          
          init: function () {
            this.handleScale = this.handleScale.bind(this);
            this.handleRotation = this.handleRotation.bind(this);
            
            this.isVisible = false;
            this.initialScale = this.el.object3D.scale.clone();
            this.scaleFactor = 1;
            
            this.el.sceneEl.addEventListener('markerFound', (e) => {
              this.isVisible = true;
            });
            
            this.el.sceneEl.addEventListener('markerLost', (e) => {
              this.isVisible = false;
            });
          },
          
          handleRotation: function (event) {
            if (this.isVisible) {
              this.el.object3D.rotation.y += event.detail.rotationDelta * this.data.rotationFactor;
            }
          },
          
          handleScale: function (event) {
            if (this.isVisible) {
              this.scaleFactor *= 1 + event.detail.spreadDelta / event.detail.startSpread;
              this.scaleFactor = Math.min(Math.max(this.scaleFactor, this.data.minScale), this.data.maxScale);
              this.el.object3D.scale.x = this.scaleFactor * this.initialScale.x;
              this.el.object3D.scale.y = this.scaleFactor * this.initialScale.y;
              this.el.object3D.scale.z = this.scaleFactor * this.initialScale.z;
            }
          },
        });
      }
    },
    
    togglePlant() {
      const plant = document.querySelector('#plantModel');
      if (plant) {
        this.showPlant = !this.showPlant;
        plant.setAttribute('visible', this.showPlant);
      }
    },
    
    addWaterEffect() {
      // Create water particle effect
      const plant = document.querySelector('#plantModel');
      if (plant) {
        // Create temporary water droplets
        for (let i = 0; i < 10; i++) {
          const droplet = document.createElement('a-sphere');
          droplet.setAttribute('position', `${Math.random() * 2 - 1} ${3 + Math.random()} ${Math.random() * 2 - 1}`);
          droplet.setAttribute('radius', '0.05');
          droplet.setAttribute('color', '#00BFFF');
          droplet.setAttribute('animation', {
            property: 'position',
            to: `${Math.random() * 2 - 1} 0 ${Math.random() * 2 - 1}`,
            dur: 2000,
            easing: 'easeInQuad'
          });
          
          plant.appendChild(droplet);
          
          // Remove droplet after animation
          setTimeout(() => {
            if (droplet.parentNode) {
              droplet.parentNode.removeChild(droplet);
            }
          }, 2100);
        }
        
        // Make plant grow slightly
        const currentScale = this.plantScale;
        this.plantScale = Math.min(currentScale * 1.1, 1.0);
        plant.setAttribute('scale', `${this.plantScale} ${this.plantScale} ${this.plantScale}`);
      }
    },
    
    changePlantSize() {
      const plant = document.querySelector('#plantModel');
      if (plant) {
        // Cycle through different sizes
        const sizes = [0.3, 0.5, 0.8, 1.0];
        const currentIndex = sizes.indexOf(this.plantScale);
        const nextIndex = (currentIndex + 1) % sizes.length;
        this.plantScale = sizes[nextIndex];
        
        plant.setAttribute('animation__scale', {
          property: 'scale',
          to: `${this.plantScale} ${this.plantScale} ${this.plantScale}`,
          dur: 1000,
          easing: 'easeInOutQuad'
        });
      }
    }
  }
}
</script>

<style scoped>
.ar-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #000;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.ar-header {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 1001;
}

.ar-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.close-btn {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 1.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #cc3333;
}

.ar-scene-container {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.ar-controls {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 1rem;
  z-index: 1001;
}

.ar-instructions {
  text-align: center;
  margin-bottom: 1rem;
}

.ar-instructions p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  opacity: 0.8;
}

.ar-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.ar-btn {
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s ease;
}

.ar-btn:hover {
  background: #45a049;
}

.ar-btn:active {
  transform: scale(0.95);
}

@media (max-width: 768px) {
  .ar-header h3 {
    font-size: 1rem;
  }
  
  .ar-buttons {
    flex-direction: column;
  }
  
  .ar-btn {
    width: 100%;
  }
}
</style>
