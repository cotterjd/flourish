<template>
  <div class="app">
    <header>
      <h1>🌱 Garden App</h1>
      <p>Track your plants and garden progress</p>
    </header>
    
    <main>
      <div class="welcome">
        <h2>Welcome to your digital garden!</h2>
        <p>Start by adding your first plant to track its growth and care schedule.</p>
        
        <div class="actions">
          <button class="btn-primary">Add Plant</button>
          <button class="btn-secondary">View Garden</button>
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

export default {
  name: 'App',
  data() {
    return {
      version: packageJson.version
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
}

.btn-primary, .btn-secondary {
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
  
  .btn-primary, .btn-secondary {
    width: 100%;
    max-width: 200px;
  }
}
</style>
