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
  after: Symbol("AFTER"),
  alias: Symbol("ALIAS"),
  amp_amp: Symbol("AMP_AMP"), // &&
  amp_amp_amp: Symbol("AMP_AMP_AMP"), // &&&
  ampersand: Symbol("AMPERSAND"), // &
  and: Symbol("AND"), // and
  arrow: Symbol("ARROW"), // =>
  at: Symbol("AT"), // @
  atom: Symbol("ATOM"),
  bang: Symbol("BANG"), // !
  bang_equal: Symbol("BANG_EQUAL"), // !=
  bang_equal_equal: Symbol("BANG_EQUAL_EQUAL"), // !==
  begin: Symbol("BEGIN"),
  caret: Symbol("CARET"), // ^
  case: Symbol("CASE"),
  catch: Symbol("CATCH"),
  colon_colon: Symbol("COLON_COLON"), // ::
  cond: Symbol("COND"),
  def: Symbol("DEF"),
  defcallback: Symbol("DEFCALLBACK"),
  defimpl: Symbol("DEFIMPL"),
  defmacro: Symbol("DEFMACRO"),
  defmod: Symbol("DEFMOD"),
  defp: Symbol("DEFP"),
  defprotocol: Symbol("DEFPROTOCOL"),
  do: Symbol("DO"),
  dot: Symbol("DOT"), // .
  dot_dot: Symbol("DOT_DOT"), // ..
  else: Symbol("ELSE"),
  end: Symbol("END"),
  eof: Symbol("EOF"),
  equal: Symbol("EQUAL"), // =
  equal_equal: Symbol("EQUAL_EQUAL"), // ==
  equal_equal_equal: Symbol("EQUAL_EQUAL_EQUAL"), // ===
  equal_tilde: Symbol("EQUAL_TILDE"), // =
  exit: Symbol("EXIT"),
  float: Symbol("FLOAT"),
  fn: Symbol("FN"),
  function: Symbol("FUNCTION"),
  gt: Symbol("GT"), // >
  gt_equal: Symbol("GT_EQUAL"), // >=
  gt_gt_gt: Symbol("GT_GT_GT"), // >>>
  ident: Symbol("IDENT"),
  if: Symbol("IF"),
  import: Symbol("IMPORT"),
  in: Symbol("IN"), // in
  int: Symbol("INT"),
  left_arrow: Symbol("LEFT_ARROW"), // <-
  left_paren: Symbol("LEFT_PAREN"),
  lt: Symbol("LT"), // <
  lt_equal: Symbol("LT_EQUAL"), // <=
  lt_gt: Symbol("LT_GT"), // <>
  lt_lt_lt: Symbol("LT_LT_LT"), // <<< 
  lt_lt_tilde: Symbol("LT_LT_TILDE"), // <<~
  lt_tilde: Symbol("LT_TILDE"), // <<
  lt_tilde_gt: Symbol("LT_TILDE_GT"), // <>
  macro: Symbol("MACRO"),
  minus: Symbol("MINUS"), // -
  minus_minus: Symbol("MINUS_MINUS"), // --
  minus_minus_minus: Symbol("MINUS_MINUS_MINUS"), // ---
  not: Symbol("NOT"), // not
  or: Symbol("OR"), // or
  pipe: Symbol("PIPE"), // |
  pipe_pipe: Symbol("DOUBLE_PIPE"), // ||
  pipe_pipe_pipe: Symbol("TRIPLE_PIPE"), // |||
  pipeline: Symbol("PIPELINE"), // |>
  plus: Symbol("PLUS"), // +
  plus_plus: Symbol("PLUS_PLUS"), // ++
  plus_plus_plus: Symbol("PLUS_PLUS_PLUS"), // +++
  quote: Symbol("QUOTE"),
  raise: Symbol("RAISE"),
  receive: Symbol("RECEIVE"),
  require: Symbol("REQUIRE"),
  rescue: Symbol("RESCUE"),
  right_paren: Symbol("RIGHT_PAREN"),
  send: Symbol("SEND"),
  slash: Symbol("SLASH"), // /
  spawn: Symbol("SPAWN"),
  star: Symbol("STAR"), // *
  star_star: Symbol("STAR_STAR"), // **
  string: Symbol("STRING"),
  throw: Symbol("THROW"),
  tilde_gt: Symbol("TILDE_GT"), // ~>
  tilde_gt_gt: Symbol("TILDE_GT_GT"), // ~>>
  try: Symbol("TRY"),
  unless: Symbol("UNLESS"),
  unquote: Symbol("UNQUOTE"),
  unquote_splicing: Symbol("UNQUOTE_SPLICING"),
  use: Symbol("USE"),
  when: Symbol("WHEN"), // when

  left_square: Symbol("LEFT_SQUARE"),
  right_square: Symbol("RIGHT_SQUARE"),
  left_curly: Symbol("LEFT_CURLY"),
  right_curly: Symbol("RIGHT_CURLY"),
  comma: Symbol("COMMA"),
  percent: Symbol("PERCENT"),
})

