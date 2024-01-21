import ScanWorld from "./scanworld.mjs";
import { Creep } from 'game/prototypes';
import MoveManager from "./movemanager.mjs";
import GroupManager from "./groupmanager.mjs";
import { MOVE, CARRY, ATTACK, RANGED_ATTACK, HEAL, TOUGH, WORK, ERR_BUSY, ERR_NOT_ENOUGH_ENERGY, ERR_INVALID_ARGS, ERR_NOT_OWNER } from "game/constants";

// this class will handle spawning of creeps
// It will manager harvester spawnng logic
// It receive soilder spawn requests from the group manager
// It will spawn soilders and assign them to groups

class spawnManager {

  debug = true;
  scanner = null;
  groupmanager = null;
  MAX_HARVESTERS = 3;
  numharvesters = null;

  RANGER = [MOVE, MOVE, RANGED_ATTACK];
  LINE = [MOVE, ATTACK, TOUGH,TOUGH];
  HEALER = [MOVE, HEAL];

  constructor(vscanner) {
    this.scanner = vscanner; //save the scanner object so we have access to all the world information
    this.numharvesters = 0;
    if (this.groupmanager == null) { this.groupmanager = new GroupManager(this.scanner); }
  }

  processSpawn() {
    
    if (this.shouldspawnHarvester() == false) {
      this.shouldSpawnSoilder();
    } else {
      return false;
    }

  }

  //region soilders
  shouldSpawnSoilder() {

    let resultgroup = this.groupmanager.processGroups();
    if (!resultgroup) {  this.debug ? console.log('Spawner: No groups to fill') : null;  return false; } //no groups have room for a soilder

    let style = resultgroup.TypeToSpawn;
    let group = resultgroup.grouptoputin;
    let result = null;
    // below selects body parts based on the type of soilder needed
    style = resultgroup.TypeToSpawn === 'ranger' ? this.RANGER :
      resultgroup.TypeToSpawn === 'line' ? this.LINE :
        resultgroup.TypeToSpawn === 'healer' ? this.HEALER :
          null;

    result = this.scanner.MySpawn.spawnCreep(style).object;

    if (result == null) { return false; } //spawn failed

    switch (result) {
      case ERR_NOT_OWNER:
        this.debug ? console.log("Spawn not owner") : null;
        return false;
        break;
      case ERR_BUSY:
        this.debug ? console.log("Spawn busy") : null;
        return false;
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        this.debug ? console.log("Not enough energy") : null;
        return false;
        break;
      case ERR_INVALID_ARGS:
        this.debug ? console.log("Spawn Invalid args") : null;
        return false;
        break;
      default:
        result.role = 'soilder';
        result.name = 'Soilder' + this.scanner.GameTick + group;
        result.unit = resultgroup.TypeToSpawn;
        result.groupName = group;
        result.leader = resultgroup == 'ranger' ? true : false;
        result.hasMission = false;
        result.mission = null;
        this.debug ? console.log("Spawning soilder: " + result.name) : null;
        return true;
        break;
    }


  }

  //endregion soilders
  //#REGION Harvester
  shouldspawnHarvester() {

    let result = null;
    this.numharvesters = this.scanner.MyCreeps != null ? this.scanner.MyCreeps.filter(creep => creep.role == 'harvester').length : 0;
    console.log("Number of harvesters: " + this.numharvesters);

    if (this.numharvesters >= this.MAX_HARVESTERS) { this.debug ? console.log("Max harvesters reached") : null; return false; }

    result = this.scanner.MySpawn.spawnCreep([WORK, CARRY, MOVE]).object;

    if (result == null) { return false; }

    //count the harvester creeps

    switch (result) {
      case ERR_NOT_OWNER:
        this.debug ? console.log("Spawn not owner") : null;
        return false;
        break;
      case ERR_BUSY:
        this.debug ? console.log("Spawn busy") : null;
        return false;
        break;
      case ERR_NOT_ENOUGH_ENERGY:
        this.debug ? console.log("Not enough energy") : null;
        return false;
        break;
      case ERR_INVALID_ARGS:
        this.debug ? console.log("Spawn Invalid args") : null;
        return false;
        break;
      default:

        result.role = 'harvester';
        result.name = 'harvester' + this.numharvesters != null ? 'Harvester' + this.numharvesters + 1 : 0;
        this.debug ? console.log("Spawning harvester: " + result.name) : null;
        return true;
        break;
    }
  }
  //endregion Harvester



}

export default spawnManager;
