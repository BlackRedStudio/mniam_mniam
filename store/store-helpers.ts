import { WritableAtom, atom } from "jotai";

export const atomWithLocalStorage = <T>(key: string, initialValue: T) => {
    
    const getInitialValue = () => {
        const item = localStorage.getItem(key);

        if (item !== null) {
            return JSON.parse(item);
        }
        return initialValue;
    };

    const baseAtom = atom<T>(getInitialValue()) as WritableAtom<
        T,
        any[],
        unknown
    >;

    const derivedAtom = atom<T, any[], unknown>(
        get => get(baseAtom),
        (get, set, update) => {
            const nextValue =
                typeof update === 'function' ? update(get(baseAtom)) : update;
            set(baseAtom, nextValue);
            localStorage.setItem(key, JSON.stringify(nextValue));
        },
    );
    return derivedAtom;
};
