import Area, {Constraint} from './Area';
import AreasCollection from "./AreasCollection";

export interface ConstraintRaw {
    or?: string[];
    and?: string[];
    not?: string[];
}

interface AreaRaw {
    label: string;
    name: string;
    constraints: ConstraintRaw[];
}

const rawAreas: AreaRaw[] = [
    { label: '1', name: 'Duběnka', constraints: [{}]},
    { label: '2', name: 'Pašerácké stezky', constraints: [{ and: ['1'] }] },
    { label: '3', name: 'Trolí pahorkatina', constraints: [{ and: ['1'] }] },
    { label: '4', name: 'Bažiny a traverzy', constraints: [{ and: ['1'] }] },
    { label: '5', name: 'Přístaviště', constraints: [{ and: ['3', '4'] }] },
    { label: '6', name: 'Nehostinná tundra', constraints: [{ and: ['2', '4'] }] },
    { label: '7x', name: 'Šamanova chýše v lesích', constraints: [{ and: ['6'] }, { not: ['7y'] }] },
    { label: '7y', name: 'Lovecká chatrč', constraints: [{ and: ['6']}, { not: ['7x'] }] },
    { label: '8x', name: 'Doly a Daně', constraints: [{ and: ['2', '5'] }, { not: ['8y'] }] },
    { label: '8y', name: 'Starostovy Horní Mousy', constraints: [{ and: ['2', '5']}, { not: ['8x'] }] },
    { label: 'B1', name: 'Skalní město', constraints: [{ and: ['3'] }] },
    { label: 'B2', name: 'Maják', constraints: [{ or: ['7y', '8y'] }] },
    { label: '9a', name: 'Vesnice v podhradí', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9b', '10b'] }] },
    { label: '10a', name: 'Šlechtická tvrz', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9b', '10b'] }] },
    { label: 'Ba', name: 'Pohřebiště', constraints: [{ or: ['9a', '10a'] }] },
    { label: '11a', name: 'Královský palác', constraints: [{ and: ['9a', '10a'] }] },
    { label: '9b', name: 'Skalní labyrint', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9a', '10a'] }] },
    { label: '10b', name: 'Jeskyně skřetů', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9a', '10a'] }] },
    { label: '11b', name: 'Dračí doupě', constraints: [{ and: ['9b', '10b'] }] },
    { label: 'Bb', name: 'Oáza klidu', constraints: [{ or: ['9b', '10b'] }] },
];

const getIndex = (areas: Area[], code: string): number => {
    const index = areas.findIndex((area) => area.label === code);
    if (index < 0) throw new Error('Unimplemented area reference ' + code);
    return index;
};

const getConstraints = (areas: Area[], csRaw: ConstraintRaw[]): Constraint[] => {
    const refMapper = (str: string) => getIndex(areas, str);
    return csRaw.map((c) => ({
        ...(c.or ? { or: c.or.map(refMapper)} : {}),
        ...(c.and ? { and: c.and.map(refMapper)} : {}),
        ...(c.not ? { not: c.not.map(refMapper)} : {}),
    }));
}

export const createAreaCollection = function(): AreasCollection {
    const areas = rawAreas.map((area) => new Area(area.label, area.name));
    areas.forEach((area, ix) => {
        area.setConstraints(getConstraints(areas, rawAreas[ix].constraints));
    });
    return new AreasCollection(areas);
};
