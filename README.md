## Yet Another Currency Parser Generator

A deliberately strict generator which generates regular expressions
for matching and parsers for extracting the numeric values from currency
strings.

#### Matching: 

Matching English and European currency strings can be matched with the
convenience functions like so:

```JavaScript
var CP = require('currency-parser')

CP.english_currency_regex.test("$1,234,567.89")     // true
CP.english_currency_regex.test("$-1,234,567.89")    // true
CP.euro_currency_regex.test("\u20ac1.234.567,89")   // true
CP.euro_currency_regex.test("\u20ac(1.234.567,89)") // true
CP.euro_currency_regex.test("(\u00a51.234.567,89)") // true

CP.english_currency_regex.test("$12,34,567.89")    // false
CP.english_currency_regex.test("$-1,234,56789")    // false
CP.euro_currency_regex.test("\u20ac1.2345.67,89")  // false
CP.euro_currency_regex.test("\u20ac(1.234567,89)") // false
CP.euro_currency_regex.test("(\u00a51234.567,89)") // false
```

The extended (perl style) regular expressions library
[xregexp](http://xregexp.com/) is used rather than JavaScript's Regular
Expressions to take advantage of the included [unicode currency
range](https://stackoverflow.com/a/4180379/1519199) item (\p{Sc}), and by
default, the any of the Unicode currency symbols may appear at the start of
the number string. 

The English and European style currency regular expressions and parsers
refer to the use of decimals and separators, not the currency symbols.
Custom expressions can be constructed for arbitrary decimal, separator, and
(optionally) currency characters: 


```JavaScript
var english_currency_regex = CP.currency_regex({decimal:".",separator:","}),
    euro_currency_regex = CP.currency_regex({decimal:",",separator:"."}),
    wierd_currency_regex = CP.currency_regex({decimal:"v",separator:"_"}),

english_currency_regex.test("$-1,234,567.89")     // true
euro_currency_regex.test("\u20ac(1.234.567,89)")  // true
wierd_currency_regex.test("\u20ac(1_234_567v89)") // true

var yen_only_currency_regex = CP.currency_regex({decimal:".",separator:",",symbol:"\u00a5"});
yen_only_currency_regex.test("\u20a5(1,234,567.89)") // true
yen_only_currency_regex.test("$(1,234,567.89)")      // false
yen_only_currency_regex.test("\u20ac(1,234,567.89)") // false
```

### Parsing: 

The numeric value of the expression can be extracted via the built in
convenience parsers, like so:

```JavaScript
CP.english_currency_parser("$1,234,567.89")     // 1234567.89
CP.english_currency_parser("$-1,234,567.89")    // -1234567.89
CP.euro_currency_parser("\u20ac1.234.567,89")   // 1234567.89
CP.euro_currency_parser("\u20ac(1.234.567,89)") // -1234567.89
CP.euro_currency_parser("(\u00a51.234.567,89)") // -1234567.89

var wierd_currency_parser = CP.currency_parser({decimal:"v",separator:"_"});
wierd_currency_parser("$1_234_567v89")        // 1234567.89
wierd_currency_parser("$-1_234_567v89")       // -1234567.89
wierd_currency_parser("\u20ac1_234_567v89")   // 1234567.89
wierd_currency_parser("\u20ac(1_234_567v89)") // -1234567.89
wierd_currency_parser("(\u00a51_234_567v89)") // -1234567.89

var yen_only_currency_regex = CP.currency_regex({decimal:".",separator:",",symbol:"\u00a5"});
yen_only_currency_regex.test("\u20a5(1,234,567.89)") // -1234567.89
```
