import { Check, Copy, Download, LogIn, QrCode, Send, Trash2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import React, { useMemo, useRef, useState } from 'react';
import { User } from 'firebase/auth';
import { Batch, Memory, VALIDATION_LIMITS } from '../types';

interface BarcodeMemoriesSectionProps {
  batches: Batch[];
  selectedYear: string;
  onSelectYear: (year: string) => void;
  memories: Memory[];
  user: User | null;
  isAdmin: boolean;
  onSignIn: () => Promise<void>;
  onCreateMemory: (payload: {
    batchId: string;
    batchYear: string;
    studentName: string;
    className: string;
    message: string;
    quote: string;
  }) => Promise<void>;
  onDeleteMemory: (memoryId: string) => Promise<void>;
}

export function BarcodeMemoriesSection({
  batches,
  selectedYear,
  onSelectYear,
  memories,
  user,
  isAdmin,
  onSignIn,
  onCreateMemory,
  onDeleteMemory,
}: BarcodeMemoriesSectionProps) {
  const [studentName, setStudentName] = useState('');
  const [className, setClassName] = useState('');
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const qrWrapperRef = useRef<HTMLDivElement>(null);

  const activeBatch = useMemo(() => {
    return (
      batches.find((b) => b.year === selectedYear) ||
      batches[0] || {
        id: 'angkatan-2025',
        year: '2025',
        title: 'Angkatan 2025',
        theme: 'Kenang-kenangan angkatan SMKN 3 Pacitan',
        isActive: true,
      }
    );
  }, [batches, selectedYear]);

  const filteredMemories = useMemo(() => {
    return memories.filter((m) => m.batchYear === activeBatch.year);
  }, [memories, activeBatch.year]);

  const qrTargetUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const url = new URL(window.location.origin);
    url.searchParams.set('angkatan', activeBatch.year);
    url.hash = 'isi-kenangan';
    return url.toString();
  }, [activeBatch.year]);

  const handleCopyQrLink = async () => {
    try {
      await navigator.clipboard.writeText(qrTargetUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2500);
    } catch {
      setFormError('Gagal menyalin tautan ke clipboard.');
    }
  };

  const handleDownloadPoster = () => {
    const sourceCanvas = qrWrapperRef.current?.querySelector('canvas');
    if (!sourceCanvas) return;

    const posterCanvas = document.createElement('canvas');
    posterCanvas.width = 760;
    posterCanvas.height = 980;
    const ctx = posterCanvas.getContext('2d');
    if (!ctx) return;

    // Background archival paper
    ctx.fillStyle = '#FAF8F5';
    ctx.fillRect(0, 0, posterCanvas.width, posterCanvas.height);

    // Outer frame border
    ctx.strokeStyle = '#D6D3D1';
    ctx.lineWidth = 4;
    ctx.strokeRect(28, 28, 704, 924);

    // Header school label
    ctx.fillStyle = '#1E3A8A';
    ctx.font = '600 22px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('OSIS SMKN 3 PACITAN · OSKAGA', 380, 96);

    // Title
    ctx.fillStyle = '#171923';
    ctx.font = '700 42px Georgia, serif';
    ctx.fillText(`Kenang-Kenangan ${activeBatch.year}`, 380, 156);

    // Subtitle
    ctx.fillStyle = '#57534E';
    ctx.font = '400 20px sans-serif';
    ctx.fillText('Pindai QR Code ini untuk menulis pesan & kesan angkatanmu', 380, 200);

    // White QR container
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(150, 250, 460, 460);
    ctx.strokeStyle = '#E7E5E4';
    ctx.lineWidth = 2;
    ctx.strokeRect(150, 250, 460, 460);

    // Draw QR code centered
    ctx.drawImage(sourceCanvas, 185, 285, 390, 390);

    // Footer metadata
    ctx.fillStyle = '#171923';
    ctx.font = '600 22px sans-serif';
    ctx.fillText(activeBatch.title, 380, 780);

    ctx.fillStyle = '#78716C';
    ctx.font = '400 17px monospace';
    ctx.fillText(qrTargetUrl, 380, 825, 640);

    ctx.fillStyle = '#B45309';
    ctx.font = '600 18px sans-serif';
    ctx.fillText('Tempel di Mading Sekolah / Buku Tahunan Angkatan', 380, 895);

    const link = document.createElement('a');
    link.download = `QR-Kenangan-Angkatan-${activeBatch.year}-SMKN3Pacitan.png`;
    link.href = posterCanvas.toDataURL('image/png');
    link.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!user) {
      setFormError('Silakan masuk dengan akun Google terlebih dahulu untuk mengirim kenang-kenangan.');
      return;
    }

    const trimmedName = studentName.trim();
    const trimmedClass = className.trim();
    const trimmedMessage = message.trim();
    const trimmedQuote = quote.trim();

    if (
      trimmedName.length < VALIDATION_LIMITS.memory.studentNameMin ||
      trimmedName.length > VALIDATION_LIMITS.memory.studentNameMax
    ) {
      setFormError(
        `Nama siswa harus ${VALIDATION_LIMITS.memory.studentNameMin}–${VALIDATION_LIMITS.memory.studentNameMax} karakter.`
      );
      return;
    }
    if (
      trimmedClass.length < VALIDATION_LIMITS.memory.classNameMin ||
      trimmedClass.length > VALIDATION_LIMITS.memory.classNameMax
    ) {
      setFormError(
        `Kelas/jurusan harus ${VALIDATION_LIMITS.memory.classNameMin}–${VALIDATION_LIMITS.memory.classNameMax} karakter.`
      );
      return;
    }
    if (
      trimmedMessage.length < VALIDATION_LIMITS.memory.messageMin ||
      trimmedMessage.length > VALIDATION_LIMITS.memory.messageMax
    ) {
      setFormError(
        `Pesan kenangan harus ${VALIDATION_LIMITS.memory.messageMin}–${VALIDATION_LIMITS.memory.messageMax} karakter.`
      );
      return;
    }
    if (trimmedQuote.length > VALIDATION_LIMITS.memory.quoteMax) {
      setFormError(`Kutipan maksimal ${VALIDATION_LIMITS.memory.quoteMax} karakter.`);
      return;
    }

    if (activeBatch.isFallback) {
      setFormError(
        'Angkatan ini belum diaktifkan di database Firestore. Pengurus OSIS perlu masuk dan mengklik "Inisialisasi Data Awal" di Panel Pengurus.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await onCreateMemory({
        batchId: activeBatch.id,
        batchYear: activeBatch.year,
        studentName: trimmedName,
        className: trimmedClass,
        message: trimmedMessage,
        quote: trimmedQuote,
      });
      setStudentName('');
      setClassName('');
      setMessage('');
      setQuote('');
      setFormSuccess(`Kenang-kenangan untuk Angkatan ${activeBatch.year} berhasil disimpan!`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan kenang-kenangan.';
      setFormError(
        msg.includes('permission') || msg.includes('PERMISSION_DENIED')
          ? 'Gagal menyimpan: pastikan email Google Anda terverifikasi dan angkatan aktif di database.'
          : msg
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await onDeleteMemory(id);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (date?: Date | null) => {
    if (!date) return 'Baru saja';
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  };

  return (
    <section
      id="kenang-kenangan"
      className="py-16 sm:py-24 border-t border-stone-200 bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-stone-200">
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-wider text-[#B45309] mb-2">
              01. Arsip &amp; Barcode Angkatan
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#171923] tracking-tight text-balance">
              Barcode Kenang-Kenangan Tiap Angkatan
            </h2>
            <p className="mt-3 text-base text-stone-600 leading-relaxed">
              Pilih tahun angkatan untuk menampilkan QR code khusus yang dapat dipindai siswa saat
              perpisahan, dipasang di mading sekolah, atau dibagikan di grup kelas.
            </p>
          </div>

          {/* Interactive Batch Tabs */}
          <div
            role="tablist"
            aria-label="Pilih angkatan kenang-kenangan"
            className="flex flex-wrap items-center gap-1.5 p-1 bg-stone-100 rounded-lg border border-stone-200 self-start lg:self-auto"
          >
            {batches.map((batch) => {
              const active = batch.year === activeBatch.year;
              return (
                <button
                  key={batch.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectYear(batch.year)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer font-mono tabular-nums ${
                    active
                      ? 'bg-white text-[#1E3A8A] shadow-xs border border-stone-200'
                      : 'text-stone-600 hover:text-[#171923]'
                  }`}
                >
                  Angkatan {batch.year}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2-Column Split: QR Barcode Station (Left) + Submit Memory Form (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-10 items-start">
          {/* QR Barcode Card */}
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-stone-200 rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <p className="text-xs font-mono text-stone-500">
                  Kode QR Angkatan {activeBatch.year}
                </p>
                <h3 className="text-xl font-semibold text-[#171923] mt-1">
                  {activeBatch.title}
                </h3>
              </div>
              <QrCode className="w-6 h-6 text-[#1E3A8A] shrink-0" aria-hidden="true" />
            </div>

            <p className="text-sm text-stone-600 leading-relaxed mb-6">{activeBatch.theme}</p>

            {/* Real Scannable QR Code */}
            <div
              ref={qrWrapperRef}
              className="bg-white border border-stone-200 rounded-xl p-6 flex flex-col items-center justify-center"
            >
              <QRCodeCanvas
                value={qrTargetUrl || 'https://smkn3pacitan.sch.id'}
                size={216}
                level="M"
                bgColor="#FFFFFF"
                fgColor="#171923"
                includeMargin={false}
              />
              <p className="mt-4 text-xs font-mono text-stone-500 text-center break-all">
                ?angkatan={activeBatch.year}#isi-kenangan
              </p>
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleCopyQrLink}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#171923] bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap cursor-pointer"
              >
                {copiedUrl ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-700" />
                    Tautan Disalin
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-stone-600" />
                    Salin Tautan QR
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleDownloadPoster}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] transition-colors whitespace-nowrap cursor-pointer"
              >
                <Download className="w-4 h-4" />
                Unduh Poster QR
              </button>
            </div>

            <p className="mt-4 text-xs text-stone-500 leading-relaxed">
              Pindai kode QR di atas dengan kamera ponsel untuk langsung membuka formulir pengisian
              kenang-kenangan khusus Angkatan {activeBatch.year}.
            </p>
          </div>

          {/* Memory Submission Form */}
          <div
            id="isi-kenangan"
            className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 scroll-mt-24"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-stone-200 mb-6">
              <div>
                <p className="text-xs font-mono text-[#1E3A8A]">
                  Formulir Digital · Angkatan {activeBatch.year}
                </p>
                <h3 className="text-xl font-semibold text-[#171923] mt-1">
                  Tulis Kenang-Kenanganmu
                </h3>
              </div>

              {!user ? (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk dengan Google
                </button>
              ) : (
                <div className="text-xs text-stone-600">
                  Masuk sebagai{' '}
                  <span className="font-semibold text-[#171923]">
                    {user.displayName || user.email}
                  </span>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="memory-name"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Nama Lengkap
                  </label>
                  <input
                    id="memory-name"
                    type="text"
                    required
                    maxLength={VALIDATION_LIMITS.memory.studentNameMax}
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Ardiansyah Putra"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg text-[#171923] placeholder:text-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="memory-class"
                    className="block text-xs font-semibold text-stone-700 mb-1.5"
                  >
                    Kelas / Jurusan
                  </label>
                  <input
                    id="memory-class"
                    type="text"
                    required
                    maxLength={VALIDATION_LIMITS.memory.classNameMax}
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="Contoh: XII Kuliner 1 / XII Busana"
                    className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg text-[#171923] placeholder:text-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="memory-message"
                    className="block text-xs font-semibold text-stone-700"
                  >
                    Pesan &amp; Kenangan Terbaik di SMKN 3 Pacitan
                  </label>
                  <span className="text-xs font-mono tabular-nums text-stone-400">
                    {message.length}/{VALIDATION_LIMITS.memory.messageMax}
                  </span>
                </div>
                <textarea
                  id="memory-message"
                  required
                  rows={4}
                  maxLength={VALIDATION_LIMITS.memory.messageMax}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ceritakan momen paling berkesan bersama teman seangkatan, guru, atau kegiatan OSIS..."
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg text-[#171923] placeholder:text-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors resize-y"
                />
              </div>

              <div>
                <label
                  htmlFor="memory-quote"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  Kutipan Singkat / Motto (Opsional)
                </label>
                <input
                  id="memory-quote"
                  type="text"
                  maxLength={VALIDATION_LIMITS.memory.quoteMax}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="Contoh: Sukses selalu untuk angkatan 2025!"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg text-[#171923] placeholder:text-stone-400 focus:outline-none focus:border-[#1E3A8A] focus:bg-white transition-colors"
                />
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3.5 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-lg"
                >
                  {formError}
                </div>
              )}

              {formSuccess && (
                <div
                  role="status"
                  className="p-3.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  {formSuccess}
                </div>
              )}

              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs text-stone-500">
                  {user
                    ? `Akan diterbitkan ke Dinding Angkatan ${activeBatch.year}.`
                    : 'Masuk dengan Google agar catatan terverifikasi bebas spam.'}
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] disabled:opacity-60 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Menyimpan...' : 'Kirim Kenang-Kenangan'}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Wall of Memories for Selected Angkatan */}
        <div className="mt-14 pt-10 border-t border-stone-200">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-6">
            <h3 className="text-2xl font-semibold text-[#171923]">
              Dinding Kenangan Angkatan {activeBatch.year}
            </h3>
            <p className="text-xs font-mono tabular-nums text-stone-500">
              {filteredMemories.length} catatan tersimpan
            </p>
          </div>

          {filteredMemories.length === 0 ? (
            <div className="p-10 text-center bg-[#FAF8F5] border border-stone-200 rounded-xl">
              <p className="text-sm font-medium text-stone-700">
                Belum ada kenang-kenangan untuk Angkatan {activeBatch.year}.
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Jadilah yang pertama mengisi catatan angkatan melalui formulir di atas atau pindai QR
                code.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMemories.map((item) => {
                const canDelete =
                  !item.isFallback && user && (isAdmin || user.uid === item.authorUid);

                return (
                  <article
                    key={item.id}
                    className="flex flex-col justify-between p-6 bg-[#FAF8F5] border border-stone-200 rounded-xl"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="text-base font-semibold text-[#171923]">
                          {item.studentName}
                        </h4>
                        {canDelete && (
                          <button
                            type="button"
                            disabled={deletingId === item.id}
                            onClick={() => handleDelete(item.id)}
                            aria-label={`Hapus catatan ${item.studentName}`}
                            className="text-stone-400 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                        <span>{item.className}</span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">Angkatan {item.batchYear}</span>
                        <span aria-hidden="true">·</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>

                      <p className="mt-4 text-sm text-stone-700 leading-relaxed">{item.message}</p>
                    </div>

                    {item.quote && (
                      <blockquote className="mt-5 pt-4 border-t border-stone-200 text-xs italic text-[#1E3A8A] font-medium">
                        “{item.quote}”
                      </blockquote>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
