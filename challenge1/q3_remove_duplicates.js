/**
 * Challenge 1 - Question 3
 * Removing duplicates in an array in JavaScript.
 * Input:  [ 1, 2, 3, 6, 4, 3, 7, 4, 2, 6, 8, 2, 5, 9, 0, 1 ]
 * Output: [ 1, 2, 3, 6, 4, 7, 8, 5, 9, 0 ]
 */

const inputArray = [1, 2, 3, 6, 4, 3, 7, 4, 2, 6, 8, 2, 5, 9, 0, 1];
console.log("Input Array:", inputArray);

// =========================================================================
// Way 1: Using ES6 Set (The Modern, Simplest, and Most Efficient Way)
// =========================================================================
function removeDuplicates_Set(arr) {
    return [...new Set(arr)];
}
console.log("Way 1 (ES6 Set):             ", removeDuplicates_Set(inputArray));

// =========================================================================
// Way 2: Using Array.prototype.filter and indexOf
// =========================================================================
function removeDuplicates_Filter(arr) {
    // Keep only elements whose first occurrence index is equal to their current index
    return arr.filter((item, index) => arr.indexOf(item) === index);
}
console.log("Way 2 (Filter & indexOf):    ", removeDuplicates_Filter(inputArray));

// =========================================================================
// Way 3: Using Array.prototype.reduce and includes
// =========================================================================
function removeDuplicates_Reduce(arr) {
    return arr.reduce((accumulator, currentVal) => {
        if (!accumulator.includes(currentVal)) {
            accumulator.push(currentVal);
        }
        return accumulator;
    }, []);
}
console.log("Way 3 (Reduce & includes):   ", removeDuplicates_Reduce(inputArray));

// =========================================================================
// Way 4: Using a HashTable / Lookup Object (O(N) Time Complexity)
// =========================================================================
function removeDuplicates_LookupObject(arr) {
    const seen = {};
    const result = [];
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (!seen[item]) {
            seen[item] = true;
            result.push(item);
        }
    }
    return result;
}
console.log("Way 4 (Lookup Object):       ", removeDuplicates_LookupObject(inputArray));

// =========================================================================
// Way 5: Using Map (Preserves key types and insertion order)
// =========================================================================
function removeDuplicates_Map(arr) {
    const map = new Map();
    arr.forEach(item => {
        if (!map.has(item)) {
            map.set(item, true);
        }
    });
    return Array.from(map.keys());
}
console.log("Way 5 (Map):                 ", removeDuplicates_Map(inputArray));
