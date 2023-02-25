import {createAreaCollection} from './DataFactory';
import {Logger, LoggerLevel} from './Logger';

const logger = new Logger(LoggerLevel.DEBUG);

const commands = {
    deps: '--deps',
    ways: '--ways',
    help: '--help',
}

// Init command
const cmd = process.argv[2] ?? commands.help;

// HELP
if (cmd === commands.help) {
    console.log(`Use one of these commands [ ${Object.values(commands).join(' | ')} ]`)
    process.exit(0);
}

// PRINT ALL AREAS WITH ITS CONSTRAINTS
if (cmd === commands.deps) {
    const areaCollection = createAreaCollection(logger);
    // print all areas with its constraints
    areaCollection.getAreasWithRefs().forEach(({area, refs}) => {
        console.log(`${area.label}: ${area.name}`);
        refs.forEach((ref) => {
            console.log(`  ${ref.refPrefix} ${ref.area.label}: ${ref.area.name}`);
        });
    });
    process.exit(0);
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
    process.exit(0);
}

