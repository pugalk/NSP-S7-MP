import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { CATEGORIES, STATES, COURSES } from '../data/scholarships';
import ScholarshipCard from '../components/ScholarshipCard';
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal, 
  IndianRupee, 
  Calendar,
  Sparkles,
  BookOpen,
  RotateCcw,
  LayoutGrid,
  List,
  Scale,
  Heart,
  ChevronRight,
  TrendingUp,
  Clock,
  ArrowUpDown
} from 'lucide-react';

export default function ScholarshipsPage() {
  const { scholarships, compareList, wishlist } = usePortal();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [selectedState, setSelectedState] = useState(searchParams.get('state') || 'All');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [maxIncome, setMaxIncome] = useState(1000000);
  const [minPercentageCutoff, setMinPercentageCutoff] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [page, setPage] = useState(1);
  const itemsPerPage = 9;

  const now = new Date();

  // Keep state synced with URL search params
  React.useEffect(() => {
    const q = searchParams.get('q');
    if (q !== null && q !== searchQuery) setSearchQuery(q);
    const cat = searchParams.get('category');
    if (cat !== null && cat !== selectedCategory) setSelectedCategory(cat);
    const st = searchParams.get('state');
    if (st !== null && st !== selectedState) setSelectedState(st);
  }, [searchParams]);

  // Filter & Sort computation
  const filteredSchemes = useMemo(() => {
    let result = [...scholarships];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        (s.description && s.description.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(s => s.category.toLowerCase().includes(selectedCategory.toLowerCase()));
    }

    // State Domicile
    if (selectedState && selectedState !== 'All') {
      result = result.filter(s => 
        !s.eligibleStates || s.eligibleStates.length === 0 || s.eligibleStates.includes(selectedState)
      );
    }

    // Course Level
    if (selectedCourse && selectedCourse !== 'All') {
      result = result.filter(s => 
        !s.eligibleCourses || s.eligibleCourses.length === 0 || s.eligibleCourses.includes(selectedCourse)
      );
    }

    // Income
    if (maxIncome < 1000000) {
      result = result.filter(s => !s.maxFamilyIncome || s.maxFamilyIncome <= maxIncome);
    }

    // Minimum Percentage
    if (minPercentageCutoff > 0) {
      result = result.filter(s => !s.minPercentage || s.minPercentage <= minPercentageCutoff);
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'deadline') return new Date(a.closingDate) - new Date(b.closingDate);
      if (sortBy === 'amount_desc') return b.amount - a.amount;
      if (sortBy === 'amount_asc') return a.amount - b.amount;
      if (sortBy === 'popularity') return Number(b.id) - Number(a.id);
      return a.name.localeCompare(b.name);
    });

    return result;
  }, [scholarships, searchQuery, selectedCategory, selectedState, selectedCourse, maxIncome, minPercentageCutoff, sortBy]);

  const totalPages = Math.ceil(filteredSchemes.length / itemsPerPage);
  const paginatedSchemes = filteredSchemes.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedState('All');
    setSelectedCourse('All');
    setMaxIncome(1000000);
    setMinPercentageCutoff(0);
    setSortBy('relevance');
    setSearchParams({});
    setPage(1);
  };

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setPage(1);
    if (cat === 'All') {
      const p = new URLSearchParams(searchParams);
      p.delete('category');
      setSearchParams(p);
    } else {
      const p = new URLSearchParams(searchParams);
      p.set('category', cat);
      setSearchParams(p);
    }
  };

  return (
    <div className="portal-container py-6 space-y-6">
      {/* Breadcrumbs & Catalog Title (Flipkart Style) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Link to="/" className="hover:text-blue-900">Home</Link>
            <ChevronRight className="size-3" />
            <span className="text-slate-800 font-semibold">Scholarship Catalog</span>
            {selectedCategory !== 'All' && (
              <>
                <ChevronRight className="size-3" />
                <span className="text-blue-900 font-bold">{selectedCategory}</span>
              </>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <span>Official Scholarship Catalog</span>
            <span className="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full border border-amber-300">
              AY 2026-27 Active
            </span>
          </h1>
        </div>

        {/* Quick Compare & Wishlist Badges */}
        <div className="flex items-center gap-2 text-xs">
          <Link
            to="/compare"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-900 rounded-xl border border-blue-200 font-semibold hover:bg-blue-100 transition-colors"
          >
            <Scale className="size-3.5" />
            <span>Compare ({compareList.length})</span>
          </Link>
          <Link
            to="/wishlist"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-900 rounded-xl border border-rose-200 font-semibold hover:bg-rose-100 transition-colors"
          >
            <Heart className="size-3.5 fill-rose-500 text-rose-500" />
            <span>Wishlist ({wishlist.length})</span>
          </Link>
        </div>
      </div>

      {/* 2-Column Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Sidebar Filter Panel (Flipkart Faceted Filter) */}
        <aside className="lg:col-span-4 xl:col-span-3 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <SlidersHorizontal className="size-4 text-blue-900" />
              <span>Filters</span>
            </h2>
            <button
              onClick={resetFilters}
              className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="size-3" />
              <span>Clear All</span>
            </button>
          </div>

          {/* 1. Category Facets */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Categories
            </label>
            <div className="space-y-1.5 text-xs max-h-48 overflow-y-auto pr-1">
              <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === 'All'}
                    onChange={() => handleCategorySelect('All')}
                    className="accent-blue-900 rounded size-4 cursor-pointer"
                  />
                  <span className={selectedCategory === 'All' ? 'font-bold text-blue-900' : ''}>
                    All Categories
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-bold">
                  {scholarships.length}
                </span>
              </label>

              {CATEGORIES.map((cat) => {
                const count = scholarships.filter(s => s.category.toLowerCase() === cat.toLowerCase()).length;
                return (
                  <label key={cat} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 cursor-pointer text-slate-700">
                    <div className="flex items-center gap-2 truncate">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory.toLowerCase() === cat.toLowerCase()}
                        onChange={() => handleCategorySelect(cat)}
                        className="accent-blue-900 rounded size-4 cursor-pointer shrink-0"
                      />
                      <span className={`truncate ${selectedCategory.toLowerCase() === cat.toLowerCase() ? 'font-bold text-blue-900' : ''}`}>
                        {cat}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono font-bold ml-1 shrink-0">
                      {count}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* 2. State Domicile Filter */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              State Domicile
            </label>
            <select
              value={selectedState}
              onChange={(e) => { setSelectedState(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            >
              <option value="All">All Indian States &amp; UTs</option>
              {STATES.map((st, idx) => (
                <option key={idx} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* 3. Course Level */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <label className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
              Course / Degree
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => { setSelectedCourse(e.target.value); setPage(1); }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-900"
            >
              <option value="All">All Higher Education Courses</option>
              {COURSES.map((crs, idx) => (
                <option key={idx} value={crs}>{crs}</option>
              ))}
            </select>
          </div>

          {/* 4. Annual Family Income Slider */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-900 uppercase tracking-wider">
                Max Income Limit
              </label>
            </div>
            <div className="text-center py-1">
              <span className="inline-block bg-amber-50 border border-amber-200 px-3 py-1 rounded-lg text-xs font-mono font-bold text-amber-900">
                {maxIncome >= 1000000 ? 'No Ceiling (Up to ₹10L)' : `≤ ₹${(maxIncome / 100000).toFixed(1)} Lakhs / yr`}
              </span>
            </div>
            <input
              type="range"
              min="100000"
              max="1000000"
              step="50000"
              value={maxIncome}
              onChange={(e) => { setMaxIncome(parseInt(e.target.value)); setPage(1); }}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹1 Lakh</span>
              <span>₹10 Lakhs+</span>
            </div>
          </div>

          {/* 5. Minimum Percentage Filter Slider */}
          <div className="space-y-2 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between text-xs">
              <label className="font-bold text-slate-900 uppercase tracking-wider">
                Min 12th / Degree Marks
              </label>
              <span className="font-mono font-bold text-blue-900">
                {minPercentageCutoff > 0 ? `≤ ${minPercentageCutoff}% cut-off` : 'Any %'}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={minPercentageCutoff}
              onChange={(e) => { setMinPercentageCutoff(parseInt(e.target.value)); setPage(1); }}
              className="w-full accent-blue-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>Any</span>
              <span>50%</span>
              <span>75%</span>
              <span>90%</span>
            </div>
          </div>
        </aside>

        {/* Right Main Content Area (Flipkart Catalog Display) */}
        <main className="lg:col-span-8 xl:col-span-9 space-y-4">
          {/* Top Sort & Filter Ribbon (Flipkart Style) */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Results Counter */}
            <div className="text-xs sm:text-sm font-semibold text-slate-700 self-start sm:self-auto">
              <span>Showing </span>
              <strong className="text-slate-900">
                {filteredSchemes.length > 0 ? (page - 1) * itemsPerPage + 1 : 0} – {Math.min(page * itemsPerPage, filteredSchemes.length)}
              </strong>
              <span> of </span>
              <strong className="text-blue-900">{filteredSchemes.length} scholarships</strong>
            </div>

            {/* Sort Tabs & View Switcher */}
            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              {/* Flipkart Sort Pills */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 font-medium hidden sm:inline mr-1">Sort By:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-bold text-slate-800 focus:outline-hidden"
                >
                  <option value="relevance">Relevance</option>
                  <option value="popularity">Popularity / Rating</option>
                  <option value="amount_desc">Amount: High to Low</option>
                  <option value="amount_asc">Amount: Low to High</option>
                  <option value="deadline">Deadline: Closing Soon</option>
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'grid' ? 'bg-white shadow-2xs text-blue-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="size-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                    viewMode === 'list' ? 'bg-white shadow-2xs text-blue-900' : 'text-slate-500 hover:text-slate-800'
                  }`}
                  title="List View"
                >
                  <List className="size-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {(selectedCategory !== 'All' || selectedState !== 'All' || selectedCourse !== 'All' || maxIncome < 1000000 || minPercentageCutoff > 0 || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Active filters:</span>
              {selectedCategory !== 'All' && (
                <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <span>Category: {selectedCategory}</span>
                  <X className="size-3 cursor-pointer" onClick={() => handleCategorySelect('All')} />
                </span>
              )}
              {selectedState !== 'All' && (
                <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <span>State: {selectedState}</span>
                  <X className="size-3 cursor-pointer" onClick={() => setSelectedState('All')} />
                </span>
              )}
              {searchQuery && (
                <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-1 rounded-full font-medium flex items-center gap-1">
                  <span>Keyword: "{searchQuery}"</span>
                  <X className="size-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-xs text-rose-600 hover:underline font-semibold ml-2 cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}

          {/* Schemes Display (Grid or List) */}
          {paginatedSchemes.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="size-8" />
              </div>
              <h3 className="text-base font-bold text-slate-900">No matching scholarships found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or resetting the search term to view all 82 active schemes.
              </p>
              <button onClick={resetFilters} className="btn-primary text-xs py-2 px-4 cursor-pointer">
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {paginatedSchemes.map((scheme) => (
                <ScholarshipCard key={scheme.id} scheme={scheme} />
              ))}
            </div>
          ) : (
            /* Flipkart List View (Full Width Product Style) */
            <div className="space-y-4">
              {paginatedSchemes.map((scheme) => {
                const closing = new Date(scheme.closingDate);
                const diffDays = Math.ceil((closing - now) / (1000 * 60 * 60 * 24));
                return (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <span className="bg-amber-400 text-slate-950 font-bold px-2 py-0.5 rounded">
                          {scheme.code}
                        </span>
                        <span className="text-slate-500 font-semibold">{scheme.category}</span>
                        <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold border border-emerald-200">
                          100% DBT
                        </span>
                      </div>
                      <Link
                        to={`/scholarships/${scheme.id}`}
                        className="text-base font-bold text-slate-900 hover:text-blue-900 block"
                      >
                        {scheme.name}
                      </Link>
                      <p className="text-xs text-slate-500">{scheme.provider}</p>
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                        {scheme.minPercentage && <span className="bg-slate-100 px-2 py-0.5 rounded">Min {scheme.minPercentage}%</span>}
                        {scheme.maxFamilyIncome && <span className="bg-slate-100 px-2 py-0.5 rounded">Income ≤ ₹{(scheme.maxFamilyIncome / 100000).toFixed(1)}L</span>}
                        <span className="text-amber-800 font-medium">Closes in {diffDays} days</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end gap-3 shrink-0 w-full md:w-auto border-t md:border-t-0 pt-3 md:pt-0">
                      <div>
                        <span className="text-xl font-extrabold text-emerald-800 font-mono block">
                          ₹{scheme.amount.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-slate-400 block md:text-right">per academic year</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/scholarships/${scheme.id}`}
                          className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs"
                        >
                          Details
                        </Link>
                        <Link
                          to={`/student/apply/${scheme.id}`}
                          className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold rounded-xl text-xs shadow-xs"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Flipkart Pagination */}
          {totalPages > 1 && (
            <div className="pt-6 flex items-center justify-between border-t border-slate-200">
              <span className="text-xs text-slate-500">
                Page <strong className="text-slate-800">{page}</strong> of <strong className="text-slate-800">{totalPages}</strong>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pNum = i + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setPage(pNum)}
                      className={`size-8 rounded-xl text-xs font-bold cursor-pointer transition-colors ${
                        page === pNum ? 'bg-blue-900 text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white text-xs font-bold disabled:opacity-40 cursor-pointer hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
