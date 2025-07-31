export const CONFIG = {
    // Canvas settings
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 800,
    
    // Intersection settings
    INTERSECTION_SIZE: 120,
    ROAD_WIDTH: 80,
    LANE_WIDTH: 40,
    
    // Traffic light settings
    LIGHT_SIZE: 8,
    LIGHT_POLE_HEIGHT: 30,
    LIGHT_COLORS: {
        RED: '#ff4444',
        YELLOW: '#ffaa00',
        GREEN: '#44ff44',
        OFF: '#333333'
    },
    
    // Car settings
    CAR_WIDTH: 24,
    CAR_HEIGHT: 12,
    CAR_COLORS: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'],
    
    // Default game settings
    DEFAULT_SETTINGS: {
        GREEN_DURATION: 10000,      // 10 seconds
        YELLOW_DURATION: 3000,      // 3 seconds
        ALL_RED_DURATION: 2000,     // 2 seconds
        CAR_SPAWN_RATE: 4,          // cars per 10 seconds
        CAR_SPEED: 25,              // pixels per second
        TURN_RATE: 0.25,            // 25% chance to turn
        DETECTOR_DISTANCE: 80,      // pixels from stop line
        MIN_GREEN_TIME: 5000        // 5 seconds minimum green
    },
    
    // Directions
    DIRECTIONS: {
        NORTH: 0,
        EAST: 1,
        SOUTH: 2,
        WEST: 3
    },
    
    // Traffic light states
    LIGHT_STATES: {
        RED: 'red',
        YELLOW: 'yellow',
        GREEN: 'green'
    },
    
    // Turn types
    TURN_TYPES: {
        STRAIGHT: 'straight',
        LEFT: 'left',
        RIGHT: 'right'
    },
    
    // Simulation modes
    MODES: {
        FIXED: 'fixed',
        ADAPTIVE: 'adaptive'
    }
};