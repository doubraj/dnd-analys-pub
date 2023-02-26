import { createAreaCollection } from './AreaFactory';
import { Logger, LoggerLevel } from './Logger';
import { createGames } from './GameFactory';

const logger = new Logger(LoggerLevel.DEBUG);

const commands = {
    deps: '--deps',
    ways: '--ways',
    waysg: '--ways-games',
    help: '--help',
};

// Init command
/* eslint-disable-next-line no-undef */
const cmd = process.argv[2] ?? commands.help;

// HELP
if (cmd === commands.help) {
    console.log(`Use one of these commands [ ${Object.values(commands).join(' | ')} ]`);
}

// PRINT ALL AREAS WITH ITS CONSTRAINTS
if (cmd === commands.deps) {
    const areaCollection = createAreaCollection(logger);
    // print all areas with its constraints
    areaCollection.getAreasWithRefs().forEach(({ area, refs }) => {
        console.log(`${area.label}: ${area.name}`);
        refs.forEach((ref) => {
            console.log(`  ${ref.refPrefix} ${ref.area.label}: ${ref.area.name}`);
        });
    });
}

if (cmd === commands.ways) {
    const areaCollection = createAreaCollection(logger);
    const ways = areaCollection.getAllPossibleWays();
    let shortest = ways.length;
    let longest = 0;
    let completed = 0;
    ways.forEach((way) => {
        shortest = Math.min(shortest, way.points.length);
        longest = Math.max(longest, way.points.length);
        if (way.completed) {
            completed++;
            console.log(`-   (${way.points.length}) ${way.points.map((a) => a.label)}`);
        } else {
            console.log(`!!! (${way.points.length}) ${way.points.map((a) => a.label)}`);
        }
    });
    console.log(`There is ${ways.length} possible ways to complete this game`);
    console.log(`Min way: ${shortest}  X  Max way: ${longest}`);
    console.log(`${completed}/${ways.length} are successfully completable`);
}

if (cmd === commands.waysg) {
    const areaCollection = createAreaCollection(logger);
    const games = createGames();
    const assignedCount = areaCollection.assignGames(games);
    const toAssignCount = games.filter((g) => g.area).length;
    const ways = areaCollection.getAllPossibleWays();
    areaCollection.calculateGameTags(ways);
    console.log(`There is ${ways.length} possible ways to complete this game`);
    console.log(`Assigned ${assignedCount}/${toAssignCount} games`);
    const { min: strMin, max: strMax, avg: strAvg } = areaCollection.calculateMinMaxAvgTag(ways, 'strength');
    const { min: manMin, max: manMax, avg: manAvg } = areaCollection.calculateMinMaxAvgTag(ways, 'manual');
    const { min: knoMin, max: knoMax, avg: knoAvg } = areaCollection.calculateMinMaxAvgTag(ways, 'knowledge');
    const { min: thiMin, max: thiMax, avg: thiAvg } = areaCollection.calculateMinMaxAvgTag(ways, 'thinking');
    const { min: coMin, max: coMax, avg: coAvg } = areaCollection.calculateMinMaxAvgTag(ways, 'coop');
    const { min: siMin, max: siMax, avg: siAvg } = areaCollection.calculateMinMaxAvgTag(ways, 'single');
    console.log(` Strength (${strMax - strMin}) min: ${strMin}, max: ${strMax}, avg: ${strAvg}`);
    console.log(`   Manual (${manMax - manMin}) min: ${manMin}, max: ${manMax}, avg: ${manAvg}`);
    console.log(`Knowledge (${knoMax - knoMin}) min: ${knoMin}, max: ${knoMax}, avg: ${knoAvg}`);
    console.log(` Thinking (${thiMax - thiMin}) min: ${thiMin}, max: ${thiMax}, avg: ${thiAvg}`);
    console.log('----------------------------------------------------------');
    console.log(`  Coop (${coMax - coMin}) min: ${coMin}, max: ${coMax}, avg: ${coAvg}`);
    console.log(`Single (${siMax - siMin}) min: ${siMin}, max: ${siMax}, avg: ${siAvg}`);
}
