"use strict";
//-- zz = require("./currency-strings")
//-- zz.english_currency_parser("$12,345.55")
//-- zz.english_currency_regex.test("$12,345.55")
//-- zz.english_currency_regex.test("hello")
//-- var Ajv = require('ajv');
//-- var ajv = new Ajv()
//-- zz.add_ajv_Keywords(ajv)
//-- validate = ajv.compile({
//--     properties:{
//--             foo:{"currency":{decimal:".",separator:","}}
//--         }
//--     })
//-- validate({foo:"asdf"})
//-- validate = ajv.compile({
//--     properties:{
//--             foo:{"currency-en":true}
//--         }
//--     })
//-- validate({foo:"asdf"})
//-- validate({foo:"$313121"})
//-- validate({foo:"$3,131.21"})
//-- validate({foo:"$3,1,31.21"})
//-- modify = ajv.compile({
//--     properties:{
//--             foo:{"currency-value":{decimal:".",separator:","}}
//--         }
//--     })
//-- good = {foo:"$1432"}
//-- modify(good )
//-- good
//-- modify = ajv.compile({
//--     properties:{
//--             foo:{"currency-value":{decimal:".",separator:","}}
//--         }
//--     })
//-- good = {foo:"$1,432.432"}
//-- modify(good )
//-- good
//-- modify = ajv.compile({
//--     properties:{
//--             foo:{"currency-en-value":{decimal:".",separator:","}}
//--         }
//--     })
//-- good = {foo:"$1,432.432"}
//-- modify(good )
//-- good
//-- modify = ajv.compile({
//--     properties:{
//--             foo:{"currency-en-value":{decimal:".",separator:","}}
//--         }
//--     })
//-- bad = {foo:"$1,,432.432"}
//-- modify(bad )
//-- bad
//-- modify({foo:"asdf"})
//-- modify = ajv.compile({
//--     type: "object",
//--     properites:{
//--         "name":{
//--             type:"string",
//--         },
//--         "balance": {
//--             "currency-value":{decimal:".",separator:","},
//--         }
//--     }
//-- })
//-- good = {"name":"bob",balance:"$12,345.55"}
//-- bad = {"name":"bob",balance:"hello"}
//-- validate(good)
//-- validate(bad)
//-- modify(good)
//-- modify(bad)
//-- good
//-- bad
//-- validate({"name":"bob",balance:"'hi'"})
