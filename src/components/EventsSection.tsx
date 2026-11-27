import { ArrowUpRight, Calendar, MapPin, Users, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { EventCategory, OsisEvent } from '../types';

interface EventsSectionProps {
  events: OsisEvent[];
}

const FILTER_OPTIONS: Array<'Semua' | EventCategory> = [
  'Semua',
  'Akan Datang',
  'Program Kerja',
  'Terlaksana',
];

export function EventsSection({ events }: EventsSectionProps) {
  const [filter, setFilter] = useState<'Semua' | EventCategory>('Semua');
  const [selectedEvent, setSelectedEvent] = useState<OsisEvent | null>(null);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const filteredEvents = useMemo(() => {
    if (filter === 'Semua') return events;
    return events.filter((ev) => ev.category === filter);
  }, [events, filter]);

  const leadEvent = filteredEvents[0] || null;
  const secondaryEvents = filteredEvents.slice(1);

  return (
    <section id="kegiatan" className="py-16 sm:py-24 border-t border-stone-200 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-10 border-b border-stone-200">
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-wider text-[#B45309] mb-2">
              02. Informasi Kegiatan OSIS
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#171923] tracking-tight text-balance">
              Agenda, Program Kerja &amp; Dokumentasi OSKAGA
            </h2>
            <p className="mt-3 text-base text-stone-600 leading-relaxed">
              Informasi resmi pelaksanaan kegiatan siswa, jadwal agenda mendatang, serta laporan
              program kerja OSIS SMKN 3 Pacitan.
            </p>
          </div>

          {/* Filter Tabs */}
          <div
            role="tablist"
            aria-label="Filter kategori kegiatan OSIS"
            className="flex flex-wrap items-center gap-1 p-1 bg-white rounded-lg border border-stone-200 self-start lg:self-auto"
          >
            {FILTER_OPTIONS.map((option) => {
              const active = filter === option;
              return (
                <button
                  key={option}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setFilter(option)}
                  className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'bg-[#1E3A8A] text-white'
                      : 'text-stone-600 hover:text-[#171923]'
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="mt-10 p-10 text-center bg-white border border-stone-200 rounded-xl">
            <p className="text-sm font-medium text-stone-700">
              Belum ada informasi kegiatan untuk kategori {filter}.
            </p>
          </div>
        ) : (
          <div className="mt-10 space-y-8">
            {/* Lead Featured Event */}
            {leadEvent && (
              <article className="grid grid-cols-1 lg:grid-cols-12 bg-white border border-stone-200 rounded-xl overflow-hidden items-stretch">
                <div className="lg:col-span-6 bg-stone-100 relative min-h-[260px] lg:min-h-[340px]">
                  {leadEvent.imageUrl && !brokenImages[leadEvent.id] ? (
                    <img
                      src={leadEvent.imageUrl}
                      alt={leadEvent.title}
                      referrerPolicy="no-referrer"
                      onError={() =>
                        setBrokenImages((prev) => ({ ...prev, [leadEvent.id]: true }))
                      }
                      className="w-full h-full object-cover lg:absolute lg:inset-0"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-stone-100 to-stone-200 text-stone-500">
                      <Calendar className="w-8 h-8 mb-2 text-[#1E3A8A]" />
                      <span className="text-xs font-medium text-center">{leadEvent.title}</span>
                    </div>
                  )}
                </div>

                <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-3">
                      <span className="font-semibold text-[#1E3A8A]">{leadEvent.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">{leadEvent.dateLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span>{leadEvent.location}</span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-semibold text-[#171923] tracking-tight text-balance">
                      {leadEvent.title}
                    </h3>

                    <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
                      {leadEvent.summary}
                    </p>
                  </div>

                  <div className="mt-8 pt-5 border-t border-stone-200 flex flex-wrap items-center justify-between gap-4">
                    <span className="text-xs text-stone-500">{leadEvent.organizer}</span>

                    <button
                      type="button"
                      onClick={() => setSelectedEvent(leadEvent)}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1E3A8A] hover:underline underline-offset-4 cursor-pointer whitespace-nowrap"
                    >
                      Baca Detail Kegiatan
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </article>
            )}

            {/* Secondary Events Grid */}
            {secondaryEvents.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {secondaryEvents.map((ev) => (
                  <article
                    key={ev.id}
                    className="flex flex-col bg-white border border-stone-200 rounded-xl overflow-hidden"
                  >
                    <div className="aspect-[4/3] bg-stone-100 relative overflow-hidden">
                      {ev.imageUrl && !brokenImages[ev.id] ? (
                        <img
                          src={ev.imageUrl}
                          alt={ev.title}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setBrokenImages((prev) => ({ ...prev, [ev.id]: true }))
                          }
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-stone-100 to-stone-200 text-stone-500">
                          <Calendar className="w-7 h-7 mb-2 text-[#1E3A8A]" />
                          <span className="text-xs font-medium text-center">{ev.title}</span>
                        </div>
                      )}
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500 mb-2">
                          <span className="font-semibold text-[#1E3A8A]">{ev.category}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono tabular-nums">{ev.dateLabel}</span>
                        </div>

                        <h3 className="text-lg font-semibold text-[#171923] leading-snug">
                          {ev.title}
                        </h3>

                        <p className="mt-2.5 text-sm text-stone-600 leading-relaxed">
                          {ev.summary}
                        </p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-stone-200 flex items-center justify-between gap-3">
                        <span className="text-xs text-stone-500 truncate">{ev.location}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedEvent(ev)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E3A8A] hover:underline underline-offset-4 whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Detail
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="event-modal-title"
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white border border-stone-200 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/9] bg-stone-100 relative overflow-hidden">
              {selectedEvent.imageUrl && !brokenImages[selectedEvent.id] ? (
                <img
                  src={selectedEvent.imageUrl}
                  alt={selectedEvent.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-100 text-stone-500">
                  <Calendar className="w-10 h-10 text-[#1E3A8A]" />
                </div>
              )}
              <button
                type="button"
                aria-label="Tutup detail kegiatan"
                onClick={() => setSelectedEvent(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-lg bg-white/95 text-[#171923] border border-stone-200 flex items-center justify-center hover:bg-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 mb-2">
                <span className="font-semibold text-[#1E3A8A]">{selectedEvent.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">{selectedEvent.dateLabel}</span>
              </div>

              <h3
                id="event-modal-title"
                className="text-2xl sm:text-3xl font-semibold text-[#171923]"
              >
                {selectedEvent.title}
              </h3>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-[#1E3A8A] shrink-0" />
                  <span>{selectedEvent.organizer}</span>
                </div>
              </div>

              <p className="mt-5 text-sm sm:text-base text-stone-700 leading-relaxed whitespace-pre-line">
                {selectedEvent.description}
              </p>

              <div className="mt-6 pt-5 border-t border-stone-200 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#171923] bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
