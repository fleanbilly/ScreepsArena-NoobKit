import ScanWorld from './scanworld.mjs';
import { Creep } from 'game/prototypes';
import spawnManager from './spawnmanager.mjs';
import MissionWildChicken from './missions/missionwildchicken.mjs';
import { RESOURCE_ENERGY, ERR_NOT_IN_RANGE, OK } from "game/constants";
import { Visual } from 'game/visual';


// this class ill handle moving of creeps and assigning them to tasks/missions
// It will manager harvester movement logic cause that never changes


class MoveManager {
    scanner = null;
    spawnmanager = null;
    debug = true;
    availableMissions = [];
    MVisual = null;


    constructor(vscanner, vspawnmanager) {
        this.scanner = vscanner; //save the scanner object so we have access to all the world information
        this.spawnmanager = vspawnmanager;
        this.availableMissions.push(new MissionWildChicken(this.scanner));
        this.MVisual = new Visual(2, true);
        this.showMissionInfo();
    }

    processSoilderMoves() {
        // if a creep has a mission pass it to that mission class to handle the movement
        //else we will creatre logic here to assign a mission to the creep and then pass it to the mission class to handle the movement
        //start off simple with WildtChicken mission
        //if a creep has no mission assign it to a mission
        //if a creep has a mission let the mission handle the movement
        if (this.scanner.MYSoilderCreeps == null || this.scanner.MYSoilderCreeps == undefined) { return false; }
        for (const creep of this.scanner.MYSoilderCreeps) {
            if (creep.exists == false) continue; //creep is dead
            if (creep.hasMission == false) {
                //creep has no mission assign it to a mission
                //this.availableMissions[0].addBriefcreep(creep);
                this.availableMissions[0].addBriefcreep(creep);
                creep.hasMission = true;
            }

            //creep has a mission let the mission handle the movement
            if (creep.hasVisual == false || creep.hasVisual == undefined || creep.hasVisual == null) {
                creep.hasVisual = new Visual(1, true);
            }
            creep.hasVisual.clear();
            creep.hasVisual.text('Unit ' + creep.unit + ' HP:' + creep.hits + '/' + creep.hitsMax, {x:creep.x,y:creep.y -1}, { font: 0.5 });
            let vtext = creep.groupName != null ? 'G:' + creep.groupName : 'No Group';
            vtext += creep.mission.MissionName != null ? ' M:' + creep.mission.MissionName : 'No Mission';
            creep.hasVisual.text(vtext, {x:creep.x,y:creep.y -0.5}, { font: 0.5 });
           
            creep.mission.doMissionAction(creep);
        }

    }

    showMissionInfo() {

        this.MVisual.text('Missions:' + this.getAvailableMissionsString(), { x: 50, y: 50 }, { font: 0.8 });

    }
    getAvailableMissionsString() {
        let missionString = '';
        for (const mission of this.availableMissions) {
            missionString += mission.MissionName + ', ';
        }
        missionString = missionString.slice(0, -2); // Remove the last comma and space
        return missionString;
    }
    //#region Harvester
    processHarvesterMove() {
        // Process move logic here
        this.debug = false;
        if (this.scanner.MyCreeps == null || this.scanner.MyCreeps == undefined) { this.debug ? console.log('Creeps Null cant move any') : null; this.debug = true; return false; }
        if (this.spawnmanager.numharvesters == 0) { this.debug ? console.log('No Harvesters to move') : null; this.debug = true; return false; }
        for (const creep of this.scanner.MyCreeps) {
            if (creep.exists == false) continue;
            if (creep.role == 'harvester' && creep.store.getFreeCapacity() > 0) {
                if (this.scanner.findClosestContainerWithEnergywithCreep(creep) == null) { this.debug ? console.log('No containers with energy for Creep' + creep.name) : null; this.debug = true; return false; }
                this.debug ? console.log("Moving harvester to container with energy") : null;
                let result = creep.withdraw(this.scanner.ClosestContainerwEnergy, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(this.scanner.ClosestContainerwEnergy);
                }

            } else {
                //creep is full of energy
                if (this.scanner.MySpawn == null) { this.debug ? console.log('No spawn to move to') : null; this.debug = true; return false; }

                let result = creep.transfer(this.scanner.MySpawn, RESOURCE_ENERGY);
                if (result == ERR_NOT_IN_RANGE) {
                    creep.moveTo(this.scanner.MySpawn);
                    this.debug ? console.log("Moving harvester to spawn") : null;

                } else if (result == OK) {
                    this.debug ? console.log("Harvester transfered energy to spawn") : null;
                }
            }
        }
        this.debug = true;
    }
    //#endregion

    // Methods and properties here
}

export default MoveManager;
