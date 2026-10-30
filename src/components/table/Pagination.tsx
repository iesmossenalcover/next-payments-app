interface PaginationProps {
    page: number;
    pageCount: number;
    pageSize?: number;
    total: number;
    onPageChange: (page: number) => void;
    className?: string;
}

// Pàgines a mostrar (base 0): primera, última i les veïnes de l'actual; null és "…".
const pageWindow = (page: number, pageCount: number): (number | null)[] => {
    const pages: (number | null)[] = [];

    for (let i = 0; i < pageCount; i++) {
        if (i === 0 || i === pageCount - 1 || Math.abs(i - page) <= 1) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== null) {
            pages.push(null);
        }
    }

    return pages;
}

export const Pagination = ({ page, pageCount, pageSize, total, onPageChange, className = "" }: PaginationProps) => {
    if (!pageSize || pageCount <= 1) return null;

    const from = page * pageSize + 1;
    const to = Math.min(total, (page + 1) * pageSize);

    return (
        <nav aria-label="Paginació" className={`flex flex-wrap items-center justify-between gap-3 text-sm text-slate-500 ${className}`}>
            <p>Mostrant {from}–{to} de {total}</p>
            <div className="flex items-center gap-1">
                <button
                    type="button"
                    title="Pàgina anterior"
                    className="btn-icon"
                    disabled={page === 0}
                    onClick={() => onPageChange(page - 1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                    </svg>
                </button>
                {pageWindow(page, pageCount).map((x, idx) => x === null
                    ? <span key={`gap-${idx}`} className="px-1 text-slate-400">…</span>
                    : <button
                        key={x}
                        type="button"
                        aria-current={x === page ? "page" : undefined}
                        className={`btn btn-sm min-w-9 ${x === page ? "btn-primary" : "btn-ghost"}`}
                        onClick={() => onPageChange(x)}>
                        {x + 1}
                    </button>
                )}
                <button
                    type="button"
                    title="Pàgina següent"
                    className="btn-icon"
                    disabled={page >= pageCount - 1}
                    onClick={() => onPageChange(page + 1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-4 w-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </button>
            </div>
        </nav>
    );
}
