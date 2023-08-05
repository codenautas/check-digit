import { checkdigit, checkdigitCompute, CheckDigitParameters, checkQualityOfCodeList } from "../lib/check-digit-compute";

import * as assert from "assert";
import { IpcSocketConnectOpts } from "net";

describe("ISBN10", function(){
    const ISBN10: CheckDigitParameters<number> = {
        cast: Number, 
        multipliers: [9,8,7,6,5,4,3,2,1], 
        divider: 11,
        overflowMap: {'10':'X'}
    };
// console.log(checkdigit(isbnBook2, BigInt, [9n,8n,7n,6n,5n,4n,3n,2n,1n], 11n), "= 4?");    it("isbn", function(){
    it("compute isbn check digit", function(){
        var isbnBook1_whitout_chd = "007140638" // 7
        var result = checkdigitCompute(isbnBook1_whitout_chd, ISBN10);
        assert.equal(result, 7);
    })
    it("isbn check digit", function(){
        var isbnBook2 = "0465050654"
        var result = checkdigit(isbnBook2, ISBN10);
        assert.equal(result, true);
    })
    it("isbn check digit X", function(){
        var isbnBookX_wchd = "086243680"
        var digit = checkdigitCompute(isbnBookX_wchd, ISBN10);
        assert.equal(digit, 'X');
        var isbnBookX = "0-86243-680-X"
        var result = checkdigit(isbnBookX, ISBN10);
        assert.equal(result, true);
    })
})

describe("CUIT", function(){
    const CUIT: CheckDigitParameters<number> = {
        cast: Number,
        // multipliers: [5,4,3,2,7,6,5,4,3,2],
        multipliers: [2,3,4,5,6,7,2,3,4,5],
        turn: true,
        divider: 11,
    }
    it("detect failed CUIT", function(){
        var cuit = '30-50001091-1';
        var result = checkdigit(cuit, CUIT);
        assert.equal(result,false);
    })
    it("detect valid CUIT", function(){
        var cuit = '30-50001091-2';
        var result = checkdigit(cuit, CUIT);
        assert(result);
    })
})

describe("EAN13", function(){
    const EAN13: CheckDigitParameters<number> = {
        cast: Number,
        multipliers: [3,1,3,1,3,1,3,1,3,1,3,1],
        turn: true,
        divider: 10,
    }
    it("compute last digit", function(){
        var ean_wchd = "123456789041"; //8
        var result = checkdigitCompute(ean_wchd, EAN13);
        assert.equal(result, 8)
    });
    it("checks EAN13", function(){
        var ean = "4-003994-155486";
        var result = checkdigit(ean, EAN13);
        assert(result)
    })
})

describe("bigint", function(){
    const CONF: CheckDigitParameters<bigint> = {
        cast: BigInt, 
        multipliers: [1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n], 
        divider: 11n,
        shift: 1n
    }
    it("all ceros", function(){
        var code = "000000000000000000"
        var result = checkdigitCompute(code, CONF)
        assert.equal(result, 1n);
    })
    it("all ones", function(){
        var code = "111111111111111111"
        var result = checkdigitCompute(code, CONF)
        assert.equal(result, 1n);
    })
    it("check digit overflow valid", function(){
        var code = "123456789012345679"
        var result = checkdigitCompute(code, {
            cast: BigInt, 
            multipliers: [1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n, 1n, 3n, 7n], 
            divider: 11n,
            shift: 1n, 
            overflowMap:{}
        })
        assert.equal(result, 10n);
    })
    it("check digit overflow as null", function(){
        var code = "123456789012345679"
        var result = checkdigitCompute(code, CONF)
        assert.equal(result, null);
    })
    it("last one", function(){
        var code = "000000000000000001"
        var result = checkdigitCompute(code, CONF)
        assert.equal(result, 2n);
    })
    it("bigint 1", function(){
        var code = 1n
        var result = checkdigitCompute(code, CONF)
        assert.equal(result, 2n);
    })
    it("bigint all ones", function(){
        var code = 111111111111111111n
        var result = checkdigitCompute(code, CONF)
        assert.equal(result, 1n);
    })
})

