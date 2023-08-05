import { checkdigit, checkdigitCompute, CheckDigitParameters } from "../lib/check-digit-compute";

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