import { Game, Prepare } from './Game';
import { rawGames } from './DataSource';

export interface RawGame {
    name: string;
    length: number;
    prepare: Prepare;
    area?: string;
    desc?: string;
    strength?: number;
    manual?: number;
    knowledge?: number;
    thinking?: number;
    coop?: number;
    single?: number;
}

export const createGames = (onlyAssigned = true): Game[] => {
    const filteredGames = onlyAssigned ? rawGames.filter((game) => game.area) : rawGames;
    return filteredGames.map((
        {
            area,
            name,
            length,
            prepare,
            strength,
            manual,
            knowledge,
            thinking,
            coop,
            single,
        }) => new Game(
        area ?? '', name, length, prepare, {
            strength: strength ?? 0,
            manual: manual ?? 0,
            knowledge: knowledge ?? 0,
            thinking: thinking ?? 0,
            coop: coop ?? 0,
            single: single ?? 0,
        },
    ));
};
