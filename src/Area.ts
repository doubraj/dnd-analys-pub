export interface Constraint {
    or?: number[];
    and?: number[];
    not?: number[];
}

export enum AreaStates {
    locked,
    unlocked,
    completed,
}

export default class Area {
    private constraints: Constraint[] = [];

    public constructor(
        public readonly label: string,
        public readonly name: string
    ) {}

    public setConstraints(constraints: Constraint[]): void {
        this.constraints = constraints;
    }

    public getConstraints(): Constraint[] {
        return this.constraints;
    }
}
