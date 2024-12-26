// vowels = ["a", "e", "i", "o", "u"]
// nice string = DOES not contain ab, cd, pq, xy, 3 vowels, twice in a row, 

const path = "./input.txt";
const file = Bun.file(path);
const text = await file.text()
const splitted = text.split("\n");


const forbiddenSubstrings = ["ab", "cd", "pq", "xy"];
const goodSubstrings = ["a", "e", "i", "o", "u"]
let vowels = 0

let good_strings = 0; // Initialize the counter outside the loop

for (let i = 0; i < splitted.length; i++) {
    let vowels = 0; // Reset vowel count for each string
    let hasRepetition = false;
    let hasForbidden = false;

    // Condition 1: Check for at least 3 vowels
    for (let j = 0; j < splitted[i].length; j++) {
        if (goodSubstrings.includes(splitted[i][j])) {
            vowels++;
        }
    }
    if (vowels < 3) {
        continue; // Move to the next string if vowel count is less than 3
    }

    // Condition 2: Check for repetitions
    for (let j = 0; j < splitted[i].length - 1; j++) {
        if (splitted[i][j] === splitted[i][j + 1]) {
            hasRepetition = true;
            break; // No need to check further for repetitions in this string
        }
    }
    if (!hasRepetition) {
        continue; // Move to the next string if no repetition found
    }
    // Condition 3: Check for forbidden substrings
    for (let j = 0; j < forbiddenSubstrings.length; j++) {
        if (splitted[i].includes(forbiddenSubstrings[j])) {
            hasForbidden = true;
            break; // No need to check further for forbidden substrings in this string
        }
    }
    if (hasForbidden) {
        continue; // Move to the next string if a forbidden substring is found
    }

    // If all conditions are met, increment the counter
    good_strings++;
}
console.log(good_strings);


// for (let i = 0; i < splitted.length; i++) {
//     for (let j = 0; j < splitted[i].length; j++) {
//         if (goodSubstrings.includes(splitted[i][j])) {
//             vowels++
//         }
//     }
//     if (vowels < 3) {
//         continue
//     }
//     for (let j = 0; j < splitted[i].length - 1; j++) {
//         if (splitted[i][j] == splitted[i][j+1]) {
//             break
//         }
//     }
//     for (let j = 0; j < forbiddenSubstrings.length; j++) {
//         if (splitted[i].includes(forbiddenSubstrings[j])) {
//             continue
//         }
//     }
//     vowels = 0
//     good_strings++
// }
// console.log(good_strings)