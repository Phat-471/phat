'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App-level error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 font-serif">
        Đã có lỗi xảy ra
      </h1>
      <p className="text-slate-600 max-w-md mb-6 text-sm leading-relaxed">
        Hệ thống gặp sự cố trong quá trình xử lý yêu cầu. Bạn có thể thử tải lại hoặc quay về trang chủ.
      </p>
      {error.message && (
        <div className="max-w-md w-full bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-500 font-mono mb-6 truncate">
          {error.message}
        </div>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-medium text-sm rounded-xl hover:bg-emerald-700 transition shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-medium text-sm rounded-xl hover:bg-slate-50 transition shadow-sm"
        >
          <Home className="w-4 h-4" />
          Về Trang Chủ
        </Link>
      </div>
    </div>
  );
}
