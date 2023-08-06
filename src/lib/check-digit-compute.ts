type OverflowMap = Record<string, (string|number)>

type Code = number | bigint | string

export type CheckDigitParameters = {
    multipliers:number[]
    divider:number
    shift?:number 
    turn?:boolean
    overflowMap?:OverflowMap
}

export const ISBN10: CheckDigitParameters = {
    multipliers: [9,8,7,6,5,4,3,2,1], 
    divider: 11,
    overflowMap: {'10':'X'}
};

export function checkdigitCompute(partialCode:Code, conf:CheckDigitParameters):number|string|null{
    var {multipliers, divider, shift, turn, overflowMap} = conf;
    return checkdigitInternal(partialCode, multipliers, divider, shift, turn, overflowMap);
}

export function checkdigit(code:Code, conf:CheckDigitParameters):boolean{
    var {multipliers, divider, shift, turn, overflowMap} = conf;
    var codeStr = code.toString();
    var lastDigit = checkdigitInternal(codeStr.substr(0,codeStr.length-1), multipliers, divider, shift, turn, overflowMap);
    return lastDigit == codeStr[codeStr.length-1];
}

function checkdigitInternal(code:Code, multipliers:number[], divider:number, shift?:number, turn?:boolean, overflowMap?:OverflowMap):number|null|string{
    var cast = Number;
    var digitos = code.toString().replace(/-/g,'').split('');
    var i = 0;
    var sumador = cast(0);
    while (digitos.length) {
        var digito = cast(digitos.pop());
        var multiplicador = multipliers[i];
        var producto:number = digito * multiplicador;
        sumador = sumador + producto;
        i++;
    }
    if (shift) {
        sumador = sumador + shift;
    }
    var remainder:number = sumador % divider;
    if (turn) remainder = divider - remainder;
    if (remainder > 9) return overflowMap ? overflowMap?.[remainder.toString()] || remainder : null;
    return remainder;
}

export function computePrefixedCodeList(maxCodes:number, prefix:string, conf:CheckDigitParameters|CheckDigitParameters[], startingSufix:number = 0, lastSufix:number|null = null, allowLessCodes:boolean = false):string[]{
    var list = [];
    var cant = 0;
    var confA = conf instanceof Array ? conf : [conf];
    var usefullDigits = confA[0].multipliers.length - prefix.length;
    if (usefullDigits > 13) throw new RangeError("computePrefixedCodeList: Can't compute more than 13 digits");
    var baseCode = Number("1" + prefix); 
    var expUD = 1;
    for (var i = 0; i < usefullDigits; i++) { expUD *= 10; baseCode *= 10; }
    if (lastSufix == null) {
        lastSufix = expUD - 1;
    }
    var i = startingSufix;
    var list = [];
    // console.log('**********************',{usefullDigits, maxCodes, expUD, maxSufix: sufixLimit, i})
    while (i <= lastSufix && cant < maxCodes) {
        var codePayload = (baseCode + i).toString().substring(1);
        var code = codePayload;
        for (conf of confA) {
            var d = checkdigitCompute(codePayload, conf);
            if (d == null || d.toString().length != 1) { d = null; break; }
            code += d;
        }
        // @ts-expect-error I know that d is set because confA has at least one element
        if (d != null) {
            list.push(code);
            cant++;
        }
        i++
    }
    if (list.length < maxCodes && !allowLessCodes) throw new Error("computePrefixedCodeList: not enought codes for prefix '"+prefix+"', "+list.length+" generated");
    return list;
}

export function checkQualityOfCodeList(list: string[], relative?:number){ 
    var result = {
        oneChanges: 0,
        twoChanges: 0,
        consecutiveSwap: {1:0,2:0,3:0},
        anySwap: {1:0,2:0,3:0}
    }
    var denominator = {
        oneChanges: 0,
        twoChanges: 0,
        consecutiveSwap: {1:0,2:0,3:0},
        anySwap: {1:0,2:0,3:0}
    }
    var len = list[0].length
    var vistos = {} as Record<string, boolean>
    for (var codigo of list) {
        vistos[codigo] = true;
    }
    for (var codigo of list) {
        for (var i = 0; i < len; i++) {
            for (var v = 0; v < 10; v++) {
                var nuevo = codigo.substring(0, i) + v.toString() + codigo.substring(i+1);
                if (nuevo != codigo) {
                    denominator.oneChanges ++;
                    if (vistos[nuevo]) result.oneChanges ++;
                    for (var j = 0; j < i; j++) {
                        for (var w = 0; w < 10; w++) {
                            var renuevo = nuevo.substring(0, j) + w.toString() + nuevo.substring(j+1);
                            if (renuevo != codigo && renuevo != nuevo) {
                                denominator.twoChanges ++;
                                if (vistos[renuevo]) result.twoChanges ++;
                            }
                        }
                    }
                }
            }
            for (var l of [1,2,3] as (1|2|3)[]) {
                if (i + l <= len) {
                    for (var j = l as number; j <= i; j++) {
                        var nuevo = codigo.substring(0, j-l) + codigo.substr(i,l) + codigo.substring(j,i) + codigo.substr(j-l,l) + codigo.substring(i+l);
                        if (nuevo != codigo) {
                            denominator.anySwap[l] ++;
                            if (i == j) denominator.consecutiveSwap[l] ++;
                            if (vistos[nuevo]) {
                                result.anySwap[l] ++;
                                if (i == j) result.consecutiveSwap[l] ++;
                            }
                        }
                    }
                }
            }
        }
    }
    if (relative) {
        result.oneChanges = result.oneChanges / denominator.oneChanges * relative;
        result.twoChanges = result.twoChanges / denominator.twoChanges * relative;
        for (var l of [1,2,3] as (1|2|3)[]) {
            result.consecutiveSwap[l] = result.consecutiveSwap[l] / denominator.consecutiveSwap[l] * relative;
            result.anySwap[l] = result.anySwap[l] / denominator.anySwap[l] * relative;
        }
    }
    return result;
}