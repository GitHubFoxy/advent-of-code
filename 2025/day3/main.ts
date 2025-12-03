import { input as data } from "./input";

// function getMaxJoltage(bank: string): number {
//     let maxJoltage = 0;
  
//     for (let i = 0; i < bank.length - 1; i++) {
//       const tens = Number(bank[i]);
  
//       // Optimization: if the current 'tens' digit cannot possibly beat the record
//       // (even if paired with a 9), skip it.
//       if (tens * 10 + 9 <= maxJoltage) continue;
  
//       for (let j = i + 1; j < bank.length; j++) {
//         const ones = Number(bank[j]);
//         const current = tens * 10 + ones;
  
//         if (current > maxJoltage) {
//           maxJoltage = current;
//           // 99 is the highest possible value, return early if found
//           if (maxJoltage === 99) return 99;
//         }
//       }
//     }
  
//     return maxJoltage;
//   }
  


function getMaxJoltage(bank: string, batteryCount: number): number {
  const n = bank.length;

  // We need to select exactly `batteryCount` batteries
  // Strategy: Remove the smallest (n - batteryCount) digits while maintaining order
  const toRemove = n - batteryCount;

  // Edge case: if the string is shorter than or equal to the needed count
  if (toRemove <= 0) {
    return Number(bank);
  }

  const stack: string[] = [];
  let removeCount = 0;

  for (let i = 0; i < n; i++) {
    const current = bank[i];

    // Remove smaller digits from stack if we can still remove more
    // and current digit is larger
    while (
      stack.length > 0 &&
      stack[stack.length - 1] < current &&
      removeCount < toRemove
    ) {
      stack.pop();
      removeCount++;
    }

    stack.push(current);
  }

  // Remove remaining digits from the end if needed (e.g. if the number was "54321")
  while (removeCount < toRemove) {
    stack.pop();
    removeCount++;
  }

  return Number(stack.join(""));
}

let total = 0;

data.split("\n").forEach((battery) => {
  // Ideally, add a check to skip empty lines which often occur at EOF
  if (battery.trim()) {
    total += getMaxJoltage(battery, 12); // FIXED: Added the second argument
  }
});

console.log(total);
