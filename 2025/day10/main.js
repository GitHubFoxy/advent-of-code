const fs = require('fs');

function parseInput(input) {
    const machines = [];
    const lines = input.trim().split('\n');

    for (const line of lines) {
        // Parse indicator lights pattern
        const lightsMatch = line.match(/\[([.#]+)\]/);
        const targetState = lightsMatch[1].split('').map(c => c === '#' ? 1 : 0);

        // Parse button configurations
        const buttons = [];
        const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
        for (const match of buttonMatches) {
            const toggles = match[1].split(',').map(Number);
            buttons.push(toggles);
        }

        machines.push({ targetState, buttons });
    }

    return machines;
}

// Solve system of linear equations over GF(2) using Gaussian elimination
function solveGF2(buttons, target) {
    const numLights = target.length;
    const numButtons = buttons.length;

    // Create augmented matrix [A | b]
    // Each column (except last) represents a button
    // Each row represents a light
    const matrix = [];
    for (let i = 0; i < numLights; i++) {
        const row = new Array(numButtons + 1).fill(0);
        row[numButtons] = target[i]; // target value for this light
        for (let j = 0; j < numButtons; j++) {
            if (buttons[j].includes(i)) {
                row[j] = 1;
            }
        }
        matrix.push(row);
    }

    // Gaussian elimination
    let pivotRow = 0;
    const pivotCols = [];
    const freeVars = [];

    for (let col = 0; col < numButtons && pivotRow < numLights; col++) {
        // Find pivot
        let foundPivot = false;
        for (let row = pivotRow; row < numLights; row++) {
            if (matrix[row][col] === 1) {
                // Swap rows
                [matrix[pivotRow], matrix[row]] = [matrix[row], matrix[pivotRow]];
                foundPivot = true;
                break;
            }
        }

        if (!foundPivot) {
            freeVars.push(col);
            continue;
        }

        pivotCols.push(col);

        // Eliminate
        for (let row = 0; row < numLights; row++) {
            if (row !== pivotRow && matrix[row][col] === 1) {
                for (let c = 0; c <= numButtons; c++) {
                    matrix[row][c] ^= matrix[pivotRow][c];
                }
            }
        }

        pivotRow++;
    }

    // Add remaining columns as free variables
    for (let col = 0; col < numButtons; col++) {
        if (!pivotCols.includes(col) && !freeVars.includes(col)) {
            freeVars.push(col);
        }
    }

    // Check for inconsistency
    for (let row = pivotRow; row < numLights; row++) {
        if (matrix[row][numButtons] === 1) {
            return null; // No solution
        }
    }

    // Try all combinations of free variables to find minimum
    let minPresses = Infinity;
    const numFreeVars = freeVars.length;
    const numCombinations = 1 << numFreeVars; // 2^numFreeVars

    for (let combo = 0; combo < numCombinations; combo++) {
        const solution = new Array(numButtons).fill(0);

        // Set free variables according to this combination
        for (let i = 0; i < numFreeVars; i++) {
            solution[freeVars[i]] = (combo >> i) & 1;
        }

        // Solve for pivot variables
        for (let i = 0; i < pivotCols.length; i++) {
            const col = pivotCols[i];
            let val = matrix[i][numButtons];

            // Subtract contributions from free variables
            for (let j = 0; j < numButtons; j++) {
                if (j !== col && solution[j] === 1) {
                    val ^= matrix[i][j];
                }
            }

            solution[col] = val;
        }

        // Count presses
        const presses = solution.reduce((sum, val) => sum + val, 0);
        minPresses = Math.min(minPresses, presses);
    }

    return minPresses;
}

// Solve integer linear system to minimize button presses for joltage
function solveJoltage(buttons, target) {
    const numCounters = target.length;
    const numButtons = buttons.length;

    // Create coefficient matrix
    const matrix = [];
    for (let i = 0; i < numCounters; i++) {
        const row = new Array(numButtons + 1).fill(0);
        row[numButtons] = target[i]; // target value for this counter
        for (let j = 0; j < numButtons; j++) {
            if (buttons[j].includes(i)) {
                row[j] = 1;
            }
        }
        matrix.push(row);
    }

    // Gaussian elimination to reduced row echelon form
    let pivotRow = 0;
    const pivotCols = [];

    for (let col = 0; col < numButtons && pivotRow < numCounters; col++) {
        // Find pivot
        let foundPivot = false;
        for (let row = pivotRow; row < numCounters; row++) {
            if (matrix[row][col] !== 0) {
                // Swap rows
                [matrix[pivotRow], matrix[row]] = [matrix[row], matrix[pivotRow]];
                foundPivot = true;
                break;
            }
        }

        if (!foundPivot) {
            continue;
        }

        pivotCols.push(col);
        const pivot = matrix[pivotRow][col];

        // Normalize pivot row
        for (let c = 0; c <= numButtons; c++) {
            matrix[pivotRow][c] /= pivot;
        }

        // Eliminate column in all other rows
        for (let row = 0; row < numCounters; row++) {
            if (row !== pivotRow && matrix[row][col] !== 0) {
                const factor = matrix[row][col];
                for (let c = 0; c <= numButtons; c++) {
                    matrix[row][c] -= factor * matrix[pivotRow][c];
                }
            }
        }

        pivotRow++;
    }

    // Check for inconsistency
    for (let row = pivotRow; row < numCounters; row++) {
        if (Math.abs(matrix[row][numButtons]) > 1e-9) {
            return null; // No solution
        }
    }

    // Identify free variables
    const freeVars = [];
    for (let col = 0; col < numButtons; col++) {
        if (!pivotCols.includes(col)) {
            freeVars.push(col);
        }
    }

    // Try different values for free variables to find minimum integer solution
    const maxSearch = Math.max(100, ...target);
    let minPresses = Infinity;

    function search(freeVarValues) {
        const solution = new Array(numButtons).fill(0);

        // Set free variables
        for (let i = 0; i < freeVars.length; i++) {
            solution[freeVars[i]] = freeVarValues[i];
        }

        // Solve for pivot variables using RREF
        for (let i = 0; i < pivotCols.length; i++) {
            const col = pivotCols[i];
            let val = matrix[i][numButtons];

            // Subtract contributions from all other variables
            for (let j = 0; j < numButtons; j++) {
                if (j !== col) {
                    val -= matrix[i][j] * solution[j];
                }
            }

            solution[col] = val;
        }

        // Check if all values are non-negative integers
        let valid = true;
        for (let i = 0; i < numButtons; i++) {
            if (solution[i] < -1e-9 || Math.abs(solution[i] - Math.round(solution[i])) > 1e-9) {
                valid = false;
                break;
            }
        }

        if (valid) {
            const presses = solution.reduce((sum, val) => sum + Math.round(val), 0);
            if (presses < minPresses) {
                minPresses = presses;
            }
        }
    }

    // Generate all combinations of free variable values
    function generateCombinations(index, current, currentSum) {
        if (index === freeVars.length) {
            // Prune if current sum of free vars already exceeds best solution
            if (currentSum < minPresses) {
                search(current);
            }
            return;
        }

        for (let val = 0; val <= maxSearch; val++) {
            // Early pruning
            if (currentSum + val >= minPresses) break;
            generateCombinations(index + 1, [...current, val], currentSum + val);
        }
    }

    if (freeVars.length === 0) {
        search([]);
    } else {
        generateCombinations(0, [], 0);
    }

    return minPresses === Infinity ? null : minPresses;
}

function solve(input) {
    const machines = parseInput(input);
    let totalPresses = 0;

    for (const machine of machines) {
        const presses = solveGF2(machine.buttons, machine.targetState);
        if (presses === null) {
            console.log('No solution found for machine');
            return null;
        }
        totalPresses += presses;
    }

    return totalPresses;
}

function solvePart2(input) {
    const lines = input.trim().split('\n');
    let totalPresses = 0;

    for (const line of lines) {
        // Parse joltage requirements
        const joltageMatch = line.match(/\{([0-9,]+)\}/);
        const target = joltageMatch[1].split(',').map(Number);

        // Parse button configurations
        const buttons = [];
        const buttonMatches = line.matchAll(/\(([0-9,]+)\)/g);
        for (const match of buttonMatches) {
            const toggles = match[1].split(',').map(Number);
            buttons.push(toggles);
        }

        const presses = solveJoltage(buttons, target);
        if (presses === null) {
            console.log('No solution found for machine');
            return null;
        }
        totalPresses += presses;
    }

    return totalPresses;
}

// Test with example
const exampleInput = `[.##.] (3) (1,3) (2) (2,3) (0,2) (0,1) {3,5,4,7}
[...#.] (0,2,3,4) (2,3) (0,4) (0,1,2) (1,2,3,4) {7,5,12,7,2}
[.###.#] (0,1,2,3,4) (0,3,4) (0,1,2,4,5) (1,2) {10,11,11,5,10,5}`;

console.log('Part 1 Example (should be 7):', solve(exampleInput));
console.log('Part 2 Example (should be 33):', solvePart2(exampleInput));

// Read and solve actual input if file exists
try {
    const input = fs.readFileSync('input.txt', 'utf8');
    console.log('\nPart 1 result:', solve(input));
    console.log('Part 2 result:', solvePart2(input));
} catch (err) {
    console.log('No input.txt file found');
}
