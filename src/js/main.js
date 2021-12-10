import  { Amaze } from "./amaze.js"

const canvas = document.body.querySelector("canvas");
const ctx = canvas.getContext("2d");
const selectAlgo = document.body.querySelector("select");
const scaleInput = document.body.querySelector("input#scale");
const optionInput = document.body.querySelector("input#option");




function mazeUpdate() {

    let scale = parseInt(scaleInput.value);
    let option = parseInt(optionInput.value);
    let width = parseInt(canvas.width / scale);
    let height = parseInt(canvas.height / scale);
    let algorithm = document.body.querySelector("select").value;
    
    
    let start = new Date();
   
    let maze = new Amaze(width, height, algorithm, option);

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

optionInput.addEventListener("input", () => {
    optionInput.nextElementSibling.value = "x" + optionInput.value;
    mazeUpdate();
});

selectAlgo.addEventListener("input", () => {
    mazeUpdate();
});

mazeUpdate();