// read file
const path = "./text.txt";
const file = Bun.file(path);
const text = await file.text()
const splitted = text.split("\n"); // array of strings

// Condition 1: Check for at least 3 vowels
let vowels = 0
const vowelsArray = ["a", "e", "i", "o", "u"]

// Condition 2: Check for repetitions
let hasRepetition = false;

// Condition 3: Check for forbidden substrings
const forbiddenSubstrings = ["ab", "cd", "pq", "xy"];
let hasForbidden = false;

const splittedL = splitted.length

for (let i = 0; i < splittedL; i++) {
    // reset
    vowels = 0
    hasRepetition = false
    hasForbidden = false 

    // cond 1:
    for(let j = 0; j < splitted[i].length; j++) {
        if (vowelsArray.includes(splitted[i][j])) {
            vowels++
        }
    }
    if (vowels < 3) {
        continue
    }

    // cond 2:
    for (let j = 0; j < splitted[i].length - 1; j++) {
        if (splitted[i][j] === splitted[i][j + 1]) {
            hasRepetition = true
            break
        }
    }
    if (!hasRepetition) {
        continue
    }

    //cond 3:
    for (let j = 0; j < forbiddenSubstrings.length; j++) {
        if (splitted[i].includes(forbiddenSubstrings[j])) {
            hasForbidden = true
            break
        }
    }
    if (hasForbidden) {
        continue
    }
    
}