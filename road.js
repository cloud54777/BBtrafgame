import { CONFIG } from './config.js';

//#########################################################
// Road trajectory system with lane-specific paths
//#########################################################

export class RoadSystem {
    constructor(centerX, centerY) {
        this.center_xPhys = centerX;
        this.center_yPhys = centerY;
        
        // Road geometry parameters
        this.road0Len = 400;
        this.road2Len = 400;
        this.road4Len = 400;
        this.offsetMain = 20;    // offset for main road lanes
        this.offsetSec = 20;     // offset for secondary road lanes
        this.radiusRight = 30;   // radius for right turns
        this.radiusLeft = 50;    // radius for left turns
        
        // Target positions for lane changes
        this.offset20Target = 40;
        this.offset21Target = 40;
        this.offset20Source = 20;
        this.offset21Source = 20;
        
        // Transition points
        this.u20Target = 100;
        this.u21Target = 100;
        this.u03Target = 100;
        this.u13Target = 100;
        
        // Turn lengths
        this.lenRight = 80;
        this.lenLeft = 120;
        this.lenLeftSecMain = 150;
        
        this.initializeTrajectories();
        this.initializeRoutes();
    }

    //#########################################################
    // Main trajectories for straight lanes
    //#########################################################

    // East-West main road (horizontal)
    traj0_x(u) { // East to West (right lane)
        return this.center_xPhys + u - 0.5 * this.road0Len;
    }
    traj0_y(u) { 
        return this.center_yPhys - this.offsetMain;
    }

    traj1_x(u) { // West to East (left lane)
        return this.center_xPhys - (u - 0.5 * this.road0Len);
    }
    traj1_y(u) { 
        return this.center_yPhys + this.offsetMain;
    }

    // North-South secondary road (vertical)
    traj2_x(u) { // North to South (right lane)
        return this.center_xPhys + this.offsetSec;
    }
    traj2_y(u) { 
        return this.center_yPhys - this.offset20Target - this.radiusRight - this.road2Len + u;
    }

    traj3_x(u) { // North to South (left lane)
        return this.center_xPhys + this.offsetSec;
    }
    traj3_y(u) { 
        return this.center_yPhys - this.offset20Target - this.radiusRight + u;
    }

    traj4_x(u) { // South to North (right lane)
        return this.center_xPhys - this.offsetSec;
    }
    traj4_y(u) { 
        return this.center_yPhys + this.offset20Target + this.radiusRight + this.road4Len - u;
    }

    traj5_x(u) { // South to North (left lane)
        return this.center_xPhys - this.offsetSec;
    }
    traj5_y(u) { 
        return this.center_yPhys + this.offset20Target + this.radiusRight - u;
    }

    //#################################################################
    // Special trajectories for right turns
    // Routes: 20, 41, 13, 05
    //#################################################################

    trajRight_x(u, dr) { 
        const urel = u - this.u20Target;
        const x0 = this.center_xPhys + this.offset20Source + this.radiusRight;
        const y0 = this.center_yPhys - this.offset20Target - this.radiusRight;

        const x = (urel < 0)
            ? x0 - (this.radiusRight + dr)
            : x0 - (this.radiusRight + dr) * Math.cos(urel / this.radiusRight);

        return x;
    }

    trajRight_y(u, dr) { 
        const urel = u - this.u20Target;
        const y0 = this.center_yPhys - this.offset20Target - this.radiusRight;
        const y = (urel < 0)
            ? y0 + urel
            : y0 + (this.radiusRight + dr) * Math.sin(urel / this.radiusRight);
        return y;
    }

    // Specific right turn trajectories
    traj0_20x(u) { return this.trajRight_x(u, this.offset20Target - this.offsetMain); }
    traj0_20y(u) { return this.trajRight_y(u, this.offset20Target - this.offsetMain); }

    traj1_41x(u) { return 2 * this.center_xPhys - this.traj0_20x(u); }
    traj1_41y(u) { return 2 * this.center_yPhys - this.traj0_20y(u); }

