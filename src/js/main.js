import  { Amaze } from "./amaze.js"

const canvas = document.body.querySelector("canvas");
const ctx = canvas.getContext("2d");
const scaleInput = document.body.querySelector("input#scale");
const corridorInput = document.body.querySelector("input#corridor");



function mazeUpdate() {

    let scale = parseInt(scaleInput.value);
    let corridor = parseInt(corridorInput.value);
    let width = parseInt(canvas.width / scale);
    let height = parseInt(canvas.height / scale);
    
    let start = new Date();
    let maze = new Amaze(width, height, "recursiveDivision", {minCorridorWidth: corridor});

    // Draw the maze
    //
    ctx.fillStyle = "rgb(0, 0, 200)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgb(20, 20, 20)";
    for (let y = 0; y < maze.height; y += 1) {
        for (let x = 0; x < maze.width; x += 1) { 
            if (maze.grid[x][y] != Amaze.WALL) {
                ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }

    // Show time
    //
    let time = new Date() - start;
    document.body.querySelector("span").innerHTML = time + "ms";

}



scaleInput.addEventListener("input", () => {
    scaleInput.nextElementSibling.value = "x" + scaleInput.value;
    mazeUpdate();
});

corridorInput.addEventListener("input", () => {
    corridorInput.nextElementSibling.value = "x" + corridorInput.value;
    mazeUpdate();
});



mazeUpdate();