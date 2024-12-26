const path = "./text.txt";
const file = Bun.file(path);
const text = await file.text()

const splitted = text.split("\n");


for (let i = 0; i< splitted.length; i++) {
    if (splitted[i].contains > 10) {
}