    traj3_13x(u) {
        return this.trajRight_x(this.lenRight - u + this.u20Target + this.u13Target, 
                               this.offset20Source - this.offsetSec);
    }
    traj3_13y(u) {
        return 2 * this.center_yPhys - 
               this.trajRight_y(this.lenRight - u + this.u20Target + this.u13Target, 
                               this.offset20Source - this.offsetSec);
    }

    traj5_05x(u) { return 2 * this.center_xPhys - this.traj3_13x(u); }
    traj5_05y(u) { return 2 * this.center_yPhys - this.traj3_13y(u); }

    //#################################################################
    // Special trajectories for left turns
    // Routes: 40, 21, 03, 15
    //#################################################################

    trajLeftSecMain_x(u, dr) {
        const straightSec = this.lenLeftSecMain - this.lenLeft;
        const x0 = this.center_xPhys + this.offset21Source - this.radiusLeft;
        const y0 = this.center_yPhys + this.offset21Target - this.radiusLeft;
        const urel = u - this.u21Target;

        const x = (urel < straightSec)
            ? x0 + (this.radiusLeft + dr)
            : x0 + (this.radiusLeft + dr) * Math.cos((urel - straightSec) / this.radiusLeft);
        return x;
    }

    trajLeftSecMain_y(u, dr) {
        const straightSec = this.lenLeftSecMain - this.lenLeft;
        const y0 = this.center_yPhys + this.offset21Target - this.radiusLeft;
        const urel = u - this.u21Target;
        const y = (urel < straightSec)
            ? y0 + urel - straightSec
            : y0 + (this.radiusLeft + dr) * Math.sin((urel - straightSec) / this.radiusLeft);
        return y;
    }

    trajLeftMainSec_x(u, dr) {
        const x0 = this.center_xPhys + this.offset21Source - this.radiusLeft;
        const urel = u - this.u03Target;
        const x = (urel < 0) 
            ? x0 + urel
            : x0 + (this.radiusLeft + dr) * Math.sin(urel / this.radiusLeft);
        return x;
    }

    trajLeftMainSec_y(u, dr) {
        const y0 = this.center_yPhys - this.offset21Target + this.radiusLeft;
        const urel = u - this.u03Target;
        const y = (urel < 0) 
            ? y0 - (this.radiusLeft + dr)
            : y0 - (this.radiusLeft + dr) * Math.cos(urel / this.radiusLeft);
        return y;
    }

    // Specific left turn trajectories
    traj1_21x(u) { return this.trajLeftSecMain_x(u, this.offsetMain - this.offset21Target); }
    traj1_21y(u) { return this.trajLeftSecMain_y(u, this.offsetMain - this.offset21Target); }

    traj0_40x(u) { return 2 * this.center_xPhys - this.traj1_21x(u); }
    traj0_40y(u) { return 2 * this.center_yPhys - this.traj1_21y(u); }

    traj3_03x(u) { return this.trajLeftMainSec_x(u, this.offsetSec - this.offset21Source); }
    traj3_03y(u) { return this.trajLeftMainSec_y(u, this.offsetSec - this.offset21Source); }

    traj5_15x(u) { return 2 * this.center_xPhys - this.traj3_03x(u); }
    traj5_15y(u) { return 2 * this.center_yPhys - this.traj3_03y(u); }

    initializeTrajectories() {
        // Main trajectory array
        this.traj = [
            [(u) => this.traj0_x(u), (u) => this.traj0_y(u)], // Road 0
            [(u) => this.traj1_x(u), (u) => this.traj1_y(u)], // Road 1
            [(u) => this.traj2_x(u), (u) => this.traj2_y(u)], // Road 2
            [(u) => this.traj3_x(u), (u) => this.traj3_y(u)], // Road 3
            [(u) => this.traj4_x(u), (u) => this.traj4_y(u)], // Road 4
            [(u) => this.traj5_x(u), (u) => this.traj5_y(u)]  // Road 5
        ];

        // Special turning trajectories
        this.specialTraj = {
            // Right turns
            '0_20': [(u) => this.traj0_20x(u), (u) => this.traj0_20y(u)],
            '1_41': [(u) => this.traj1_41x(u), (u) => this.traj1_41y(u)],
            '3_13': [(u) => this.traj3_13x(u), (u) => this.traj3_13y(u)],
            '5_05': [(u) => this.traj5_05x(u), (u) => this.traj5_05y(u)],
            
            // Left turns
            '1_21': [(u) => this.traj1_21x(u), (u) => this.traj1_21y(u)],
            '0_40': [(u) => this.traj0_40x(u), (u) => this.traj0_40y(u)],
            '3_03': [(u) => this.traj3_03x(u), (u) => this.traj3_03y(u)],
            '5_15': [(u) => this.traj5_15x(u), (u) => this.traj5_15y(u)]
        };
    }

