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
    const actual = lex.tokens[i];
    const expected = expected_tokens[i]
    if (actual.type != expected.type && actual.lexeme != expected.lexeme) {
      console.log(`Failed--actual token doesn't equal expected--${actual} vs. ${expected}`);
      return
    }
    if (lex.errors[i] != expected_errors[i]) {
      console.log(`Failed--actual error doesn't equal expected--${lex.errors[i]} vs. ${expected_errors[i]}`);
      return
    }
  }

  console.log("Passed")
}

function random_char(arr) {
  const random_pick = arr[Math.floor(Math.random() * arr.length)];

  if (Array.isArray(random_pick)) {
    const start = random_pick[0].charCodeAt(0);
    const end = random_pick[1].charCodeAt(0);
    return String.fromCharCode(start + Math.random() * (end - start + 1));
  }

  return random_pick;
}

function atom_start() {
  return random_char(['_', ['a', 'z'], ['A', 'Z']]);
}

function atom_middle() {
  const times = Math.floor(Math.random() * 3)
  let str = "";
  for (let i = 0; i < times; i++) {
    str += random_char(['', '_', '@', ['a', 'z'], ['A', 'Z'], ['0', '9']]);

  }
  return str;
}

function atom_end() {
  return random_char(['', '!', '?']);
}

for (let i = 0; i < 1000; i++) {
  const template = `:${atom_start() + atom_middle() + atom_end()} `
  lex = new Lexer(template);
  lex.scanTokens();
  assertEq(lex.errors.length, 0);
}

/// @next
// Maybe add property testing with a template for atoms
// Have some kind of function where you can pass in the src, tokens, and errors and it asserts they match
// and then write a loop that can build a list of those structures (src, tokens, errors)
// also have asserts log the lexer
