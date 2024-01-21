import { getObjectsByPrototype, getTicks, getCpuTime, findClosestByPath } from "game/utils";
import { Creep, StructureSpawn, StructureContainer } from "game/prototypes";
import { RESOURCE_ENERGY } from "game/constants";
import { Visual } from "game/visual";



class ScanWorld {

    MySpawn = null;
    Espawn = null;
    MyCreeps = null;
    MYSoilderCreeps = null;
    Ecreeps = null;
    Container = null;
    ClosestContainerwEnergy = null;
    GameTick = null;
    CPUtime = null;
    debug = true;
   

    constructor() {


        //These dont change  only do once
        console.log("Scanner created");
        this.MySpawn = getObjectsByPrototype(StructureSpawn).find(StructureSpawn => StructureSpawn.my);
        if (this.MySpawn == null) console.log("No spawn found");
        this.Espawn = getObjectsByPrototype(StructureSpawn).find(StructureSpawn => !StructureSpawn.my);
        if (this.Espawn == null) console.log("No enemy spawn found");
       

    }

    ScanWorld() {
        // Scan the world here
        this.GameTick = getTicks();
        this.CPUtime = getCpuTime();
        console.log("Scanning world" + "Tick: " + this.GameTick + "  CPU: " + this.CPUtime);
        console.log('Myspawn ' + this.MySpawn.x + " " + this.MySpawn.y);
        this.MyCreeps = getObjectsByPrototype(Creep).filter(creep => creep.my);
        this.Ecreeps = getObjectsByPrototype(Creep).filter(creep => !creep.my);
        console.log("Number of MyCreeps: " + (this.MyCreeps ? this.MyCreeps.length : 0));
        console.log("Number of Ecreeps: " + (this.Ecreeps ? this.Ecreeps.length : 0));
        this.Container = getObjectsByPrototype(StructureContainer);
        this.debug ? console.log("Number of Containers: " + (this.Container ? this.Container.length : 0)) : null;
    }

    findClosestDamagedCreep(creep) {
        this.debug = false; //finds the closest damaged creep to the spawn  TODO: Needs work currrelty just returns most damaged creep
        const damagedCreeps = this.MyCreeps.filter(creep => creep.hits < creep.hitsMax);
        let worstcreep = damagedCreeps.sort((a, b) => a.hits / a.hitsMax - b.hits / b.hitsMax);
        if (damagedCreeps.length == 0) { this.debug ? console.log("No damaged creeps left!") : null; this.debug = true; return null; }
        return findClosestByPath(this.MySpawn, damagedCreeps[0]);
    }

    findClosestContainerWithEnergywithSpawn() {
        const containersWithEnergy = this.Container.filter(container => container.store[RESOURCE_ENERGY] > 0);
        if (containersWithEnergy.length == 0) { this.debug ? console.log("No Containers with energy left!") : null; return null; }
        this.ClosestContainerwEnergy = findClosestByPath(this.MySpawn, containersWithEnergy);

    }

    findClosestContainerWithEnergywithCreep(aCreep) {
        const containersWithEnergy = this.Container.filter(container => container.store[RESOURCE_ENERGY] > 0);
        if (containersWithEnergy.length == 0) { this.debug ? console.log("No Containers with energy left!") : null; return null; }
        return this.ClosestContainerwEnergy = findClosestByPath(aCreep, containersWithEnergy);
    }

    scanForGroupUpdate() {
        this.debug = false;
        // Scan for groups and create an object to hold the group information
        // This object will be an array of objects holding a group name/number and number of types of creeps in that group
        if (this.MyCreeps == null || this.MyCreeps.length == 0) {
            this.debug ? console.log("In Scan: no MyCreeps") : null;
            return false;
        }else
        {
            this.MYSoilderCreeps = this.MyCreeps.filter(creep => creep.role === 'soilder');
            this.debug ? console.log("In Scan: " + this.MYSoilderCreeps.length + " found.") : null;
        }

        let groups = []; //We start with a blank array of groups
        for (const creep of this.MYSoilderCreeps) {
            //Lets tag each creep with a group name and mission
            //check what group a creep is in
            //if the group exists update the group object
            //if the group does not exist create a new group object and add it to the array
            //return the array of groups
             if (creep.groupName == null) {
                    this.debug ? console.log("Error! Creep has no group") : null;
                    return false;
             }
             

            let group = groups.find(g => g.groupName == creep.groupName);
            if (group != null) {
                //group exists
                //update the group object
                this.debug ? console.log("Updating Group:" + group.groupName) : null;
                creep.unit == 'ranger' ? group.NumRanger++ :
                    creep.unit == 'line' ? group.NumLine++ :
                        creep.unit == 'healer' ? group.NumHealer++ : null;
            } else {
                //group does not exist
                //create a group object and add it to the array
                this.debug ? console.log("Adding Group") : null;
                let group = { groupName: creep.groupName, NumRanger: 0, NumLine: 0, NumHealer: 0 };
                creep.unit == 'ranger' ? group.NumRanger++ :
                    creep.unit == 'line' ? group.NumLine++ :
                        creep.unit == 'healer' ? group.NumHealer++ : null;
                groups.push(group);

            }

        }
        this.debug ? console.log('Scanner: ' + groups) : null;
        this.debug = true;
        return groups
    }


   

    // Add code to create objects for other group types


}




export default ScanWorld;