    //##################################################################
    // Road network specification: routes and connections
    //##################################################################

    initializeRoutes() {
        const roadIDs = [0, 1, 2, 3, 4, 5];

        this.routes = {
            // Straight routes
            '00': [roadIDs[0]],                // mainE-straight
            '11': [roadIDs[1]],                // mainW-straight
            '22': [roadIDs[2]],                // secN-straight
            '33': [roadIDs[3]],                // secN-straight
            '44': [roadIDs[4]],                // secS-straight
            '55': [roadIDs[5]],                // secS-straight
            
            // Right turn routes
            '05': [roadIDs[0], roadIDs[5]],    // mainE-right
            '13': [roadIDs[1], roadIDs[3]],    // mainW-right
            '20': [roadIDs[2], roadIDs[0]],    // secN-right
            '41': [roadIDs[4], roadIDs[1]],    // secS-right
            
            // Left turn routes
            '03': [roadIDs[0], roadIDs[3]],    // mainE-left
            '15': [roadIDs[1], roadIDs[5]],    // mainW-left
            '21': [roadIDs[2], roadIDs[1]],    // secN-left
            '40': [roadIDs[4], roadIDs[0]],    // secS-left
            
            // Through routes
            '23': [roadIDs[2], roadIDs[3]],    // secN-through
            '45': [roadIDs[4], roadIDs[5]]     // secS-through
        };
    }

    // Get trajectory for a specific route
    getTrajectory(routeId) {
        if (this.specialTraj[routeId]) {
            return this.specialTraj[routeId];
        }
        
        // For simple routes, use main trajectories
        const route = this.routes[routeId];
        if (route && route.length === 1) {
            return this.traj[route[0]];
        }
        
        return null;
    }

    // Get position along trajectory
    getPositionOnTrajectory(routeId, u) {
        const trajectory = this.getTrajectory(routeId);
        if (trajectory) {
            return {
                x: trajectory[0](u),
                y: trajectory[1](u)
            };
        }
        return { x: 0, y: 0 };
    }

    // Get all available routes from a direction
    getRoutesFromDirection(direction) {
        const routeMap = {
            [CONFIG.DIRECTIONS.NORTH]: ['20', '21', '23'],  // North can go right, left, straight
            [CONFIG.DIRECTIONS.EAST]: ['00', '05', '03'],   // East can go straight, right, left
            [CONFIG.DIRECTIONS.SOUTH]: ['40', '41', '45'],  // South can go left, right, straight
            [CONFIG.DIRECTIONS.WEST]: ['11', '13', '15']    // West can go straight, right, left
        };
        
        return routeMap[direction] || [];
    }

    // Render trajectory paths for debugging
    renderTrajectories(ctx) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);

        // Render main trajectories
        this.traj.forEach((trajectory, index) => {
            ctx.beginPath();
            for (let u = 0; u <= 200; u += 5) {
                const x = trajectory[0](u);
                const y = trajectory[1](u);
                if (u === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });

        // Render special turning trajectories
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.5)';
        Object.values(this.specialTraj).forEach(trajectory => {
            ctx.beginPath();
            for (let u = 0; u <= 150; u += 5) {
                const x = trajectory[0](u);
                const y = trajectory[1](u);
                if (u === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });

        ctx.setLineDash([]);
    }
}