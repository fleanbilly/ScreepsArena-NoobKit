import ScanWorld from '../scanworld.mjs';
import { OK, ERR_NOT_OWNER, ERR_NOT_IN_RANGE, ERR_INVALID_TARGET, ERR_NO_BODYPART } from 'game/constants';
import { Creep } from 'game/prototypes';
import { StructureSpawn } from 'game/prototypes';



class MissionHarvestNBuildTower {

    //Mission States
    isFollowLearder = false;
    isAttack = false;
    isStaytogether = false;
    isPausetoRegroup = false;
    targetType = null
    targetPosX = null;
    targetPosY = null;
    target = null;
    MissionName = 'HarvestNBuildTower';
    MissionNumber = 2;
    MissionGroup = null;
    MissionLeader = null;
    MissionCreeps = [];
    MissionActive = true;
    scanner = null;
    debug = true;

    constructor(vscanner) {
        this.scanner = vscanner;

    }


    addBriefcreep(creep) {
      
    }

    removeBriefcreep(creep) {
     
    }

    doMissionAction(creep) {
    }

}


export default MissionHarvestNBuildTower;
