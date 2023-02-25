import Area, {AreaType, Constraint} from './Area';
import {Logger} from "./Logger";

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
}

export default class AreasCollection {
    public constructor(
        private readonly areas: Area[],
        private readonly logger: Logger,
    ) {}

    public getAllPossibleWays(): Way[] {
        try {
            const start = this.getStartArea();
            const unlockedIxs = [start.index];
            const remainingMx = this.areas.map(() => true);
            return this.tryAllWays(unlockedIxs, remainingMx, { points: [], completed: false })
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
        ignoreBonuses: boolean = true,
    ): Way[] {
        const completed = this.isCompleted(remainingMx);
        if (unlockedIxs.length === 0 || completed) {
            return [{ points, completed }];
        }
        const possibleWays = unlockedIxs.map((unlockedIndex, fieldIx) => {
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
