/* Control Sequence Initiator */
const csi = '\x1b['

/**
 * @exports ansi-escape-sequences
 * @typicalname ansi
 * @example
 * import ansi from 'ansi-escape-sequences'
 */
const ansi = {}

/**
 * Various formatting styles (aka Select Graphic Rendition codes).
 * @enum {string}
 * @example
 * console.log(ansi.style.red + 'this is red' + ansi.style.reset)
 */
ansi.style = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',
  fontDefault: '\x1b[10m',
  font2: '\x1b[11m',
  font3: '\x1b[12m',
  font4: '\x1b[13m',
  font5: '\x1b[14m',
  font6: '\x1b[15m',
  imageNegative: '\x1b[7m',
  imagePositive: '\x1b[27m',
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  grey: '\x1b[90m',
  gray: '\x1b[90m',
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  'bgBlack': '\x1b[40m',
  'bgRed': '\x1b[41m',
  'bgGreen': '\x1b[42m',
  'bgYellow': '\x1b[43m',
  'bgBlue': '\x1b[44m',
  'bgMagenta': '\x1b[45m',
  'bgCyan': '\x1b[46m',
  'bgWhite': '\x1b[47m',
  'bgGrey': '\x1b[100m',
  'bgGray': '\x1b[100m',
  'bgBrightRed': '\x1b[101m',
  'bgBrightGreen': '\x1b[102m',
  'bgBrightYellow': '\x1b[103m',
  'bgBrightBlue': '\x1b[104m',
  'bgBrightMagenta': '\x1b[105m',
  'bgBrightCyan': '\x1b[106m',
  'bgBrightWhite': '\x1b[107m'
}

ansi.style.text = function(text, colorSeq) {
	return `${colorSeq}${text}${ansi.style.reset}`;
}
/**
 * Returns a 24-bit "true colour" foreground colour escape sequence.
 * @param {number} r - Red value.
 * @param {number} g - Green value.
 * @param {number} b - Blue value.
 * @returns {string}
 * @example
 * > ansi.rgb(120, 0, 120)
 * '\u001b[38;2;120;0;120m'
 */
ansi.rgb = function (r, g, b) {
  return `\x1b[38;2;${r};${g};${b}m`
}

/**
 * Returns a 24-bit "true colour" background colour escape sequence.
 * @param {number} r - Red value.
 * @param {number} g - Green value.
 * @param {number} b - Blue value.
 * @returns {string}
 * @example
 * > ansi.bgRgb(120, 0, 120)
 * '\u001b[48;2;120;0;120m'
 */
ansi.bgRgb = function (r, g, b) {
  return `\x1b[48;2;${r};${g};${b}m`
}


/**
 * cursor-related sequences
 */
ansi.cursor = {
  /**
   * Moves the cursor `lines` cells up.
   * If the cursor is already at the edge of the screen, this has no effect
   * @param [lines=1] {number}
   * @return {string}
   */
  up: function (lines = 1) { return `${csi}${lines}A` },

  /**
   * Moves the cursor `lines` cells down.
   * If the cursor is already at the edge of the screen, this has no effect
   * @param [lines=1] {number}
   * @return {string}
   */
  down: function (lines) { return `${csi}${lines}B` },

  /**
   * Moves the cursor `lines` cells forward.
   * If the cursor is already at the edge of the screen, this has no effect
   * @param [lines=1] {number}
   * @return {string}
   */
  forward: function (lines) { return `${csi}${lines}C` },

  /**
   * Moves the cursor `lines` cells back.
   * If the cursor is already at the edge of the screen, this has no effect
   * @param [lines=1] {number}
   * @return {string}
   */
  back: function (lines) { return `${csi}${lines}D` },

  /**
   * Moves cursor to beginning of the line n lines down.
   * @param [lines=1] {number}
   * @return {string}
   */
  nextLine: function (lines) { return `${csi}${lines}E` },

  /**
   * Moves cursor to beginning of the line n lines up.
   * @param [lines=1] {number}
   * @return {string}
   */
  previousLine: function (lines) { return `${csi}${lines}F` },

  /**
   * Moves the cursor to column n.
   * @param n {number} - column number
   * @return {string}
   */
  horizontalAbsolute: function (n) { return csi + n + 'G' },
  toCol: function (n) { return csi + n + 'G' },

  /**
   * Moves the cursor to row n, column m. The values are 1-based, and default to 1 (top left corner) if omitted.
   * @param n {number} - row number
   * @param m {number} - column number
   * @return {string}
   */
  position: function (n, m) { return csi + (n || 1) + ';' + (m || 1) + 'H' },
  pos: function (n, m) { return csi + (n || 1) + ';' + (m || 1) + 'H' },

  /**
   * Hides the cursor
   */
  hide: `${csi}?25l`,

  /**
   * Shows the cursor
   */
  show: `${csi}?25h`,
}

/**
 * erase sequences
 */
ansi.erase = {
  /**
   * Clears part of the screen.
   * If n is 0 (or missing), clear from cursor to end of screen.
   * If n is 1, clear from cursor to beginning of the screen.
   * If n is 2, clear entire screen.
   * @param n {number}
   * @return {string}
   */
  display: function (n) { return csi + (n || 0) + 'J' },
  cls: `${csi}2J`,

  /**
   * Erases part of the line.
   * If n is zero (or missing), clear from cursor to the end of the line.
   * If n is one, clear from cursor to beginning of the line.
   * If n is two, clear entire line. Cursor position does not change.
   * @param n {number}
   * @return {string}
   */
  inLine: function (n) { return csi + (n || 0) + 'K' }
}

module.exports = ansi;
