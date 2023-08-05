<!--multilang v0 es:LEEME.md en:README.md -->
# check-digit-compute
<!--lang:es-->
Calcula y verifica el dígito verificador

<!--lang:en--]
Compute and validate check digit

[!--lang:*-->

<!-- cucardas -->
![extending](https://img.shields.io/badge/stability-extending-orange.svg)
[![npm-version](https://img.shields.io/npm/v/check-digit-compute.svg)](https://npmjs.org/package/check-digit-compute)
[![build](https://github.com/codenautas/check-digit-compute/actions/workflows/node.js.yml/badge.svg)](https://github.com/codenautas/check-digit-compute/actions/workflows/node.js.yml)
[![coverage](https://img.shields.io/coveralls/codenautas/check-digit-compute/master.svg)](https://coveralls.io/r/codenautas/check-digit-compute)
[![outdated-deps](https://img.shields.io/github/issues-search/codenautas/check-digit-compute?color=9cf&label=outdated-deps&query=is%3Apr%20author%3Aapp%2Fdependabot%20is%3Aopen)](https://github.com/codenautas/check-digit-compute/pulls/app%2Fdependabot)

<!--multilang buttons-->

idioma: ![castellano](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-es.png)
también disponible en:
[![inglés](https://raw.githubusercontent.com/codenautas/multilang/master/img/lang-en.png)](README.md)

<!--lang:es-->

# Objetivo

<!--lang:en--]

# Main goal

[!--lang:es-->

Verificar la validez de códigos que contienen dígitos verificadores (como el ISBN de los libros).

Calcular el dígito verificador para armar códigos con dígito vericador válido. 

<!--lang:en--]

Check the validity of code that has a check digit (like book ISBN). 

Compute the check digit of new codes. 

[!--lang:*-->

```ts
const ISBN10: CheckDigitParameters<number> = {
    cast: Number, 
    multipliers: [9,8,7,6,5,4,3,2,1], 
    divider: 11,
    overflowMap: {'10':'X'}
};

var valid = checkdigit("0-86243-680-X", ISBN10);
```

<!--lang:es-->

El segundo parámetro contiene la definición del dígito verificador

<!--lang:en--]

The seccond parameter contains the definition of the check digit

[!--lang:*-->

# CheckDigitParameters

<!--lang:es-->

   * `cast`: constructor del tipo numérico. Se usa `Number` en general. Se puede usar también `BigInt`. Debe coincidir con el parámetro de clase (`number` o `bigint`).
   * `multipliers`: secuencia de dígitos empezando por el que multiplicará al dígito menos significativo.
   * `divider`: módulo (divisor final).
   * `shift`: desplazamiento del dígito verificador.
   * `turn`: valor lógico que calcula el dígito verificador como resta del `divider`. Usado para calcular CUITs.
   * `overflowMap`: mapa de caracteres usados para obtener los dígitos verificadores cuando el resto supera el número 9. Usado para obtener la `"X"` en los ISBN.

<!--lang:en--]

   * `cast`: numeric constructor. Use `Number` for the general case. You can use `BigInt` for special cases. It must match with the class parameter (`number` or `bigint`).
   * `multipliers`: numeric secuence of digit multipliers starting from the less significative digit of the code.
   * `divider`: modulus (divisor of the final sum)
   * `shift`: shift of the result
   * `turn`: (boolean) indicates that the result must be substracted from the divisor
   * `overflowMap`: caracter map to obtain check digits over the 9. Used to obtain the `"X"` in ISBN.

[!--lang:*-->

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

<!--lang:es-->

## Licencia

<!--lang:en--]

## License

[!--lang:*-->

[MIT](LICENSE)
