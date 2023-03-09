
export const unique = <T>(arr: T[]): T[] => {
    return new Array(...new Set(arr));
};
