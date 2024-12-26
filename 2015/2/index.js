const path = "./input.txt";
const file = Bun.file(path);
const text = await file.text();

const lines = text.split("\n");

const linesL = lines.length;
let sum = 0;
let l = 0;
let h = 0;
let w = 0;
let first_side = 2 * l * w;
let second_side = 2 * w * h;
let third_side = 2 * h * l;
let smallest = 0
let ribbon = 0
let bow = 0
let wrap=0

let all_sides = first_side + second_side + third_side;
for (let i = 0; i < linesL; i++) {
  l = lines[i].split("x")[0];
  h = lines[i].split("x")[1];
  w = lines[i].split("x")[2];
  
  first_side = 2 *l * w;
  second_side = 2 * w * h;
  third_side = 2 * h * l;
  smallest = Math.min(l*w, w*h, h*l);
  all_sides = first_side + second_side + third_side;
  sum = sum + all_sides + smallest;
  bow = h*w*l
  wrap = lines[i].split("x").map(Number).sort((a,b) => a-b)[0]*2 + lines[i].split("x").map(Number).sort((a,b) => a-b)[1]*2
  ribbon = ribbon + bow + wrap
}
console.log("Sum:" + sum)
console.log("Wrap:" + ribbon)



