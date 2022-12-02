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
    // TODO compress these
    console.log(`Failed--actual token length doesn't equal expected--${lex.tokens.length} vs. ${expected_tokens.length}`);
    console.log('actual');
    console.log(lex.tokens);
    console.log('expected');
    console.log(expected_tokens);
    console.log('------------');
    return
  }
  if (lex.errors.length != expected_errors.length) {
    console.log(`Failed--actual errors length doesn't equal expected--${lex.errors.length} vs. ${expected_errors.length}`);
    console.log('actual');
    console.log(lex.errors);
    console.log('expected');
    console.log(expected_errors);
    console.log('------------');
    return
  }
  for (let i = 0; i < lex.tokens.length; i++) {
    const actual = lex.tokens[i];
    const expected = expected_tokens[i]

    if (actual.type != expected.type || actual.lexeme != expected.lexeme) {
      console.log(`Failed--actual token doesn't equal expected`);
      console.log('actual');
      console.log(lex.tokens);
      console.log('expected');
      console.log(expected_tokens);
      console.log('------------');
      return
    }
    if (lex.errors[i] != expected_errors[i]) {
      console.log(`Failed--actual error doesn't equal expected--${lex.errors[i]} vs. ${expected_errors[i]}`);
      console.log('actual');
      console.log(lex.errors);
      console.log('expected');
      console.log(expected_errors);
      console.log('------------');
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

// TODO What should EOF have as it's value empty quotes, nul, "EOF?"
const EOF = new Token(TokenType.eof, "");

// atom 
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
  const template = atom_start() + atom_middle() + atom_end();
  const string = ":" + template
  lex = new Lexer(string);
  lex.scanTokens();
  expected_tokens = [new Token(TokenType.atom, template), EOF];
  assertLex(lex, expected_tokens, []);
}

// identifier
function ident_start() {
  return random_char(['_', ['a', 'z']]);
}

function ident_middle() {
  const times = Math.floor(Math.random() * 3)
  let str = "";
  for (let i = 0; i < times; i++) {
    str += random_char(['', '_', ['a', 'z'], ['A', 'Z'], ['0', '9']]);
  }
  return str;
}

function ident_end() {
  return random_char(['', '!', '?']);
}

for (let i = 0; i < 1000; i++) {
  const str = ident_start() + ident_middle() + ident_end();
  if (str == "do") { continue; }
  lex = new Lexer(str);
  lex.scanTokens();
  expected_tokens = [new Token(TokenType.ident, str), EOF];
  assertLex(lex, expected_tokens, []);
}

// @next
// compress the stuff in the TODO above
