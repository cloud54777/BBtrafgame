const turnPaths = {
    // ========================================
    // STRAIGHT MOVEMENTS
    // ========================================
    
    // North to South (straight through)
    "north_left_to_south_left": [
        { x: 230, y: 150 },  // Entry point (left lane from north)
        { x: 230, y: 250 },  // Center of intersection
        { x: 230, y: 350 }   // Exit point (left lane to south)
    ],
    
    "north_right_to_south_right": [
        { x: 270, y: 150 },  // Entry point (right lane from north)
        { x: 270, y: 250 },  // Center of intersection
        { x: 270, y: 350 }   // Exit point (right lane to south)
    ],
    
    // South to North (straight through)
    "south_left_to_north_left": [
        { x: 270, y: 350 },  // Entry point (left lane from south)
        { x: 270, y: 250 },  // Center of intersection
        { x: 270, y: 150 }   // Exit point (left lane to north)
    ],
    
    "south_right_to_north_right": [
        { x: 230, y: 350 },  // Entry point (right lane from south)
        { x: 230, y: 250 },  // Center of intersection
        { x: 230, y: 150 }   // Exit point (right lane to north)
    ],
    
    // East to West (straight through)
    "east_left_to_west_left": [
        { x: 350, y: 230 },  // Entry point (left lane from east)
        { x: 250, y: 230 },  // Center of intersection
        { x: 150, y: 230 }   // Exit point (left lane to west)
    ],
    
    "east_right_to_west_right": [
        { x: 350, y: 270 },  // Entry point (right lane from east)
        { x: 250, y: 270 },  // Center of intersection
        { x: 150, y: 270 }   // Exit point (right lane to west)
    ],
    
    // West to East (straight through)
    "west_left_to_east_left": [
        { x: 150, y: 270 },  // Entry point (left lane from west)
        { x: 250, y: 270 },  // Center of intersection
        { x: 350, y: 270 }   // Exit point (left lane to east)
    ],
    
    "west_right_to_east_right": [
        { x: 150, y: 230 },  // Entry point (right lane from west)
        { x: 250, y: 230 },  // Center of intersection
        { x: 350, y: 230 }   // Exit point (right lane to east)
    ],
    
    // ========================================
    // LEFT TURNS (Wide arcs crossing traffic)
    // ========================================
    
    // North left turn to West (crosses intersection diagonally)
    "north_left_to_west_left": [
        { x: 230, y: 150 },  // Entry point (left lane from north)
        { x: 225, y: 190 },  // Start of turn arc
        { x: 200, y: 215 },  // Mid-turn point
        { x: 165, y: 225 },  // End of turn arc
        { x: 150, y: 230 }   // Exit point (left lane to west)
    ],
    
    // South left turn to East (crosses intersection diagonally)
    "south_left_to_east_left": [
        { x: 270, y: 350 },  // Entry point (left lane from south)
        { x: 275, y: 310 },  // Start of turn arc
        { x: 300, y: 285 },  // Mid-turn point
        { x: 335, y: 275 },  // End of turn arc
        { x: 350, y: 270 }   // Exit point (left lane to east)
    ],
    
    // East left turn to North (crosses intersection diagonally)
    "east_left_to_north_left": [
        { x: 350, y: 230 },  // Entry point (left lane from east)
        { x: 310, y: 220 },  // Start of turn arc
        { x: 285, y: 195 },  // Mid-turn point
        { x: 275, y: 160 },  // End of turn arc
        { x: 270, y: 150 }   // Exit point (left lane to north)
    ],
    
    // West left turn to South (crosses intersection diagonally)
    "west_left_to_south_left": [
        { x: 150, y: 270 },  // Entry point (left lane from west)
        { x: 190, y: 280 },  // Start of turn arc
        { x: 215, y: 305 },  // Mid-turn point
        { x: 225, y: 340 },  // End of turn arc
        { x: 230, y: 350 }   // Exit point (left lane to south)
    ],
    
    // ========================================
    // RIGHT TURNS (Tight arcs staying close)
    // ========================================
    
    // North right turn to East (tight right arc)
    "north_right_to_east_right": [
        { x: 270, y: 150 },  // Entry point (right lane from north)
        { x: 280, y: 190 },  // Start of turn arc
        { x: 310, y: 210 },  // Mid-turn point
        { x: 340, y: 225 },  // End of turn arc
        { x: 350, y: 230 }   // Exit point (right lane to east)
    ],
    
    // South right turn to West (tight right arc)
    "south_right_to_west_right": [
        { x: 230, y: 350 },  // Entry point (right lane from south)
        { x: 220, y: 310 },  // Start of turn arc
        { x: 190, y: 290 },  // Mid-turn point
        { x: 160, y: 275 },  // End of turn arc
        { x: 150, y: 270 }   // Exit point (right lane to west)
    ],
    
    // East right turn to South (tight right arc)
    "east_right_to_south_right": [
        { x: 350, y: 270 },  // Entry point (right lane from east)
        { x: 320, y: 280 },  // Start of turn arc
        { x: 295, y: 310 },  // Mid-turn point
        { x: 280, y: 340 },  // End of turn arc
        { x: 270, y: 350 }   // Exit point (right lane to south)
    ],
    
    // West right turn to North (tight right arc)
    "west_right_to_north_right": [
        { x: 150, y: 230 },  // Entry point (right lane from west)
        { x: 180, y: 220 },  // Start of turn arc
        { x: 205, y: 190 },  // Mid-turn point
        { x: 220, y: 160 },  // End of turn arc
        { x: 230, y: 150 }   // Exit point (right lane to north)
    ]
};

export default turnPaths;
