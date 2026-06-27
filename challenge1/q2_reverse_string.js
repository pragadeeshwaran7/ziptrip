/**
 * Challenge 1 - Question 2
 * Reversing characters in a string in JavaScript.
 * Input: "Bhaskara"
 * Output: "araksahB"
 */

const inputString = "Bhaskara";
console.log(`Input: "${inputString}"`);

// =========================================================================
// Way 1: Standard Built-in Array Methods
// =========================================================================
function reverseString_BuiltIn(str) {
    return str.split("").reverse().join("");
}
console.log(`Way 1 (Split-Reverse-Join): "${reverseString_BuiltIn(inputString)}"`);

// =========================================================================
// Way 2: Iterative Loop (Prepend accumulation)
// =========================================================================
function reverseString_IterativePrepend(str) {
    let reversed = "";
    for (let char of str) {
        reversed = char + reversed; // Prepend character to shift it to the start
    }
    return reversed;
}
console.log(`Way 2 (Iterative Prepend):  "${reverseString_IterativePrepend(inputString)}"`);

// =========================================================================
// Way 3: Iterative Loop (Decrementing index)
// =========================================================================
function reverseString_DecrementingLoop(str) {
    let reversed = "";
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}
console.log(`Way 3 (Decrementing Loop):   "${reverseString_DecrementingLoop(inputString)}"`);

// =========================================================================
// Way 4: Using Array.prototype.reduce
// =========================================================================
function reverseString_Reduce(str) {
    return str.split("").reduce((acc, char) => char + acc, "");
}
console.log(`Way 4 (Array.reduce):        "${reverseString_Reduce(inputString)}"`);

// =========================================================================
// Way 5: Recursive Approach
// =========================================================================
function reverseString_Recursive(str) {
    if (str === "") return "";
    return reverseString_Recursive(str.substring(1)) + str[0];
}
console.log(`Way 5 (Recursion):           "${reverseString_Recursive(inputString)}"`);

// =========================================================================
// Way 6: Swapping Pointers (In-place swap on array)
// =========================================================================
function reverseString_PointerSwap(str) {
    let arr = str.split("");
    let left = 0;
    let right = arr.length - 1;
    while (left < right) {
        let temp = arr[left];
        arr[left] = arr[right];
        arr[right] = temp;
        left++;
        right--;
    }
    return arr.join("");
}
console.log(`Way 6 (Pointer Swap):        "${reverseString_PointerSwap(inputString)}"`);
