import { User } from 'firebase/auth';
import { Lock, LogIn, MessageSquarePlus, Trash2 } from 'lucide-react';
import React, { useState } from 'react';
import {
  FeedbackCategory,
  FeedbackItem,
  FeedbackType,
  VALIDATION_LIMITS,
} from '../types';

interface FeedbackSectionProps {
  feedbackList: FeedbackItem[];
  user: User | null;
  isAdmin: boolean;
  onSignIn: () => Promise<void>;
  onCreateFeedback: (payload: {
    senderName: string;
    className: string;
    feedbackType: FeedbackType;
    category: FeedbackCategory;
    message: string;
    isPublic: boolean;
  }) => Promise<void>;
  onDeleteFeedback: (feedbackId: string) => Promise<void>;
}

const FEEDBACK_TYPES: FeedbackType[] = ['Saran', 'Kritik', 'Aspirasi'];
const FEEDBACK_CATEGORIES: FeedbackCategory[] = [
  'Kegiatan OSIS',
  'Fasilitas Sekolah',
  'Ekstrakurikuler',
  'Lainnya',
];

export function FeedbackSection({
  feedbackList,
  user,
  isAdmin,
  onSignIn,
  onCreateFeedback,
  onDeleteFeedback,
}: FeedbackSectionProps) {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('Saran');
  const [category, setCategory] = useState<FeedbackCategory>('Kegiatan OSIS');
  const [senderName, setSenderName] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [className, setClassName] = useState('');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!user) {
      setError('Silakan masuk dengan akun Google terlebih dahulu untuk mengirim saran atau kritik.');
      return;
    }

    const finalName = isAnonymous ? 'Anonim' : senderName.trim();
    const finalClass = className.trim();
    const finalMessage = message.trim();

    if (
      finalName.length < VALIDATION_LIMITS.feedback.senderNameMin ||
      finalName.length > VALIDATION_LIMITS.feedback.senderNameMax
    ) {
      setError(
        `Nama pengirim harus ${VALIDATION_LIMITS.feedback.senderNameMin}–${VALIDATION_LIMITS.feedback.senderNameMax} karakter (atau pilih Anonim).`
      );
      return;
    }

    if (finalClass.length > VALIDATION_LIMITS.feedback.classNameMax) {
      setError(`Kelas maksimal ${VALIDATION_LIMITS.feedback.classNameMax} karakter.`);
      return;
    }

    if (
      finalMessage.length < VALIDATION_LIMITS.feedback.messageMin ||
      finalMessage.length > VALIDATION_LIMITS.feedback.messageMax
    ) {
      setError(
        `Isi saran/kritik harus ${VALIDATION_LIMITS.feedback.messageMin}–${VALIDATION_LIMITS.feedback.messageMax} karakter.`
      );
      return;
    }

    setSubmitting(true);
    try {
      await onCreateFeedback({
        senderName: finalName,
        className: finalClass,
        feedbackType,
        category,
        message: finalMessage,
        isPublic,
      });
      setSenderName('');
      setClassName('');
      setMessage('');
      setSuccess(
        isPublic
          ? 'Saran & kritik berhasil dikirim dan tampil di Papan Aspirasi.'
          : 'Saran & kritik privat berhasil dikirim langsung ke Pengurus OSIS.'
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim saran & kritik.');
    } finally {
      setSubmitting(false);
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
    <section id="saran" className="py-16 sm:py-24 border-t border-stone-200 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl pb-10 border-b border-stone-200">
          <p className="text-xs font-mono tracking-wider text-[#B45309] mb-2">
            03. Kotak Aspirasi Warga Sekolah
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#171923] tracking-tight text-balance">
            Ruang Saran, Kritik &amp; Aspirasi Siswa
          </h2>
          <p className="mt-3 text-base text-stone-600 leading-relaxed">
            Sampaikan masukan membangun untuk program kerja OSIS, kegiatan sekolah, maupun fasilitas
            di SMKN 3 Pacitan. Bisa dikirim secara terbuka atau privat.
          </p>
        </div>

        {/* 2-Column Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 mt-10 items-start">
          {/* Submission Form */}
          <div className="lg:col-span-5 bg-[#FAF8F5] border border-stone-200 rounded-xl p-6 sm:p-8">
            <div className="flex items-center justify-between gap-3 pb-4 border-b border-stone-200 mb-5">
              <h3 className="text-xl font-semibold text-[#171923]">Tulis Masukan</h3>
              {!user && (
                <button
                  type="button"
                  onClick={onSignIn}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  Masuk Google
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type selector */}
              <div>
                <span className="block text-xs font-semibold text-stone-700 mb-1.5">
                  Jenis Masukan
                </span>
                <div className="grid grid-cols-3 gap-1 p-1 bg-white border border-stone-200 rounded-lg">
                  {FEEDBACK_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFeedbackType(t)}
                      className={`py-2 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                        feedbackType === t
                          ? 'bg-[#1E3A8A] text-white'
                          : 'text-stone-600 hover:text-[#171923]'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category selector */}
              <div>
                <label
                  htmlFor="fb-category"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  Bidang / Topik
                </label>
                <select
                  id="fb-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as FeedbackCategory)}
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg text-[#171923] focus:outline-none focus:border-[#1E3A8A]"
                >
                  {FEEDBACK_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name & Anonymous toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="fb-name"
                    className="block text-xs font-semibold text-stone-700"
                  >
                    Nama Pengirim
                  </label>
                  <label className="inline-flex items-center gap-1.5 text-xs text-stone-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-stone-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                    />
                    Kirim sebagai Anonim
                  </label>
                </div>
                <input
                  id="fb-name"
                  type="text"
                  disabled={isAnonymous}
                  required={!isAnonymous}
                  maxLength={VALIDATION_LIMITS.feedback.senderNameMax}
                  value={isAnonymous ? 'Anonim' : senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="Nama siswa / warga sekolah"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg text-[#171923] placeholder:text-stone-400 disabled:bg-stone-100 disabled:text-stone-500 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <label
                  htmlFor="fb-class"
                  className="block text-xs font-semibold text-stone-700 mb-1.5"
                >
                  Kelas / Angkatan (Opsional)
                </label>
                <input
                  id="fb-class"
                  type="text"
                  maxLength={VALIDATION_LIMITS.feedback.classNameMax}
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="Contoh: XI Kuliner 2"
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg text-[#171923] placeholder:text-stone-400 focus:outline-none focus:border-[#1E3A8A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="fb-message"
                    className="block text-xs font-semibold text-stone-700"
                  >
                    Isi Saran atau Kritik
                  </label>
                  <span className="text-xs font-mono tabular-nums text-stone-400">
                    {message.length}/{VALIDATION_LIMITS.feedback.messageMax}
                  </span>
                </div>
                <textarea
                  id="fb-message"
                  required
                  rows={4}
                  maxLength={VALIDATION_LIMITS.feedback.messageMax}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan saran atau kritik secara jelas dan santun agar mudah ditindaklanjuti..."
                  className="w-full px-3.5 py-2.5 text-sm bg-white border border-stone-300 rounded-lg text-[#171923] placeholder:text-stone-400 focus:outline-none focus:border-[#1E3A8A] resize-y"
                />
              </div>

              {/* Privacy choice */}
              <div className="p-3.5 bg-white border border-stone-200 rounded-lg">
                <label className="flex items-start gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!isPublic}
                    onChange={(e) => setIsPublic(!e.target.checked)}
                    className="mt-0.5 rounded border-stone-300 text-[#1E3A8A] focus:ring-[#1E3A8A]"
                  />
                  <span>
                    <strong className="font-semibold text-[#171923] block">
                      Kirim secara Privat (Hanya Pengurus OSIS)
                    </strong>
                    Centang jika kritik bersifat sensitif dan hanya boleh dibaca oleh tim pengurus
                    OSIS SMKN 3 Pacitan.
                  </span>
                </label>
              </div>

              {error && (
                <div
                  role="alert"
                  className="p-3 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-lg"
                >
                  {error}
                </div>
              )}

              {success && (
                <div
                  role="status"
                  className="p-3 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg"
                >
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] disabled:opacity-60 transition-colors cursor-pointer"
              >
                <MessageSquarePlus className="w-4 h-4" />
                {submitting ? 'Mengirim...' : 'Kirim Saran & Kritik'}
              </button>
            </form>
          </div>

          {/* Public Aspiration & Response Board */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-baseline justify-between gap-4 pb-3 border-b border-stone-200">
              <h3 className="text-xl font-semibold text-[#171923]">
                Papan Aspirasi &amp; Tanggapan OSIS
              </h3>
              <span className="text-xs font-mono tabular-nums text-stone-500">
                {feedbackList.length} masukan
              </span>
            </div>

            {feedbackList.length === 0 ? (
              <div className="p-10 text-center bg-[#FAF8F5] border border-stone-200 rounded-xl">
                <p className="text-sm font-medium text-stone-700">
                  Belum ada aspirasi yang ditampilkan.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbackList.map((item) => {
                  const canDelete =
                    !item.isFallback &&
                    user &&
                    (isAdmin || (user.uid === item.authorUid && item.status === 'Baru'));

                  return (
                    <article
                      key={item.id}
                      className="p-6 bg-[#FAF8F5] border border-stone-200 rounded-xl"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                          <span className="font-semibold text-[#171923]">
                            {item.feedbackType}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{item.category}</span>
                          <span aria-hidden="true">·</span>
                          <span>
                            {item.senderName}
                            {item.className ? ` (${item.className})` : ''}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span>{formatDate(item.createdAt)}</span>
                          {!item.isPublic && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span className="inline-flex items-center gap-1 font-medium text-amber-800">
                                <Lock className="w-3 h-3" /> Privat
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`text-xs font-semibold ${
                              item.status === 'Selesai'
                                ? 'text-emerald-800'
                                : item.status === 'Diproses'
                                ? 'text-[#1E3A8A]'
                                : 'text-amber-800'
                            }`}
                          >
                            Status: {item.status}
                          </span>

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => onDeleteFeedback(item.id)}
                              aria-label="Hapus masukan"
                              className="text-stone-400 hover:text-red-700 p-1 rounded transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="mt-3 text-sm text-[#171923] leading-relaxed">{item.message}</p>

                      {item.adminReply && (
                        <div className="mt-4 p-4 bg-white border border-stone-200 rounded-lg">
                          <p className="text-xs font-semibold text-[#1E3A8A] mb-1">
                            Tanggapan Pengurus OSIS
                          </p>
                          <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                            {item.adminReply}
                          </p>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
