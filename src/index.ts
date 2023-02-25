import { createAreaCollection } from './DataSource';

const areaCollection = createAreaCollection();
// PRINT ALL AREAS WITH ITS CONSTRAINTS
areaCollection.getAreasWithRefs().forEach(({area, refs}) => {
    console.log(`${area.label}: ${area.name}`);
    refs.forEach((ref) => {
        console.log(`  ${ref.refPrefix} ${ref.area.label}: ${ref.area.name}`);
    });
});
// todo - print all area with its constraints
// todo - count all possible game paths
// todo - think about possibilities of this model
