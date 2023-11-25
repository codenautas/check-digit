/*
# RUN
```sh
npm run sample-byarea
```
*/

import { CheckDigitParameters, checkQualityOfCodeList, computePrefixedCodeList } from "../lib/check-digit-compute";
import { promises as fs } from "fs";

const CONF: CheckDigitParameters = {
    multipliers: [2,3,4,7], 
    divider: 11 // CAN BE 10 if more numbers needed. With 10 there are no skipped numbers.
}

const FIRST_AREA = 100;
const AREA_STEP = 2; // second area = FIRST_AREA + AREA_STEP
const FIRST_NUMBER = 1; // CAN BE 0 if more numbers needed
const SPACE_NUMBERS = AREA_STEP * 10; // equal to (second area - first area) * 10
const CODES_PER_AREA = 10; // CAN BE upt to 17 when divider is 11 or 20 if divider is 10 and FIRST_NUMBER = 0
const FIRST_NON_AREA = 740;

async function getList(){
    var allList:string[] = []
    for (var area = FIRST_AREA; area < FIRST_NON_AREA; area += AREA_STEP) {
        var codeList = computePrefixedCodeList(CODES_PER_AREA, area.toString(), CONF, FIRST_NUMBER, SPACE_NUMBERS);
        allList.push(...codeList)
    }
    console.log("List computed");
    var writing = fs.writeFile("local-codes.txt", allList.join("\n")).then(_=>console.log("List saved."));
    console.log('Quality report:', checkQualityOfCodeList(allList, 100));
    await writing;
}

getList();
