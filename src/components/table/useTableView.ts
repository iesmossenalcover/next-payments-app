import { useCallback, useMemo, useState } from "react";

/*
    Filtre i ordenació en client per a les taules.

    Pensat per a llistes que ja arriben senceres de l'API (centenars de files):
    filtrar i ordenar és instantani, el que costa és pintar el DOM, per això
    el resultat va memoitzat i el component Table no repinta les files iguals.
*/

export type SortDirection = "asc" | "desc";

export interface SortState<T> {
    key: keyof T,
    dir: SortDirection,
}

export type SortValue = string | number | null | undefined;
export type SortAccessors<T> = Partial<Record<keyof T, (it: T) => SortValue>>;

// Clic a una columna: ascendent → descendent → ordre original.
export const useSort = <T>(initial?: SortState<T>) => {
    const [sort, setSort] = useState<SortState<T> | undefined>(initial);

    const toggleSort = useCallback((key: keyof T) => {
        setSort(prev => {
            if (prev?.key !== key) return { key, dir: "asc" };
            if (prev.dir === "asc") return { key, dir: "desc" };
            return undefined;
        });
    }, []);

    return { sort, setSort, toggleSort };
}

const collator = new Intl.Collator("ca", { numeric: true, sensitivity: "base" });

const isEmpty = (value: SortValue) => value === null || value === undefined || value === "";

const compareValues = (a: SortValue, b: SortValue): number => {
    if (typeof a === "number" && typeof b === "number") return a - b;
    return collator.compare(String(a), String(b));
}

const defaultAccessor = <T>(key: keyof T) => (it: T): SortValue => {
    const value = it[key];
    return typeof value === "string" || typeof value === "number" ? value : undefined;
}

export const sortItems = <T>(items: T[], sort: SortState<T> | undefined, accessors?: SortAccessors<T>): T[] => {
    if (!sort) return items;

    const accessor = accessors?.[sort.key] ?? defaultAccessor<T>(sort.key);
    const factor = sort.dir === "asc" ? 1 : -1;

    return items
        .map(item => ({ item, value: accessor(item) }))
        .sort((a, b) => {
            // Els buits sempre al final, sigui quin sigui el sentit.
            const aEmpty = isEmpty(a.value), bEmpty = isEmpty(b.value);
            if (aEmpty || bEmpty) return aEmpty === bEmpty ? 0 : aEmpty ? 1 : -1;
            return compareValues(a.value, b.value) * factor;
        })
        .map(x => x.item);
}

interface TableViewOptions<T> {
    // Ha de ser estable (useCallback) o es recalcularà a cada render.
    filter?: (it: T) => boolean,
    sort?: SortState<T>,
    // Valors per ordenar quan el camp de la fila no serveix (dates formatades, nulls...).
    sortAccessors?: SortAccessors<T>,
    // Sense pageSize no es pagina.
    pageSize?: number,
}

export interface TableView<T> {
    // Files de la pàgina actual, ja filtrades i ordenades.
    items: T[],
    // Files que passen el filtre (totes les pàgines).
    total: number,
    page: number,
    pageCount: number,
    pageSize?: number,
    setPage: (page: number) => void,
}

export const useTableView = <T>(items: T[], { filter, sort, sortAccessors, pageSize }: TableViewOptions<T>): TableView<T> => {
    const filtered = useMemo(
        () => sortItems(filter ? items.filter(filter) : items, sort, sortAccessors),
        [items, filter, sort, sortAccessors]);

    const [page, setPage] = useState(0);

    // Si canvia el filtre o l'ordre es torna a la primera pàgina. Si només canvien
    // les dades (p. ex. s'ha eliminat una fila) es manté la pàgina, retallada al final.
    const [view, setView] = useState({ filter, sort });
    if (view.filter !== filter || view.sort !== sort) {
        setView({ filter, sort });
        setPage(0);
    }

    const pageCount = pageSize ? Math.max(1, Math.ceil(filtered.length / pageSize)) : 1;
    const current = Math.min(page, pageCount - 1);

    const pageItems = useMemo(
        () => pageSize ? filtered.slice(current * pageSize, (current + 1) * pageSize) : filtered,
        [filtered, current, pageSize]);

    return { items: pageItems, total: filtered.length, page: current, pageCount, pageSize, setPage };
}
