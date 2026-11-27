import { User } from 'firebase/auth';
import {
  CalendarPlus,
  Database,
  LogIn,
  LogOut,
  MessageSquare,
  Plus,
  Share2,
  Trash2,
  X,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { HERO_IMAGE_PATH } from '../data/defaults';
import {
  ADMIN_EMAIL,
  Batch,
  EventCategory,
  FeedbackItem,
  FeedbackStatus,
  OsisEvent,
  SocialSettings,
  VALIDATION_LIMITS,
} from '../types';

interface AdminDrawerProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  isAdmin: boolean;
  onSignIn: () => Promise<void>;
  onSignOut: () => Promise<void>;
  batches: Batch[];
  events: OsisEvent[];
  feedbackList: FeedbackItem[];
  social: SocialSettings;
  hasLiveBatches: boolean;
  hasLiveEvents: boolean;
  onSeedDefaults: () => Promise<void>;
  onCreateBatch: (payload: { year: string; title: string; theme: string }) => Promise<void>;
  onToggleBatch: (batchId: string, isActive: boolean) => Promise<void>;
  onCreateEvent: (payload: {
    title: string;
    category: EventCategory;
    dateLabel: string;
    location: string;
    organizer: string;
    summary: string;
    description: string;
    imageUrl: string;
  }) => Promise<void>;
  onDeleteEvent: (eventId: string) => Promise<void>;
  onReplyFeedback: (
    feedbackId: string,
    status: FeedbackStatus,
    adminReply: string
  ) => Promise<void>;
  onSaveSocial: (payload: SocialSettings) => Promise<void>;
}

type AdminTab = 'batches' | 'events' | 'feedback' | 'social';

const IMAGE_PRESETS = [
  {
    label: 'Foto Rapat / LDKS OSIS',
    url: '/src/assets/images/kegiatan_ldks_osis_v2_1795751236287.jpg',
  },
  {
    label: 'Foto Pentas Seni / Akustik',
    url: '/src/assets/images/kegiatan_pensi_stemga_v2_1795751235181.jpg',
  },
  {
    label: 'Foto Bakti Sosial Sekolah',
    url: '/src/assets/images/kegiatan_baksos_pacitan_1795751219930.jpg',
  },
  {
    label: 'Foto Pengurus OSIS di Taman',
    url: HERO_IMAGE_PATH,
  },
];

