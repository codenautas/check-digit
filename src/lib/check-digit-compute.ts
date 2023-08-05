type OverflowMap<Num extends bigint|number> = Record<string, (string|Num)>

export type CheckDigitParameters<Num extends bigint|number> = {
    cast:(numbreString:string|number)=>Num
    multipliers:Num[]
    divider:Num
    shift?:Num 
    turn?:boolean
    overflowMap?:OverflowMap<Num>
}

export function checkdigitCompute<Num extends bigint|number>(number:any, params:CheckDigitParameters<Num>):Num|string|null{
    var {cast, multipliers, divider, shift, turn, overflowMap} = params;
    return checkdigitInternal(number, cast, multipliers, divider, shift, turn, overflowMap);
}

export function checkdigit<Num extends bigint|number>(number:any, params:CheckDigitParameters<Num>):boolean{
    var {cast, multipliers, divider, shift, turn, overflowMap} = params;
    var numberStr = number.toString();
    var lastDigit = checkdigitInternal(numberStr.substr(0,numberStr.length-1), cast, multipliers, divider, shift, turn, overflowMap);
    return lastDigit == numberStr[numberStr.length-1];
}

function checkdigitInternal<Num extends bigint|number>(number:any, cast:(numbreString:string|number)=>Num, multipliers:Num[], divider:Num, shift?:Num, turn?:boolean, overflowMap?:OverflowMap<Num>):Num|null|string{
    var digitos = number.toString().replace(/-/g,'').split('');
    var i = 0;
    var sumador:Num = cast(0);
    while (digitos.length) {
        var digito = cast(digitos.pop());
        var multiplicador = multipliers[i];
        // @ts-expect-error until I have https://github.com/microsoft/TypeScript/issues/39569
        var producto:Num = digito * multiplicador;
        // @ts-expect-error until I have https://github.com/microsoft/TypeScript/issues/39569
        sumador = sumador + producto;
        i++;
    }
    if (shift) {
        // @ts-expect-error until I have https://github.com/microsoft/TypeScript/issues/39569
        sumador = sumador + shift;
    }
    // @ts-expect-error until I have https://github.com/microsoft/TypeScript/issues/39569
    var remainder:Num = sumador % divider;
    // @ts-expect-error until I have https://github.com/microsoft/TypeScript/issues/39569
    if (turn) remainder = divider - remainder;
    if (remainder > 9) return overflowMap ? overflowMap?.[remainder.toString()] || remainder : null;
    return remainder;
}