const Reserved = Object.freeze({
  'after': TokenType.after,
  'alias': TokenType.alias,
  'and': TokenType.and,
  'begin': TokenType.begin,
  'case': TokenType.case,
  'catch': TokenType.catch,
  'cond': TokenType.cond,
  'def': TokenType.def,
  'defcallback': TokenType.defcallback,
  'defimpl': TokenType.defimpl,
  'defmacro': TokenType.defmacro,
  'defmodule': TokenType.defmod,
  'defp': TokenType.defp,
  'defprotocol': TokenType.defprotocol,
  'do': TokenType.do,
  'else': TokenType.else,
  'end': TokenType.end,
  'exit': TokenType.exit,
  'fn': TokenType.fn,
  'function': TokenType.function,
  'if': TokenType.if,
  'import': TokenType.import,
  'in': TokenType.in,
  'macro': TokenType.macro,
  'not': TokenType.not,
  'or': TokenType.or,
  'quote': TokenType.quote,
  'raise': TokenType.raise,
  'receive': TokenType.receive,
  'require': TokenType.require,
  'rescue': TokenType.rescue,
  'send': TokenType.send,
  'spawn': TokenType.spawn,
  'throw': TokenType.throw,
  'try': TokenType.try,
  'unless': TokenType.unless,
  'unquote': TokenType.unquote,
  'unquote_splicing': TokenType.unquote_splicing,
  'use': TokenType.use,
  'when': TokenType.when,
})

class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
    Object.freeze(this);
  }
}

class Lexer {
  tokens = [];
  errors = [];
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
      case '(':
        this.addToken(TokenType.left_paren);
        break;
      case ')':
        this.addToken(TokenType.right_paren);
        break;
      case '[':
        this.addToken(TokenType.left_square);
        break;
      case ']':
        this.addToken(TokenType.right_square);
        break;
      case '{':
        this.addToken(TokenType.left_curly);
        break;
      case '}':
        this.addToken(TokenType.right_curly);
        break;
      case ',':
        this.addToken(TokenType.comma);
        break;
      case ',':
        this.addToken(TokenType.comma);
        break;
      case '@':
        this.addToken(TokenType.at);
        break;
      case '^':
        this.addToken(TokenType.caret);
        break;
      case '/':
        this.addToken(TokenType.slash);
        break;
      case '%':
        this.addToken(TokenType.percent);
        break;

      case '=':
        this.addFirstMatch([
          ['==', TokenType.equal_equal_equal], ['=', TokenType.equal_equal], ['>', TokenType.arrow],
          ['~', TokenType.equal_tilde]], TokenType.equal);
        break;
      case '!':
        this.addFirstMatch([['==', TokenType.bang_equal_equal], ['=', TokenType.bang_equal]], TokenType.bang);
        break;
      case '+':
        this.addFirstMatch([['++', TokenType.plus_plus_plus], ['+', TokenType.plus_plus]], TokenType.plus);
        break;
      case '*':
        this.addFirstMatch([['**', TokenType.star_star_star], ['*', TokenType.star_star]], TokenType.star);
        break;
      case '-':
        this.addFirstMatch([['--', TokenType.minus_minus_minus], ['-', TokenType.minus_minus]], TokenType.minus);
        break;
      case '.':
        this.addFirstMatch([['.', TokenType.dot_dot]], TokenType.dot);
        break;
      case '<':
        this.addFirstMatch([
          ['<<', TokenType.lt_lt_lt], ['<~', TokenType.lt_lt_tilde], ['<', TokenType.lt_lt], ['>', TokenType.lt_gt],
          ['=', TokenType.lt_equal], ['~>', TokenType.lt_tilde_gt], ['~', TokenType.lt_tilde],
          ['-', TokenType.left_arrow]
        ], TokenType.lt);
        break;
      case '>':
        this.addFirstMatch([
          ['>>', TokenType.gt_gt_gt], ['=', TokenType.gt_equal], ['-', TokenType.gt_minus],
        ], TokenType.gt);
        break;
      case '|':
        this.addFirstMatch([
          ['>', TokenType.pipeline], ['||', TokenType.pipe_pipe_pipe], ['|', TokenType.pipe_pipe]
        ], TokenType.pipe);
        break;
      case '~':
        this.addFirstMatch([
          ['>>', TokenType.tilde_gt_gt], ['>', TokenType.tilde_gt]
        ], TokenType.tilde);
        break;
      case '&':
        this.addFirstMatch([
          ['&&', TokenType.amp_amp_amp], ['&', TokenType.amp_amp]
        ], TokenType.ampersand);
        break;
      case ':':
        if (this.match(':')) {
          this.addToken(TokenType.colon_colon);
        } else {
          this.atom();
        }

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
          this.addError(`Unexpected character ${c}`)
        }
        break;
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
  }

  addTokenIfMatch(pattern, type) {
    switch (pattern.length) {
      case 1:
        if (this.match(pattern[0])) {
          this.addToken(type);
          return true;
        }
        return false;
      case 2:
        if (this.peek() == pattern[0] && this.peekNext() == pattern[1]) {
          this.addToken(type);
          this.current += 2;
          return true;
        }
        return false;
      default:
        throw 'Function only supports pattern of length 1 or 2!';
    }
  }

  addFirstMatch(patternTokenPairs, defaultToken) {
    for (const patternTokenPair of patternTokenPairs) {
      const pattern = patternTokenPair[0];
      const token = patternTokenPair[1];

      if (this.addTokenIfMatch(pattern, token)) {
        return;
      }
    }

    this.addToken(defaultToken);
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
      this.addError("Unterminated string");
      return;
    }

    // The closing quote.
    this.advance();

    // Trim the surrounding quotes.
    const value = this.source.substring(this.start + 1, this.current - 1);
    this.addToken(TokenType.string, value);
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
      this.addError("Error atom must start with a letter or _");
    }
  }

  addError(message) {
    this.errors.push({ message: message })
  }
}

const src = `
  defmodule Foo do
    def bar do
      a = %{foo: "bar", baz: 1}
      b = %{"foo" => "bar", "baz" => 1}
      c = [a: "b", c: 1]
      d = [{"a", "b"}, {"c", 1}]
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
console.log(lex.tokens)
console.log(lex.errors)

// @next
// get maps working (kw_identifier, brackets fat arrow maybe more)
// kw_identifier is weird

// handle the rest of the ops
// maybe get quoted atoms working.
// figure out if we're going to support unicode
