// identifier kw_identifier bracket_identifier
// paren_identifier do_identifier block_identifier op_identifier
// fn 'end' alias
// atom bin_string list_string sigil
// comp_op at_op unary_op and_op or_op arrow_op match_op in_op in_match_op
// type_op dual_op mult_op power_op concat_op range_op xor_op pipe_op stab_op when_op
// capture_int capture_op assoc_op rel_op ternary_op dot_call_op
// 'true' 'false' 'nil' 'do' eol ';' ',' '.'
// '(' ')' '[' ']' '{' '}' '<<' '>>' '%{}' '%'
// int flt char
// .

const TokenType = Object.freeze({
  defmod: Symbol("DEFMOD"),
  ident: Symbol("IDENT"),
  alias: Symbol("ALIAS"),
  atom: Symbol("ATOM"),
  do: Symbol("DO"),
  def: Symbol("DEF"),
  int: Symbol("INT"),
  float: Symbol("FLOAT"),
  plus: Symbol("PLUS"),
  end: Symbol("END"),
  eof: Symbol("EOF"),
  equal: Symbol("EQUAL"),
  bang_equal: Symbol("BANG_EQUAL"),
  equal_equal: Symbol("EQUAL_EQUAL"),
  lt_equal: Symbol("LT_EQUAL"),
  gt_equal: Symbol("GT_EQUAL"),
  gt: Symbol("GT"),
  lt: Symbol("LT"),
  bang: Symbol("BANG"),
  left_paren: Symbol("LEFT_PAREN"),
  right_paren: Symbol("RIGHT_PAREN"),
  string: Symbol("STRING")
})

const Reserved = Object.freeze({
  'defmodule': TokenType.defmod,
  'def': TokenType.def,
  'do': TokenType.do,
  'end': TokenType.end,
})

class Token {
  constructor(type, lexeme) {
    this.type = type;
    this.lexeme = lexeme;
    Object.freeze(this);
  }
}

class Lexer {
  tokens = [];
  start = 0;
  current = 0;

  constructor(source) {
    this.source = source;
  }

  scanTokens() {
    while (!this.isAtEnd()) {
      this.start = this.current;
      this.scanToken();
    }

    this.tokens.push(new Token(TokenType.eof, ""));
    return this.tokens;
  }

  isAtEnd() {
    return this.current >= this.source.length;
  }

  scanToken() {
    const c = this.advance();
    switch (c) {
      case '+':
        this.addToken(TokenType.plus);
        break;
      case '(':
        this.addToken(TokenType.left_paren);
        break;
      case ')':
        this.addToken(TokenType.right_paren);
        break;

      case '=':
        this.addToken(this.match('=') ? TokenType.equal_equal : TokenType.equal);
        break;
      case '!':
        this.addToken(this.match('=') ? TokenType.bang_equal : TokenType.bang);
        break;
      case '<':
        this.addToken(this.match('=') ? TokenType.lt_equal : TokenType.lt);
        break;
      case '>':
        this.addToken(this.match('=') ? TokenType.gt_equal : TokenType.gt);
        break;

      case '#':
        while (this.peek() != '\n' && !this.isAtEnd()) this.advance();
        break;

      // Ignore whitespace
      case ' ': break;
      case '\r': break;
      case '\t': break;
      case '\n': break; // increment line numbers

      case '"': this.string(); break;

      default:
        if (this.isDigit(c)) {
          this.number();
        } else if (this.isLowerAlpha(c)) {
          this.identifier();
        } else if (this.isUpperAlpha(c)) {
          this.alias();
        } else if (c == ":") {
          this.atom();
        } else {
          console.log("Unexpected character");
        }
        break;

      // TODO add default and idents and reserved words
    }
  }

  advance() {
    return this.source.charAt(this.current++);
  }

  addToken(type, text) {
    if (text == undefined)
      text = this.source.substring(this.start, this.current);

    const token = new Token(type, text)
    this.tokens.push(token);

    console.log(token);
  }

  match(expected) {
    if (this.isAtEnd()) return false;
    if (this.source.charAt(this.current) != expected) return false;

    this.current++;
    return true;
  }

  peek() {
    if (this.isAtEnd()) return '\0';
    return this.source.charAt(this.current);
  }

  peekNext() {
    if (this.current + 1 >= this.source.length) return '\0';
    return this.source.charAt(this.current + 1);
  }

  string() {
    while (this.peek() != '"' && !this.isAtEnd()) {
      // if (peek() == '\n') line++;
      this.advance();
    }

    if (this.isAtEnd()) {
      console.log("Unterminated string");
      return;
    }

    // The closing quote.
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    addToken(TokenType.string, value);
  }

  isDigit(c) {
    return c >= '0' && c <= '9';
  }

  number() {
    while (this.isDigit(this.peek())) this.advance();

    // Look for a fractional part.
    if (this.peek() == '.' && this.isDigit(this.peekNext())) {
      // Consume the "."
      this.advance();

      while (this.isDigit(this.peek())) this.advance();

      this.addToken(TokenType.float,
        parseFloat(this.source.substring(this.start, this.current)));
    }
    else {
      this.addToken(TokenType.int,
        parseInt(this.source.substring(this.start, this.current)));

    }
  }

  isAlpha(c) {
    return (c >= 'a' && c <= 'z') ||
      (c >= 'A' && c <= 'Z') ||
      c == '_';
  }

  isLowerAlpha(c) {
    return (c >= 'a' && c <= 'z') || c == '_';
  }

  isUpperAlpha(c) {
    return (c >= 'A' && c <= 'Z');
  }

  isAlphaNumeric(c) {
    return this.isAlpha(c) || this.isDigit(c);
  }

  identifier() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    if (this.peek() == '!' || this.peek() == '?') {
      this.advance();
    }

    const text = this.source.substring(this.start, this.current);
    const type = Reserved[text];
    if (type == null) {
      this.addToken(TokenType.ident, text);
    } else {
      this.addToken(type, text);
    }
  }

  alias() {
    while (this.isAlphaNumeric(this.peek())) this.advance();

    this.addToken(TokenType.alias);
  }

  atom() {
    if (this.isAlpha(this.peek())) {
      this.advance();
      while (this.isAlphaNumeric(this.peek()) || this.peek() == '@') this.advance();

      if (this.peek() == '!' || this.peek() == '?') {
        this.advance();
      }

      // Trim the :
      const value = this.source.substring(this.start + 1, this.current);
      this.addToken(TokenType.atom, value);

    } else {
      console.log("Error atom must start with a letter or _")
    }
  }
}

const src = `
  defmodule Foo do
    def bar do
      aaa!bb = 2
      :aa!aa
      :f@l_ibbets!
      2.1 + 3 != 4
      baz(5)
    end

    def baz(x) do
      x + 3.4 == 7
    end

    def bot do
      a <= 6 >=5 < 2 > 4
    end
  end
`

let lex = new Lexer(src);

lex.scanTokens();

// @next
// setup a simple testing framework and add some tests
// get maps working (kw_identifier, brackets fat arrow maybe more)
// handle the rest of the ops
// maybe get quoted atoms working.
// figure out if we're going to support unicode