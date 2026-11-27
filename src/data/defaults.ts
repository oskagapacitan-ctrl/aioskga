import { Batch, FeedbackItem, Memory, OsisEvent, SocialSettings } from '../types';

export const HERO_IMAGE_PATH = '/src/assets/images/hero_osis_pacitan_1795751219011.jpg';

export const DEFAULT_BATCHES: Batch[] = [
  {
    id: 'angkatan-2024',
    year: '2024',
    title: 'Angkatan 2024 — Cakrawala Stemga',
    theme: 'Menjaga jejak langkah dan persaudaraan alumni SMKN 3 Pacitan.',
    isActive: true,
    isFallback: true,
  },
  {
    id: 'angkatan-2025',
    year: '2025',
    title: 'Angkatan 2025 — Lentera Karya',
    theme: 'Tumbuh bersama di bengkel, studio, dan halaman sekolah tercinta.',
    isActive: true,
    isFallback: true,
  },
  {
    id: 'angkatan-2026',
    year: '2026',
    title: 'Angkatan 2026 — Gema Prestasi',
    theme: 'Merangkai cerita masa SMK sebelum melangkah ke dunia kerja & kuliah.',
    isActive: true,
    isFallback: true,
  },
  {
    id: 'angkatan-2027',
    year: '2027',
    title: 'Angkatan 2027 — Tunas Inovasi',
    theme: 'Catatan awal perjalanan siswa-siswi baru kabinet OSKAGA.',
    isActive: true,
    isFallback: true,
  },
];

export const DEFAULT_MEMORIES: Memory[] = [
  {
    id: 'demo-mem-2024-1',
    batchId: 'angkatan-2024',
    batchYear: '2024',
    authorUid: 'system',
    studentName: 'Raka Pratama',
    className: 'XII Kuliner 1',
    message:
      'Paling kangen waktu persiapan bazar HUT sekolah di lapangan utama. Hujan deras menjelang acara tapi seluruh angkatan tetap kompak merapikan tenda sampai selesai.',
    quote: 'Sekali Stemga, selamanya keluarga.',
    isPublic: true,
    createdAt: new Date('2024-05-12T08:30:00Z'),
    isFallback: true,
  },
  {
    id: 'demo-mem-2025-1',
    batchId: 'angkatan-2025',
    batchYear: '2025',
    authorUid: 'system',
    studentName: 'Nadia Kusuma',
    className: 'XII Tata Busana 2',
    message:
      'Terima kasih untuk Bapak/Ibu guru dan teman-teman OSKAGA yang selalu memberi ruang berkarya di panggung pentas seni. Latihan sepulang sekolah jadi kenangan terbaik.',
    quote: 'Karya kecil di masa SMK adalah awal langkah besar.',
    isPublic: true,
    createdAt: new Date('2025-04-20T10:00:00Z'),
    isFallback: true,
  },
  {
    id: 'demo-mem-2026-1',
    batchId: 'angkatan-2026',
    batchYear: '2026',
    authorUid: 'system',
    studentName: 'Dimas Setiawan',
    className: 'XI Perhotelan 1',
    message:
      'Momen classmeeting antar jurusan selalu seru! Walaupun capek persiapan lomba, kebersamaan di koridor kelas bikin masa sekolah terasa penuh warna.',
    quote: 'Solidaritas tumbuh dari tawa di sela jam istirahat.',
    isPublic: true,
    createdAt: new Date('2026-09-15T09:15:00Z'),
    isFallback: true,
  },
];

