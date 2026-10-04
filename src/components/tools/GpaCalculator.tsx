'use client';

import React, { useState } from 'react';

interface Course {
  id: string;
  name: string;
  hours: number | '';
  grade: number | '';
}

const GRADE_OPTIONS = [
  { label: 'A+ (4.00)', value: 4.0 },
  { label: 'A (3.75)', value: 3.75 },
  { label: 'B+ (3.50)', value: 3.5 },
  { label: 'B (3.00)', value: 3.0 },
  { label: 'B- (2.75)', value: 2.75 },
  { label: 'C+ (2.50)', value: 2.5 },
  { label: 'C (2.00)', value: 2.0 },
  { label: 'C- (1.75)', value: 1.75 },
  { label: 'D+ (1.50)', value: 1.5 },
  { label: 'D (1.00)', value: 1.0 },
  { label: 'F (0.00)', value: 0.0 },
];

export default function GpaCalculator() {
  const [courses, setCourses] = useState<Course[]>([
    { id: '1', name: '', hours: 3, grade: 4.0 }
  ]);
  const [result, setResult] = useState<{ gpa: string; hours: number; classification: string } | null>(null);
  const [error, setError] = useState('');

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: '', hours: 3, grade: 4.0 }]);
  };

  const removeCourse = (id: string) => {
    if (courses.length > 1) {
      setCourses(courses.filter(c => c.id !== id));
    }
  };

  const updateCourse = (id: string, field: keyof Course, value: any) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculateGpa = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);

    let totalPoints = 0;
    let totalHours = 0;

    for (const course of courses) {
      if (course.hours === '' || course.grade === '') {
        setError('يرجى تعبئة جميع الحقول بشكل صحيح.');
        return;
      }
      const h = Number(course.hours);
      if (isNaN(h) || h < 1 || h > 10) {
        setError('عدد الساعات يجب أن يكون بين 1 و 10.');
        return;
      }
      totalHours += h;
      totalPoints += h * Number(course.grade);
    }

    if (totalHours === 0) {
      setError('إجمالي عدد الساعات لا يمكن أن يكون صفراً.');
      return;
    }

    const gpa = totalPoints / totalHours;
    let classification = '';
    if (gpa >= 3.75) classification = 'ممتاز';
    else if (gpa >= 2.75) classification = 'جيد جداً';
    else if (gpa >= 2.0) classification = 'جيد';
    else if (gpa >= 1.0) classification = 'مقبول';
    else classification = 'ضعيف';

    setResult({
      gpa: gpa.toFixed(2),
      hours: totalHours,
      classification
    });
  };

  const reset = () => {
    setCourses([{ id: '1', name: '', hours: 3, grade: 4.0 }]);
    setResult(null);
    setError('');
  };

  return (
    <div className="bg-[#0b1329] text-white p-6 rounded-xl shadow-lg border border-[#f5b731]/20 font-[Cairo] rtl" dir="rtl" lang="ar">
      <h2 className="text-2xl font-bold mb-6 text-[#f5b731] flex items-center gap-2">
        <span>🎓</span> حاسبة المعدل التراكمي
      </h2>

      <form onSubmit={calculateGpa} className="space-y-6">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="border-b border-[#f5b731]/30">
                <th className="pb-3 font-semibold">اسم المادة</th>
                <th className="pb-3 font-semibold">عدد الساعات</th>
                <th className="pb-3 font-semibold">التقدير</th>
                <th className="pb-3 font-semibold w-12"></th>
              </tr>
            </thead>
            <tbody>
              {courses.map((course, index) => (
                <tr key={course.id} className="border-b border-gray-800">
                  <td className="py-3 pr-2">
                    <input
                      type="text"
                      aria-label={`اسم المادة ${index + 1}`}
                      placeholder="اسم المادة (اختياري)"
                      value={course.name}
                      onChange={(e) => updateCourse(course.id, 'name', e.target.value)}
                      className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <input
                      type="number"
                      aria-label={`عدد ساعات المادة ${index + 1}`}
                      min="1"
                      max="10"
                      required
                      value={course.hours}
                      onChange={(e) => updateCourse(course.id, 'hours', e.target.value ? Number(e.target.value) : '')}
                      className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none text-white"
                    />
                  </td>
                  <td className="py-3 px-2">
                    <select
                      aria-label={`تقدير المادة ${index + 1}`}
                      required
                      value={course.grade}
                      onChange={(e) => updateCourse(course.id, 'grade', e.target.value ? Number(e.target.value) : '')}
                      className="w-full min-h-[44px] bg-[#0b1329] border border-gray-700 rounded px-3 py-2 focus:border-[#f5b731] outline-none text-white"
                    >
                      <option value="" disabled>اختر</option>
                      {GRADE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-3 pl-2 text-center">
                    <button
                      type="button"
                      aria-label={`حذف المادة ${index + 1}`}
                      onClick={() => removeCourse(course.id)}
                      disabled={courses.length === 1}
                      className="text-red-400 hover:text-red-300 disabled:opacity-50 min-h-[44px] px-3"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          type="button"
          onClick={addCourse}
          className="text-[#f5b731] hover:text-[#ffd97d] font-medium text-sm border border-[#f5b731]/30 rounded px-4 py-2 min-h-[44px]"
        >
          + إضافة مادة
        </button>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded">
            {error}
          </div>
        )}

        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-[#f5b731] hover:bg-[#e0a629] text-[#0b1329] font-bold py-3 px-6 rounded min-h-[44px] transition-colors"
          >
            حساب المعدل
          </button>
          <button
            type="button"
            onClick={reset}
            className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded min-h-[44px] transition-colors"
          >
            إعادة ضبط
          </button>
        </div>
      </form>

      {result && (
        <div className="mt-8 p-6 bg-[#f5b731]/10 border-2 border-[#f5b731] rounded-lg text-center">
          <h3 className="text-xl mb-4">النتيجة</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-sm">المعدل التراكمي (GPA)</p>
              <p className="text-3xl font-bold text-[#f5b731] mt-1">{result.gpa}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">إجمالي الساعات</p>
              <p className="text-2xl font-bold mt-1">{result.hours}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">التقدير</p>
              <p className="text-2xl font-bold mt-1">{result.classification}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
