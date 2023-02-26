import { Game } from './Game';

export interface Constraint {
    or?: number[];
    and?: number[];
    not?: number[];
}

export enum AreaType {
    Start,
    BaseHalf,
    BaseFull,
    BaseBonus,
    FinalHalf,
    FinalBonus,
    End,
}

export default class Area {
    private constraints: Constraint[] = [];
    private game?: Game;

    public constructor(
        public readonly index: number,
        public readonly label: string,
        public readonly name: string,
        public readonly type: AreaType,
    ) {}

    public setConstraints(constraints: Constraint[]): void {
        this.constraints = constraints;
    }

    public getConstraints(): Constraint[] {
        return this.constraints;
    }

    public setGame(game: Game): void {
        this.game = game;
    }

    public getGame(): Game | undefined {
        return this.game;
    }

    public isBonus(): boolean {
        return this.type === AreaType.BaseBonus || this.type === AreaType.FinalBonus;
    }

    public isEnd(): boolean {
        return this.type === AreaType.End;
    }

    public isNotLocked(remainingAreasMx: boolean[]): boolean {
        /**
         * remainingAreasMx is Matrix of all areas
         * > true = area is remaining (but don't have to be reachable)
         * > false = area is completed
         */
        return this.constraints.every((c) => {
            if (c.or) {
                return c.or.some((ix) => !remainingAreasMx[ix]);
            }
            if (c.and) {
                /** All of these areas are completed */
                return c.and.every((ix) => !remainingAreasMx[ix]);
            }
            if (c.not) {
                /** All of these restricted areas are remaining */
                return c.not.every((ix) => remainingAreasMx[ix]);
            }
            return true;
        });
    }
}
