import { useCallback } from 'react';

const MAX_VISIBLE_PAGES = 5;

export default function Pagination({ page, totalPages, total, limit, onPageChange }) {
  const handlePrev = useCallback(() => {
    if (page > 1) onPageChange(page - 1);
  }, [page, onPageChange]);

  const handleNext = useCallback(() => {
    if (page < totalPages) onPageChange(page + 1);
  }, [page, totalPages, onPageChange]);

  const handleFirst = useCallback(() => {
    if (page > 1) onPageChange(1);
  }, [page, onPageChange]);

  const handleLast = useCallback(() => {
    if (page < totalPages) onPageChange(totalPages);
  }, [page, totalPages, onPageChange]);

  // Build page numbers: 1, 2, 3, ..., 10
  let pages = [];
  if (totalPages <= MAX_VISIBLE_PAGES + 2) {
    pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const left = Math.max(1, page - 1);
    const right = Math.min(totalPages, page + 1);
    const useLeftEllipsis = left > 2;
    const useRightEllipsis = right < totalPages - 1;
    if (useLeftEllipsis) pages.push(1);
    if (left > 2) pages.push('...');
    for (let i = left; i <= right; i++) {
      if (i >= 1 && i <= totalPages) pages.push(i);
    }
    if (right < totalPages - 1) pages.push('...');
    if (useRightEllipsis) pages.push(totalPages);
  }

  if (totalPages <= 0) return null;

  return (
    <nav className="pagination" aria-label="Incident list pagination">
      <span className="pagination-info">
        Page {page} of {totalPages}
      </span>
      <div className="pagination-buttons">
        <button type="button" onClick={handleFirst} disabled={page <= 1} aria-label="First page">
          &laquo;
        </button>
        <button type="button" onClick={handlePrev} disabled={page <= 1} aria-label="Previous page">
          &lsaquo;
        </button>
        {pages.map((p, i) =>
          p === '...' ? (
            <span key={`ellipsis-${i}`} className="pagination-ellipsis">
              ...
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              disabled={p === page}
              className={p === page ? 'active' : ''}
              aria-label={`Page ${p}`}
              aria-current={p === page ? 'page' : undefined}
            >
              {p}
            </button>
          )
        )}
        <button type="button" onClick={handleNext} disabled={page >= totalPages} aria-label="Next page">
          &rsaquo;
        </button>
        <button type="button" onClick={handleLast} disabled={page >= totalPages} aria-label="Last page">
          &raquo;
        </button>
      </div>
    </nav>
  );
}
