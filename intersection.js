import { CONFIG } from './config.js';

export class Intersection {
    constructor(centerX, centerY) {
        this.centerX = centerX;
        this.centerY = centerY;
        this.size = CONFIG.INTERSECTION_SIZE;
        this.roadWidth = CONFIG.ROAD_WIDTH;
        this.laneWidth = CONFIG.LANE_WIDTH;
        
        this.calculatePositions();
    }

    initialize() {
        this.calculatePositions();
    }

    calculatePositions() {
        const halfSize = this.size / 2;
        const halfRoad = this.roadWidth / 2;
        const laneOffset = this.laneWidth / 2;
        
        // Stop line positions (before intersection)
        this.stopLines = {
            [CONFIG.DIRECTIONS.NORTH]: {
                x1: this.centerX - halfRoad,
                y1: this.centerY - halfSize - 5,
                x2: this.centerX + halfRoad,
                y2: this.centerY - halfSize - 5
            },
            [CONFIG.DIRECTIONS.EAST]: {
                x1: this.centerX + halfSize + 5,
                y1: this.centerY - halfRoad,
                x2: this.centerX + halfSize + 5,
                y2: this.centerY + halfRoad
            },
            [CONFIG.DIRECTIONS.SOUTH]: {
                x1: this.centerX - halfRoad,
                y1: this.centerY + halfSize + 5,
                x2: this.centerX + halfRoad,
                y2: this.centerY + halfSize + 5
            },
            [CONFIG.DIRECTIONS.WEST]: {
                x1: this.centerX - halfSize - 5,
                y1: this.centerY - halfRoad,
                x2: this.centerX - halfSize - 5,
                y2: this.centerY + halfRoad
            }
        };

        // Traffic light positions
        this.lightPositions = {
            [CONFIG.DIRECTIONS.NORTH]: {
                x: this.centerX - 25,
                y: this.centerY - halfSize - 40
            },
            [CONFIG.DIRECTIONS.EAST]: {
                x: this.centerX + halfSize + 15,
                y: this.centerY - 25
            },
            [CONFIG.DIRECTIONS.SOUTH]: {
                x: this.centerX + 25,
                y: this.centerY + halfSize + 15
            },
            [CONFIG.DIRECTIONS.WEST]: {
                x: this.centerX - halfSize - 40,
                y: this.centerY + 25
            }
        };

        // Car spawn points
        this.spawnPoints = {
            [CONFIG.DIRECTIONS.NORTH]: {
                x: this.centerX - laneOffset,
                y: 0
            },
            [CONFIG.DIRECTIONS.EAST]: {
                x: CONFIG.CANVAS_WIDTH,
                y: this.centerY - laneOffset
            },
            [CONFIG.DIRECTIONS.SOUTH]: {
                x: this.centerX + laneOffset,
                y: CONFIG.CANVAS_HEIGHT
            },
            [CONFIG.DIRECTIONS.WEST]: {
                x: 0,
                y: this.centerY + laneOffset
            }
        };

        // Exit points - these are for straight-through traffic
        this.exitPoints = {
            [CONFIG.DIRECTIONS.NORTH]: {
                x: this.centerX + laneOffset,
                y: 0
            },
            [CONFIG.DIRECTIONS.EAST]: {
                x: CONFIG.CANVAS_WIDTH,
                y: this.centerY + laneOffset
            },
            [CONFIG.DIRECTIONS.SOUTH]: {
                x: this.centerX - laneOffset,
                y: CONFIG.CANVAS_HEIGHT
            },
            [CONFIG.DIRECTIONS.WEST]: {
                x: 0,
                y: this.centerY - laneOffset
            }
        };
    }

    render(ctx) {
        this.drawRoads(ctx);
        this.drawIntersection(ctx);
        this.drawLaneMarkings(ctx);
        this.drawStopLines(ctx);
    }

    drawRoads(ctx) {
        const halfRoad = this.roadWidth / 2;
        
        ctx.fillStyle = '#444444';
        
        // Vertical road (North-South)
        ctx.fillRect(
            this.centerX - halfRoad,
            0,
            this.roadWidth,
            CONFIG.CANVAS_HEIGHT
        );
        
        // Horizontal road (East-West)
        ctx.fillRect(
            0,
            this.centerY - halfRoad,
            CONFIG.CANVAS_WIDTH,
            this.roadWidth
        );
    }

    drawIntersection(ctx) {
        // Draw intersection as a simple square (straight corners)
        const halfRoad = this.roadWidth / 2;
        
        ctx.fillStyle = '#444444';
        ctx.fillRect(
            this.centerX - halfRoad,
            this.centerY - halfRoad,
            this.roadWidth,
            this.roadWidth
        );
    }

    drawLaneMarkings(ctx) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.setLineDash([10, 10]);

        const halfRoad = this.roadWidth / 2;
        
