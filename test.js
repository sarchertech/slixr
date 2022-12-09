function assertEq(actual, expected) {
  if (actual === expected) {
    return true;
  } else {
    // console.log(`Failed ${actual.toString()} != ${expected.toString()} `);
    return false;
  }
}

function assertNotEq(actual, expected) {
  if (actual !== expected) {
    return true;
  } else {
    // console.log(`Failed ${actual.toString()} == ${expected.toString()} but it shouldn't`);
    return false;
  }
}

function log_actual_expected(actual, expected) {
  console.log('actual');
  console.log(actual);
  console.log('expected');
  console.log(expected);
  console.log('------------');
}

function assertLex(lex, expected_tokens, expected_errors) {
  if (lex.tokens.length != expected_tokens.length) {
    console.log(`Failed--actual token length doesn't equal expected--${lex.tokens.length} vs. ${expected_tokens.length}`);
    log_actual_expected(lex.tokens, expected_tokens);
    return
  }
  if (lex.errors.length != expected_errors.length) {
    console.log(`Failed--actual errors length doesn't equal expected--${lex.errors.length} vs. ${expected_errors.length}`);
    log_actual_expected(lex.errors, expected_errors);
    return
  }
  for (let i = 0; i < lex.tokens.length; i++) {
    const actual = lex.tokens[i];
    const expected = expected_tokens[i]

    if (actual.type != expected.type || actual.lexeme != expected.lexeme) {
      console.log(`Failed--actual token doesn't equal expected`);
      log_actual_expected(lex.tokens, expected_tokens);
      return
    }
    if (lex.errors[i] != expected_errors[i]) {
      console.log(`Failed--actual error doesn't equal expected--${lex.errors[i]} vs. ${expected_errors[i]}`);
      log_actual_expected(lex.errors, expected_errors);
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
  if (str == "do" || str == "in" || str == "or" || str == "if") { continue; }
  lex = new Lexer(str);
  lex.scanTokens();
  expected_tokens = [new Token(TokenType.ident, str), EOF];
  assertLex(lex, expected_tokens, []);
}

const reservedWords = [
  "and", "or", "not", "in", "when", "begin", "end", "cond", "if", "else",
  "unless", "do", "quote", "unquote", "unquote_splicing", "case", "try",
  "rescue", "catch", "after", "function", "def", "macro", "defmacro", "defp",
  "defmodule", "defprotocol", "defimpl", "defcallback", "import", "alias",
  "require", "use", "quote", "unquote", "unquote_splicing", "fn", "receive",
  "send", "spawn", "raise", "throw", "exit"
]

for (const word of reservedWords) {
  lex = new Lexer(word);
  lex.scanTokens();
  const a = assertEq(lex.tokens.length, 2);
  const b = assertEq(lex.errors.length, 0);
  const c = assertNotEq(lex.tokens[0].type, TokenType.ident);
  const d = assertNotEq(lex.tokens[0].type, TokenType.atom);
  const e = assertNotEq(lex.tokens[0].type, undefined);

  if (!(a && b && c && d && e)) {
    console.log(`Failed--${word}`);
    console.log(lex.tokens);
    console.log(lex.errors);
    console.log("-------");
  } else {
    console.log("Passed")
  }
}

const operators = [
  "@", ".", "+", "-", "!", "^", "**", "*", "/", "+", "-", "++", "--", "+++", "---",
  "..", "<>", "in", "not", "|>", "<<<", ">>>", "<<~", "~>>", "<~", "~>", "<~>",
  "<", ">", "<=", ">=", "==", "!=", "=~", "===", "!==", "&&", "&&&", "and", "||",
  "|||", "or", "=", "&", "=>", "|", "::", "when", "<-"
]

for (const operator of operators) {
  lex = new Lexer(operator);
  lex.scanTokens();
  const a = assertEq(lex.tokens.length, 2);
  const b = assertEq(lex.errors.length, 0);
  const c = assertNotEq(lex.tokens[0].type, TokenType.ident);
  const d = assertNotEq(lex.tokens[0].type, TokenType.atom);
  const e = assertNotEq(lex.tokens[0].type, undefined);

  if (!(a && b && c && d && e)) {
    console.log(`Failed--${operator}`);
    console.log(lex.tokens);
    console.log(lex.errors);
    console.log("-------");
  } else {
    console.log("Passed")
  }
}

// @next
// test keywords
// test strings. add other keywords

// compress the matches for *, **, *** with function
// maybe find a generic function for for complex like ~> and ~>>

// Decision - no types and subtypes for tokens