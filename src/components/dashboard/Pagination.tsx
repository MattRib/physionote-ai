'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}) => {
  
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const showPages = 5; // Number of page buttons to show

    if (totalPages <= showPages + 2) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage > 3) {
        pages.push('...');
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push('...');
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
      
      {/* Results Info */}
      <div className="text-sm text-[#666666]">
        Mostrando <span className="font-semibold text-[#333333]">{startItem}</span> a{' '}
        <span className="font-semibold text-[#333333]">{endItem}</span> de{' '}
        <span className="font-semibold text-[#333333]">{totalItems}</span> sessões
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center space-x-2">
        
        {/* First Page */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border-2 border-gray-200
                   hover:border-[#5A9BCF] hover:bg-[#5A9BCF]/10 hover:text-[#5A9BCF]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200
                   transition-all duration-200 text-[#666666]"
          title="Primeira página"
        >
          <ChevronsLeft className="w-5 h-5" />
        </button>

        {/* Previous Page */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border-2 border-gray-200
                   hover:border-[#5A9BCF] hover:bg-[#5A9BCF]/10 hover:text-[#5A9BCF]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200
                   transition-all duration-200 text-[#666666]"
          title="Página anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center space-x-2">
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`ellipsis-${index}`} className="px-3 py-2 text-[#666666]">
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2 rounded-lg border-2 font-medium
                         transition-all duration-200 min-w-[44px]
                         ${currentPage === page
                           ? 'border-[#5A9BCF] bg-[#5A9BCF] text-white'
                           : 'border-gray-200 text-[#666666] hover:border-[#5A9BCF] hover:bg-[#5A9BCF]/10 hover:text-[#5A9BCF]'
                         }`}
              >
                {page}
              </button>
            )
          ))}
        </div>

        {/* Mobile: Current Page Indicator */}
        <div className="sm:hidden px-4 py-2 text-sm font-medium text-[#333333]">
          {currentPage} / {totalPages}
        </div>

        {/* Next Page */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border-2 border-gray-200
                   hover:border-[#5A9BCF] hover:bg-[#5A9BCF]/10 hover:text-[#5A9BCF]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200
                   transition-all duration-200 text-[#666666]"
          title="Próxima página"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Last Page */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border-2 border-gray-200
                   hover:border-[#5A9BCF] hover:bg-[#5A9BCF]/10 hover:text-[#5A9BCF]
                   disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200
                   transition-all duration-200 text-[#666666]"
          title="Última página"
        >
          <ChevronsRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
