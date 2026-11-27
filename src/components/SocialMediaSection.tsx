import { ExternalLink, Globe, Instagram } from 'lucide-react';
import { SocialSettings } from '../types';

interface SocialMediaSectionProps {
  social: SocialSettings;
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className || 'w-5 h-5'}
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

export function SocialMediaSection({ social }: SocialMediaSectionProps) {
  return (
    <section id="sosial" className="py-16 sm:py-24 border-t border-stone-200 bg-[#FAF8F5]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-stone-200">
          <div className="max-w-2xl">
            <p className="text-xs font-mono tracking-wider text-[#B45309] mb-2">
              04. Kanal Media Sosial Resmi
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#171923] tracking-tight text-balance">
              Instagram &amp; TikTok SMKN 3 Pacitan
            </h2>
            <p className="mt-3 text-base text-stone-600 leading-relaxed">
              Ikuti dokumentasi kegiatan sekolah, video keseruan ekstrakurikuler, serta pengumuman
              cepat melalui kanal Instagram dan TikTok resmi SMKN 3 Pacitan &amp; OSKAGA.
            </p>
          </div>

          <a
            href="https://smkn3pacitan.sch.id/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#171923] bg-white border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors whitespace-nowrap shrink-0 self-start md:self-auto"
          >
            <Globe className="w-4 h-4 text-[#1E3A8A]" />
            Portal smkn3pacitan.sch.id
            <ExternalLink className="w-3.5 h-3.5 text-stone-400" />
          </a>
        </div>

        {/* Instagram & TikTok Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          {/* Instagram Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-[#1E3A8A]">
                    <Instagram className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-stone-500">Instagram</p>
                    <h3 className="text-xl font-semibold text-[#171923]">
                      Liputan Foto &amp; Reels Sekolah
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <a
                  href={social.schoolInstagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg hover:border-[#1E3A8A] transition-colors group"
                >
                  <div>
                    <p className="text-xs text-stone-500">Akun Resmi Sekolah</p>
                    <p className="text-base font-semibold text-[#171923] font-mono mt-0.5 group-hover:text-[#1E3A8A]">
                      {social.schoolInstagramHandle}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#1E3A8A] shrink-0" />
                </a>

                <a
                  href={social.osisInstagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg hover:border-[#1E3A8A] transition-colors group"
                >
                  <div>
                    <p className="text-xs text-stone-500">Akun OSIS / OSKAGA</p>
                    <p className="text-base font-semibold text-[#171923] font-mono mt-0.5 group-hover:text-[#1E3A8A]">
                      {social.osisInstagramHandle}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#1E3A8A] shrink-0" />
                </a>
              </div>
            </div>

            <p className="mt-6 text-xs text-stone-500 leading-relaxed">
              Dokumentasi kegiatan upacara, prestasi lomba kompetensi siswa (LKS), serta info
              pendaftaran lomba antar kelas.
            </p>
          </div>

          {/* TikTok Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-4 pb-5 border-b border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-[#171923]">
                    <TikTokIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-mono text-stone-500">TikTok</p>
                    <h3 className="text-xl font-semibold text-[#171923]">
                      Video Kreatif &amp; Keseharian Stemga
                    </h3>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <a
                  href={social.schoolTiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg hover:border-[#1E3A8A] transition-colors group"
                >
                  <div>
                    <p className="text-xs text-stone-500">TikTok Resmi SMKN 3 Pacitan</p>
                    <p className="text-base font-semibold text-[#171923] font-mono mt-0.5 group-hover:text-[#1E3A8A]">
                      {social.schoolTiktokHandle}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#1E3A8A] shrink-0" />
                </a>

                <a
                  href={social.osisTiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-4 p-4 bg-[#FAF8F5] border border-stone-200 rounded-lg hover:border-[#1E3A8A] transition-colors group"
                >
                  <div>
                    <p className="text-xs text-stone-500">TikTok OSIS OSKAGA</p>
                    <p className="text-base font-semibold text-[#171923] font-mono mt-0.5 group-hover:text-[#1E3A8A]">
                      {social.osisTiktokHandle}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-400 group-hover:text-[#1E3A8A] shrink-0" />
                </a>
              </div>
            </div>

            <p className="mt-6 text-xs text-stone-500 leading-relaxed">
              Cuplikan vlog kegiatan OSIS, praktik jurusan, pentas seni, serta momen angkatan SMKN 3
              Pacitan.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
