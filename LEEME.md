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
const ISBN10: CheckDigitParameters = {
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

# Type `CheckDigitParameters`

<!--lang:es-->

   * `multipliers`: secuencia de dígitos empezando por el que multiplicará al dígito menos significativo.
   * `divider`: módulo (divisor final).
   * `shift`: desplazamiento del dígito verificador.
   * `turn`: valor lógico que calcula el dígito verificador como resta del `divider`. Usado para calcular CUITs.
   * `overflowMap`: mapa de caracteres usados para obtener los dígitos verificadores cuando el resto supera el número 9. Usado para obtener la `"X"` en los ISBN.

<!--lang:en--]

   * `multipliers`: numeric secuence of digit multipliers starting from the less significative digit of the code.
   * `divider`: modulus (divisor of the final sum)
   * `shift`: shift of the result
   * `turn`: (boolean) indicates that the result must be substracted from the divisor
   * `overflowMap`: caracter map to obtain check digits over the 9. Used to obtain the `"X"` in ISBN.

[!--lang:*-->

# `digitcheckCompute(code, config)`

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

# `checkQualityOfCodeList(listOfCodes, relative)`

```ts
var codeList:string[] = await fs.readFile('codes.txt','utf8');

console.log(checkQualityOfCodeList(codeList, 100));
```

<!--lang:es-->

Realiza un control de calidad de la lista de códigos indicando el % de probabildad de obtener otro código
si al tipear un código se comete:
  * un error (cambiando un dígito por otro)
  * dos errores (camabiando un dígito por otro en dos lugares)
  * la inversión de dos dígitos consecutivos (o dos pares o dos ternas)
  * la inversión de dos dígitos cualquiera, consecutivos o no (o de dos pares o de dos ternas)

<!--lang:en--]

Computes de quality of a list of codes. Computes the % of probability to obtain an existing code when 
types other code an makes some error:
   * only one type error
   * two type error
   * inverting digits

[!--lang:*-->

## `computePrefixedCodeList(maxCodes, prefix, conf, startingSufix, lastSufix, allowLessCodes)`

<!--lang:es-->

Genera una lista de códigos utilizando una `conf`iguración de dígito verificador.
Se debe especificar la cantidad máxima de códigos que se desean generar,
un prefio (puede ser `""` para no poner prefijo). 
Se puede especificar también el número inicial y final a generar;
si no se especifican se empieza de 0 y se termina en 9999 
(con tantos nueves como sea necesario para completar el código).
La cantidad de dígitos a generar en cada código dependerá de la cantidad de multiplicadores
de la configuración. 
Si no se pueden generar tantos códigos como `maxCodes` se obtendrá un error 
salvo que se pase `true` en el parámetro `allowLesCodes`.

<!--lang:en--]

Generates a list of codes using a check digit `conf`.
You must specify the maximum number of codes that you want to generate and a prefix (it can be `""` to no prefix).
You can also specify the initial number to generate and the last number to generate.
If you not, 0 is the first and the last is 9999 (with many nines to complete the code). 
The number of digits to generate in each code will depend on the number of multipliers of the configuration.
If you cannot generate as many codes as `maxCodes` you will get an error 
unless `true` is passed in the `allowLesCodes` parameter.

[!--lang:*-->

```ts
// GET 8000 labels starting with 1000 ensuring not grater than 9900
import { CheckDigitParameters, checkQualityOfCodeList, computePrefixedCodeList } from "../lib/check-digit-compute";
import { promises as fs } from "fs";

const CONF: CheckDigitParameters = {
    multipliers: [2,3,4,7], 
    divider: 11
}

const FIRST_LABEL = 1000;
const LAST_LABEL = 9900;

async function getList(){
    var allList = computePrefixedCodeList(8000, "", CONF, FIRST_LABEL, LAST_LABEL);
    console.log("List computed");
    var writing = fs.writeFile("local-codes.txt", allList.join("\n")).then(_=>console.log("List saved."));
    console.log('Quality report:', checkQualityOfCodeList(allList, 100));
    await writing;
}

getList();

```

<!--lang:es-->

## Licencia

<!--lang:en--]

## License

[!--lang:*-->

[MIT](LICENSE)
