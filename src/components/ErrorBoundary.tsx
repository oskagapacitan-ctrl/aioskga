import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    let readable = error.message || 'Terjadi kendala saat memuat aplikasi.';
    try {
      const parsed = JSON.parse(error.message);
      if (parsed?.error) {
        readable = `Akses data (${parsed.operationType || 'operasi'}): ${parsed.error}`;
      }
    } catch {
      // Bukan pesan JSON Firestore
    }
    return { hasError: true, message: readable };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FAF8F5] text-[#171923] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white border border-stone-200 rounded-xl p-8">
            <p className="text-xs font-mono text-stone-500 mb-2">OSIS SMKN 3 Pacitan</p>
            <h1 className="text-2xl font-semibold text-[#171923] mb-3">
              Terjadi Gangguan Memuat Halaman
            </h1>
            <p className="text-sm text-stone-600 leading-relaxed mb-6">{this.state.message}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 text-sm font-medium bg-[#1E3A8A] text-white rounded-lg hover:bg-[#172D6E] transition-colors cursor-pointer"
            >
              Muat Ulang Halaman
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
