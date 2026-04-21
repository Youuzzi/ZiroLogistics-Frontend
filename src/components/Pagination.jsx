import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-end gap-2 p-6 border-t border-slate-800">
      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mr-4">
        Page {currentPage + 1} of {totalPages}
      </span>
      <button
        disabled={currentPage === 0}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-2 bg-slate-800 rounded-lg text-white disabled:opacity-20 hover:bg-[#0dcaf0] hover:text-black transition-all"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        disabled={currentPage >= totalPages - 1}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-2 bg-slate-800 rounded-lg text-white disabled:opacity-20 hover:bg-[#0dcaf0] hover:text-black transition-all"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};

export default Pagination;