export function AdminDrawer({
  open,
  onClose,
  user,
  isAdmin,
  onSignIn,
  onSignOut,
  batches,
  events,
  feedbackList,
  social,
  hasLiveBatches,
  hasLiveEvents,
  onSeedDefaults,
  onCreateBatch,
  onToggleBatch,
  onCreateEvent,
  onDeleteEvent,
  onReplyFeedback,
  onSaveSocial,
}: AdminDrawerProps) {
  const [tab, setTab] = useState<AdminTab>('batches');
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Batch form
  const [year, setYear] = useState('');
  const [batchTitle, setBatchTitle] = useState('');
  const [batchTheme, setBatchTheme] = useState('');

  // Event form
  const [evTitle, setEvTitle] = useState('');
  const [evCategory, setEvCategory] = useState<EventCategory>('Akan Datang');
  const [evDate, setEvDate] = useState('');
  const [evLocation, setEvLocation] = useState('');
  const [evOrganizer, setEvOrganizer] = useState('');
  const [evSummary, setEvSummary] = useState('');
  const [evDesc, setEvDesc] = useState('');
  const [evImage, setEvImage] = useState(IMAGE_PRESETS[0].url);

  // Social form
  const [socialForm, setSocialForm] = useState<SocialSettings>(social);
  useEffect(() => {
    setSocialForm(social);
  }, [social]);

  // Feedback replies state
  const [replyDrafts, setReplyDrafts] = useState<
    Record<string, { status: FeedbackStatus; reply: string }>
  >({});

  if (!open) return null;

  const clearAlerts = () => {
    setStatusMsg(null);
    setErrorMsg(null);
  };

  const handleSeed = async () => {
    clearAlerts();
    setBusy(true);
    try {
      await onSeedDefaults();
      setStatusMsg('Data awal angkatan, kegiatan OSIS, dan media sosial berhasil disimpan.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal inisialisasi data.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    if (!VALIDATION_LIMITS.yearPattern.test(year.trim())) {
      setErrorMsg('Tahun angkatan harus berupa 4 digit angka (contoh: 2028).');
      return;
    }
    setBusy(true);
    try {
      await onCreateBatch({
        year: year.trim(),
        title: batchTitle.trim(),
        theme: batchTheme.trim(),
      });
      setYear('');
      setBatchTitle('');
      setBatchTheme('');
      setStatusMsg('Angkatan baru dan kode QR berhasil ditambahkan.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menambah angkatan.');
    } finally {
      setBusy(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setBusy(true);
    try {
      await onCreateEvent({
        title: evTitle.trim(),
        category: evCategory,
        dateLabel: evDate.trim(),
        location: evLocation.trim(),
        organizer: evOrganizer.trim(),
        summary: evSummary.trim(),
        description: evDesc.trim(),
        imageUrl: evImage.trim(),
      });
      setEvTitle('');
      setEvDate('');
      setEvLocation('');
      setEvOrganizer('');
      setEvSummary('');
      setEvDesc('');
      setStatusMsg('Informasi kegiatan OSIS berhasil diterbitkan.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menambah kegiatan.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveSocialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setBusy(true);
    try {
      await onSaveSocial(socialForm);
      setStatusMsg('Tautan Instagram & TikTok resmi berhasil diperbarui.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menyimpan media sosial.');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveFeedbackReply = async (item: FeedbackItem) => {
    clearAlerts();
    const draft = replyDrafts[item.id] || {
      status: item.status,
      reply: item.adminReply || '',
    };
    setBusy(true);
    try {
      await onReplyFeedback(item.id, draft.status, draft.reply.trim());
      setStatusMsg('Tanggapan & status saran berhasil disimpan.');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal menyimpan tanggapan.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Panel Pengurus OSIS SMKN 3 Pacitan"
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[#FAF8F5] h-full overflow-y-auto border-l border-stone-200 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-5 bg-white border-b border-stone-200 flex items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <p className="text-xs font-mono text-[#1E3A8A]">Panel Pengurus OSIS</p>
            <h2 className="text-xl font-semibold text-[#171923]">
              Kelola Portal OSKAGA SMKN 3 Pacitan
            </h2>
          </div>

          <button
            type="button"
            aria-label="Tutup panel pengurus"
            onClick={onClose}
            className="w-10 h-10 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1">
          {/* Account bar */}
          <div className="p-4 bg-white border border-stone-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {user ? (
              <>
                <div>
                  <p className="text-xs text-stone-500">Masuk sebagai</p>
                  <p className="text-sm font-semibold text-[#171923]">{user.email}</p>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {isAdmin
                      ? 'Terverifikasi sebagai Pengurus OSIS (Admin)'
                      : `Akun siswa biasa. Akses admin khusus ${ADMIN_EMAIL}.`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Keluar
                </button>
              </>
            ) : (
              <>
                <div>
                  <p className="text-sm font-semibold text-[#171923]">
                    Masuk sebagai Pengurus OSIS
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Gunakan akun resmi pengurus ({ADMIN_EMAIL}) untuk mengelola data.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onSignIn}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] transition-colors cursor-pointer"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk Google
                </button>
              </>
            )}
          </div>

          {isAdmin && (
            <>
              {/* Seed helper if live Firestore has no batches or events yet */}
              {(!hasLiveBatches || !hasLiveEvents) && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-amber-900">
                      Database Firestore Belum Terisi Data Awal
                    </p>
                    <p className="text-xs text-amber-800 mt-0.5">
                      Simpan data awal Angkatan (2024–2027), Kegiatan OSIS, dan link IG/TikTok ke
                      Firestore agar siswa bisa langsung mengisi kenang-kenangan.
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={handleSeed}
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#B45309] hover:bg-[#92400E] rounded-lg transition-colors shrink-0 cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    Inisialisasi Data Awal
                  </button>
                </div>
              )}

              {statusMsg && (
                <div className="p-3.5 text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                  {statusMsg}
                </div>
              )}
              {errorMsg && (
                <div className="p-3.5 text-xs font-medium text-red-800 bg-red-50 border border-red-200 rounded-lg">
                  {errorMsg}
                </div>
              )}

              {/* Admin Tabs */}
              <div className="flex flex-wrap gap-1 p-1 bg-white border border-stone-200 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    clearAlerts();
                    setTab('batches');
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    tab === 'batches' ? 'bg-[#1E3A8A] text-white' : 'text-stone-600'
                  }`}
                >
                  Angkatan QR
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearAlerts();
                    setTab('events');
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    tab === 'events' ? 'bg-[#1E3A8A] text-white' : 'text-stone-600'
                  }`}
                >
                  Kegiatan OSIS
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearAlerts();
                    setTab('feedback');
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    tab === 'feedback' ? 'bg-[#1E3A8A] text-white' : 'text-stone-600'
                  }`}
                >
                  Saran &amp; Kritik ({feedbackList.filter((f) => !f.isFallback).length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    clearAlerts();
                    setTab('social');
                  }}
                  className={`flex-1 py-2 px-3 text-xs font-semibold rounded-md transition-colors cursor-pointer whitespace-nowrap ${
                    tab === 'social' ? 'bg-[#1E3A8A] text-white' : 'text-stone-600'
                  }`}
                >
                  IG &amp; TikTok
                </button>
              </div>

              {/* Tab 1: Batches */}
              {tab === 'batches' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleAddBatch}
                    className="p-5 bg-white border border-stone-200 rounded-xl space-y-4"
                  >
                    <h3 className="text-base font-semibold text-[#171923] flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#1E3A8A]" />
                      Tambah Angkatan &amp; Barcode QR Baru
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Tahun (4 digit)
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                          placeholder="2028"
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg font-mono"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Judul Angkatan
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={VALIDATION_LIMITS.batch.titleMax}
                          value={batchTitle}
                          onChange={(e) => setBatchTitle(e.target.value)}
                          placeholder="Angkatan 2028 — Generasi Emas"
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Tema / Slogan Kenang-Kenangan
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={VALIDATION_LIMITS.batch.themeMax}
                        value={batchTheme}
                        onChange={(e) => setBatchTheme(e.target.value)}
                        placeholder="Melangkah bersama mengukir prestasi di SMKN 3 Pacitan."
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={busy}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] cursor-pointer"
                    >
                      Simpan Angkatan
                    </button>
                  </form>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#171923]">Daftar Angkatan</h4>
                    {batches.map((b) => (
                      <div
                        key={b.id}
                        className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#171923]">
                            {b.title}{' '}
                            {b.isFallback && (
                              <span className="text-xs font-normal text-amber-700">
                                (Belum di database)
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-stone-500 mt-0.5">{b.theme}</p>
                        </div>
                        {!b.isFallback && (
                          <button
                            type="button"
                            onClick={() => onToggleBatch(b.id, !b.isActive)}
                            className="px-3 py-1.5 text-xs font-semibold border border-stone-300 rounded-lg hover:bg-stone-50 cursor-pointer shrink-0"
                          >
                            {b.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 2: Events */}
              {tab === 'events' && (
                <div className="space-y-6">
                  <form
                    onSubmit={handleAddEvent}
                    className="p-5 bg-white border border-stone-200 rounded-xl space-y-4"
                  >
                    <h3 className="text-base font-semibold text-[#171923] flex items-center gap-2">
                      <CalendarPlus className="w-4 h-4 text-[#1E3A8A]" />
                      Terbitkan Informasi Kegiatan OSIS
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Nama Kegiatan
                        </label>
                        <input
                          type="text"
                          required
                          minLength={VALIDATION_LIMITS.event.titleMin}
                          maxLength={VALIDATION_LIMITS.event.titleMax}
                          value={evTitle}
                          onChange={(e) => setEvTitle(e.target.value)}
                          placeholder="Contoh: Classmeeting Akhir Semester Ganjil"
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Kategori
                        </label>
                        <select
                          value={evCategory}
                          onChange={(e) => setEvCategory(e.target.value as EventCategory)}
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        >
                          <option value="Akan Datang">Akan Datang</option>
                          <option value="Program Kerja">Program Kerja</option>
                          <option value="Terlaksana">Terlaksana</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Tanggal Pelaksanaan
                        </label>
                        <input
                          type="text"
                          required
                          minLength={VALIDATION_LIMITS.event.dateLabelMin}
                          maxLength={VALIDATION_LIMITS.event.dateLabelMax}
                          value={evDate}
                          onChange={(e) => setEvDate(e.target.value)}
                          placeholder="Contoh: 18–20 Desember 2026"
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Lokasi
                        </label>
                        <input
                          type="text"
                          required
                          minLength={VALIDATION_LIMITS.event.locationMin}
                          maxLength={VALIDATION_LIMITS.event.locationMax}
                          value={evLocation}
                          onChange={(e) => setEvLocation(e.target.value)}
                          placeholder="Lapangan SMKN 3 Pacitan"
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Penanggung Jawab (Sekbid)
                        </label>
                        <input
                          type="text"
                          required
                          minLength={VALIDATION_LIMITS.event.organizerMin}
                          maxLength={VALIDATION_LIMITS.event.organizerMax}
                          value={evOrganizer}
                          onChange={(e) => setEvOrganizer(e.target.value)}
                          placeholder="Sekbid IX · Olahraga"
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Foto Dokumentasi
                        </label>
                        <select
                          value={evImage}
                          onChange={(e) => setEvImage(e.target.value)}
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        >
                          {IMAGE_PRESETS.map((p) => (
                            <option key={p.url} value={p.url}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Ringkasan Singkat
                        </label>
                        <input
                          type="text"
                          required
                          minLength={VALIDATION_LIMITS.event.summaryMin}
                          maxLength={VALIDATION_LIMITS.event.summaryMax}
                          value={evSummary}
                          onChange={(e) => setEvSummary(e.target.value)}
                          placeholder="Ringkasan 1-2 kalimat untuk kartu kegiatan..."
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Deskripsi Lengkap
                        </label>
                        <textarea
                          rows={3}
                          required
                          minLength={VALIDATION_LIMITS.event.descriptionMin}
                          maxLength={VALIDATION_LIMITS.event.descriptionMax}
                          value={evDesc}
                          onChange={(e) => setEvDesc(e.target.value)}
                          placeholder="Jelaskan tujuan, jadwal, dan ketentuan kegiatan..."
                          className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={busy}
                      className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] cursor-pointer"
                    >
                      Terbitkan Kegiatan
                    </button>
                  </form>

                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-[#171923]">Daftar Kegiatan</h4>
                    {events.map((ev) => (
                      <div
                        key={ev.id}
                        className="p-4 bg-white border border-stone-200 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#171923]">{ev.title}</p>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {ev.category} · {ev.dateLabel}
                          </p>
                        </div>
                        {!ev.isFallback && (
                          <button
                            type="button"
                            onClick={() => onDeleteEvent(ev.id)}
                            aria-label={`Hapus ${ev.title}`}
                            className="p-2 text-stone-400 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab 3: Feedback Management */}
              {tab === 'feedback' && (
                <div className="space-y-4">
                  <h3 className="text-base font-semibold text-[#171923] flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-[#1E3A8A]" />
                    Tindak Lanjut Saran &amp; Kritik Masuk
                  </h3>

                  {feedbackList.filter((f) => !f.isFallback).length === 0 ? (
                    <p className="text-sm text-stone-600 p-6 bg-white border border-stone-200 rounded-xl">
                      Belum ada saran atau kritik dari pengguna di database.
                    </p>
                  ) : (
                    feedbackList
                      .filter((f) => !f.isFallback)
                      .map((item) => {
                        const draft = replyDrafts[item.id] || {
                          status: item.status,
                          reply: item.adminReply || '',
                        };
                        return (
                          <div
                            key={item.id}
                            className="p-5 bg-white border border-stone-200 rounded-xl space-y-3"
                          >
                            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-500">
                              <span>
                                <strong className="text-[#171923]">{item.feedbackType}</strong> ·{' '}
                                {item.category} · {item.senderName}
                                {item.className ? ` (${item.className})` : ''}
                              </span>
                              <span>{item.isPublic ? 'Publik' : 'Privat'}</span>
                            </div>
                            <p className="text-sm text-[#171923]">{item.message}</p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                              <div>
                                <label className="block text-xs font-semibold text-stone-700 mb-1">
                                  Status
                                </label>
                                <select
                                  value={draft.status}
                                  onChange={(e) =>
                                    setReplyDrafts((prev) => ({
                                      ...prev,
                                      [item.id]: {
                                        ...draft,
                                        status: e.target.value as FeedbackStatus,
                                      },
                                    }))
                                  }
                                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-stone-300 rounded-lg"
                                >
                                  <option value="Baru">Baru</option>
                                  <option value="Diproses">Diproses</option>
                                  <option value="Selesai">Selesai</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-stone-700 mb-1">
                                  Tanggapan OSIS
                                </label>
                                <input
                                  type="text"
                                  maxLength={VALIDATION_LIMITS.feedback.adminReplyMax}
                                  value={draft.reply}
                                  onChange={(e) =>
                                    setReplyDrafts((prev) => ({
                                      ...prev,
                                      [item.id]: { ...draft, reply: e.target.value },
                                    }))
                                  }
                                  placeholder="Tulis tanggapan resmi pengurus OSIS..."
                                  className="w-full px-3 py-2 text-xs bg-[#FAF8F5] border border-stone-300 rounded-lg"
                                />
                              </div>
                            </div>
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => handleSaveFeedbackReply(item)}
                              className="px-3.5 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] cursor-pointer"
                            >
                              Simpan Tanggapan
                            </button>
                          </div>
                        );
                      })
                  )}
                </div>
              )}

              {/* Tab 4: Social Settings */}
              {tab === 'social' && (
                <form
                  onSubmit={handleSaveSocialSubmit}
                  className="p-5 bg-white border border-stone-200 rounded-xl space-y-4"
                >
                  <h3 className="text-base font-semibold text-[#171923] flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-[#1E3A8A]" />
                    Perbarui Akun Instagram &amp; TikTok Resmi
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Username IG Sekolah
                      </label>
                      <input
                        type="text"
                        required
                        value={socialForm.schoolInstagramHandle}
                        onChange={(e) =>
                          setSocialForm((p) => ({
                            ...p,
                            schoolInstagramHandle: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Link URL IG Sekolah
                      </label>
                      <input
                        type="url"
                        required
                        value={socialForm.schoolInstagramUrl}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, schoolInstagramUrl: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Username IG OSIS (OSKAGA)
                      </label>
                      <input
                        type="text"
                        required
                        value={socialForm.osisInstagramHandle}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, osisInstagramHandle: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Link URL IG OSIS
                      </label>
                      <input
                        type="url"
                        required
                        value={socialForm.osisInstagramUrl}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, osisInstagramUrl: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Username TikTok Sekolah
                      </label>
                      <input
                        type="text"
                        required
                        value={socialForm.schoolTiktokHandle}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, schoolTiktokHandle: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Link URL TikTok Sekolah
                      </label>
                      <input
                        type="url"
                        required
                        value={socialForm.schoolTiktokUrl}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, schoolTiktokUrl: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Username TikTok OSIS
                      </label>
                      <input
                        type="text"
                        required
                        value={socialForm.osisTiktokHandle}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, osisTiktokHandle: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Link URL TikTok OSIS
                      </label>
                      <input
                        type="url"
                        required
                        value={socialForm.osisTiktokUrl}
                        onChange={(e) =>
                          setSocialForm((p) => ({ ...p, osisTiktokUrl: e.target.value }))
                        }
                        className="w-full px-3 py-2 text-sm bg-[#FAF8F5] border border-stone-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={busy}
                    className="px-4 py-2 text-xs font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] cursor-pointer"
                  >
                    Simpan Pengaturan Media Sosial
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
