import React, { useEffect, useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import styles from './style.module.scss';

const CustomTablePagination = ({
  totalCount,
  pageNo = 1,
  setPageNo,
  limit = 10,
}) => {
  const [currentPage, setCurrentPage] = useState(pageNo);
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    setCurrentPage(pageNo);
  }, [pageNo]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setPageNo(page);
    }
  };

  const generatePageNumbers = () => {
    const maxVisible = 3;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  return (
    <div
      className={`${styles.paginationContainer} sm:flex-wrap sm:justify-center`}
    >
      <Pagination>
        <PaginationContent
          className={`${styles.paginationContent} sm:flex-wrap`}
        >
          <PaginationItem disabled={currentPage === 1}>
            <PaginationPrevious
              className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
              onClick={() =>
                currentPage !== 1 && handlePageChange(currentPage - 1)
              }
            />
          </PaginationItem>

          {generatePageNumbers().map((page) => (
            <PaginationItem key={page} active={page === currentPage}>
              <PaginationLink
                className={`${styles.paginationLink} ${page === currentPage ? styles.active : ''}`}
                onClick={() => handlePageChange(page)}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {currentPage < totalPages - 2 && (
            <PaginationItem className="hidden sm:block">
              <PaginationEllipsis className={styles.paginationEllipsis} />
            </PaginationItem>
          )}
          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationNext
              className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
              onClick={() =>
                currentPage !== totalPages && handlePageChange(currentPage + 1)
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default CustomTablePagination;
