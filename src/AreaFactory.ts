import Area, { AreaType, Constraint } from './Area';
import AreasCollection from './AreasCollection';
import { rawAreas } from './DataSource';
import { Logger } from './Logger';

export interface ConstraintRaw {
    or?: string[];
    and?: string[];
    not?: string[];
}

export interface AreaRaw {
    label: string;
    name: string;
    constraints: ConstraintRaw[];
    type: AreaType,
}

const getIndex = (areas: Area[], code: string): number => {
    const index = areas.findIndex((area) => area.label === code);
    if (index < 0) throw new Error('Unimplemented area reference ' + code);
    return index;
};

const getConstraints = (areas: Area[], csRaw: ConstraintRaw[]): Constraint[] => {
    const refMapper = (str: string) => getIndex(areas, str);
    return csRaw.map((c) => ({
        ...(c.or ? { or: c.or.map(refMapper) } : {}),
        ...(c.and ? { and: c.and.map(refMapper) } : {}),
        ...(c.not ? { not: c.not.map(refMapper) } : {}),
    }));
};

export const createAreaCollection = function(logger: Logger): AreasCollection {
    const areas = rawAreas.map((area, index) => new Area(index, area.label, area.name, area.type));
    areas.forEach((area, ix) => {
        area.setConstraints(getConstraints(areas, rawAreas[ix].constraints));
    });
    return new AreasCollection(areas, logger);
};
