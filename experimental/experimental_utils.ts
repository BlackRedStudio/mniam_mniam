export function csvToArray(str: string, delimiter: string = ',') {
    const headers = str.slice(0, str.indexOf('\n')).split(delimiter);

    const rows = str.slice(str.indexOf('\n') + 1).split('\n');

    const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        const el = headers.reduce(function (
            object: Record<string, string>,
            header,
            index,
        ) {
            object[header] = values[index];
            return object;
        }, {});
        return el;
    });

    // return the array
    return arr;
}


export function handleCurrencyInput(value: string) {
    if (value.match(/[^0-9.]/g)) {
        return null;
    }

    const splittedVal = value.split('.');

    if (splittedVal.length < 3) {
        if (splittedVal.length > 1 && splittedVal[1].length > 2) {
            return null;
        }
        return value;
    }
    return null;
}
