import { onAuthStateChanged, signInWithPopup, signOut, User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { ArrowRight, QrCode, ShieldCheck } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { AdminDrawer } from './components/AdminDrawer';
import { BarcodeMemoriesSection } from './components/BarcodeMemoriesSection';
import { ErrorBoundary } from './components/ErrorBoundary';
import { EventsSection } from './components/EventsSection';
import { FeedbackSection } from './components/FeedbackSection';
import { Header } from './components/Header';
import { SocialMediaSection } from './components/SocialMediaSection';
import {
  DEFAULT_BATCHES,
  DEFAULT_EVENTS,
  DEFAULT_FEEDBACK,
  DEFAULT_MEMORIES,
  DEFAULT_SOCIAL_SETTINGS,
  HERO_IMAGE_PATH,
} from './data/defaults';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from './firebase';
import {
  ADMIN_EMAIL,
  Batch,
  EventCategory,
  FeedbackCategory,
  FeedbackItem,
  FeedbackStatus,
  FeedbackType,
  Memory,
  OsisEvent,
  SocialSettings,
} from './types';

function toDateOrNull(val: unknown): Date | null {
  if (val instanceof Timestamp) return val.toDate();
  if (val instanceof Date) return val;
  return null;
}

function generateId(prefix: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${rand}`;
}

function PortalApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);

  const [liveBatches, setLiveBatches] = useState<Batch[]>([]);
  const [liveMemories, setLiveMemories] = useState<Memory[]>([]);
  const [liveEvents, setLiveEvents] = useState<OsisEvent[]>([]);
  const [publicFeedback, setPublicFeedback] = useState<FeedbackItem[]>([]);
  const [ownFeedback, setOwnFeedback] = useState<FeedbackItem[]>([]);
  const [adminFeedback, setAdminFeedback] = useState<FeedbackItem[]>([]);
  const [liveSocial, setLiveSocial] = useState<SocialSettings | null>(null);

  const [selectedYear, setSelectedYear] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const param = new URLSearchParams(window.location.search).get('angkatan');
      if (param && /^[0-9]{4}$/.test(param)) return param;
    }
    return '2025';
  });

  const [adminOpen, setAdminOpen] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);

  const isAdmin = Boolean(user && user.email === ADMIN_EMAIL && user.emailVerified);

  // Scroll to memory form automatically if accessed via QR link (?angkatan=YYYY#isi-kenangan)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('angkatan')) {
      setTimeout(() => {
        const el = document.getElementById('isi-kenangan');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 250);
    }
  }, []);

  // Auth listener
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthReady(true);
    });
    return () => unsub();
  }, []);

  // Public Firestore listeners (batches, memories, events, social settings, public feedback)
  useEffect(() => {
    const batchesQuery = query(collection(db, 'batches'), where('isActive', '==', true));
    const unsubBatches = onSnapshot(
      batchesQuery,
      (snap) => {
        const rows: Batch[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            year: String(data.year || ''),
            title: String(data.title || ''),
            theme: String(data.theme || ''),
            isActive: Boolean(data.isActive),
            createdAt: toDateOrNull(data.createdAt),
          };
        });
        rows.sort((a, b) => b.year.localeCompare(a.year));
        setLiveBatches(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'batches')
    );

    const memoriesQuery = query(collection(db, 'memories'), where('isPublic', '==', true));
    const unsubMemories = onSnapshot(
      memoriesQuery,
      (snap) => {
        const rows: Memory[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            batchId: String(data.batchId || ''),
            batchYear: String(data.batchYear || ''),
            authorUid: String(data.authorUid || ''),
            studentName: String(data.studentName || ''),
            className: String(data.className || ''),
            message: String(data.message || ''),
            quote: String(data.quote || ''),
            isPublic: Boolean(data.isPublic),
            createdAt: toDateOrNull(data.createdAt),
          };
        });
        rows.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setLiveMemories(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'memories')
    );

    const eventsQuery = query(collection(db, 'events'), where('isPublished', '==', true));
    const unsubEvents = onSnapshot(
      eventsQuery,
      (snap) => {
        const rows: OsisEvent[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: String(data.title || ''),
            category: (data.category as EventCategory) || 'Program Kerja',
            dateLabel: String(data.dateLabel || ''),
            location: String(data.location || ''),
            organizer: String(data.organizer || ''),
            summary: String(data.summary || ''),
            description: String(data.description || ''),
            imageUrl: String(data.imageUrl || ''),
            isPublished: Boolean(data.isPublished),
            createdAt: toDateOrNull(data.createdAt),
            updatedAt: toDateOrNull(data.updatedAt),
          };
        });
        rows.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setLiveEvents(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'events')
    );

    const unsubSocial = onSnapshot(
      doc(db, 'settings', 'social'),
      (snap) => {
        if (snap.exists()) {
          const data = snap.data();
          setLiveSocial({
            schoolInstagramHandle: String(data.schoolInstagramHandle || ''),
            schoolInstagramUrl: String(data.schoolInstagramUrl || ''),
            osisInstagramHandle: String(data.osisInstagramHandle || ''),
            osisInstagramUrl: String(data.osisInstagramUrl || ''),
            schoolTiktokHandle: String(data.schoolTiktokHandle || ''),
            schoolTiktokUrl: String(data.schoolTiktokUrl || ''),
            osisTiktokHandle: String(data.osisTiktokHandle || ''),
            osisTiktokUrl: String(data.osisTiktokUrl || ''),
          });
        }
      },
      (err) => handleFirestoreError(err, OperationType.GET, 'settings/social')
    );

    const pubFbQuery = query(collection(db, 'feedback'), where('isPublic', '==', true));
    const unsubPubFb = onSnapshot(
      pubFbQuery,
      (snap) => {
        const rows: FeedbackItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            authorUid: String(data.authorUid || ''),
            senderName: String(data.senderName || ''),
            className: String(data.className || ''),
            feedbackType: (data.feedbackType as FeedbackType) || 'Saran',
            category: (data.category as FeedbackCategory) || 'Kegiatan OSIS',
            message: String(data.message || ''),
            isPublic: Boolean(data.isPublic),
            status: (data.status as FeedbackStatus) || 'Baru',
            adminReply: String(data.adminReply || ''),
            createdAt: toDateOrNull(data.createdAt),
            updatedAt: toDateOrNull(data.updatedAt),
          };
        });
        setPublicFeedback(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'feedback')
    );

    return () => {
      unsubBatches();
      unsubMemories();
      unsubEvents();
      unsubSocial();
      unsubPubFb();
    };
  }, []);

  // Authenticated user's own feedback (including private items)
  useEffect(() => {
    if (!authReady || !user) {
      setOwnFeedback([]);
      return;
    }

    const ownFbQuery = query(collection(db, 'feedback'), where('authorUid', '==', user.uid));
    const unsubOwn = onSnapshot(
      ownFbQuery,
      (snap) => {
        const rows: FeedbackItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            authorUid: String(data.authorUid || ''),
            senderName: String(data.senderName || ''),
            className: String(data.className || ''),
            feedbackType: (data.feedbackType as FeedbackType) || 'Saran',
            category: (data.category as FeedbackCategory) || 'Kegiatan OSIS',
            message: String(data.message || ''),
            isPublic: Boolean(data.isPublic),
            status: (data.status as FeedbackStatus) || 'Baru',
            adminReply: String(data.adminReply || ''),
            createdAt: toDateOrNull(data.createdAt),
            updatedAt: toDateOrNull(data.updatedAt),
          };
        });
        setOwnFeedback(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'feedback')
    );

    return () => unsubOwn();
  }, [authReady, user]);

  // Admin full feedback listener
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setAdminFeedback([]);
      return;
    }

    const unsubAdminFb = onSnapshot(
      collection(db, 'feedback'),
      (snap) => {
        const rows: FeedbackItem[] = snap.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            authorUid: String(data.authorUid || ''),
            senderName: String(data.senderName || ''),
            className: String(data.className || ''),
            feedbackType: (data.feedbackType as FeedbackType) || 'Saran',
            category: (data.category as FeedbackCategory) || 'Kegiatan OSIS',
            message: String(data.message || ''),
            isPublic: Boolean(data.isPublic),
            status: (data.status as FeedbackStatus) || 'Baru',
            adminReply: String(data.adminReply || ''),
            createdAt: toDateOrNull(data.createdAt),
            updatedAt: toDateOrNull(data.updatedAt),
          };
        });
        rows.sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
        setAdminFeedback(rows);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'feedback')
    );

    return () => unsubAdminFb();
  }, [authReady, isAdmin]);

  // Combine live Firestore records with curated initial showcase when Firestore is empty
  const batches = useMemo(() => {
    return liveBatches.length > 0 ? liveBatches : DEFAULT_BATCHES;
  }, [liveBatches]);

  const memories = useMemo(() => {
    return liveMemories.length > 0 ? liveMemories : DEFAULT_MEMORIES;
  }, [liveMemories]);

  const events = useMemo(() => {
    return liveEvents.length > 0 ? liveEvents : DEFAULT_EVENTS;
  }, [liveEvents]);

  const social = useMemo(() => {
    return liveSocial || DEFAULT_SOCIAL_SETTINGS;
  }, [liveSocial]);

  const mergedFeedback = useMemo(() => {
    const source = isAdmin && adminFeedback.length > 0 ? adminFeedback : [...publicFeedback, ...ownFeedback];
    const map = new Map<string, FeedbackItem>();
    source.forEach((item) => map.set(item.id, item));
    const list = Array.from(map.values()).sort(
      (a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0)
    );
    return list.length > 0 ? list : DEFAULT_FEEDBACK;
  }, [isAdmin, adminFeedback, publicFeedback, ownFeedback]);

  // Actions
  const handleSignIn = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const handleSeedDefaults = async () => {
    if (!isAdmin) return;
    const batch = writeBatch(db);

    for (const b of DEFAULT_BATCHES) {
      batch.set(doc(db, 'batches', b.id), {
        year: b.year,
        title: b.title,
        theme: b.theme,
        isActive: b.isActive,
        createdAt: serverTimestamp(),
      });
    }

    for (const ev of DEFAULT_EVENTS) {
      batch.set(doc(db, 'events', ev.id), {
        title: ev.title,
        category: ev.category,
        dateLabel: ev.dateLabel,
        location: ev.location,
        organizer: ev.organizer,
        summary: ev.summary,
        description: ev.description,
        imageUrl: ev.imageUrl,
        isPublished: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    }

    batch.set(doc(db, 'settings', 'social'), {
      ...DEFAULT_SOCIAL_SETTINGS,
      updatedAt: serverTimestamp(),
    });

    try {
      await batch.commit();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'seed-defaults');
    }
  };

  const handleCreateMemory = async (payload: {
    batchId: string;
    batchYear: string;
    studentName: string;
    className: string;
    message: string;
    quote: string;
  }) => {
    if (!user) throw new Error('Autentikasi diperlukan.');
    const id = generateId('mem');
    try {
      await setDoc(doc(db, 'memories', id), {
        batchId: payload.batchId,
        batchYear: payload.batchYear,
        authorUid: user.uid,
        studentName: payload.studentName,
        className: payload.className,
        message: payload.message,
        quote: payload.quote,
        isPublic: true,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `memories/${id}`);
    }
  };

  const handleDeleteMemory = async (memoryId: string) => {
    try {
      await deleteDoc(doc(db, 'memories', memoryId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `memories/${memoryId}`);
    }
  };

  const handleCreateFeedback = async (payload: {
    senderName: string;
    className: string;
    feedbackType: FeedbackType;
    category: FeedbackCategory;
    message: string;
    isPublic: boolean;
  }) => {
    if (!user) throw new Error('Autentikasi diperlukan.');
    const id = generateId('fb');
    try {
      await setDoc(doc(db, 'feedback', id), {
        authorUid: user.uid,
        senderName: payload.senderName,
        className: payload.className,
        feedbackType: payload.feedbackType,
        category: payload.category,
        message: payload.message,
        isPublic: payload.isPublic,
        status: 'Baru',
        adminReply: '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `feedback/${id}`);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    try {
      await deleteDoc(doc(db, 'feedback', feedbackId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `feedback/${feedbackId}`);
    }
  };

  const handleCreateBatch = async (payload: {
    year: string;
    title: string;
    theme: string;
  }) => {
    const id = `angkatan-${payload.year}`;
    try {
      await setDoc(doc(db, 'batches', id), {
        year: payload.year,
        title: payload.title,
        theme: payload.theme,
        isActive: true,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `batches/${id}`);
    }
  };

  const handleToggleBatch = async (batchId: string, isActive: boolean) => {
    try {
      await updateDoc(doc(db, 'batches', batchId), { isActive });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `batches/${batchId}`);
    }
  };

  const handleCreateEvent = async (payload: {
    title: string;
    category: EventCategory;
    dateLabel: string;
    location: string;
    organizer: string;
    summary: string;
    description: string;
    imageUrl: string;
  }) => {
    const id = generateId('ev');
    try {
      await setDoc(doc(db, 'events', id), {
        title: payload.title,
        category: payload.category,
        dateLabel: payload.dateLabel,
        location: payload.location,
        organizer: payload.organizer,
        summary: payload.summary,
        description: payload.description,
        imageUrl: payload.imageUrl,
        isPublished: true,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `events/${id}`);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      await deleteDoc(doc(db, 'events', eventId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `events/${eventId}`);
    }
  };

  const handleReplyFeedback = async (
    feedbackId: string,
    status: FeedbackStatus,
    adminReply: string
  ) => {
    try {
      await updateDoc(doc(db, 'feedback', feedbackId), {
        status,
        adminReply,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `feedback/${feedbackId}`);
    }
  };

  const handleSaveSocial = async (payload: SocialSettings) => {
    try {
      await setDoc(doc(db, 'settings', 'social'), {
        ...payload,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'settings/social');
    }
  };

  const jumpToMemoryForm = () => {
    const el = document.getElementById('isi-kenangan');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#171923]">
      <Header onJumpToMemoryForm={jumpToMemoryForm} />

      <main className="flex-1">
        {/* Hero Section */}
        <section id="beranda" className="pt-10 pb-14 sm:pt-14 sm:pb-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
              {/* Left Typographic Anchor */}
              <div className="lg:col-span-6 flex flex-col justify-between py-2">
                <div>
                  <p className="text-xs font-mono tracking-wider text-[#1E3A8A] mb-4">
                    Portal Resmi · OSIS SMK Negeri 3 Pacitan (OSKAGA)
                  </p>

                  <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] leading-[1.1] font-semibold tracking-tight text-[#171923] text-balance">
                    Suara, Karya, dan Jejak Angkatan SMKN 3 Pacitan.
                  </h1>

                  <p className="mt-5 text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
                    Ruang kolaborasi warga sekolah untuk mengabadikan kenang-kenangan tiap angkatan
                    melalui barcode QR, menyampaikan saran &amp; kritik, serta mengikuti informasi
                    kegiatan OSIS.
                  </p>

                  <div className="mt-8 flex flex-wrap items-center gap-4">
                    <a
                      href="#kenang-kenangan"
                      className="inline-flex items-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#1E3A8A] rounded-lg hover:bg-[#172D6E] transition-colors whitespace-nowrap"
                    >
                      <QrCode className="w-4 h-4" />
                      Buka Barcode Angkatan
                    </a>

                    <a
                      href="#saran"
                      className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-semibold text-[#171923] border border-stone-300 bg-white rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap"
                    >
                      Kirim Saran &amp; Kritik
                      <ArrowRight className="w-4 h-4 text-stone-500" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right 16:9 Focal Visual */}
              <div className="lg:col-span-6">
                <div className="h-full min-h-[280px] sm:min-h-[340px] rounded-xl overflow-hidden border border-stone-200 bg-stone-200 relative">
                  {!heroImgError ? (
                    <img
                      src={HERO_IMAGE_PATH}
                      alt="Pengurus OSIS SMKN 3 Pacitan berdiskusi program kerja di lingkungan sekolah"
                      referrerPolicy="no-referrer"
                      onError={() => setHeroImgError(true)}
                      className="w-full h-full object-cover lg:absolute lg:inset-0"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-br from-stone-200 to-stone-300 text-stone-600 text-sm font-medium">
                      OSIS SMKN 3 Pacitan · Kabinet OSKAGA
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Full-width Operational Utility Strip below Hero Split */}
            <div className="mt-10 pt-6 border-t border-stone-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-stone-500">Organisasi</p>
                <p className="text-sm font-semibold text-[#171923] mt-1">
                  OSIS SMKN 3 Pacitan (OSKAGA)
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Angkatan Aktif</p>
                <p className="text-sm font-semibold text-[#171923] mt-1 font-mono tabular-nums">
                  {batches.map((b) => b.year).join(' · ')}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Agenda &amp; Proker</p>
                <p className="text-sm font-semibold text-[#171923] mt-1 font-mono tabular-nums">
                  {events.length} kegiatan terdata
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-500">Lokasi Sekolah</p>
                <p className="text-sm font-semibold text-[#171923] mt-1">
                  Pacitan, Jawa Timur
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 1. Barcode & Kenang-Kenangan Tiap Angkatan */}
        <BarcodeMemoriesSection
          batches={batches}
          selectedYear={selectedYear}
          onSelectYear={setSelectedYear}
          memories={memories}
          user={user}
          isAdmin={isAdmin}
          onSignIn={handleSignIn}
          onCreateMemory={handleCreateMemory}
          onDeleteMemory={handleDeleteMemory}
        />

        {/* 2. Informasi Kegiatan OSIS */}
        <EventsSection events={events} />

        {/* 3. Saran & Kritik */}
        <FeedbackSection
          feedbackList={mergedFeedback}
          user={user}
          isAdmin={isAdmin}
          onSignIn={handleSignIn}
          onCreateFeedback={handleCreateFeedback}
          onDeleteFeedback={handleDeleteFeedback}
        />

        {/* 4. Media Sosial IG & TikTok */}
        <SocialMediaSection social={social} />
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-stone-200 bg-white py-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="font-editorial text-lg font-semibold text-[#171923]">
              OSIS SMKN 3 Pacitan
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Portal Kenang-Kenangan Angkatan, Aspirasi Siswa &amp; Informasi Kegiatan OSKAGA.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-stone-600">
            <a href="#kenang-kenangan" className="hover:text-[#171923]">
              Kenang-Kenangan
            </a>
            <a href="#kegiatan" className="hover:text-[#171923]">
              Kegiatan
            </a>
            <a href="#saran" className="hover:text-[#171923]">
              Saran &amp; Kritik
            </a>
            <a
              href={social.schoolInstagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#171923]"
            >
              Instagram
            </a>
            <a
              href={social.schoolTiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#171923]"
            >
              TikTok
            </a>
            <button
              type="button"
              onClick={() => setAdminOpen(true)}
              className="inline-flex items-center gap-1.5 text-[#1E3A8A] font-semibold hover:underline underline-offset-4 cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              {isAdmin ? 'Panel Pengurus OSIS' : 'Masuk Pengurus'}
            </button>
          </div>
        </div>
      </footer>

      <AdminDrawer
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        user={user}
        isAdmin={isAdmin}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        batches={batches}
        events={events}
        feedbackList={mergedFeedback}
        social={social}
        hasLiveBatches={liveBatches.length > 0}
        hasLiveEvents={liveEvents.length > 0}
        onSeedDefaults={handleSeedDefaults}
        onCreateBatch={handleCreateBatch}
        onToggleBatch={handleToggleBatch}
        onCreateEvent={handleCreateEvent}
        onDeleteEvent={handleDeleteEvent}
        onReplyFeedback={handleReplyFeedback}
        onSaveSocial={handleSaveSocial}
      />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortalApp />
    </ErrorBoundary>
  );
}
