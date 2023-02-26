function updateField(completionIx: number, updatedMx: number[]): void {
    updatedMx[completionIx] = 0;
}

const remainingMx = [0, 1, 1, 1, 1];
console.log(remainingMx);
updateField(2, remainingMx);
console.log(remainingMx);
