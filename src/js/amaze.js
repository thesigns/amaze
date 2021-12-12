/**
 * amaze.js
 * v0.2
 * Jakub Adamczyk
 * 
 */



/**
 * Returns random integer in a range
 */
function randomMinMax(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

/**
 * Object with maze algorithms
 */
let mazeAlgorithms = {



    recursiveBacktracking(maze) {

        // Fill the maze with walls and borders with special (uncarvable walls).
        //
        maze.setTile(Amaze.SPECIAL, 0, 0, maze.width, maze.height);
        maze.setTile(Amaze.WALL, 1, 1, maze.width - 2, maze.height - 2);

        // Pick a random starting point.
        //
        const startX = randomMinMax(1, maze.width - 2);
        const startY = randomMinMax(1, maze.height - 2);

        let x = startX;
        let y = startY;

        // Direction values.
        //
        const NORTH = {x: 0, y: -1};
        const SOUTH = {x: 0, y: 1};
        const WEST = {x: -1, y: 0};
        const EAST = {x: 1, y: 0};

        // There is no direction of movement at start.
        //
        let forward = null;
        const forwardChance = maze.option / 100;

        // Used to keep track of the path and diggable walls
        //
        let stack = [];

        function isDiggable(x, y, fromX, fromY) {
            let countFloors = 0;

            if (maze.grid[x][y - 1] === Amaze.FLOOR) {countFloors += 1; }
            if (maze.grid[x][y + 1] === Amaze.FLOOR) { countFloors += 1; }
            if (maze.grid[x - 1][y] === Amaze.FLOOR) { countFloors += 1; }
            if (maze.grid[x + 1][y] === Amaze.FLOOR) { countFloors += 1; }

            if (maze.grid[x - 1][y - 1] === Amaze.FLOOR) { 
                if (Math.abs(fromX - (x - 1)) > 1 || Math.abs(fromY - (y - 1)) > 1) {
                    countFloors += 1;    
                }
            }
            if (maze.grid[x - 1][y + 1] === Amaze.FLOOR) { 
                if (Math.abs(fromX - (x - 1)) > 1 || Math.abs(fromY - (y + 1)) > 1) {
                    countFloors += 1;    
                }
            }
            if (maze.grid[x + 1][y - 1] === Amaze.FLOOR) { 
                if (Math.abs(fromX - (x + 1)) > 1 || Math.abs(fromY - (y - 1)) > 1) {
                    countFloors += 1;    
                }
            }
            if (maze.grid[x + 1][y + 1] === Amaze.FLOOR) { 
                if (Math.abs(fromX - (x + 1)) > 1 || Math.abs(fromY - (y + 1)) > 1) {
                    countFloors += 1;    
                }
            }
            if (countFloors <= 1) {
                return true;
            }
            return false;
        }


        while(true) {

            maze.setTile(Amaze.FLOOR, x, y, 1, 1);

            // push current location at stack
            //
            stack.push({x: x, y: y});
            
            let diggable = [];

            // Collect all diggable walls
            //
            if (maze.grid[x][y - 1] === Amaze.WALL) {
                if (isDiggable(x, y - 1, x, y)) {
                    diggable.push(NORTH);
                }
            }
            if (maze.grid[x][y + 1] === Amaze.WALL) {
                if (isDiggable(x, y + 1, x, y)) {
                    diggable.push(SOUTH);
                }
            }
            if (maze.grid[x - 1][y] === Amaze.WALL) {
                if (isDiggable(x - 1, y, x, y)) {
                    diggable.push(WEST);
                }
            }
            if (maze.grid[x + 1][y] === Amaze.WALL) {
                if (isDiggable(x + 1, y, x, y)) {
                    diggable.push(EAST);
                }
            }

            if (diggable.length > 0) {
                if (forward !== null && diggable.includes(forward) && forwardChance > Math.random()) {
                    x = x + forward.x;
                    y = y + forward.y;
                    forward = forward;
                } else {
                    let rand = randomMinMax(0, diggable.length - 1);
                    x = x + diggable[rand].x;
                    y = y + diggable[rand].y;
                    forward = diggable[rand];
                }
            } else {
                
                // go back
                let back = stack.pop();
                back = stack.pop();
                if (stack.length == 0) {
                    maze.setTile(Amaze.WALL, 0, 0, maze.width, 1);
                    maze.setTile(Amaze.WALL, 0, maze.height - 1, maze.width, 1);
                    maze.setTile(Amaze.WALL, 0, 1, 1, maze.height - 2);
                    maze.setTile(Amaze.WALL, maze.width - 1, 1, 1, maze.height - 2);



                    // open holes
                    for (let x = 1; x < maze.width - 1; x += 1) {
                        for (let y = 1; y < maze.height - 1; y += 1) {
                            if(maze.grid[x][y] === Amaze.WALL) {
                                if (maze.grid[x][y - 1] === Amaze.FLOOR && maze.grid[x][y + 1] === Amaze.FLOOR && maze.grid[x - 1][y] !== Amaze.FLOOR && maze.grid[x + 1][y] !== Amaze.FLOOR) {
                                    if (Math.random() < maze.junctions)  {
                                        maze.grid[x][y] = Amaze.FLOOR;
                                    }
                                }
                                if (maze.grid[x][y - 1] !== Amaze.FLOOR && maze.grid[x][y + 1] !== Amaze.FLOOR && maze.grid[x - 1][y] === Amaze.FLOOR && maze.grid[x + 1][y] === Amaze.FLOOR) {
                                    if (Math.random() < maze.junctions)  {
                                        maze.grid[x][y] = Amaze.FLOOR;
                                    }
                                }

                            }
                        }
                    }










                    return;
                }
                x = back.x;
                y = back.y;
                
            }


        }

    }


}






export class Amaze {

    constructor(width, height, algorithm, option, junctions) {

        // These properties can't be changed
        //
        Object.defineProperty(this, 'width', { value: width });
        Object.defineProperty(this, 'height', { value: height });
        Object.defineProperty(this, 'algorithm', { value: algorithm });

        this.option = option;

        this.junctions = junctions / 100;

        // Create maze grid filled with floor
        //
        this.grid = new Array(this.width).fill(Amaze.FLOOR).map(value => new Array(height).fill(Amaze.FLOOR));

        // If algorithm exists - call it, otherwise throw error
        //
        if (mazeAlgorithms.hasOwnProperty(algorithm)) {
            mazeAlgorithms[algorithm](this);
        } else {
            throw new Error("Unknown maze algorithm: " + algorithm);
        }

    }

    /**
     * Set tiles of the grid.
     * 
     */
    setTile(value, setX, setY, setWidth = 1, setHeight = 1) {
        for (let x = setX; x < setX + setWidth; x += 1) {    
            for (let y = setY; y < setY + setHeight; y += 1) {
                this.grid[x][y] = value;
            }
        }
    }

    /**
     * Draw the maze in the console.
     */
    log() {
        for (let y = 0; y < this.height; y += 1) {
            let row = "";
            for (let x = 0; x < this.width; x += 1) { 

                let scale = 20;

                if (this.grid[x][y] === Amaze.FLOOR) {
                    row += ".....";
                } else if (this.grid[x][y] > Amaze.FLOOR) {
                    row += "[" + this.grid[x][y].toLocaleString('en-US', {minimumIntegerDigits: 3, useGrouping: false}) + "]";
                } else {
                    row += "#####";
                }
            }
            console.log(row + "  " + y);
        }
        console.log("");
    }

}

Amaze.SPECIAL = -1;
Amaze.FLOOR = 0;
Amaze.WALL = 1;
