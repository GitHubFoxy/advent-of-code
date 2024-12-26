//How to read input from a file
//path
const path = "./input.txt";
const file = Bun.file(path);

const string = await file.text();

let floor = 0;

// for of Answer: 74
for (const char of string) {
  if (char == "(") {
    floor += 1;
  } else if (char == ")") {
    floor -= 1;
  }
}

console.log(floor);

// Whats the best optimized way to stream file
// Whats the fastest way to iterate over a string in JavaScript?
