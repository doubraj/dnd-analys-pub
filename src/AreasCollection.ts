import Area, {Constraint} from './Area';

interface AreaRef {
    refPrefix: string;
    area: Area;
}

interface AreaWithRefs {
    area: Area;
    refs: AreaRef[];
}

export default class AreasCollection {
    public constructor(
        private readonly areas: Area[],
    ) {}

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
