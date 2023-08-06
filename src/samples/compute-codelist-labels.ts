/*
# RUN
```sh
npm run sample-labels
```
*/

import { CheckDigitParameters, checkQualityOfCodeList, computePrefixedCodeList } from "../lib/check-digit-compute";
import { promises as fs } from "fs";

const CONF1: CheckDigitParameters = {
    multipliers: [2,3,4,7], 
    divider: 11,
    shift: 3 
}

const CONF2: CheckDigitParameters = {
    multipliers: [3,4,5,9], 
    divider: 11 
}

const FIRST_LABEL = 1000;
const LAST_LABEL = 9999;

async function getList(){
    var allList = computePrefixedCodeList(LAST_LABEL, "", [CONF1, CONF2], FIRST_LABEL, LAST_LABEL);
    console.log("List computed");
    var writing = fs.writeFile("local-codes.txt", allList.join("\n")).then(_=>console.log("List saved."));
    console.log('Quality report:', checkQualityOfCodeList(allList, 100));
    await writing;
}

getList();
