// const src = `
//     aaa!bb = 2
//     :aa!aa
//     :f@l_ibbets!
//     2.1 + 3 != 4
//     baz(5)

//   def baz(x) do
//     x + 3.4 == 7
//   end

//   def bot do
//     a <= 6 >=5 < 2 > 4
//   end
// end
// `

function assert(actual, expected) {
  if (actual === expected) {
    console.log("Passed");
  } else {
    console.log(`Failed ${actual} != ${expected} `);
  }
}

valid_atoms = [
  ":abc",
  ":abc!",
  ":abc?",
  ":_abc",
  ":abc@_123",
  ":Abc",
]

invalid_atoms = [
  ":1abc",
  ":",
  ":1abc",
  ":1abc :@bc",
]

for (const atom of valid_atoms) {
  let lex = new Lexer(atom);
  lex.scanTokens();
  assert(lex.errors.length, 0);
  console.log(lex)
}

for (const atom of invalid_atoms) {
  let lex = new Lexer(atom);
  lex.scanTokens();
  assert(lex.errors.length, 1);
  console.log(lex)
}

// @next
// Maybe add property testing with a template for atoms
// Have some kind of function where you can pass in the src, tokens, and errors and it asserts they match
// and then write a loop that can build a list of those structures (src, tokens, errors)
// also have asserts log the lexer
