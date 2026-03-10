// create a script that accepts a set of numbers as command line arguments and display their sum
// use process.exit(1) to progammatically kill the Node process with an error code
// CALL: node 01_sum.js OUTPUT: USAGE node 01_sum.js <num1> <num2> ... <numN>
// CALL: node 01_sum.js 1a 2 3 OUTPUT: ERROR: One or more arguments are not valid numbers
// CALL: node 01_sum.js 1 2 3 4 OUTPUT: The sum of the numbers is: 10

const args = process.argv.slice(2);
let sum = 0;
console.log(args);

if(args.length === 0){
    console.error('USAGE: node 01_sum.js <num1> <num2> ... <numN>');
    process.exit(1);
}

const num = args.map(arg => parseFloat(arg));

for ( const arg of args){
    const num = Number(arg);
    console.log(`Processing argument: ${arg} => ${num}`);
    if (isNaN(num)){
        console.error('ERROR: One or more arguments are not valid numbers');
        process.exit(1);
    }
    sum += num;
}

console.log(`The sum is ${sum}`);