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


    // FIXME: everything wrong (was supposed to be Eller's Algorithm)
    //
    bugsFailed(maze) {

        const CELL_UNINITIALIZED = 0;
        const CELL_WALL = 1;

        // Cells with value CELL_UNINITIALIZED are uninitialized.
        // Cells with negative value are corridor sets.
        // Cells with value CELL_WALL are walls.

        let cellNum = 1;
        for (let y = 0; y < maze.height; y++) {

            // Initialize each cell in that row.
            //
            for(let x = 0; x < maze.width; x++) {
                if (maze.grid[x][y] === CELL_UNINITIALIZED) {
                    maze.grid[x][y] = cellNum++;
                }
            }

            // randomly join adjacent cells that belong to different sets.
            //
            let posJoin = 0;
            while (posJoin < maze.width) {
                let cellJoinNum = maze.grid[posJoin][y];
                let joinWidth = randomMinMax(1, (maze.width - posJoin) > 6 ? 6 : (maze.width - posJoin));
                let joinEnd = posJoin + joinWidth;
                for (let i = posJoin; i < joinEnd; i += 1) {
                    posJoin++;
                    maze.grid[i][y] = cellJoinNum;

                }
                if (posJoin < maze.width) {

                    maze.grid[posJoin][y] = -1;
                }
                posJoin++;
            }

            // randomly determine the vertical connections
            //
            for(let x = 0; x < maze.width; x++) {
                if(Math.random() < maze.option / 100) {
                    maze.grid[x][y + 1] = maze.grid[x][y];
                }
            }
        }

        // Fix values
        //
        for (let y = 0; y < maze.height; y += 1) {
            for (let x = 0; x < maze.width; x += 1) { 
                if (maze.grid[x][y] < 0) {
                    maze.grid[x][y] = Amaze.WALL;
                } else {
                    maze.grid[x][y] = Amaze.FLOOR;
                }
            }
        }
        
    },










    recursiveDivision(maze) {


        // Set outer walls
        //
        maze.setTile(Amaze.WALL, 0, 0, maze.width, 1);
        maze.setTile(Amaze.WALL, 0, maze.height - 1, maze.width, 1);
        maze.setTile(Amaze.WALL, 0, 1, 1, maze.height - 2);
        maze.setTile(Amaze.WALL, maze.width - 1, 1, 1, maze.height - 2);

        let divide = function(x, y, width, height) {

            let x2 = x + width - 1;
            let y2 = y + height - 1;

            if (width <= maze.option || height <= maze.option) {
                return;
            }
            
            // Divide vertically
            //
            if ((width > height) || (width === height && Math.random() < 0.5)) {
                let divPos = randomMinMax(x + 1, x2 - 1);
                maze.setTile(Amaze.WALL, divPos, y,  1, height);
                let openingPos = randomMinMax(y, y2);
                maze.setTile(Amaze.OPENING, divPos, openingPos,  1, 1);
                divide(x, y, divPos - x, y2 - y + 1);
                divide(divPos + 1, y, x2 - divPos, y2 - y + 1);

            // Divide horizontally
            //
            } else {
                let divPos = randomMinMax(y + 1, y2 - 1);
                maze.setTile(Amaze.WALL, x, divPos,  width, 1);
                let openingPos = randomMinMax(x, x2);
                maze.setTile(Amaze.OPENING, openingPos, divPos, 1, 1);
                divide(x, y, x2 - x + 1, divPos - y);
                divide(x, divPos + 1, x2 - x + 1, y2 - divPos);
            }
       
        }

        divide(1, 1, maze.width - 2, maze.height - 2);

        // Fix diagonal openings
        //
        for (let y = 0; y < maze.height; y += 1) {
            for (let x = 0; x < maze.width; x += 1) { 
                if (maze.grid[x][y] === Amaze.FLOOR) {
                    if (maze.grid[x + 1][y] === Amaze.WALL && maze.grid[x][y + 1] === Amaze.WALL && maze.grid[x + 1][y + 1] != Amaze.WALL) {
                        maze.grid[x + 1][y] = Amaze.FLOOR;
                    }
                    if (maze.grid[x + 1][y] === Amaze.WALL && maze.grid[x][y - 1] === Amaze.WALL && maze.grid[x + 1][y - 1] != Amaze.WALL) {
                        maze.grid[x][y - 1] = Amaze.FLOOR;
                        }
                    if (maze.grid[x][y - 1] === Amaze.WALL && maze.grid[x - 1][y] === Amaze.WALL && maze.grid[x - 1][y - 1] != Amaze.WALL) {
                        maze.grid[x - 1][y] = Amaze.FLOOR;
                    }
                    if (maze.grid[x - 1][y] === Amaze.WALL && maze.grid[x][y + 1] === Amaze.WALL && maze.grid[x - 1][y + 1] != Amaze.WALL) {
                        maze.grid[x - 1][y + 1] = Amaze.FLOOR;
                    }
                }
            }
        }
    }
}






export class Amaze {

    constructor(width, height, algorithm, option) {

        // These properties can't be changed
        //
        Object.defineProperty(this, 'width', { value: width });
        Object.defineProperty(this, 'height', { value: height });
        Object.defineProperty(this, 'algorithm', { value: algorithm });

        this.option = option;

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

Amaze.FLOOR = 0;
Amaze.WALL = 1;
Amaze.OPENING = 2;
Amaze.DEBUG = 3;

