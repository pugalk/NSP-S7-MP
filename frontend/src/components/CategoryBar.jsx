import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Landmark, 
  MapPin, 
  GraduationCap, 
  HeartHandshake, 
  Sparkles, 
  Accessibility, 
  Microscope, 
  Trophy, 
  Briefcase, 
  RotateCcw,
  Scale,
  Compass
} from 'lucide-react';
import { usePortal } from '../context/PortalContext';

const CATEGORY_ITEMS = [
  { id: 'All', name: 'All Schemes', icon: Compass, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  { id: 'Central Government', name: 'Central Govt', icon: Landmark, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
  { id: 'State Government', name: 'State Schemes', icon: MapPin, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  { id: 'Merit-Based', name: 'Merit Excellence', icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  { id: 'Need-Based', name: 'Need / Low-Income', icon: HeartHandshake, color: 'text-rose-600 bg-rose-50 border-rose-200' },
  { id: 'Women / Girls', name: 'Girls & Women', icon: Sparkles, color: 'text-pink-600 bg-pink-50 border-pink-200' },
  { id: 'Disability', name: 'Specially Abled', icon: Accessibility, color: 'text-purple-600 bg-purple-50 border-purple-200' },
  { id: 'Research / Fellowships', name: 'STEM & Research', icon: Microscope, color: 'text-teal-600 bg-teal-50 border-teal-200' },
  { id: 'Sports', name: 'Sports Quota', icon: Trophy, color: 'text-orange-600 bg-orange-50 border-orange-200' },
  { id: 'Private / Corporate CSR', name: 'Corporate CSR', icon: Briefcase, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
  { id: 'RENEWAL', name: 'Renewal Desk', icon: RotateCcw, color: 'text-amber-700 bg-amber-100 border-amber-300', isLink: '/student/renewal' },
  { id: 'COMPARE', name: 'Compare Schemes', icon: Scale, color: 'text-violet-600 bg-violet-50 border-violet-200', isLink: '/compare' },
];

export default function FlipkartCategoryBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { scholarships, compareList } = usePortal();

  const handleCategoryClick = (item) => {
    if (item.isLink) {
      navigate(item.isLink);
      return;
    }
    if (item.id === 'All') {
      navigate('/scholarships');
    } else {
      navigate(`/scholarships?category=${encodeURIComponent(item.id)}`);
    }
  };

  const getCount = (categoryId) => {
    if (categoryId === 'All') return scholarships.length;
    if (categoryId === 'COMPARE') return compareList.length;
    if (categoryId === 'RENEWAL') return 'Fast';
    return scholarships.filter(s => s.category.toLowerCase().includes(categoryId.toLowerCase())).length;
  };

  return (
    <div className="bg-white border-b border-slate-200 shadow-2xs">
      <div className="portal-container py-2.5">
        <div className="flex items-center justify-between gap-1 overflow-x-auto no-scrollbar scroll-smooth">
          {CATEGORY_ITEMS.map((item) => {
            const Icon = item.icon;
            const count = getCount(item.id);
            const isSelected = !item.isLink && location.pathname === '/scholarships' && 
              (location.search.includes(encodeURIComponent(item.id)) || (item.id === 'All' && !location.search.includes('category=')));

            return (
              <button
                key={item.id}
                onClick={() => handleCategoryClick(item)}
                className={`flex flex-col items-center justify-center min-w-[76px] sm:min-w-[88px] px-2 py-1.5 rounded-xl transition-all cursor-pointer group text-center ${
                  isSelected 
                    ? 'bg-blue-50/80 ring-2 ring-blue-600/30' 
                    : 'hover:bg-slate-50'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border mb-1 transition-transform group-hover:scale-110 shadow-2xs relative ${item.color}`}>
                  <Icon className="size-5" />
                  {count !== 0 && (
                    <span className="absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-white border border-white">
                      {count}
                    </span>
                  )}
                </div>
                <span className={`text-[11px] font-semibold tracking-tight whitespace-nowrap transition-colors ${
                  isSelected ? 'text-blue-900 font-bold' : 'text-slate-700 group-hover:text-blue-800'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
