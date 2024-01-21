
import * as prototypes from 'game/prototypes';
import * as constants from 'game/constants';
import * as utils from 'game/utils';

for (let globalKey in utils) {
    global[globalKey] = utils[globalKey];
}



// import * as specConstants from 'arena/constants';
// for (let globalKey in specConstants) { global[globalKey] = specConstants[globalKey];}

import * as pathing from 'game/path-finder';
import { arenaInfo } from 'game';


export function loop() {
    console.log('-------------------tick: '+utils.getTicks());
   
    let cpuUsed = utils.getCpuTime();
    let limit = (utils.getTicks() === 1) ? arenaInfo.cpuTimeLimitFirstTick : arenaInfo.cpuTimeLimit;
    let usedRatio = cpuUsed / limit;
    console.log('CPU: '+ Math.floor(usedRatio*100)+' %');
}
