//import { ScanWorld } from './scanner.mjs';
import { Creep } from 'game/prototypes';

// This Class basicly orders solider creeps from the spawn manager by returning an object with the type of creep to spawn and the group to put it in
class GroupManager {

    scanner = null;
    debug = false;

    groupsNumthatExist = [];
    MAX_SOILDERS_GROUPS = 3;
    MAX_SOILDERS = 20;
    MAX_SOILDER_IN_GROUP = 4;
    NUM_RANGER_IN_GROUP = 1;1
    NUM_LINE_IN_GROUP = 2;
    NUM_HEALER_IN_GROUP = 1;




    constructor(vscanner) {
        // Initialize your class properties here
        this.scanner = vscanner;

    }

    processGroups() {
        //create groups of 4 soilders, 1 healer, 1 rangers, 2 line, return first group that is not full
        //if no groups exist create a new group
        //if all groups are not full create a new group and noty at soilder limit yet create a new group
        //Returns a object with the type of soilder to spawn and the group to put it in to thr spawnmanager

        let result = null;
        let numsoilders = this.scanner.MyCreeps.filter(creep => creep.role == 'soilder').length;
        this.debug ? console.log("Number of soilders: " + numsoilders) : null;
        if (numsoilders != 0 && numsoilders >= this.MAX_SOILDERS) { this.debug ? console.log("Soilder Limit reached") : null; return false; }

        //scan for groups in the active world
        let thegroups = this.scanner.scanForGroupUpdate();

        if (thegroups === false) {
            this.debug ? console.log("False groups found after scan") : null;
            this.NumofGroups = 1;
            return this.addToNewGroup(0);
        } else if (thegroups === null) {
            this.debug ? console.log("Null Groups found after scan") : null;
            this.NumofGroups = 1;
            return this.addToNewGroup(0);
        } else if (thegroups === undefined) {
            this.debug ? console.log("Undefined Groups found after scan") : null;
            this.NumofGroups = 1;
            return this.addToNewGroup(0);
        } else if (thegroups.length == 0) {
            this.debug ? console.log("Length 0 /Create Group") : null;
            this.NumofGroups = 1;
            return this.addToNewGroup(0);

        } else {

            this.debug ? console.log("Groups Found - Will balance Groups") : null;
            // this.debug ? console.log(thegroups) : null;
        }


        //does any existing group have room for a soilder
        let highestGroup = 0;
        //We clear this array so we can add updated groups that exist to it
        this.groupsNumthatExist = [];

        for (const Agroup of thegroups) {
            Agroup.groupName > highestGroup ? highestGroup = Agroup.groupName : null;
            //check is this group is in the groups that exist array - that will be used for moving soilders groups
            let Gresult = this.groupsNumthatExist.find(g => g == Agroup.groupName);
            if (Gresult == null || Gresult == undefined || Gresult == false) { this.groupsNumthatExist.push(Agroup.groupName); this.debug ? console.log("Adding Group " + Agroup.groupName + " to groups that exist" + this.groupsNumthatExist) : null; };
            let result = this.checkGroupforRoom(Agroup);
            if (result == true) {
                const groupIndex = thegroups.indexOf(Agroup);
                this.debug ? console.log("Group " + groupIndex + " has room for a soilder Add: " + result) : null;
                return { 'TypeToSpawn': this.checkGroupforTypeToAdd(Agroup), 'grouptoputin': groupIndex }
            }
        } //end loop through groups

        // if we are here we have groups to work with but are they all full and we may new group needed
        if (numsoilders % this.MAX_SOILDER_IN_GROUP == 0) {
            this.debug ? console.log("All Groups Full! Need to create Soilder in new group") : null;
            return this.addToNewGroup(highestGroup + 1);
        }


        return false; //no groups have room for a soilder should never get here
    }



    addToNewGroup(grounpNumbertoAddTo) {
        //create a new group and add it to the array in group 0
        // Determine the type of soilder to spawn in new groups Rangers are first then lines then healers
        let spawncommand = { 'TypeToSpawn': 'ranger', 'grouptoputin': grounpNumbertoAddTo };
        return spawncommand;

    }
    getGroupPopulation(group) {
        let numSoilders = group.NumRanger + group.NumLine + group.NumHealer;
        return numSoilders;
    }

    checkGroupforRoom(group) {
        let numSoilders = this.getGroupPopulation(group);
        if (numSoilders < this.MAX_SOILDER_IN_GROUP) {
            return true;
        }
        return false;
    }
    // Add code to create objects for other group types
    //This control the priority of soilders to replace in a group
    checkGroupforTypeToAdd(group) {
        if (group.NumRanger < this.NUM_RANGER_IN_GROUP) { return 'ranger'; }
        if (group.NumLine < this.NUM_LINE_IN_GROUP) { return 'line'; }
        if (group.NumHealer < this.NUM_HEALER_IN_GROUP) { return 'healer'; }
        return false;
    }



}

export default GroupManager;
