const path = "./input.txt";
const file = Bun.file(path);

const text = await file.text()

// Какие координаты сейчас
let santa_x = 0
let santa_y = 0
let robo_x = 0
let robo_y = 0
let SantaSet = new Set();
let RoboSet = new Set();
SantaSet.add(`${santa_x},${santa_y}`);
RoboSet.add(`${robo_x},${robo_y}`);
let RoboTurn = false

let length = text.length;
for (let i = 0; i < length ; i++) {
    let char = text[i];
    if ( RoboTurn ) {
        if (char == ">") {
                robo_x+=1
        } else if (char == "<") {
                robo_x-=1
            } else if (char == "^") {
                robo_y+=1
        } else if (char == "v") {
                robo_y-=1
        }
        RoboSet.add(`${robo_x},${robo_y}`);
    } else {
        if (char == ">") {
                santa_x+=1
        } else if (char == "<") {
                santa_x-=1
            } else if (char == "^") {
                santa_y+=1
        } else if (char == "v") {
                santa_y-=1
        }
        SantaSet.add(`${santa_x},${santa_y}`);
    }
    RoboTurn = !RoboTurn

}
//couse we didnt initialize the set
const final = new Set([...SantaSet, ...RoboSet])
console.log(final.size)


