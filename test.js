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
  // ":1abc",
  // ":",
  ":@abc",
]

// for (const atom in valid_atoms) {
//   let lex = new Lexer(atom);
//   lex.scanToken();
//   assert(lex.errors.length, 0);
// }

for (const atom in invalid_atoms) {
  let lex = new Lexer(atom);
  lex.scanToken();
  assert(lex.errors.length, 1);
}
