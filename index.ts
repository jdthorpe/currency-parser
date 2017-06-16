// Extended (perl style) regular expressions library (xregexp) is used rather
// than JavaScript's Regular Expressions to take advantage of the included
// unicode currency range item (\p{Sc})
var xreg = require('xregexp');

export interface currency_regex_options {
    decimal:string;
    separator:string;
    symbol?:string;
}

export function currency_regex(options:currency_regex_options){
    var currency_symbol:string = (typeof options.symbol === 'string')?
        options.symbol:
        currency_symbol ="\\p{Sc}";
	// VALIDATION
    if(options.decimal.length !== 1)
        throw new Error("The decimal character must have length 1")
    if(options.separator.length === 0)
        throw new Error("The separator character must have positive length")
    if(options.decimal === options.separator)
        throw new Error(`The decimal character("${options.decimal}") must differ from the separator ("${options.separator}")`)
	// BUILD THE REGEX
    var integer_part = `(([1-9]\\d{0,2}([${options.separator}]\\d{3})+)|0|([1-9]\\d*))`,
        decimal_part = `([${options.decimal}]\\d+)`,
        // optional currency symbol followed by either (a) an interger part followed by
        // an optional decimal part, or (b)just a decimal part 
        currecy_figure = `${currency_symbol}?(${integer_part}${decimal_part}?|${decimal_part})`;
    return xreg(`^([+-]?${currecy_figure}|\\(${currecy_figure}\\))$` );
}

export function currency_parser(options:currency_regex_options):{(x:string):number}{
    if(options.decimal === options.separator)
        throw new Error(`The decimal character("${options.decimal}") must differ from the separator ("${options.separator}")`)
	var dec = options.decimal,
	    xdec = xreg(options.decimal),
	    regex = currency_regex(options),
	// currency string extended regex
	    xcs = xreg((typeof options.symbol === 'string') ?  options.symbol : "\\p{Sc}");
	// separator extended regex
	const xsep = xreg(options.separator === "." ? "\\." : options.separator);
	return  function(x) {
		var x_copy = x;
		if(!regex.test(x)){
			throw new Error("Invalid value string: " + x);
		}
		x = xreg.replace(x ,xcs,"");
		x = xreg.replace(x ,xsep,"","all");
		if(dec !== "."){
			x = xreg.replace(x ,xdec,".");
		}
		// remove a leading plus sign
		x = xreg.replace(x ,"^+","");
		// handle accounting negation "(1234.56)" > "-1234.56"
		if(/^\(.+\)$/.test(x)){
			x = "-"+x.slice(1,x.length-1);
		}
		var out = Number(x)
		if(isNaN(out)){
			throw new Error(`String "${x_copy}" could not be coerced to a number using options ${JSON.stringify(options)}`);
		}
		return out;
	};
}

// ------------------------------
// pre-packaged validators
// ------------------------------
const english_currency_regex:RegExp =  currency_regex({decimal:'.',separator:','});
const euro_currency_regex:RegExp =  currency_regex({decimal:',',separator:'.'});

export function is_english_currency(x:string):boolean{ return english_currency_regex.test(x); }
export function is_euro_currency(x:string):boolean{ return euro_currency_regex.test(x); }

export function is_currency_string(x:string,options:currency_regex_options):boolean{
  	return currency_regex(options).test(x);
}

// ------------------------------
// pre-packaged parsers
// ------------------------------
export const english_currency_parser =  currency_parser({decimal:'.',separator:','});
export const euro_currency_parser =  currency_parser({decimal:',',separator:'.'});

export function english_currency_value(x:string):number{ return english_currency_parser(x); }
export function euro_currency_value(x:string):number{ return euro_currency_parser(x); }

// ------------------------------
// AJV.keywords functionality
// ------------------------------

export function add_ajv_Keywords(ajv:any):void{

    if(!(ajv instanceof require('ajv'))){
        throw new Error('add_ajv_Keywords must be called with an instance of Ajv')
    }

    ajv.addKeyword('currency-en-value', { 
        "modifying": true,
        "type": 'string', 
        "compile": function () {
            console.log("compiling currency-en-value schema: ")
            return (data:string,path:string[],parent:any,key:string) => { 
                try{
                    parent[key] = english_currency_parser(data);
                    return true;
                }catch(err){
                    return false;
                }
            };
        }
    });

    ajv.addKeyword('currency-eu-value', { 
        "modifying": true,
        "type": 'string', 
        "compile": function () {
            console.log("compiling currency-eu-value schema: ")
            return (data:string,path:string[],parent:any,key:string) => { 
                try{
                    parent[key] = euro_currency_parser(data);
                    return true;
                }catch(err){
                    return false;
                }
            };
        }
    });

    ajv.addKeyword('currency-value', { 
        "modifying": true,
        "type": 'string', 
        "compile": function (schema:currency_regex_options) {
            console.log("compiling currency-value schema: ", schema)
            const parser = currency_parser(schema);
            return (data:string,path:string[],parent:any,key:string) => {  
                try{
                    parent[key] = parser(data);
                    return true;
                }catch(err){
                    return false;
                }
            };
        },
        "metaSchema":{
            "type":"object",
            "properties":{
                "decimal":{
                    "type":'string',
                    "minLength":1,
                },
                "separator":{
                    "type":'string',
                    "minLength":1,
                },
                "symbol":{
                    "type":'string',
                    "minLength":1,
                },
            },
            "required":[ "decimal", "separator", ],
        },
    });

    // --------------------------------------------------
    // string-to-number conversions
    // --------------------------------------------------
    ajv.addKeyword('currency-en', { 
        "type": 'string', 
        "compile": function () {
            console.log("compiling currency-en")
            return (data:string) => { return english_currency_regex.test(data)};
        }
    });

    ajv.addKeyword('currency-eu', { 
        "type": 'string', 
        "compile": function () {
            console.log("compiling currency-eu")
            return (data:string) => { return euro_currency_regex.test(data)};
        }
    });

    ajv.addKeyword('currency', { 
        "type": 'string', 
        "compile": function (schema:currency_regex_options) {
            console.log("compiling currency-value schema: ",schema)
            const regex = currency_regex(schema);
            return (data:string) => { return regex.test(data)};
        },
        "metaSchema":{
            "type":"object",
            "properties":{
                "decimal":{
                    "type":'string',
                    "minLength":1,
                },
                "separator":{
                    "type":'string',
                    "minLength":1,
                },
                "symbol":{
                    "type":'string',
                    "minLength":1,
                },
            },
            required:[ "decimal", "separator", ],
        },
    });
}
