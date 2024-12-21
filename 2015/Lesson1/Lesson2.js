//How to read input from a file
//path
// Now, given the same instructions, find the position of the first character that causes him to enter the basement (floor -1). The first character in the instructions has position 1, the second character has position 2, and so on.

// For example:

// ) causes him to enter the basement at character position 1.
// ()()) causes him to enter the basement at character position 5.
// What is the position of the character that causes Santa to first enter the basement?

const path = "./input.txt";
const file = Bun.file(path);
const string = await file.text();

let floor = 0;

const textL = string.length;
for (let i = 0; i < textL; i++) {
  if (string[i] == "(") {
    floor += 1;
  } else if (string[i] == ")") {
    floor -= 1;
    if (floor == -1) {
      console.log(i + 1);
      break;
    }
  }
}
console.log(floor);

// Whats the best optimized way to stream file
// Whats the fastest way to iterate over a string in JavaScript?
