"use strict";
// <reference path="../typings/mocha/mocha.d.ts" />
// <reference path="../typings/chai/chai.d.ts" />
Object.defineProperty(exports, "__esModule", { value: true });
var chai = require('chai'), expect = chai.expect;
chai.should();
var english_options = { separator: ",", decimal: "." };
var european_options = { separator: ".", decimal: "," };
// IMPORTS
var index_1 = require("../index");
// A CONVENIENCE FUNCTION
function get_currency_value(x, options) {
    return index_1.currency_parser(options)(x);
}
var strange_options;
var strange_notation_parameters = [
    { separator: "`", decimal: "," },
    { separator: "'", decimal: "," },
    { separator: "_", decimal: "," },
    { separator: "`", decimal: "." },
    { separator: "'", decimal: "." },
    { separator: "_", decimal: "." },
];
var english_currency_regex, european_currency_regex, strange_notations;
describe("currency_regex", function () {
    it("should successfully build a variety of currency expressions", function () {
        english_currency_regex = index_1.currency_regex(english_options);
        european_currency_regex = index_1.currency_regex(european_options);
        strange_notations = strange_notation_parameters.map(index_1.currency_regex);
    });
});
english_currency_regex = index_1.currency_regex(english_options);
european_currency_regex = index_1.currency_regex(european_options);
strange_notations = strange_notation_parameters.map(index_1.currency_regex);
var symbols = {
    none: "",
    dollar: "$",
    yen: "\u00a5",
    euro: "\u20ac",
    pound: "\u00a3",
};
var symbol_names = Object.keys(symbols);
var numeric_values = [
    0,
    1,
    33,
    555,
    4656,
    4656,
    99785,
    125944,
    7994169,
    7994169,
    0.00,
    1.0,
    33.78795,
    555.12,
    4656.489,
    99785.01,
    125944.100,
];
var indices = [];
for (var i = 0; i < numeric_values.length; i++) {
    indices[i] = i;
}
//-- ====================
//-- JAVASCRIPT LAND
//-- ====================
//-- x = require("./currency-parser")
//-- var numeric_values = [
//--         0,
//--         1,
//--         33,
//--         555,
//--         4656,
//--         4656,
//--         99785,
//--         125944,
//--         7994169,
//--         7994169,
//--         0.00,
//--         1.0,
//--         33.78795,
//--         555.12,
//--         4656.489,
//--         99785.01,
//--         125944.100,]
//-- var indices=[];
//-- for(var i=0;i<numeric_values.length;i++){indices[i] = i}
//-- var symbols = {
//--         none:"",
//--         dollar:"$",
//--         yen:"\u00a5",
//--         euro:"\u20ac",
//--         pound:"\u00a3",
//--     };
//-- var symbol_names = Object.keys(symbols);
//-- k = 1
//-- 
//-- var s = symbols[symbol_names[k]];
//--         var good_english_numbers = [
//--                 "0",
//--                 "1",
//--                 "33",
//--                 "555",
//--                 "4,656",
//--                 "4656",
//--                 "99,785",
//--                 "125,944",
//--                 "7,994,169",
//--                 "7994169",
//--                 "0.00",
//--                 "1.0",
//--                 "33.78795",
//--                 "555.12",
//--                 "4,656.489",
//--                 "99,785.01",
//--                 "125,944.100",]
//-- var english_options = {separator:",",decimal:"."}
//-- 
//-- for(var i=0;i<numeric_values.length;i++){
//--    console.log( x.get_currency_value(      s + good_english_numbers[i]      ,english_options))
//-- }
//-- 
//-- indices.map((i)=> (Number(x.get_currency_value(      s + good_english_numbers[i]      ,english_options)) == numeric_values[i]) )
//-- indices.map((i)=> (Number(x.get_currency_value('+' + s + good_english_numbers[i]      ,english_options)) == numeric_values[i]) )
//-- indices.map((i)=> (Number(x.get_currency_value('-' + s + good_english_numbers[i]      ,english_options)) == -numeric_values[i]) )
//-- indices.map((i)=> (Number(x.get_currency_value('(' + s + good_english_numbers[i] + ")",english_options)) == -numeric_values[i]) )
//-- 
//-- ====================
describe("english_currency_regex", function () {
    var good_english_numbers = [
        "0",
        "1",
        "33",
        "555",
        "4,656",
        "4656",
        "99,785",
        "125,944",
        "7,994,169",
        "7994169",
        "0.00",
        "1.0",
        "33.78795",
        "555.12",
        "4,656.489",
        "99,785.01",
        "125,944.100",
    ];
    it("should correctly match a vareiety of strings", function () {
        for (var k = 0; k < symbol_names.length; k++) {
            var s = symbols[symbol_names[k]];
            expect(good_english_numbers.every(function (x) { return english_currency_regex.test(s + x); })).to.be.true;
            expect(good_english_numbers.every(function (x) { return english_currency_regex.test(s + '+' + x); })).to.be.true;
            expect(good_english_numbers.every(function (x) { return english_currency_regex.test('+' + s + x); })).to.be.true;
            expect(good_english_numbers.every(function (x) { return english_currency_regex.test(s + '-' + x); })).to.be.true;
            expect(good_english_numbers.every(function (x) { return english_currency_regex.test('-' + s + x); })).to.be.true;
            expect(good_english_numbers.every(function (x) { return english_currency_regex.test(s + '(' + x + ")"); })).to.be.true;
            expect(good_english_numbers.every(function (x) { return english_currency_regex.test('(' + s + x + ")"); })).to.be.true;
        }
    });
    it("should correctly extract a variety of values", function () {
        for (var k = 0; k < symbol_names.length; k++) {
            var s = symbols[symbol_names[k]];
            expect(indices.map(function (i) { return (Number(get_currency_value(s + good_english_numbers[i], english_options)) == numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
            expect(indices.map(function (i) { return (Number(get_currency_value('+' + s + good_english_numbers[i], english_options)) == numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
            expect(indices.map(function (i) { return (Number(get_currency_value(s + '+' + good_english_numbers[i], english_options)) == numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
            expect(indices.map(function (i) { return (Number(get_currency_value('-' + s + good_english_numbers[i], english_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
            expect(indices.map(function (i) { return (Number(get_currency_value(s + '-' + good_english_numbers[i], english_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
            expect(indices.map(function (i) { return (Number(get_currency_value('(' + s + good_english_numbers[i] + ")", english_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
            expect(indices.map(function (i) { return (Number(get_currency_value(s + '(' + good_english_numbers[i] + ")", english_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
        }
    });
    it("should correctly reject a vareiety of values", function () {
        var bad_english_numbers = [
            "00",
            "01",
            "3,3",
            "5.",
            "3d",
            "555,",
            ",656",
            "99,78,5",
            "1,25,944",
            "--7,994,169",
            "0.0,0",
            "33.787,95",
            "4.656.489",
            "99.785,01",
            "1-125,944.1",
            "-7,994E169",
        ];
        for (var k = 0; k < symbol_names.length; k++) {
            var s = symbols[symbol_names[k]];
            expect(bad_english_numbers.every(function (x) { return !english_currency_regex.test(s + x); })).to.be.true;
            expect(bad_english_numbers.every(function (x) { return !english_currency_regex.test(s + '+' + x); })).to.be.true;
            expect(bad_english_numbers.every(function (x) { return !english_currency_regex.test('+' + s + x); })).to.be.true;
            expect(bad_english_numbers.every(function (x) { return !english_currency_regex.test(s + '-' + x); })).to.be.true;
            expect(bad_english_numbers.every(function (x) { return !english_currency_regex.test('-' + s + x); })).to.be.true;
            expect(bad_english_numbers.every(function (x) { return !english_currency_regex.test(s + '(' + x + ")"); })).to.be.true;
            expect(bad_english_numbers.every(function (x) { return !english_currency_regex.test('(' + s + x + ")"); })).to.be.true;
        }
    });
});
var another_currency_pattern, separator, decimal;
describe("Other currency patterns", function () {
    for (var i = 0; i < strange_notation_parameters.length; i++) {
        var strange_options = strange_notation_parameters[i];
        another_currency_pattern = strange_notations[i];
        separator = strange_options.separator;
        decimal = strange_options.decimal;
        var good_numbers = [
            "0",
            "1",
            "33",
            "555",
            "4" + separator + "656",
            "4656",
            "99" + separator + "785",
            "125" + separator + "944",
            "7" + separator + "994" + separator + "169",
            "7994169",
            "0" + decimal + "00",
            "1" + decimal + "0",
            "33" + decimal + "78795",
            "555" + decimal + "12",
            "4" + separator + "656" + decimal + "489",
            "99" + separator + "785" + decimal + "01",
            "125" + separator + "944" + decimal + "100",
        ];
        it("should correctly match a vareiety of strings", function () {
            for (var k = 0; k < symbol_names.length; k++) {
                var s = symbols[symbol_names[k]];
                expect(good_numbers.every(function (x) { return another_currency_pattern.test(s + x); })).to.be.true;
                expect(good_numbers.every(function (x) { return another_currency_pattern.test(s + '+' + x); })).to.be.true;
                expect(good_numbers.every(function (x) { return another_currency_pattern.test('+' + s + x); })).to.be.true;
                expect(good_numbers.every(function (x) { return another_currency_pattern.test(s + '-' + x); })).to.be.true;
                expect(good_numbers.every(function (x) { return another_currency_pattern.test('-' + s + x); })).to.be.true;
                expect(good_numbers.every(function (x) { return another_currency_pattern.test(s + '(' + x + ")"); })).to.be.true;
                expect(good_numbers.every(function (x) { return another_currency_pattern.test('(' + s + x + ")"); })).to.be.true;
            }
        });
        it("should correctly extract a variety of values", function () {
            for (var k = 0; k < symbol_names.length; k++) {
                var s = symbols[symbol_names[k]];
                expect(indices.map(function (i) { return (Number(get_currency_value(s + good_numbers[i], strange_options)) == numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
                expect(indices.map(function (i) { return (Number(get_currency_value(s + '+' + good_numbers[i], strange_options)) == numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
                expect(indices.map(function (i) { return (Number(get_currency_value('+' + s + good_numbers[i], strange_options)) == numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
                expect(indices.map(function (i) { return (Number(get_currency_value(s + '-' + good_numbers[i], strange_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
                expect(indices.map(function (i) { return (Number(get_currency_value('-' + s + good_numbers[i], strange_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
                expect(indices.map(function (i) { return (Number(get_currency_value(s + '(' + good_numbers[i] + ")", strange_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
                expect(indices.map(function (i) { return (Number(get_currency_value('(' + s + good_numbers[i] + ")", strange_options)) == -numeric_values[i]); }).every(function (x) { return x; })).to.be.true;
            }
        });
        it("should correctly reject a vareiety of invalid strings", function () {
            var bad_numbers = [
                "00",
                "01",
                "3" + separator + "3",
                "5" + decimal,
                "3d",
                "555" + separator,
                separator + "656",
                "99" + separator + "78" + separator + "5",
                "1" + separator + "25" + separator + "944",
                "--7" + separator + "994" + separator + "169",
                "0" + decimal + "0" + separator + "0",
                "33" + decimal + "787" + separator + "95",
                "4" + decimal + "656" + decimal + "489",
                "99" + decimal + "785" + separator + "01",
                "1-125" + separator + "944" + decimal + "1",
                "-7" + separator + "994E169",
            ];
            for (var k = 0; k < symbol_names.length; k++) {
                var s = symbols[symbol_names[k]];
                expect(bad_numbers.every(function (x) { return !another_currency_pattern.test(s + x); })).to.be.true;
                expect(bad_numbers.every(function (x) { return !another_currency_pattern.test(s + '+' + x); })).to.be.true;
                expect(bad_numbers.every(function (x) { return !another_currency_pattern.test('+' + s + x); })).to.be.true;
                expect(bad_numbers.every(function (x) { return !another_currency_pattern.test(s + '-' + x); })).to.be.true;
                expect(bad_numbers.every(function (x) { return !another_currency_pattern.test('-' + s + x); })).to.be.true;
                expect(bad_numbers.every(function (x) { return !another_currency_pattern.test(s + '(' + x + ")"); })).to.be.true;
                expect(bad_numbers.every(function (x) { return !another_currency_pattern.test('(' + s + x + ")"); })).to.be.true;
            }
        });
    }
});
