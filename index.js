"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Extended (perl style) regular expressions library (xregexp) is used rather
// than JavaScript's Regular Expressions to take advantage of the included
// unicode currency range item (\p{Sc})
var xreg = require('xregexp');
function currency_regex(options) {
    var currency_symbol = (typeof options.symbol === 'string') ?
        options.symbol :
        currency_symbol = "\\p{Sc}";
    // VALIDATION
    if (options.decimal.length !== 1)
        throw new Error("The decimal character must have length 1");
    if (options.separator.length === 0)
        throw new Error("The separator character must have positive length");
    if (options.decimal === options.separator)
        throw new Error("The decimal character(\"" + options.decimal + "\") must differ from the separator (\"" + options.separator + "\")");
    // BUILD THE REGEX
    var integer_part = "(([1-9]\\d{0,2}([" + options.separator + "]\\d{3})+)|0|([1-9]\\d*))", decimal_part = "([" + options.decimal + "]\\d+)", 
    // optional currency symbol followed by either (a) an interger part followed by
    // an optional decimal part, or (b)just a decimal part 
    number_part = "(" + integer_part + decimal_part + "?|" + decimal_part + ")", neg_accounting_number = currency_symbol + "?\\(" + number_part + "\\)", currecy_figure = currency_symbol + "?" + number_part, signed_currecy_figure = currency_symbol + "?[+-]" + number_part;
    return xreg("^([+-]?" + currecy_figure + "|\\(" + currecy_figure + "\\)|" + neg_accounting_number + "|" + signed_currecy_figure + ")$");
}
exports.currency_regex = currency_regex;
function currency_parser(options) {
    if (options.decimal === options.separator)
        throw new Error("The decimal character(\"" + options.decimal + "\") must differ from the separator (\"" + options.separator + "\")");
    var dec = options.decimal, xdec = xreg(options.decimal), validator = currency_regex(options), xcs = xreg((typeof options.symbol === 'string') ? options.symbol : "\\p{Sc}"), xsep = xreg(options.separator === "." ? "\\." : options.separator);
    return function (x) {
        var x_copy = x;
        if (!validator.test(x)) {
            throw new Error("Invalid value string: " + x);
        }
        // remove the separators and the currency symbol
        x = xreg.replace(x, xcs, "");
        x = xreg.replace(x, xsep, "", "all");
        // replace the decimal with '.', if needed
        if (dec !== ".") {
            x = xreg.replace(x, xdec, ".");
        }
        // remove a leading plus sign
        x = xreg.replace(x, "^+", "");
        // handle accounting negation "(1234.56)" > "-1234.56"
        if (/^\(.+\)$/.test(x)) {
            x = "-" + x.slice(1, x.length - 1);
        }
        var out = Number(x);
        if (isNaN(out)) {
            throw new Error("String \"" + x_copy + "\" could not be coerced to a number using options " + JSON.stringify(options));
        }
        return out;
    };
}
exports.currency_parser = currency_parser;
// ------------------------------
// pre-packaged validators
// ------------------------------
exports.english_currency_regex = currency_regex({ decimal: '.', separator: ',' });
exports.euro_currency_regex = currency_regex({ decimal: ',', separator: '.' });
//-- export function is_english_currency(x:string):boolean{ return english_currency_regex.test(x); }
//-- export function is_euro_currency(x:string):boolean{ return euro_currency_regex.test(x); }
//-- 
//-- export function is_currency_string(x:string,options:currency_regex_options):boolean{
//--   	return currency_regex(options).test(x);
//-- }
// ------------------------------
// pre-packaged parsers
// ------------------------------
exports.english_currency_parser = currency_parser({ decimal: '.', separator: ',' });
exports.euro_currency_parser = currency_parser({ decimal: ',', separator: '.' });
function english_currency_value(x) { return exports.english_currency_parser(x); }
exports.english_currency_value = english_currency_value;
function euro_currency_value(x) { return exports.euro_currency_parser(x); }
exports.euro_currency_value = euro_currency_value;
