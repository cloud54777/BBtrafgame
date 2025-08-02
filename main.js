import { GameEngine } from './gameEngine.js';
import { UIController } from './ui.js';
import { CONFIG } from './config.js';
import { turnPaths } from './turnpaths.js ;

class TrafficSimulator {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gameEngine = new GameEngine(this.canvas, this.ctx);
        this.uiController = new UIController(this.gameEngine);
        
        this.isRunning = true;
        this.lastTime = 0;
        
        this.initializeGame();
        this.startGameLoop();
    }

    initializeGame() {
        // Set canvas size
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;
        
        // Initialize game systems
        this.gameEngine.initialize();
        this.uiController.initialize();
        
        console.log('Traffic Simulator initialized');
    }

    startGameLoop() {
        const gameLoop = (currentTime) => {
            const deltaTime = currentTime - this.lastTime;
            this.lastTime = currentTime;

            if (this.isRunning) {
                this.gameEngine.update(deltaTime);
            }
            
            this.gameEngine.render();
            
            requestAnimationFrame(gameLoop);
        };

        requestAnimationFrame(gameLoop);
    }

    pause() {
        this.isRunning = false;
    }

    resume() {
        this.isRunning = true;
    }

    reset() {
        this.gameEngine.reset();
    }

    togglePause() {
        this.isRunning = !this.isRunning;
        return this.isRunning;
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.trafficSimulator = new TrafficSimulator();
});