describe("cuality measure", function(){
    var shortList = [
        "12340089",
        "23450089",
        "12350089", // simle error
        "23540089", // consecutive swap
        "32450089", // consecutive swap
        "52430089", // any swap
        "92340081", // any swap of extremmes
        "50023489", // triple consecutive swap
        "08950234", // triple swap
        "12340067", // two simple errors
    ];
    it("check one change", function(){
        var result = checkQualityOfCodeList(shortList);
        assert.equal(result.oneChanges, 2)
    })
    it("check consecutive swap", function(){
        var result = checkQualityOfCodeList(shortList);
        assert.equal(result.consecutiveSwap[1], 4)
    })
    it("check any simple swap", function(){
        var result = checkQualityOfCodeList(shortList);
        assert.equal(result.anySwap[1], 8)
    })
    it("check shortList", function(){
        var result = checkQualityOfCodeList(shortList);
        assert.deepEqual(result, {
            anySwap: {
              "1": 8,
              "2": 0,
              "3": 4
            },
            consecutiveSwap: {
              "1": 4,
              "2": 0,
              "3": 2
            },
            oneChanges: 2,
            twoChanges: 12
        })
    })
    it("check a long list with 1 check digit", function(){
        const CONF:CheckDigitParameters<number> = {
            cast: Number, 
            multipliers: [2,3,5,7],
            divider: 11,
            turn: true
        }
        var cant = 0;
        var i = 1000;
        var list = [];
        while(i<=9999){
            var d1 = checkdigitCompute(i, CONF);
            if(d1 != null){
                var code = i + "" + d1;
                list.push(code);
                cant++;
            }
            i++
        }
        var result = checkQualityOfCodeList(list, 100);
        assert.deepEqual(result,{
            anySwap: {
                "1": 0,
                "2": 7.042253521126761,
                "3": NaN
              },
              consecutiveSwap: {
                "1": 0,
                "2": 7.298168598669319,
                "3": NaN
              },
              oneChanges: 0,
              twoChanges: 9.121885704800277
        })
    })
    it("check a long list with 2 check digit", function(){
        const CONF1:CheckDigitParameters<number> = {
            cast: Number, 
            multipliers: [2,3,4,7],
            divider: 11,
            shift: 3
        }
        const CONF2:CheckDigitParameters<number> = {
            cast: Number, 
            multipliers: [3,4,5,9],
            divider: 11
        }
        var cant = 0;
        var i = 1000;
        var list = [];
        while(i<=9999){
            var d1 = checkdigitCompute(i, CONF1);
            var d2 = checkdigitCompute(i, CONF2);
            if(d1 != null && d2 != null){
                var code = i + "" + d1 + d2;
                list.push(code);
                cant++;
            }
            i++
        }
        var result = checkQualityOfCodeList(list, 100);
        assert.deepEqual(result,{
            anySwap: {
                "1": 0,
                "2": 1.3579883665663264,
                "3": 0.5921938088829072
              },
              consecutiveSwap: {
                "1": 0,
                "2": 2.7161611588954275,
                "3": 0.5921938088829072
              },
              oneChanges: 0,
              twoChanges: 0
        })
    })
    it("check a long list without check digit", function(){
        var i = 1000;
        var list = [];
        while(i<=9999){
            var code = i + "";
            list.push(code);
            i++
        }
        var result = checkQualityOfCodeList(list, 100);
        assert.deepEqual(result,{
            anySwap: {
                "1": 94.44444444444444,
                '2': 89.8989898989899,
                "3": NaN
              },
              consecutiveSwap: {
                "1": 96.29629629629629,
                '2': 89.8989898989899,
                "3": NaN
              },
              oneChanges: 97.22222222222221,
              twoChanges: 94.44444444444444
        })
    })
})