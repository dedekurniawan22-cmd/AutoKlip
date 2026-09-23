import { VideoSource } from '../types';

export const SAMPLE_VIDEOS: VideoSource[] = [
  {
    id: 'sample-podcast-marketing',
    title: 'Podcast: Rahasia Menghasilkan 100 Juta Pertama dari Konten & Personal Branding',
    duration: 2540, // ~42 mins
    // Reliable, fast public MP4 stream for testing
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80',
    description: 'Diskusi mendalam bersama praktisi digital marketing dan podcaster ternama tentang algoritma media sosial, hook 3 detik pertama, dan cara monetisasi audiens.',
    category: 'Bisnis & Marketing',
    transcriptSample: `00:00:15 - Host: Kebanyakan kreator pemula berpikir bahwa kamera mahal adalah segalanya. Tapi kenapa 99% dari mereka menyerah dalam 30 hari pertama?
00:01:20 - Tamu: Karena mereka melupakan satu hal paling fatal: retention curve. Jika penonton skip di 2 detik awal, algoritma menganggap konten Anda sampah.
00:04:15 - Tamu: Ini formula hook yang saya pakai: Jangan pernah buka dengan kata "Halo teman-teman". Mulailah dengan pertanyaan kontroversial atau visual pattern interrupt.
00:07:30 - Host: Banyak orang takut dikritik saat bikin konten tajam. Bagaimana mengatasinya?
00:08:10 - Tamu: Polaritas menghasilkan loyalitas. Kalau konten Anda disukai semua orang, sebenarnya tidak ada yang benar-benar peduli pada Anda.
00:11:45 - Host: Mari bedah studi kasus akun yang naik dari 0 ke 500k followers dalam 3 bulan tanpa paid ads...
00:15:20 - Tamu: Triknya ada di batch-processing 30 hook variasi dari satu rekaman panjang seperti ini. Jangan potong sembarangan, ambil momen saat ada "Aha Moment" penonton.
00:19:00 - Tamu: Uang tidak datang dari views semata, uang datang dari trust yang dibangun lewat klip-klip bernilai tinggi yang berulang kali masuk ke FYP mereka.
00:23:40 - Host: Bagaimana dengan durasi klip? Lebih baik 15 detik atau 60 detik?
00:24:10 - Tamu: Di TikTok sekarang, 25 sampai 45 detik adalah sweet spot dengan loop storytelling. Penonton tidak sadar video berputar dua kali!`
  },
  {
    id: 'sample-tech-ai-keynote',
    title: 'Keynote Talk: Masa Depan Artificial Intelligence & Automasi Konten Kreator',
    duration: 1980, // ~33 mins
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    description: 'Presentasi futuristik tentang bagaimana AI Agent merombak produksi video, pemotongan klip otomatis, dan masa depan industri kreatif.',
    category: 'Teknologi & AI',
    transcriptSample: `00:00:40 - Pembicara: Dalam kurun waktu 12 bulan ke depan, cara kita memproduksi konten video akan berubah 180 derajat.
00:02:15 - Pembicara: Dulu butuh 1 editor senior bekerja 3 hari untuk memotong 20 klip dari podcast 1 jam. Hari ini, AI melakukannya dalam 15 detik dengan akurasi retensi lebih tinggi.
00:05:50 - Pembicara: Kunci utama bukan menggantikan kreativitas manusia, melainkan mengeliminasi gesekan teknis yang melelahkan.
00:09:12 - Pembicara: Ketika Anda memadukan model multimodal dengan deteksi intonasi vokal, AI tahu persis detik di mana audiens merasakan emosi tertinggi.`
  },
  {
    id: 'sample-mindset-productivity',
    title: 'Deep Dive: Cara Membangun Fokus Brutal & Produktivitas Tingkat Tinggi',
    duration: 3120, // ~52 mins
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
    description: 'Strategi sains neurologi tentang dopamin, konsentrasi tanpa distraksi, dan cara mencapai performa puncak dalam kehidupan sehari-hari.',
    category: 'Produktivitas & Mindset',
    transcriptSample: `00:01:05 - Narasumber: 3 jam pertama di pagi hari menentukan 90% hasil finansial dan kesehatan mental Anda.
00:03:40 - Narasumber: Alasan kenapa Anda lelah bukan karena bekerja terlalu keras, tapi karena otak Anda mengalami switching context 150 kali dalam sehari.
00:07:25 - Narasumber: Jangan mengejar motivasi. Motivasi itu emosi sesaat. Bangun sistem di mana Anda tidak punya pilihan selain bertindak.`
  }
];
