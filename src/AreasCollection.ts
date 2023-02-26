import Area, { AreaType, Constraint } from './Area';
import { Logger } from './Logger';
import { Game, GameTags } from './Game';

interface AreaRef {
    refPrefix: string;
    area: Area;
}

interface AreaWithRefs {
    area: Area;
    refs: AreaRef[];
}

interface Way {
    points: Area[],
    completed: boolean,
    gameTags?: GameTags,
}

type TagKey = keyof GameTags;

export default class AreasCollection {
    public constructor(
        private readonly areas: Area[],
        private readonly logger: Logger,
    ) {}

    public calculateMinMaxAvgTag(ways: Way[], tagKey: TagKey): { min: number, max: number, avg: number } {
        const res = { min: 9, max: 0, avg: 0 };
        ways.forEach((w) => {
            if (w.gameTags === undefined) {
                throw new Error('Area tags are not calculated, call "calculateGameTags" first!');
            }
            res.min = Math.min(res.min, w.gameTags[tagKey]);
            res.max = Math.max(res.max, w.gameTags[tagKey]);
            res.avg += w.gameTags[tagKey];
        });
        res.avg = Math.round((100 * res.avg) / ways.length) / 100;
        return res;
    }

    public calculateGameTags(ways: Way[]): void {
        ways.forEach((way) => {
            way.gameTags = { strength: 0, manual: 0, knowledge: 0, thinking: 0, single: 0, coop: 0 };
            way.points.forEach((area) => {
                const game = area.getGame();
                if (!game?.tags || !way.gameTags) return;
                way.gameTags.strength += game.tags.strength;
                way.gameTags.manual += game.tags.manual;
                way.gameTags.knowledge += game.tags.knowledge;
                way.gameTags.thinking += game.tags.thinking;
                way.gameTags.single += game.tags.single;
                way.gameTags.coop += game.tags.coop;
            });
        });
    }

    public assignGames(games: Game[]): number {
        let assigned = 0;
        games.forEach((game) => {
            const areaLabel = game.area;
            this.areas.forEach((area) => {
                if (areaLabel === area.label) {
                    area.setGame(game);
                    assigned++;
                    return;
                }
            });
        });
        return assigned;
    }

    public getAllPossibleWays(): Way[] {
        try {
            const start = this.getStartArea();
            const unlockedIxs = [start.index];
            const remainingMx = this.areas.map(() => true);
            return this.tryAllWays(unlockedIxs, remainingMx, { points: [], completed: false });
            // return this.tryAllWays([start.index], , { points: []});
        } catch (e: any) {
            this.logger.error(e.message);
        }
        return [];
    }

    private tryAllWays(
        unlockedIxs: number[],
        remainingMx: boolean[],
        { points }: Way,
        ignoreBonuses = true,
    ): Way[] {
        const completed = this.isCompleted(remainingMx);
        if (unlockedIxs.length === 0 || completed) {
            return [{ points, completed }];
        }
        const possibleWays = unlockedIxs.map((unlockedIndex) => {
            // Complete area
            remainingMx[unlockedIndex] = false;
            // Calculate next unlocks
            const nextUnlockedIxs = this.updateUnlocked(remainingMx, ignoreBonuses);
            const updatedWaypoints: Area[] = [...points, this.areas[unlockedIndex]];
            const res = this.tryAllWays(nextUnlockedIxs, remainingMx, { points: updatedWaypoints, completed: false });
            // Return completion step for next iterations (this field is not copying)
            remainingMx[unlockedIndex] = true;
            return res;
        });
        let mergedWays: Way[] = [];
        possibleWays.forEach((ways) => {
            mergedWays = [...mergedWays, ...ways];
        });
        return mergedWays;
    }

    private isCompleted(remainigMx: boolean[]): boolean {
        return remainigMx.some((remains, ix) => {
            return !remains && this.areas[ix].isEnd();
        });
    }

    private updateUnlocked(remainingMx: boolean[], ignoreBonuses: boolean): number[] {
        const unlocked: number[] = [];
        remainingMx.forEach((remains, ix) => {
            if (!remains) return undefined; // Already completed area
            if (ignoreBonuses && this.areas[ix].isBonus()) return; // Ignoring bonus area
            if (!this.areas[ix].isNotLocked(remainingMx)) return; // Locked area
            unlocked.push(ix);
        });
        return unlocked;
    }

    private getStartArea(): Area {
        const start = this.areas.find((area) => area.type === AreaType.Start);
        if (!start) {
            throw new Error('Can\'t find start of DnD');
        }
        return start;
    }

    public getAreasWithRefs(): AreaWithRefs[] {
        return this.areas.map((area) => ({
            area,
            refs: this.getRefsByConstraints(area.getConstraints()),
        }));
    }

    private getRefsByConstraints(constraints: Constraint[]): AreaRef[] {
        let orPrefix = '';
        let areaRefs: AreaRef[] = [];
        constraints.forEach((c) => {
            if (c.and) {
                areaRefs = [...areaRefs, ...c.and.map((ix) => ({
                    refPrefix: '+',
                    area: this.areas[ix],
                }))];
            }
            else if (c.or) {
                orPrefix += '?';
                areaRefs = [...areaRefs, ...c.or.map((ix) => ({
                    refPrefix: orPrefix,
                    area: this.areas[ix],
                }))];
            }
            else if (c.not) {
                areaRefs = [...areaRefs, ...c.not.map((ix) => ({
                    refPrefix: '-',
                    area: this.areas[ix],
                }))];
            }
        });
        return areaRefs;
    }
}