        // Vertical center line (North-South road)
        ctx.beginPath();
        ctx.moveTo(this.centerX, 0);
        ctx.lineTo(this.centerX, this.centerY - halfRoad);
        ctx.moveTo(this.centerX, this.centerY + halfRoad);
        ctx.lineTo(this.centerX, CONFIG.CANVAS_HEIGHT);
        ctx.stroke();
        
        // Horizontal center line (East-West road)
        ctx.beginPath();
        ctx.moveTo(0, this.centerY);
        ctx.lineTo(this.centerX - halfRoad, this.centerY);
        ctx.moveTo(this.centerX + halfRoad, this.centerY);
        ctx.lineTo(CONFIG.CANVAS_WIDTH, this.centerY);
        ctx.stroke();

        ctx.setLineDash([]);
    }

    drawStopLines(ctx) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        
        Object.values(this.stopLines).forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.x1, line.y1);
            ctx.lineTo(line.x2, line.y2);
            ctx.stroke();
        });
    }

    // Helper methods for car navigation
    getStopLinePosition(direction) {
        return this.stopLines[direction];
    }

    getSpawnPoint(direction) {
        return this.spawnPoints[direction];
    }

    getExitPoint(direction) {
        return this.exitPoints[direction];
    }

    getLightPosition(direction) {
        return this.lightPositions[direction];
    }

    // Check if a point is within the intersection
    isInIntersection(x, y) {
        const halfRoad = this.roadWidth / 2;
        return (
            x >= this.centerX - halfRoad &&
            x <= this.centerX + halfRoad &&
            y >= this.centerY - halfRoad &&
            y <= this.centerY + halfRoad
        );
    }

    // Get proper exit point based on turn type to ensure correct lane usage
    getProperExitPoint(fromDirection, toDirection, turnType) {
        const laneOffset = this.laneWidth / 2;
        
        // For turning cars, left turns go to far lane, right turns go to near lane
        switch (toDirection) {
            case CONFIG.DIRECTIONS.NORTH:
                if (turnType === CONFIG.TURN_TYPES.LEFT) {
                    // Left turn to north: far lane (left side of northbound traffic)
                    return { x: this.centerX - laneOffset, y: 0 };
                } else {
                    // Right turn to north: near lane (right side of northbound traffic)
                    return { x: this.centerX + laneOffset, y: 0 };
                }
            case CONFIG.DIRECTIONS.EAST:
                if (turnType === CONFIG.TURN_TYPES.LEFT) {
                    // Left turn to east: far lane (left side of eastbound traffic)
                    return { x: CONFIG.CANVAS_WIDTH, y: this.centerY - laneOffset };
                } else {
                    // Right turn to east: near lane (right side of eastbound traffic)
                    return { x: CONFIG.CANVAS_WIDTH, y: this.centerY + laneOffset };
                }
            case CONFIG.DIRECTIONS.SOUTH:
                if (turnType === CONFIG.TURN_TYPES.LEFT) {
                    // Left turn to south: far lane (left side of southbound traffic)
                    return { x: this.centerX + laneOffset, y: CONFIG.CANVAS_HEIGHT };
                } else {
                    // Right turn to south: near lane (right side of southbound traffic)
                    return { x: this.centerX - laneOffset, y: CONFIG.CANVAS_HEIGHT };
                }
            case CONFIG.DIRECTIONS.WEST:
                if (turnType === CONFIG.TURN_TYPES.LEFT) {
                    // Left turn to west: far lane (left side of westbound traffic)
                    return { x: 0, y: this.centerY + laneOffset };
                } else {
                    // Right turn to west: near lane (right side of westbound traffic)
                    return { x: 0, y: this.centerY - laneOffset };
                }
            default:
                return this.exitPoints[toDirection];
        }
    }

    // Get turning path for straight-line turns (no curves)
    getTurningPath(fromDirection, toDirection, turnType) {
        // For straight corners, cars just need entry and exit points
        return [
            this.getPathEntryPoint(fromDirection),
            this.getProperExitPoint(fromDirection, toDirection, turnType)
        ];
    }

    getPathEntryPoint(direction) {
        const halfRoad = this.roadWidth / 2;
        const laneOffset = this.laneWidth / 2;
        
        switch (direction) {
            case CONFIG.DIRECTIONS.NORTH:
                return { x: this.centerX - laneOffset, y: this.centerY - halfRoad };
            case CONFIG.DIRECTIONS.EAST:
                return { x: this.centerX + halfRoad, y: this.centerY - laneOffset };
            case CONFIG.DIRECTIONS.SOUTH:
                return { x: this.centerX + laneOffset, y: this.centerY + halfRoad };
            case CONFIG.DIRECTIONS.WEST:
                return { x: this.centerX - halfRoad, y: this.centerY + laneOffset };
        }
    }

    // Method to provide car manager reference to cars
    setCarManager(carManager) {
        this.carManager = carManager;
    }
    
    getAllCars() {
        return this.carManager ? this.carManager.getCars() : [];
    }

}