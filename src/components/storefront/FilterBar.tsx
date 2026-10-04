'use client'
import React from 'react';

interface FilterBarProps {
  selectedCategory: string;
  selectedFileType: string;
  onCategoryChange: (category: string) => void;
  onFileTypeChange: (fileType: string) => void;
  totalProducts: number;
}

const CATEGORIES = [
  { id: 'all', label: 'جميع التخصصات' },
  { id: 'business', label: 'شركات ورواد أعمال', icon: '🏢' },
  { id: 'accounting', label: 'محاسبين وماليين', icon: '📊' },
  { id: 'engineering', label: 'مهندسين ومعماريين', icon: '📐' },
  { id: 'students', label: 'طلاب وباحثين', icon: '🎓' },
  { id: 'individuals', label: 'أفراد وإنتاجية', icon: '👤' },
];

const FILE_TYPES = [
  { id: 'all', label: 'كل الصيغ' },
  { id: 'excel', label: 'شيتات Excel', icon: '📗' },
  { id: 'notion', label: 'قوالب Notion', icon: '📝' },
  { id: 'powerpoint', label: 'سلايدات PowerPoint', icon: '📊' },
  { id: 'word-pdf', label: 'عقود PDF/Word', icon: '📄' },
  { id: 'canva', label: 'قوالب Canva', icon: '🎨' },
  { id: 'cad-revit', label: 'AutoCAD/Revit', icon: '📐' },
  { id: 'ai-prompts', label: 'برومبتات AI', icon: '🤖' },
];

export default function FilterBar({
  selectedCategory,
  selectedFileType,
  onCategoryChange,
  onFileTypeChange,
  totalProducts,
}: FilterBarProps) {
  return (
    <div className="w-full bg-rawnaq-dark border-b border-rawnaq-border py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">تصفح المنتجات</h2>
          <div className="px-3 py-1 rounded-full bg-rawnaq-surface border border-rawnaq-border text-rawnaq-gold text-sm font-medium">
            {totalProducts} منتج متاح
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Row 1: Categories */}
          <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                aria-label={`تصفية حسب ${cat.label}`}
                aria-pressed={selectedCategory === cat.id}
                className={`min-h-[44px] whitespace-nowrap px-5 py-2 rounded-full border transition-colors flex items-center gap-2 text-sm md:text-base font-medium
                  ${selectedCategory === cat.id 
                    ? 'bg-rawnaq-gold text-rawnaq-dark border-rawnaq-gold' 
                    : 'bg-rawnaq-surface text-slate-300 border-rawnaq-border hover:border-rawnaq-gold hover:text-white'
                  }`}
              >
                {cat.icon && <span>{cat.icon}</span>}
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Row 2: File Types */}
          <div className="flex overflow-x-auto pb-2 scrollbar-hide gap-3">
            {FILE_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => onFileTypeChange(type.id)}
                aria-label={`تصفية حسب صيغة ${type.label}`}
                aria-pressed={selectedFileType === type.id}
                className={`min-h-[44px] whitespace-nowrap px-4 py-2 rounded-full border transition-colors flex items-center gap-2 text-sm font-medium
                  ${selectedFileType === type.id 
                    ? 'bg-rawnaq-gold text-rawnaq-dark border-rawnaq-gold' 
                    : 'bg-rawnaq-surface text-slate-300 border-rawnaq-border hover:border-rawnaq-gold hover:text-white'
                  }`}
              >
                {type.icon && <span>{type.icon}</span>}
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