export const DEFAULT_EVENTS: OsisEvent[] = [
  {
    id: 'event-ldks-2026',
    title: 'Latihan Dasar Kepemimpinan Siswa (LDKS) OSKAGA',
    category: 'Akan Datang',
    dateLabel: '12–14 Desember 2026',
    location: 'Aula & Lapangan SMKN 3 Pacitan',
    organizer: 'Sekbid I & V · Pembinaan Kepemimpinan',
    summary:
      'Pembekalan manajemen organisasi, tata kelola proposal, dan kolaborasi lintas sekbid bagi calon pengurus OSIS periode baru.',
    description:
      'Kegiatan LDKS tahunan bertujuan membentuk karakter pengurus OSIS SMKN 3 Pacitan yang disiplin, komunikatif, dan sigap melayani kebutuhan siswa. Peserta akan mengikuti sesi materi kepemimpinan, simulasi penyusunan program kerja, diskusi studi kasus kegiatan sekolah, serta outbound penguatan solidaritas tim.',
    imageUrl: '/src/assets/images/kegiatan_ldks_osis_v2_1795751236287.jpg',
    isPublished: true,
    isFallback: true,
  },
  {
    id: 'event-pensi-stemga',
    title: 'Pentas Seni & Gelar Karya Vokasi Stemga',
    category: 'Program Kerja',
    dateLabel: 'Februari 2027',
    location: 'Halaman Tengah SMKN 3 Pacitan',
    organizer: 'Sekbid VIII · Apresiasi Seni & Budaya',
    summary:
      'Panggung ekspresi seni musik akustik, tari daerah Pacitan, peragaan busana, dan pameran produk keahlian siswa.',
    description:
      'Gelar Karya & Pentas Seni memadukan pertunjukan bakat siswa dari seluruh kompetensi keahlian dengan bazar karya kreatif. Acara ini terbuka bagi warga sekolah dan menghadirkan ruang kolaborasi antara ekstrakurikuler seni musik, tari, tata rias, kuliner, serta perhotelan.',
    imageUrl: '/src/assets/images/kegiatan_pensi_stemga_v2_1795751235181.jpg',
    isPublished: true,
    isFallback: true,
  },
  {
    id: 'event-baksos-ramadan',
    title: 'Bakti Sosial & Gerakan Peduli Sesama Pacitan',
    category: 'Terlaksana',
    dateLabel: '18 Oktober 2026',
    location: 'Koridor Utama Sekolah & Desa Sekitar',
    organizer: 'Sekbid II · Budi Pekerti & Kepedulian Sosial',
    summary:
      'Penyaluran paket kebutuhan pokok hasil donasi siswa, guru, dan alumni SMKN 3 Pacitan kepada warga sekitar sekolah.',
    description:
      'Melalui penggalangan donasi sukarela selama dua pekan di setiap kelas, OSIS SMKN 3 Pacitan menghimpun ratusan paket sembako dan perlengkapan belajar untuk disalurkan langsung ke panti asuhan serta masyarakat di wilayah Pacitan. Seluruh proses pendataan hingga distribusi dikerjakan bersama perwakilan kelas.',
    imageUrl: '/src/assets/images/kegiatan_baksos_pacitan_1795751219930.jpg',
    isPublished: true,
    isFallback: true,
  },
  {
    id: 'event-forum-aspirasi',
    title: 'Musyawarah Perwakilan Kelas & Forum Aspirasi Siswa',
    category: 'Program Kerja',
    dateLabel: 'Setiap Akhir Semester',
    location: 'Ruang Rapat Utama SMKN 3 Pacitan',
    organizer: 'Pengurus Inti OSIS & MPK',
    summary:
      'Evaluasi terbuka program kerja OSIS berdasarkan masukan dari kotak saran & kritik seluruh warga sekolah.',
    description:
      'Forum ini mempertemukan perwakilan setiap kelas, pengurus OSIS, dan pembina untuk membahas secara langsung seluruh saran dan kritik yang masuk melalui portal digital maupun kotak aspirasi sekolah. Hasil pembahasan ditindaklanjuti menjadi rekomendasi perbaikan fasilitas dan agenda kegiatan berikutnya.',
    imageUrl: HERO_IMAGE_PATH,
    isPublished: true,
    isFallback: true,
  },
];

export const DEFAULT_FEEDBACK: FeedbackItem[] = [
  {
    id: 'demo-fb-1',
    authorUid: 'system',
    senderName: 'Anonim',
    className: 'XI Perhotelan',
    feedbackType: 'Saran',
    category: 'Kegiatan OSIS',
    message:
      'Untuk classmeeting semester depan, mohon ditambahkan cabang lomba fotografi kegiatan sekolah atau konten kreatif antar kelas agar jurusan non-olahraga juga makin aktif.',
    isPublic: true,
    status: 'Diproses',
    adminReply:
      'Terima kasih atas sarannya! Usulan lomba fotografi & konten kreatif sudah masuk catatan rapat Sekbid VIII untuk persiapan classmeeting akhir semester.',
    createdAt: new Date('2026-11-10T07:20:00Z'),
    isFallback: true,
  },
  {
    id: 'demo-fb-2',
    authorUid: 'system',
    senderName: 'Siti Rahmawati',
    className: 'XII Kecantikan',
    feedbackType: 'Aspirasi',
    category: 'Fasilitas Sekolah',
    message:
      'Area gazebo depan ruang praktik perlu tambahan titik stopkontak dan jadwal piket kebersihan rutin agar nyaman dipakai diskusi kelompok saat istirahat.',
    isPublic: true,
    status: 'Selesai',
    adminReply:
      'Aspirasi sudah diteruskan ke bagian Sarpras dan jadwal piket area taman telah dikoordinasikan bersama perwakilan kelas.',
    createdAt: new Date('2026-11-04T04:15:00Z'),
    isFallback: true,
  },
];

export const DEFAULT_SOCIAL_SETTINGS: SocialSettings = {
  schoolInstagramHandle: '@smkntiga_pacitan_official',
  schoolInstagramUrl: 'https://www.instagram.com/smkntiga_pacitan_official/',
  osisInstagramHandle: '@oskaga.pacitan',
  osisInstagramUrl: 'https://www.instagram.com/explore/tags/oskagapacitan/',
  schoolTiktokHandle: '@smkn3pacitan',
  schoolTiktokUrl: 'https://www.tiktok.com/search?q=SMKN%203%20Pacitan',
  osisTiktokHandle: '@oskagapacitan',
  osisTiktokUrl: 'https://www.tiktok.com/search?q=Oskaga%20Pacitan',
};
