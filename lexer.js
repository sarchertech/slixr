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
  end: Symbol("END"),
  eof: Symbol("EOF"),
  left_paren: Symbol("LEFT_PAREN"),
  right_paren: Symbol("RIGHT_PAREN"),
  string: Symbol("STRING"),

  // operators
  amp_amp: Symbol("AMP_AMP"), // &&
  amp_amp_amp: Symbol("AMP_AMP_AMP"), // &&&
  ampersand: Symbol("AMPERSAND"), // &
  and: Symbol("AND"), // and
  arrow: Symbol("ARROW"), // =>
  at: Symbol("AT"), // @
  bang: Symbol("BANG"), // !
  bang_equal: Symbol("BANG_EQUAL"), // !=
  bang_equal_equal: Symbol("BANG_EQUAL_EQUAL"), // !==
  caret: Symbol("CARET"), // ^
  colon_colon: Symbol("COLON_COLON"), // ::
  dot: Symbol("DOT"), // .
  dot_dot: Symbol("DOT_DOT"), // ..
  equal: Symbol("EQUAL"), // =
  equal_equal: Symbol("EQUAL_EQUAL"), // ==
  equal_equal_equal: Symbol("EQUAL_EQUAL_EQUAL"), // ===
  equal_tilde: Symbol("EQUAL_TILDE"), // =
  gt: Symbol("GT"), // >
  gt_equal: Symbol("GT_EQUAL"), // >=
  gt_gt_gt: Symbol("GT_GT_GT"), // >>>
  in: Symbol("IN"), // in
  left_arrow: Symbol("LEFT_ARROW"), // <-
  lt: Symbol("LT"), // <
  lt_equal: Symbol("LT_EQUAL"), // <=
  lt_gt: Symbol("LT_GT"), // <>
  lt_lt_lt: Symbol("LT_LT_LT"), // <<< 
  lt_lt_tilde: Symbol("LT_LT_TILDE"), // <<~
  lt_tilde: Symbol("LT_TILDE"), // <<
  lt_tilde_gt: Symbol("LT_TILDE_GT"), // <>
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
  slash: Symbol("SLASH"), // /
  star: Symbol("STAR"), // *
  star_star: Symbol("STAR_STAR"), // **
  tilde_gt: Symbol("TILDE_GT"), // ~>
  tilde_gt_gt: Symbol("TILDE_GT_GT"), // ~>>
  when: Symbol("WHEN") // when
})

const Reserved = Object.freeze({
  'defmodule': TokenType.defmod,
  'def': TokenType.def,
  'do': TokenType.do,
  'end': TokenType.end,
  'in': TokenType.in,
  'not': TokenType.not,
  'or': TokenType.or,
  'when': TokenType.when,
  'and': TokenType.and
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
      case '@':
        this.addToken(TokenType.at);
        break;
      case '^':
        this.addToken(TokenType.caret);
        break;
      case '/':
        this.addToken(TokenType.slash);
        break;

      case '=':
        if (this.match('=')) {
          if (this.match('=')) {
            this.addToken(TokenType.equal_equal_equal);
          } else {
            this.addToken(TokenType.equal_equal);
          }
        } else if (this.match('~')) {
          this.addToken(TokenType.equal_tilde);
        } else if (this.match('>')) {
          this.addToken(TokenType.arrow);
        } else {
          this.addToken(TokenType.equal);
        }
        break;
      case '!':
        if (this.match('=')) {
          if (this.match('=')) {
            this.addToken(TokenType.bang_equal_equal);
          } else {
            this.addToken(TokenType.bang_equal);
          }
        } else {
          this.addToken(TokenType.bang);
        }
        break;
      case '+':
        if (this.match('+')) {
          if (this.match('+')) {
            this.addToken(TokenType.plus_plus_plus);
          } else {
            this.addToken(TokenType.plus_plus);
          }
        } else {
          this.addToken(TokenType.plus);
        }
        break;
      case '*':
        if (this.match('*')) {
          if (this.match('*')) {
            this.addToken(TokenType.star_star_star);
          } else {
            this.addToken(TokenType.star_star);
          }
        } else {
          this.addToken(TokenType.star);
        }
        break;
      case '-':
        if (this.match('-')) {
          if (this.match('-')) {
            this.addToken(TokenType.minus_minus_minus);
          } else {
            this.addToken(TokenType.minus_minus);
          }
        } else {
          this.addToken(TokenType.minus);
        }
        break;
      case '.':
        if (this.match('.')) {
          this.addToken(TokenType.dot_dot);
        } else {
          this.addToken(TokenType.dot);
        }
        break;
      case '<':
        if (this.match('<')) {
          if (this.match('<')) {
            this.addToken(TokenType.lt_lt_lt);
          }
          else if (this.match('~')) {
            this.addToken(TokenType.lt_lt_tilde);
          } else {
            this.addToken(TokenType.lt_lt);
          }
        }
        else if (this.match('>')) {
          this.addToken(TokenType.lt_gt);
        }
        else if (this.match('=')) {
          this.addToken(TokenType.lt_equal);
        }
        else if (this.match('~')) {
          if (this.match('>')) {
            this.addToken(TokenType.lt_tilde_gt);
          } else {
            this.addToken(TokenType.lt_tilde);
          }
        }
        else if (this.match('-')) {
          this.addToken(TokenType.left_arrow);
        }
        else {
          this.addToken(TokenType.lt);
        }
        break;
      case '>':
        if (this.match('>')) {
          if (this.match('>')) {
            this.addToken(TokenType.gt_gt_gt);
          }
        }
        else if (this.match('=')) {
          this.addToken(TokenType.gt_equal);
        }
        else if (this.match('-')) {
          this.addToken(TokenType.gt_minus);
        }
        else {
          this.addToken(TokenType.gt);
        }
        break;
      case '|':
        if (this.match('>')) {
          this.addToken(TokenType.pipeline);
        }
        else if (this.match('|')) {
          if (this.match('|')) {
            this.addToken(TokenType.pipe_pipe_pipe);
          } else {
            this.addToken(TokenType.pipe_pipe);
          }
        } else {
          this.addToken(TokenType.pipe);
        }
        break;
      case '~':
        if (this.match('>')) {
          if (this.match('>')) {
            this.addToken(TokenType.tilde_gt_gt);
          } else {
            this.addToken(TokenType.tilde_gt);
          }
        } else {
          this.addToken(TokenType.tilde);
        }
        break;
      case '&':
        if (this.match('&')) {
          if (this.match('&')) {
            this.addToken(TokenType.amp_amp_amp);
          } else {
            this.addToken(TokenType.amp_amp);
          }
        } else {
          this.addToken(TokenType.ampersand);
        }
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
// get maps working (kw_identifier, brackets fat arrow maybe more)

// handle the rest of the ops
// maybe get quoted atoms working.
// figure out if we're going to support unicode