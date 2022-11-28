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

function assertEq(actual, expected) {
  if (actual === expected) {
    console.log("Passed");
    return true;
  } else {
    console.log(`Failed ${actual} != ${expected} `);
    return false;
  }
}

function assertLex(lex, expected_tokens, expected_errors) {
  if (lex.tokens.length != expected_tokens.length) {
    console.log(`Failed--actual token length doesn't equal expected--${lex.tokens.length} vs. ${expected_tokens.length}`);
    return
  }
  if (lex.errors.length != expected_errors.length) {
    console.log(`Failed--actual errors length doesn't equal expected--${lex.errors.length} vs. ${expected_errors.length}`);
    return
  }
  for (let i = 0; i < lex.tokens.length; i++) {
    if (lex.tokens[i] != expected_tokens[i]) {
      console.log(`Failed--actual token doesn't equal expected--${lex.tokens[i]} vs. ${expected_token[i]}`);
      return
    }
    if (lex.errors[i] != expected_errors[i]) {
      console.log(`Failed--actual error doesn't equal expected--${lex.errors[i]} vs. ${expected_errors[i]}`);
      return
    }
  }

  console.log("Passed")
}

const valid_atom_props = [
  ['_', ['a', 'z'], ['A', 'Z']],
  ['', '_', '@', ['a', 'z'], ['A', 'Z'], ['0', '9']],
  ['', '_', '@', ['a', 'z'], ['A', 'Z'], ['0', '9']],
  ['', '!', '?']
]

for (let i = 0; i < 100; i++) {
  let generated_atom = ":";

  for (const template of valid_atom_props) {
    pattern = template[Math.floor(Math.random() * template.length)]

    if (Array.isArray(pattern)) {
      const start = pattern[0].charCodeAt(0);
      const end = pattern[1].charCodeAt(0);
      generated_atom += String.fromCharCode(start + Math.random() * (end - start + 1));
    }
    else {
      generated_atom += pattern;
    }
  }

  lex = new Lexer(generated_atom);
  lex.scanTokens();

  assertEq(lex.errors.length, 0);
}

// const start = "a".charCodeAt(0);
// const end = "z".charCodeAt(0);
// let text = String.fromCharCode(start + Math.random() * (end - start + 1));

// use a while loop. Move through each pattern and grab one at random from each category then remove that category
// kep going 

// valid_atoms = [
//   ":abc",
//   ":abc!",
//   ":abc?",
//   ":_abc",
//   ":abc@_123",
//   ":Abc",
// ]

// invalid_atoms = [
//   ":1abc",
//   ":",
//   ":1abc",
//   ":1abc :@bc",
// ]

// for (const atom of valid_atoms) {
//   let lex = new Lexer(atom);
//   lex.scanTokens();
//   assertEq(lex.errors.length, 0);
//   console.log(lex)
// }

// for (const atom of invalid_atoms) {
//   let lex = new Lexer(atom);
//   lex.scanTokens();
//   assertEq(lex.errors.length, 1);
//   console.log(lex)
// // }

// @next
// Maybe add property testing with a template for atoms
// Have some kind of function where you can pass in the src, tokens, and errors and it asserts they match
// and then write a loop that can build a list of those structures (src, tokens, errors)
// also have asserts log the lexer
