// LOCATIONS IN VILLAGE
const roads = [
    "Alice's House-Bob's House", "Alices's House-Cabin",
    "Alice's House-Post Office", "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Grete's House-Farm",
    "Grete's House-Shop", "Marketplace-Farm",
    "Marketplace-Post Office", "Marketplace-Shop",
    "Marketplace-Town Hall", "Shop-Town Hall"
];

// BUILDS ROADS IN VILLAGE
function buildGraph(edges) {
    let graph = Object.create(null);
    function addEdge(from, to) {
        if(graph[from] == null) {
            graph[from] = [to];
        } else {
            graph[from].push(to);
        }
    }
    for(let [from, to] of edges.map(r => r.split("-"))) {
        addEdge(from, to);
        addEdge(to, from);
    }
    return graph;
}

const roadGraph = buildGraph(roads);

// CONTROLS AND UPDATES VILLAGE'S CURRENT AND FUTURE STATE
class VillageState {
    constructor(place, parcels) {
        this.place = place;
        this.parcels = parcels;
    }
    move(destination){
        if(!roadGraph[this.place].includes(destination)) {
            return this;
        } else {
            let parcels = this.parcels.map(p => {
                if(p.place != this.place)
                return p;
                return  {place: destination, 
                        address: p.address};
            }).filter(p => p.place != p.address);
            return new VillageState(destination, parcels);
        }
    }
}

let first = new VillageState(
    "Post Office", 
    [{place: "Post Office", address: "Alice's House"}]
);
let next = first.move("Alice's House");

// ROBOT MEMORY
function runRobot(state, robot, memory) {
    for(let turn = 0;; turn++) {
        if(state.parcels.lenght == 0) {
            console.log(`Done in ${turn} turns`);
            break;
        }
        let action = robot(state, memory);
        state = state.move(action.direction);
        memory = action.memory;
        console.log(`Moved to ${action.direction}`);
    }
}


// PICK UP AND DELIVERY 
function randomPick(array) {
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}

function randomRobot(state) {
    return {direction: randomPick(roadGraph[state.place])};
}

VillageState.random = function(parcelCount = 5) {
    let parcels = [];
    for(let i = 0; i < parcelCount; i++) {
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do {
            place = randomPick(Object.keys(roadGraph));
        } while (place == address);
        parcels.push({place, address});
    }
    return new VillageState("Post Office", parcels);
};
console.log(next.place);
console.log(next.parcels);
console.log(first.place);
runRobot(VillageState.random(), randomRobot);
