/**
 * Challenge 1 - Question 1
 * Pattern Printing in JavaScript
 * 
 * Target Pattern:
 * 1
 * 21
 * 321
 * 4321
 * ...
 * nnnnn(n times)
 * 
 * We will cover three interpretations:
 * - Interpretation A (Standard Descending): Row i contains digits from i down to 1. (Row n has n digits).
 * - Interpretation B (Repeated Last Row): Rows 1 to n-1 contain i down to 1, but the last row contains 'n' repeated n times.
 * - Interpretation C (Repeated Digit per Row): Row i contains digit 'i' repeated i times (e.g., 1, 22, 333, etc.).
 */

// =========================================================================
// INTERPRETATION A: Standard Descending (1, 21, 321, 4321, ..., n to 1)
// =========================================================================

console.log("--- Interpretation A: Standard Descending (i down to 1) ---");

// Way 1: Double Loop (Traditional Iterative)
function printPatternA_DoubleLoop(n) {
    if (n < 1) return;
    for (let i = 1; i <= n; i++) {
        let row = "";
        for (let j = i; j >= 1; j--) {
            row += j;
        }
        console.log(row);
    }
}
console.log("\nWay 1 (Double Loop) for n = 5:");
printPatternA_DoubleLoop(5);

// Way 2: Using Array.from and map (Functional)
function printPatternA_Functional(n) {
    if (n < 1) return;
    const lines = Array.from({ length: n }, (_, idx) => {
        const rowNum = idx + 1;
        return Array.from({ length: rowNum }, (_, rIdx) => rowNum - rIdx).join("");
    });
    console.log(lines.join("\n"));
}
console.log("\nWay 2 (Functional Array Methods) for n = 5:");
printPatternA_Functional(5);

// Way 3: Recursive Approach
function printPatternA_Recursive(n, current = 1) {
    if (current > n) return;
    
    function getRow(val) {
        if (val === 1) return "1";
        return val + getRow(val - 1);
    }
    
    console.log(getRow(current));
    printPatternA_Recursive(n, current + 1);
}
console.log("\nWay 3 (Recursion) for n = 5:");
printPatternA_Recursive(5);


// =========================================================================
// INTERPRETATION B: Repeated Last Row (Rows 1 to n-1: i to 1; Row n: 'n' repeated n times)
// =========================================================================

console.log("\n--- Interpretation B: Repeated Last Row ---");

// Way 1: Double Loop with Conditional
function printPatternB_Loop(n) {
    if (n < 1) return;
    for (let i = 1; i <= n; i++) {
        let row = "";
        if (i === n) {
            row = String(n).repeat(n);
        } else {
            for (let j = i; j >= 1; j--) {
                row += j;
            }
        }
        console.log(row);
    }
}
console.log("\nWay 1 for n = 5:");
printPatternB_Loop(5);

// Way 2: Single Loop Accumulation with String.prototype.repeat
function printPatternB_Repeat(n) {
    if (n < 1) return;
    let lines = [];
    for (let i = 1; i < n; i++) {
        let row = "";
        for (let j = i; j >= 1; j--) {
            row += j;
        }
        lines.push(row);
    }
    // Append the last line: n repeated n times
    lines.push(String(n).repeat(n));
    console.log(lines.join("\n"));
}
console.log("\nWay 2 for n = 5:");
printPatternB_Repeat(5);


// =========================================================================
// INTERPRETATION C: Repeated Digit per Row (1, 22, 333, 4444, ..., n repeated n times)
// =========================================================================

console.log("\n--- Interpretation C: Repeated Digit per Row (i repeated i times) ---");

// Way 1: Using String.prototype.repeat in a single loop
function printPatternC_Repeat(n) {
    if (n < 1) return;
    for (let i = 1; i <= n; i++) {
        console.log(String(i).repeat(i));
    }
}
console.log("\nWay 1 (String.repeat) for n = 5:");
printPatternC_Repeat(5);

// Way 2: Double Loop (Traditional)
function printPatternC_DoubleLoop(n) {
    if (n < 1) return;
    for (let i = 1; i <= n; i++) {
        let row = "";
        for (let j = 0; j < i; j++) {
            row += i;
        }
        console.log(row);
    }
}
console.log("\nWay 2 (Double Loop) for n = 5:");
printPatternC_DoubleLoop(5);
