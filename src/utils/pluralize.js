export const getPluralForm = (count, one, few, many) => {
    count = Math.abs(count);

    if (count % 100 >= 11 && count % 100 <= 19) return many;
    if (count % 10 === 1) return one;
    if (count % 10 >= 2 && count % 10 <= 4) return few;

    return many;
};
