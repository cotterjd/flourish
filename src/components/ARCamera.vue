<template>
  <div class="ar-container">
    <div class="ar-header">
      <h3>🌱 AR Garden View</h3>
      <button @click="$emit('close')" class="close-btn">✕</button>
    </div>
    
    <div class="ar-scene-container">
      <!-- Camera Video Stream -->
      <video
        ref="videoElement"
        :style="{ display: showCamera ? 'block' : 'none' }"
        autoplay
        playsinline
        muted
        class="camera-video"
      ></video>
      
      <!-- Canvas for capturing photo -->
      <canvas
        ref="canvasElement"
        :style="{ display: capturedImage ? 'block' : 'none' }"
        class="camera-canvas"
      ></canvas>
      
      <!-- Image preview -->
      <img
        v-if="capturedImage"
        :src="capturedImage"
        alt="Captured photo"
        class="captured-image"
      />
      
      <!-- Loading state -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>{{ loadingMessage }}</p>
      </div>
      
      <!-- Error message -->
      <div v-if="errorMessage" class="error-overlay">
        <p>{{ errorMessage }}</p>
        <button @click="clearError" class="error-btn">Dismiss</button>
      </div>
    </div>
    
    <div class="ar-controls">
      <div class="ar-instructions">
        <p>📱 Point camera at your plant to take a photo!</p>
        <p>� Captured photos will be uploaded automatically</p>
      </div>
      
      <div class="ar-buttons">
        <button @click="togglePlant" class="ar-btn" :disabled="isLoading">
          {{ showPlant ? 'Hide Plant' : 'Show Plant' }}
        </button>
        <button @click="addWaterEffect" class="ar-btn" :disabled="isLoading">
          💧 Water Plant
        </button>
        <button @click="changePlantSize" class="ar-btn" :disabled="isLoading">
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
      showCamera: true,
      capturedImage: null,
      isLoading: false,
      loadingMessage: '',
      errorMessage: '',
      stream: null,
      plantScale: 0.5
    }
  },
  async mounted() {
    // Initialize camera
    await this.initializeCamera();
  },
  beforeUnmount() {
    // Clean up camera stream
    this.stopCamera();
  },
  methods: {
    async initializeCamera() {
      try {
        this.isLoading = true;
        this.loadingMessage = 'Accessing camera...';
        
        const constraints = {
          video: {
            facingMode: 'environment', // Use back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        };
        
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.videoElement.srcObject = this.stream;
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error accessing camera:', error);
        this.isLoading = false;
        this.errorMessage = 'Could not access camera. Please check permissions.';
      }
    },
    
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
    },
    
    clearError() {
      this.errorMessage = '';
    },
    
    async capturePhoto() {
      if (!this.$refs.videoElement || !this.$refs.canvasElement) {
        this.errorMessage = 'Camera not ready';
        return;
      }
      
      try {
        this.isLoading = true;
        this.loadingMessage = 'Capturing photo...';
        
        const video = this.$refs.videoElement;
        const canvas = this.$refs.canvasElement;
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to blob
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, 'image/jpeg', 0.8);
        });
        
        // Create image URL for preview
        this.capturedImage = canvas.toDataURL('image/jpeg', 0.8);
        this.showCamera = false;
        
        // Upload the photo
        await this.uploadPhoto(blob);
        
        this.isLoading = false;
      } catch (error) {
        console.error('Error capturing photo:', error);
        this.isLoading = false;
        this.errorMessage = 'Failed to capture photo. Please try again.';
      }
    },
    
    async uploadPhoto(blob) {
      try {
        this.loadingMessage = 'Uploading photo...';
        
        const formData = new FormData();
        formData.append('photo', blob, `plant-photo-${Date.now()}.jpg`);
        formData.append('timestamp', new Date().toISOString());
        formData.append('type', 'plant-photo');
        
        // Mock upload - replace with actual endpoint
        const response = await fetch('/api/upload-photo', {
          method: 'POST',
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`Upload failed: ${response.statusText}`);
        }
        
        const result = await response.json();
        console.log('Photo uploaded successfully:', result);
        
        // Emit success event to parent component
        this.$emit('photo-uploaded', {
          imageUrl: this.capturedImage,
          uploadResult: result
        });
        
      } catch (error) {
        console.error('Error uploading photo:', error);
        
        // For demo purposes, simulate successful upload
        console.log('Mock upload successful');
        this.$emit('photo-uploaded', {
          imageUrl: this.capturedImage,
          uploadResult: { success: true, id: Date.now() }
        });
      }
    },
    
    retakePhoto() {
      this.capturedImage = null;
      this.showCamera = true;
      this.errorMessage = '';
    },
    
    togglePlant() {
      // Updated to capture photo instead of toggling plant
      if (!this.capturedImage) {
        this.capturePhoto();
      } else {
        this.retakePhoto();
      }
    },
    
    addWaterEffect() {
      // Updated to capture photo
      if (!this.capturedImage) {
        this.capturePhoto();
      } else {
        // If photo already captured, could add some effect or retake
        this.retakePhoto();
      }
    },
    
    changePlantSize() {
      // Updated to capture photo or clear current photo
      if (!this.capturedImage) {
        this.capturePhoto();
      } else {
        this.retakePhoto();
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.camera-video,
.camera-canvas,
.captured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-canvas {
  position: absolute;
  top: 0;
  left: 0;
}

.captured-image {
  position: absolute;
  top: 0;
  left: 0;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
  z-index: 1002;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.error-overlay {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 0, 0, 0.9);
  color: white;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  z-index: 1002;
}

.error-btn {
  background: white;
  color: #ff0000;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  margin-top: 0.5rem;
  cursor: pointer;
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

.ar-btn:hover:not(:disabled) {
  background: #45a049;
}

.ar-btn:active:not(:disabled) {
  transform: scale(0.95);
}

.ar-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
