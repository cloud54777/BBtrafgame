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
        this.drawGrass(ctx);
        this.drawRoads(ctx);
        this.drawIntersection(ctx);
        this.drawLaneMarkings(ctx);
        this.drawStopLines(ctx);
    }

    drawGrass(ctx) {
        // Fill entire canvas with grass texture/color
        ctx.fillStyle = '#4a7c59'; // Dark green grass color
        ctx.fillRect(0, 0, CONFIG.CANVAS_WIDTH, CONFIG.CANVAS_HEIGHT);
        
        // Add grass texture pattern
        ctx.fillStyle = '#5a8c69';
        for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 20) {
            for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += 20) {
                if (Math.random() > 0.7) {
                    ctx.fillRect(x + Math.random() * 10, y + Math.random() * 10, 2, 2);
                }
            }
        }
    }
drawRoads(ctx) {
        const halfRoad = this.roadWidth / 2;
        
        // Draw concrete/asphalt roads
        ctx.fillStyle = '#666666'; // Darker asphalt color
        
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
        
        // Add road texture/wear marks
        ctx.fillStyle = '#555555';
        ctx.globalAlpha = 0.3;
        
        // Vertical road texture
        for (let y = 0; y < CONFIG.CANVAS_HEIGHT; y += 40) {
            ctx.fillRect(this.centerX - halfRoad + 10, y, this.roadWidth - 20, 2);
        }
        
        // Horizontal road texture  
        for (let x = 0; x < CONFIG.CANVAS_WIDTH; x += 40) {
            ctx.fillRect(x, this.centerY - halfRoad + 10, 2, this.roadWidth - 20);
        }
        
        ctx.globalAlpha = 1.0;
    }

    drawIntersection(ctx) {
    const halfRoad = this.roadWidth / 2;
    const curveRadius = halfRoad; // Makes the inward curve meet nicely

    ctx.fillStyle = '#666666';
    ctx.beginPath();

    // Start top middle going clockwise
    ctx.moveTo(this.centerX - halfRoad, this.centerY - halfRoad - curveRadius);

    // Top left inward curve
    ctx.quadraticCurveTo(
        this.centerX - halfRoad, this.centerY - halfRoad,
        this.centerX - halfRoad - curveRadius, this.centerY - halfRoad
    );

    // Left top to left bottom
    ctx.lineTo(this.centerX - halfRoad - curveRadius, this.centerY + halfRoad);

    // Bottom left inward curve
    ctx.quadraticCurveTo(
        this.centerX - halfRoad, this.centerY + halfRoad,
        this.centerX - halfRoad, this.centerY + halfRoad + curveRadius
    );

    // Bottom middle to bottom right
    ctx.lineTo(this.centerX + halfRoad, this.centerY + halfRoad + curveRadius);

    // Bottom right inward curve
    ctx.quadraticCurveTo(
        this.centerX + halfRoad, this.centerY + halfRoad,
        this.centerX + halfRoad + curveRadius, this.centerY + halfRoad
    );

    // Right bottom to right top
    ctx.lineTo(this.centerX + halfRoad + curveRadius, this.centerY - halfRoad);

    // Top right inward curve
    ctx.quadraticCurveTo(
        this.centerX + halfRoad, this.centerY - halfRoad,
        this.centerX + halfRoad, this.centerY - halfRoad - curveRadius
    );

    // Back to start
    ctx.closePath();
    ctx.fill();
}


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

        // Draw turn arrows and lane indicators
        this.drawLaneArrows(ctx);
        
        ctx.setLineDash([]);
    }

    drawLaneArrows(ctx) {
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px Arial';
        ctx.textAlign = 'center';
        
        const laneOffset = this.laneWidth / 2;
        const arrowDistance = 60;
        
        // North approach arrows
        ctx.save();
        ctx.translate(this.centerX - laneOffset, this.centerY - this.size/2 - arrowDistance);
        ctx.fillText('←↑', 0, 0);
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.centerX + laneOffset, this.centerY - this.size/2 - arrowDistance);
        ctx.fillText('↑→', 0, 0);
        ctx.restore();
        
        // South approach arrows
        ctx.save();
        ctx.translate(this.centerX + laneOffset, this.centerY + this.size/2 + arrowDistance);
        ctx.rotate(Math.PI);
        ctx.fillText('←↑', 0, 0);
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.centerX - laneOffset, this.centerY + this.size/2 + arrowDistance);
        ctx.rotate(Math.PI);
        ctx.fillText('↑→', 0, 0);
        ctx.restore();
        
        // East approach arrows
        ctx.save();
        ctx.translate(this.centerX + this.size/2 + arrowDistance, this.centerY - laneOffset);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('←↑', 0, 0);
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.centerX + this.size/2 + arrowDistance, this.centerY + laneOffset);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('↑→', 0, 0);
        ctx.restore();
        
        // West approach arrows
        ctx.save();
        ctx.translate(this.centerX - this.size/2 - arrowDistance, this.centerY + laneOffset);
        ctx.rotate(Math.PI/2);
        ctx.fillText('←↑', 0, 0);
        ctx.restore();
        
        ctx.save();
        ctx.translate(this.centerX - this.size/2 - arrowDistance, this.centerY - laneOffset);
        ctx.rotate(Math.PI/2);
        ctx.fillText('↑→', 0, 0);
        ctx.restore();
    }
drawStopLines(ctx) {
        ctx.strokeStyle = '#ffffff'; // White stop lines
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