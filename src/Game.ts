export enum Prepare {
    NOTHING,
    EASY,
    HARD60,
    EXTREME
}

export interface GameTags {
    strength: number;
    manual: number;
    knowledge: number;
    thinking: number;
    coop: number;
    single: number;
}

export class Game {
    public constructor(
        public readonly area: string,
        public readonly name: string,
        public readonly length: number,
        public readonly prepare: Prepare,
        public readonly tags: GameTags = {
            strength: 0,
            manual: 0,
            knowledge: 0,
            thinking: 0,
            coop: 0,
            single: 0,
        },
    ) {}
}
