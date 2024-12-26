const path = "./input.txt";
const file = Bun.file(path);
const text = await file.text()
const splitted = text.split("\n");
let count =0

function checkFirstCondition(str) {
    // Проходим по строке, формируя все возможные пары соседних букв
    for (let i = 0; i < str.length - 1; i++) {
      const pair = str[i] + str[i + 1]; // Формируем пару
  
      // Ищем первое вхождение этой пары
      const firstIndex = str.indexOf(pair);
  
      // Если пара найдена, ищем ее второе вхождение, начиная поиск после первого
      if (firstIndex !== -1) {
        const secondIndex = str.indexOf(pair, firstIndex + pair.length); // Начинаем поиск с позиции после первого вхождения пары
  
        // Если второе вхождение найдено, условие выполнено
        if (secondIndex !== -1) {
          return true; // Возвращаем true, так как условие выполнено
        }
      }
    }
    // Если ни одна повторяющаяся пара не найдена, возвращаем false
    return false;
  }

function checkSecondCondition(str) {
    for (let i = 0; i < str.length - 2; i++) {
        const firstChar = str[i];
        const thirdChar = str[i + 2];

        if (firstChar === thirdChar) {
            return true;
        }
        
    }
    return false
}

 
for (let i = 0; i < splitted.length; i++) {
    if(checkFirstCondition(splitted[i])) {
        if(checkSecondCondition(splitted[i])) {
            count++;
        }
    }
}
console.log(count);