import ScanWorld from '../scanworld.mjs';
import { OK, ERR_NOT_OWNER, ERR_NOT_IN_RANGE, ERR_INVALID_TARGET, ERR_NO_BODYPART } from 'game/constants';
import { Creep } from 'game/prototypes';
import { StructureSpawn } from 'game/prototypes';

class MissionWildChicken {


    //This is a simple mission to attack an Enemy Spawn
    //The mission will be to attack the spawn until it is destroyed
    //We dont' care about the creeps in the spawn just the spawn
    //We wont have a leader and a not wait for our group of soilders to move and attack together

    scanner = null;

    //Mission States
    isFollowLearder = false;
    isAttack = true;
    isStaytogether = false;
    isPausetoRegroup = false;
    targetType = 'spawn';
    targetPosX = null;
    targetPosY = null;
    target = null
    MissionName = 'WildChicken';
    MissionNumber = 1;
    MissionGroup = null;
    MissionLeader = null;
    MissionCreeps = [];
    MissionActive = true;





    constructor(vscanner) {
        this.scanner = vscanner;
        this.targetPosX = this.scanner.Espawn.X;
        this.targetPosY = this.scanner.Espawn.Y;
        this.target = this.scanner.Espawn;
    }
    addBriefcreep(creep) {
        this.MissionCreeps.push(creep);
        creep.mission = this;
        creep.hasMission = true;
    }
    removeBriefcreep(creep) {
        const index = this.MissionCreeps.indexOf(creep);
        if (index !== -1) {
            this.MissionCreeps.splice(index, 1);
        }
        creep.mission = null;
        creep.hasMission = false;
    }
    doMissionAction(creep) {
        //this is the main mission action
        if (creep.unit == 'ranger') {
            //rangers will attack from a distance
            if (creep.rangedAttack(this.target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(this.target);
            }
        }
        else if
            (creep.unit == 'line') {

            if (creep.attack(this.target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(this.target);
            }
        }
        else if
            (creep.unit == 'healer') {

            //healers will heal the closest creep
            if (creep.healTarget == null || creep.healTarget == undefined || creep.healTarget == false || creep.healTarget.exists != true) {
                //find the closest creep that is damaged
                let Healtarget = this.scanner.findClosestDamagedCreep(creep);
                creep.healTarget = Healtarget;

            }

            if (creep.healTarget != null) {
                //
                if (creep.rangedHeal(creep.healtarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.healTarget);
                }
            } else {
                //no target to heal so move to the mission target
                creep.moveTo(this.target);
            }

        }
    }

}

export default MissionWildChicken;
