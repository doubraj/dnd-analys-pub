import { AreaType } from "./Area";
import { AreaRaw } from "./DataFactory";

export const rawAreas: AreaRaw[] = [
    { label: '1', name: 'Duběnka', constraints: [{}], type: AreaType.Start },
    { label: '2', name: 'Pašerácké stezky', constraints: [{ and: ['1'] }], type: AreaType.BaseHalf },
    { label: '3', name: 'Trolí pahorkatina', constraints: [{ and: ['1'] }], type: AreaType.BaseHalf },
    { label: '4', name: 'Bažiny a traverzy', constraints: [{ and: ['1'] }], type: AreaType.BaseHalf },
    { label: '5', name: 'Přístaviště', constraints: [{ and: ['3', '4'] }], type: AreaType.BaseHalf },
    { label: '6', name: 'Nehostinná tundra', constraints: [{ and: ['2', '4'] }], type: AreaType.BaseHalf },
    { label: '7x', name: 'Šamanova chýše v lesích', constraints: [{ and: ['6'] }, { not: ['7y'] }], type: AreaType.BaseHalf },
    { label: '7y', name: 'Lovecká chatrč', constraints: [{ and: ['6']}, { not: ['7x'] }], type: AreaType.BaseHalf },
    { label: '8x', name: 'Doly a Daně', constraints: [{ and: ['2', '5'] }, { not: ['8y'] }], type: AreaType.BaseFull },
    { label: '8y', name: 'Starostovy Horní Mousy', constraints: [{ and: ['2', '5']}, { not: ['8x'] }], type: AreaType.BaseFull },
    { label: 'B1', name: 'Skalní město', constraints: [{ and: ['3'] }], type: AreaType.BaseBonus },
    { label: 'B2', name: 'Maják', constraints: [{ or: ['7y', '8y'] }], type: AreaType.BaseBonus },
    { label: '9a', name: 'Vesnice v podhradí', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9b', '10b'] }], type: AreaType.FinalHalf },
    { label: '10a', name: 'Šlechtická tvrz', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9b', '10b'] }], type: AreaType.FinalHalf },
    { label: 'Ba', name: 'Pohřebiště', constraints: [{ or: ['9a', '10a'] }], type: AreaType.FinalBonus },
    { label: '11a', name: 'Královský palác', constraints: [{ and: ['9a', '10a'] }], type: AreaType.End },
    { label: '9b', name: 'Skalní labyrint', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9a', '10a'] }], type: AreaType.FinalHalf },
    { label: '10b', name: 'Jeskyně skřetů', constraints: [{ or: ['7x', '7y'] }, { or: ['8x', '8y'] }, { not: ['9a', '10a'] }], type: AreaType.FinalHalf },
    { label: '11b', name: 'Dračí doupě', constraints: [{ and: ['9b', '10b'] }], type: AreaType.End },
    { label: 'Bb', name: 'Oáza klidu', constraints: [{ or: ['9b', '10b'] }], type: AreaType.FinalBonus },
];
