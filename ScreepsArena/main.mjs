import ScanWorld from './scanworld.mjs';
import spawnManager from './spawnmanager.mjs';
import MoveManager from './movemanager.mjs';
import { getTicks} from 'game/utils';
import { } from 'game/prototypes';
import { } from 'game/constants';
import { } from 'game';

var scanWorld = null;
var spawnmanager = null;
var movemanager = null;
var firsttick = true;

export function loop() {
 
    if (firsttick) {
        console.log("First tick");
        scanWorld = new ScanWorld();
        spawnmanager = new spawnManager(scanWorld);
        movemanager = new MoveManager(scanWorld, spawnmanager);
        firsttick = false;
    }
   
    

    scanWorld.ScanWorld(); // Scan the world first to get all the information
    spawnmanager.processSpawn(); // Process the spawning of creeps
    movemanager.processHarvesterMove(); // Process the moving of creeps
    movemanager.processSoilderMoves(); // Process the moving of Soildercreeps
    


  

    // Your code goes here

}
