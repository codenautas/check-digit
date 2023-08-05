# check-digit-compute
Compute and validate check digit


![extending](https://img.shields.io/badge/stability-extending-orange.svg)
[![npm-version](https://img.shields.io/npm/v/check-digit-compute.svg)](https://npmjs.org/package/check-digit-compute)
[![build](https://github.com/codenautas/check-digit-compute/actions/workflows/node.js.yml/badge.svg)](https://github.com/codenautas/check-digit-compute/actions/workflows/node.js.yml)
[![coverage](https://img.shields.io/coveralls/codenautas/check-digit-compute/master.svg)](https://coveralls.io/r/codenautas/check-digit-compute)
[![outdated-deps](https://img.shields.io/github/issues-search/codenautas/check-digit-compute?color=9cf&label=outdated-deps&query=is%3Apr%20author%3Aapp%2Fdependabot%20is%3Aopen)](https://github.com/codenautas/check-digit-compute/pulls/app%2Fdependabot)


language: ![English](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)
also available in:
[![Spanish](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)](LEEME.md)


# Main goal


Check the validity of code that has a check digit (like book ISBN).

Compute the check digit of new codes.


```ts
const ISBN10: CheckDigitParameters<number> = {
    cast: Number,
    multipliers: [9,8,7,6,5,4,3,2,1],
    divider: 11,
    overflowMap: {'10':'X'}
};

var valid = checkdigit("0-86243-680-X", ISBN10);
```


The seccond parameter contains the definition of the check digit


# CheckDigitParameters


   * `cast`: numeric constructor. Use `Number` for the general case. You can use `BigInt` for special cases. It must match with the class parameter (`number` or `bigint`).
   * `multipliers`: numeric secuence of digit multipliers starting from the less significative digit of the code.
   * `divider`: modulus (divisor of the final sum)
   * `shift`: shift of the result
   * `turn`: (boolean) indicates that the result must be substracted from the divisor
   * `overflowMap`: caracter map to obtain check digits over the 9. Used to obtain the `"X"` in ISBN.


# digitcheckCompute

```ts
var incomplete_ean = "123456789041"
var digit = digitcheckCompute(incomplete_ean, {
        cast: Number,
        multipliers: [3,1,3,1,3,1,3,1,3,1,3,1],
        turn: true,
        divider: 10,
    }
console.log(incomplete_ean + digit); // 1234567890418
```


## License


[MIT](LICENSE)
