import { CaretLeft, CaretRight } from "@phosphor-icons/react/ssr";
import styles from "./pagination.module.css";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Page buttons kept adjacent to the current page on each side. */
  siblingCount?: number;
  className?: string;
};

const ELLIPSIS = "ellipsis" as const;

function buildPageList(currentPage: number, totalPages: number, siblingCount: number) {
  const totalSlots = siblingCount * 2 + 5; // first + last + current + 2 ellipses
  if (totalPages <= totalSlots) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const left = Math.max(currentPage - siblingCount, 2);
  const right = Math.min(currentPage + siblingCount, totalPages - 1);

  const pages: (number | typeof ELLIPSIS)[] = [1];
  if (left > 2) pages.push(ELLIPSIS);
  for (let page = left; page <= right; page += 1) pages.push(page);
  if (right < totalPages - 1) pages.push(ELLIPSIS);
  pages.push(totalPages);
  return pages;
}

/**
 * Page-number navigation for a paged data set — pairs naturally with
 * `Table` (render `<Pagination>` below it) but is standalone: it takes
 * `currentPage`/`totalPages`/`onPageChange` and owns no state of its own,
 * so the consumer's own page-state (however it's stored) drives it.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = "",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = buildPageList(currentPage, totalPages, siblingCount);

  return (
    <nav aria-label="Pagination" className={`${styles.nav} ${className}`}>
      <button
        type="button"
        className={styles.arrow}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <CaretLeft size={14} weight="bold" />
      </button>

      <ul className={styles.list}>
        {pages.map((page, index) =>
          page === ELLIPSIS ? (
            <li key={`ellipsis-${index}`} className={styles.ellipsis} aria-hidden>
              …
            </li>
          ) : (
            <li key={page}>
              <button
                type="button"
                className={styles.page}
                data-active={page === currentPage || undefined}
                aria-current={page === currentPage ? "page" : undefined}
                aria-label={`Page ${page}`}
                onClick={() => onPageChange(page)}
              >
                {page}
              </button>
            </li>
          ),
        )}
      </ul>

      <button
        type="button"
        className={styles.arrow}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <CaretRight size={14} weight="bold" />
      </button>
    </nav>
  );
}
