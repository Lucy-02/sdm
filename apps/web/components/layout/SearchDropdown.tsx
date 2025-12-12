'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Clock, X, Trash2 } from 'lucide-react';

const SEARCH_HISTORY_KEY = 'sdm-search-history';
const MAX_HISTORY_ITEMS = 10;

interface SearchDropdownProps {
  className?: string;
  isMobile?: boolean;
}

export default function SearchDropdown({ className = '', isMobile = false }: SearchDropdownProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync search query from URL params
  useEffect(() => {
    const urlSearch = searchParams.get('search');
    if (urlSearch) {
      setSearchQuery(urlSearch);
    }
  }, [searchParams]);

  // Load search history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setSearchHistory(parsed);
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
  }, []);

  // Save search history to localStorage
  const saveHistory = useCallback((history: string[]) => {
    localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
    setSearchHistory(history);
  }, []);

  // Remove single item from history
  const removeFromHistory = useCallback((term: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newHistory = searchHistory.filter((item) => item !== term);
    saveHistory(newHistory);
  }, [searchHistory, saveHistory]);

  // Clear all history
  const clearHistory = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    saveHistory([]);
  }, [saveHistory]);

  // Handle search submission
  const handleSearch = useCallback((term?: string) => {
    const searchTerm = (term ?? searchQuery).trim();
    if (searchTerm) {
      // Add to history inline to avoid stale closure
      const saved = localStorage.getItem(SEARCH_HISTORY_KEY);
      let currentHistory: string[] = [];
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            currentHistory = parsed;
          }
        } catch {
          // ignore
        }
      }
      const newHistory = [
        searchTerm,
        ...currentHistory.filter((item) => item !== searchTerm),
      ].slice(0, MAX_HISTORY_ITEMS);
      localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(newHistory));
      setSearchHistory(newHistory);

      setIsOpen(false);
      router.push(`/vendors?search=${encodeURIComponent(searchTerm)}`);
    }
  }, [searchQuery, router]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  // Handle clicking on history item
  const handleHistoryClick = (term: string) => {
    setSearchQuery(term);
    handleSearch(term);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter history based on current search query
  const filteredHistory = searchQuery.trim()
    ? searchHistory.filter((item) =>
        item.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : searchHistory;

  const showDropdown = isOpen && (searchHistory.length > 0 || searchQuery.trim());

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsOpen(true)}
            placeholder="업체명으로 검색"
            className={`w-full pl-10 pr-4 py-2 border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#C58D8D] focus:border-transparent transition-all ${
              isMobile ? 'rounded-full' : 'rounded'
            }`}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-neutral-200 rounded-lg shadow-lg z-50 overflow-hidden">
          {/* Header with clear button */}
          {searchHistory.length > 0 && !searchQuery.trim() && (
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-100">
              <span className="text-xs font-medium text-neutral-500">최근 검색어</span>
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                전체 삭제
              </button>
            </div>
          )}

          {/* Filtered results header */}
          {searchQuery.trim() && filteredHistory.length > 0 && (
            <div className="px-4 py-2 border-b border-neutral-100">
              <span className="text-xs font-medium text-neutral-500">검색 기록</span>
            </div>
          )}

          {/* History list */}
          <div className="max-h-64 overflow-y-auto">
            {filteredHistory.length > 0 ? (
              filteredHistory.map((term) => (
                <button
                  key={term}
                  onClick={() => handleHistoryClick(term)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-neutral-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-neutral-400" />
                    <span className="text-sm text-neutral-700">{term}</span>
                  </div>
                  <div
                    onClick={(e) => removeFromHistory(term, e)}
                    className="p-1 text-neutral-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="삭제"
                  >
                    <X className="w-4 h-4" />
                  </div>
                </button>
              ))
            ) : searchQuery.trim() ? (
              <div className="px-4 py-6 text-center">
                <p className="text-sm text-neutral-500">일치하는 검색 기록이 없습니다</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Enter를 눌러 &quot;{searchQuery}&quot; 검색
                </p>
              </div>
            ) : null}
          </div>

          {/* Search suggestion when typing */}
          {searchQuery.trim() && (
            <button
              onClick={() => handleSearch()}
              className="w-full flex items-center gap-3 px-4 py-3 border-t border-neutral-100 hover:bg-[#FDF8F8] transition-colors"
            >
              <Search className="w-4 h-4 text-[#C58D8D]" />
              <span className="text-sm text-[#C58D8D] font-medium">
                &quot;{searchQuery}&quot; 검색
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
