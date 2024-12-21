const path = "./test.txt";
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
let smallest = Math.min(first_side, second_side, third_side);

let all_sides = first_side + second_side + third_side;
for (let i = 0; i < linesL; i++) {
  l = lines[i].split("x")[0];
  h = lines[i].split("x")[1];
  w = lines[i].split("x")[2];
  first_side = 2 * l * w;
  second_side = 2 * w * h;
  third_side = 2 * h * l;
  smallest = Math.min(first_side, second_side, third_side);
  all_sides = first_side + second_side + third_side;
  sum + all_sides + smallest;
}
console.log(sum);
// Прочитать первую строку
// 3x11x24
// l = 3; h=11; w=24
// 1side 2*l*w
// 2side 2*w*h
// 3side 2*h*l
// smallest side = min(1side, 2side, 3side)
// sum = sum + (2*l*w + 2*w*h + 2*h*l + smallest side)
//
