import  { Amaze } from "./amaze.js"

const canvas = document.body.querySelector("canvas");
const ctx = canvas.getContext("2d");
const selectAlgo = document.body.querySelector("select");
const scaleInput = document.body.querySelector("input#scale");
const optionInput = document.body.querySelector("input#option");
const junctionsInput = document.body.querySelector("input#junctions");



function mazeUpdate() {

    let scale = parseInt(scaleInput.value);
    let option = parseInt(optionInput.value);
    let junctions = parseInt(junctionsInput.value);
    let width = parseInt(canvas.width / scale);
    let height = parseInt(canvas.height / scale);
    let algorithm = document.body.querySelector("select").value;
    
    
    let start = new Date();
   
    let maze = new Amaze(width, height, algorithm, option, junctions);

    // Draw the maze
    //
    ctx.fillStyle = "rgb(0, 40, 240)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let y = 0; y < maze.height; y += 1) {
        for (let x = 0; x < maze.width; x += 1) { 
            if (maze.grid[x][y] === Amaze.FLOOR) {
                ctx.fillStyle = "rgb(20, 20, 20)";
                ctx.fillRect(x * scale, y * scale, scale, scale);
            } else if (maze.grid[x][y] === Amaze.SPECIAL) {
                ctx.fillStyle = "rgb(250, 0, 0)";
                ctx.fillRect(x * scale, y * scale, scale, scale);
            }
        }
    }

    // Show time
    //
    let time = new Date() - start;
    document.body.querySelector("span").innerHTML = time + "ms";

}




function updateUI() {
    scaleInput.nextElementSibling.value = scaleInput.value;
    optionInput.nextElementSibling.value = optionInput.value;
    junctionsInput.nextElementSibling.value = junctionsInput.value;
};

scaleInput.addEventListener("input", () => {
    updateUI();  
    mazeUpdate();
});


optionInput.addEventListener("input", () => {
    updateUI();
    mazeUpdate();
});

junctionsInput.addEventListener("input", () => {
    updateUI();
    mazeUpdate();
});

selectAlgo.addEventListener("input", () => {
    mazeUpdate();
});

updateUI();
mazeUpdate();