const math = require("./modules/math.js");

const args = process.argv.slice(2);

if (args.length < 3) {
  console.error(
    "ERROR: Not enough operators! USAGE: node ex3 <operation> <number1>\n<number2>",
  );
  process.exit(1);
}

const [op, aStr, bStr] = args;
const a = parseFloat(aStr);
const b = parseFloat(bStr);

if (isNaN(a) || isNaN(b)) {
  console.error("ERROR: One or more arguments are not valid numbers");
  process.exit(1);
}

let result;
try {
  switch (op) {
    case "+":
      result = math.add([a, b]);
      break;
    case "-":
      result = math.sub([a, b]);
      break;
    case "*":
      result = math.mul([a, b]);
      break;
    case "/":
      try {
        result = math.div([a, b]);
      } catch (e) {
        console.error("ERROR: Cannot divide by zero!");
        process.exit(1);
      }
      break;
    default:
      console.error(
        "ERROR: Invalid operation! Supported operations are: +, -, *, /",
      );
      process.exit(1);
  }
} catch (e) {
  console.error("ERROR:", e.message || e);
  process.exit(1);
}

console.log(`${a} ${op} ${b} = ${result}`);
