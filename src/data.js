// ReadyHands — fictional sample data. Every person, site and number here is invented.
import { H, DAY } from './logic.js';

/** Demo day: Saturday 21 November 2026, in demo-local time. */
export const D0 = Date.UTC(2026, 10, 21);
const at = (dayOffset, hour) => D0 + dayOffset * DAY + hour * H;
const b = (en, bm) => ({ en, bm });

export const AREAS = ['Hulu Langat', 'Shah Alam', 'Klang', 'Kajang', 'Petaling Jaya'];

export const LABELS = {
  skill: {
    cleanup: b('Cleanup', 'Pembersihan'), driving: b('Driving', 'Memandu'), cooking: b('Cooking', 'Memasak'),
    teaching: b('Teaching', 'Mengajar'), firstAid: b('First aid', 'Pertolongan cemas'), counseling: b('Counseling', 'Kaunseling'),
    medic: b('Medic', 'Paramedik'), electrician: b('Electrician', 'Juruelektrik'), engineer: b('Engineer', 'Jurutera'),
  },
  asset: {
    fourByFour: b('4x4', '4x4'), boat: b('Boat', 'Bot'), lorry: b('Lorry', 'Lori'),
    generator: b('Generator', 'Penjana kuasa'), pump: b('Water pump', 'Pam air'), chainsaw: b('Chainsaw', 'Gergaji rantai'),
  },
  badge: {
    medic: b('Medic', 'Paramedik'), electrician: b('Electrician', 'Juruelektrik'),
    engineer: b('Engineer', 'Jurutera'), childSafe: b('Child-safe', 'Selamat kanak-kanak'),
  },
  // Who would check each badge in production (PRODUCT.md §5.3, to confirm). Nothing is checked in this prototype.
  badgeBody: {
    medic: b('In production: the relevant medical registration body', 'Dalam produksi: badan pendaftaran perubatan berkaitan'),
    electrician: b('In production: the electrical competency regulator', 'Dalam produksi: pengawal selia kekompetenan elektrik'),
    engineer: b('In production: the professional engineers board', 'Dalam produksi: lembaga jurutera profesional'),
    childSafe: b('In production: a background check through the NGO partner', 'Dalam produksi: semakan latar belakang melalui rakan NGO'),
  },
  siteType: { school: b('School', 'Sekolah'), home: b('Home', 'Rumah'), shelter: b('Relief centre', 'Pusat pemindahan'), clinic: b('Clinic', 'Klinik') },
  risk: { low: b('Low', 'Rendah'), medium: b('Medium', 'Sederhana'), high: b('High', 'Tinggi') },
  severity: { none: b('None', 'Tiada'), light: b('Light', 'Ringan'), moderate: b('Moderate', 'Sederhana'), severe: b('Severe', 'Teruk') },
  room: {
    classrooms: b('Classrooms', 'Bilik darjah'), lab: b('Computer lab', 'Makmal komputer'),
    structure: b('Block A structure', 'Struktur Blok A'), field: b('School field', 'Padang sekolah'),
  },
  availability: {
    weekends: b('Weekends', 'Hujung minggu'), weekdays: b('Weekdays', 'Hari bekerja'),
    evenings: b('Evenings', 'Waktu petang'), anytime: b('Any time', 'Bila-bila masa'),
  },
  stage: {
    evacuees: b('Evacuees relocated', 'Mangsa dipindahkan'), assessed: b('Damage assessed', 'Kerosakan dinilai'),
    cleanup: b('Cleanup done', 'Pembersihan selesai'), inspection: b('Inspection passed', 'Pemeriksaan lulus'),
    supplies: b('Supplies in', 'Bekalan tiba'), reopened: b('Reopened', 'Dibuka semula'),
  },
};

/** Titles for posts suggested from a school damage report. */
export const SUGGESTION_TEXT = {
  cleanup: { title: b('Mud cleanup in classrooms', 'Bersihkan lumpur di bilik darjah'), desc: b('Shovel mud, wash floors and walls, carry out ruined furniture.', 'Sodok lumpur, cuci lantai dan dinding, keluarkan perabot rosak.') },
  delivery: { title: b('Deliver cleaning supplies and desks by 4x4', 'Hantar bekalan pembersihan dan meja dengan 4x4'), desc: b('Collect supplies from the Harapan Relief store and drive them to the school.', 'Ambil bekalan dari stor Harapan Relief dan hantar ke sekolah.') },
  wiring: { title: b('Check computer lab wiring', 'Periksa pendawaian makmal komputer'), desc: b('Inspect sockets and wiring before power is switched back on.', 'Periksa soket dan pendawaian sebelum bekalan elektrik dihidupkan semula.') },
  structure: { title: b('Structural check of Block A', 'Pemeriksaan struktur Blok A'), desc: b('Check walls, beams and stairs before anyone works inside.', 'Periksa dinding, rasuk dan tangga sebelum sesiapa bekerja di dalam.') },
  debris: { title: b('Remove debris from the field by lorry', 'Angkut sisa dari padang dengan lori'), desc: b('Load branches and ruined furniture and take them to the collection point.', 'Muat dahan dan perabot rosak lalu hantar ke pusat pengumpulan.') },
  generator: { title: b('Run a generator for 2 days', 'Kendalikan penjana kuasa selama 2 hari'), desc: b('Bring and operate a generator for lights and pumps.', 'Bawa dan kendalikan penjana kuasa untuk lampu dan pam.') },
  reading: { title: b('Read with pupils at the reading corner', 'Membaca bersama murid di sudut bacaan'), desc: b('Read with small groups of pupils. Always with a teacher present.', 'Membaca bersama kumpulan kecil murid. Sentiasa ditemani guru.') },
};

const q = (text, options, answer) => ({ text, options, answer });

/** PRODUCT.md §5.4. Each module: illustrated cards (low-bandwidth), one activity, three questions. */
export const MODULES = [
  {
    id: 'basics', minutes: 2, icon: 'triangle',
    title: b('Flood safety basics', 'Asas keselamatan banjir'),
    requiredFor: b('Every first post', 'Setiap tugasan pertama'),
    cards: [
      b('Never walk or drive through moving water. 15 cm of fast water can knock you over.', 'Jangan berjalan atau memandu merentasi air deras. Air deras 15 cm boleh menjatuhkan anda.'),
      b('Check in when you arrive and check out when you leave, every time. That is how the coordinator knows you are safe.', 'Daftar masuk apabila tiba dan daftar keluar apabila pulang, setiap kali. Begitulah penyelaras tahu anda selamat.'),
      b('Leave at once if water rises, you smell gas, or a building creaks. No task is worth your life.', 'Tinggalkan tempat itu segera jika air naik, terhidu gas, atau bangunan berbunyi. Tiada tugasan lebih bernilai daripada nyawa anda.'),
    ],
    activity: {
      prompt: b('Tap every sign that means "leave now".', 'Tekan setiap tanda yang bermaksud "tinggalkan sekarang".'),
      items: [
        { text: b('Water is rising', 'Air semakin naik'), correct: true },
        { text: b('You smell gas', 'Terhidu bau gas'), correct: true },
        { text: b('It is lunchtime', 'Sudah waktu makan tengah hari'), correct: false },
        { text: b('The wall is cracking', 'Dinding mula retak'), correct: true },
      ],
    },
    questions: [
      q(b('The road ahead has moving water. What do you do?', 'Jalan di hadapan ada air deras. Apa yang anda lakukan?'), [b('Drive through slowly', 'Memandu perlahan-lahan'), b('Turn back and report it', 'Berpatah balik dan laporkan'), b('Walk through to test the depth', 'Berjalan untuk menguji kedalaman')], 1),
      q(b('When do you check out?', 'Bila anda daftar keluar?'), [b('Only if something goes wrong', 'Hanya jika ada masalah'), b('Every time you leave the site', 'Setiap kali meninggalkan tapak'), b('At the end of the week', 'Pada hujung minggu')], 1),
      q(b('The water starts rising while you work. You…', 'Air mula naik semasa anda bekerja. Anda…'), [b('Finish the task first', 'Siapkan tugasan dahulu'), b('Leave at once and tell the poster', 'Beredar segera dan beritahu pemohon'), b('Wait and see', 'Tunggu dan lihat')], 1),
    ],
  },
  {
    id: 'cleanup', minutes: 2, icon: 'wrench',
    title: b('Safe flood cleanup', 'Pembersihan banjir yang selamat'),
    requiredFor: b('Cleanup posts', 'Tugasan pembersihan'),
    cards: [
      b('Wear gloves, boots and a mask. Flood mud hides glass, nails and sewage.', 'Pakai sarung tangan, but dan pelitup muka. Lumpur banjir menyembunyikan kaca, paku dan kumbahan.'),
      b('Use a shovel or rake for debris. Never reach into mud with your hands.', 'Gunakan penyodok atau pencakar untuk sisa. Jangan sekali-kali menyeluk lumpur dengan tangan.'),
      b('Lift with your legs, keep your back straight, and carry heavy things in pairs.', 'Angkat menggunakan kaki, luruskan belakang, dan angkat barang berat berdua.'),
    ],
    activity: {
      prompt: b('Tap what you must wear before cleanup.', 'Tekan apa yang mesti dipakai sebelum pembersihan.'),
      items: [
        { text: b('Gloves', 'Sarung tangan'), correct: true },
        { text: b('Boots', 'But'), correct: true },
        { text: b('Slippers', 'Selipar'), correct: false },
        { text: b('Mask', 'Pelitup muka'), correct: true },
      ],
    },
    questions: [
      q(b('What should you wear for mud cleanup?', 'Apa yang perlu dipakai untuk membersihkan lumpur?'), [b('Slippers and shorts', 'Selipar dan seluar pendek'), b('Gloves, boots and a mask', 'Sarung tangan, but dan pelitup muka'), b('Anything comfortable', 'Apa-apa yang selesa')], 1),
      q(b('You see something sharp in the mud. You…', 'Anda nampak sesuatu yang tajam dalam lumpur. Anda…'), [b('Pick it up by hand', 'Ambil dengan tangan'), b('Use a shovel or rake', 'Gunakan penyodok atau pencakar'), b('Step over it', 'Langkah sahaja')], 1),
      q(b('How do you lift a heavy desk?', 'Bagaimana mengangkat meja yang berat?'), [b('Alone, bending your back', 'Seorang diri, membongkok'), b('In a pair, lifting with your legs', 'Berdua, mengangkat dengan kaki'), b('Drag it quickly', 'Seret dengan cepat')], 1),
    ],
  },
  {
    id: 'hygiene', minutes: 2, icon: 'shield',
    title: b('Hygiene and disease', 'Kebersihan dan penyakit'),
    requiredFor: b('Cleanup, sanitation and kitchen posts', 'Tugasan pembersihan, sanitasi dan dapur'),
    cards: [
      b('Floodwater can carry leptospirosis. Cover every cut before you start.', 'Air banjir boleh membawa leptospirosis. Tutup setiap luka sebelum bermula.'),
      b('Drink only bottled or boiled water. Never taste floodwater or tap water after a flood.', 'Minum hanya air botol atau air masak. Jangan minum air banjir atau air paip selepas banjir.'),
      b('Wash hands with soap before eating. Wash any wound at once and tell the poster.', 'Basuh tangan dengan sabun sebelum makan. Basuh sebarang luka segera dan beritahu pemohon.'),
    ],
    activity: {
      prompt: b('Tap the water that is safe to drink.', 'Tekan air yang selamat diminum.'),
      items: [
        { text: b('Bottled water', 'Air botol'), correct: true },
        { text: b('Boiled water', 'Air masak'), correct: true },
        { text: b('Tap water straight after a flood', 'Air paip sejurus selepas banjir'), correct: false },
      ],
    },
    questions: [
      q(b('You have a small cut on your hand. Before cleanup you…', 'Ada luka kecil di tangan. Sebelum pembersihan anda…'), [b('Ignore it', 'Abaikan'), b('Cover it with a waterproof plaster and wear gloves', 'Tutup dengan plaster kalis air dan pakai sarung tangan'), b('Rinse it in floodwater', 'Bilas dengan air banjir')], 1),
      q(b('Which water is safe to drink?', 'Air manakah selamat diminum?'), [b('Bottled or boiled water', 'Air botol atau air masak'), b('Clear floodwater', 'Air banjir yang jernih'), b('Any tap water', 'Sebarang air paip')], 0),
      q(b('When do you wash your hands?', 'Bila anda perlu membasuh tangan?'), [b('Only at home', 'Hanya di rumah'), b('Before eating and after cleanup', 'Sebelum makan dan selepas pembersihan'), b('When they look dirty', 'Apabila nampak kotor')], 1),
    ],
  },
  {
    id: 'electricity', minutes: 2, icon: 'plug',
    title: b('Electricity after a flood', 'Elektrik selepas banjir'),
    requiredFor: b('Damaged buildings, generator and water pump posts', 'Bangunan rosak, tugasan penjana kuasa dan pam air'),
    cards: [
      b('Never touch wet switches, sockets or appliances.', 'Jangan sentuh suis, soket atau peralatan yang basah.'),
      b('Wait for a verified electrician to say the power is safe.', 'Tunggu juruelektrik yang disahkan mengesahkan bekalan selamat.'),
      b('Run generators outdoors only. Their fumes can kill in a closed room.', 'Kendalikan penjana kuasa di luar sahaja. Asapnya boleh membunuh di bilik tertutup.'),
    ],
    activity: {
      prompt: b('Tap where a generator may run.', 'Tekan tempat penjana kuasa boleh dikendalikan.'),
      items: [
        { text: b('Outdoors, away from windows', 'Di luar, jauh dari tingkap'), correct: true },
        { text: b('Inside a classroom', 'Di dalam bilik darjah'), correct: false },
        { text: b('In a closed store room', 'Di dalam stor tertutup'), correct: false },
      ],
    },
    questions: [
      q(b('A switch is wet. You…', 'Suis basah. Anda…'), [b('Dry it and switch it on', 'Keringkan dan hidupkan'), b('Leave it and tell the poster', 'Biarkan dan beritahu pemohon'), b('Test it quickly', 'Uji dengan cepat')], 1),
      q(b('Who decides the power is safe to switch on?', 'Siapa menentukan bekalan elektrik selamat dihidupkan?'), [b('Any volunteer', 'Mana-mana sukarelawan'), b('A verified electrician', 'Juruelektrik yang disahkan'), b('Whoever arrives first', 'Sesiapa yang tiba dahulu')], 1),
      q(b('Where do you run a generator?', 'Di mana penjana kuasa dikendalikan?'), [b('Outdoors with open air', 'Di luar dengan udara terbuka'), b('Indoors near the door', 'Di dalam berhampiran pintu'), b('In the canteen', 'Di kantin')], 0),
    ],
  },
  {
    id: 'driving', minutes: 2, icon: 'truck',
    title: b('Driving in flood areas', 'Memandu di kawasan banjir'),
    requiredFor: b('Driving, 4x4 and lorry posts', 'Tugasan memandu, 4x4 dan lori'),
    cards: [
      b('If you cannot see the road surface, do not drive through. Depth is impossible to judge.', 'Jika permukaan jalan tidak kelihatan, jangan teruskan. Kedalaman mustahil dianggar.'),
      b('Respect road closures. Ask the poster for the safe route before you leave.', 'Patuhi penutupan jalan. Tanya pemohon laluan selamat sebelum bertolak.'),
      b('Tie loads down and keep within your vehicle\'s limit.', 'Ikat muatan dan jangan melebihi had kenderaan anda.'),
    ],
    activity: {
      prompt: b('Tap what to do before driving off.', 'Tekan apa yang perlu dibuat sebelum bertolak.'),
      items: [
        { text: b('Ask for the safe route', 'Tanya laluan selamat'), correct: true },
        { text: b('Tie down the load', 'Ikat muatan'), correct: true },
        { text: b('Take a shortcut through water', 'Ambil jalan pintas merentas air'), correct: false },
      ],
    },
    questions: [
      q(b('Water covers the road and you cannot see the surface. You…', 'Air menutup jalan dan permukaan tidak kelihatan. Anda…'), [b('Drive through in low gear', 'Memandu dengan gear rendah'), b('Stop and find another route', 'Berhenti dan cari laluan lain'), b('Follow the car in front', 'Ikut kereta di hadapan')], 1),
      q(b('A road is closed by the authorities. You…', 'Jalan ditutup oleh pihak berkuasa. Anda…'), [b('Go around the barrier', 'Melepasi penghadang'), b('Respect it and ask for the safe route', 'Patuhi dan tanya laluan selamat'), b('Wait for it to open', 'Tunggu ia dibuka')], 1),
      q(b('How do you carry supplies?', 'Bagaimana membawa bekalan?'), [b('Stacked loose', 'Disusun tanpa diikat'), b('Tied down, within the load limit', 'Diikat, dalam had muatan'), b('As much as fits', 'Sebanyak yang muat')], 1),
    ],
  },
  {
    id: 'boat', minutes: 2, icon: 'boat',
    title: b('Boat safety', 'Keselamatan bot'),
    requiredFor: b('Boat posts', 'Tugasan bot'),
    cards: [
      b('Everyone on board wears a life jacket, every trip.', 'Semua orang di atas bot memakai jaket keselamatan, setiap perjalanan.'),
      b('Count seats, not space. Never go over the boat\'s load limit.', 'Kira tempat duduk, bukan ruang. Jangan melebihi had muatan bot.'),
      b('Stay out of fast currents and away from submerged fences and cables.', 'Elakkan arus deras serta pagar dan kabel yang tenggelam.'),
    ],
    activity: {
      prompt: b('Tap who needs a life jacket.', 'Tekan siapa yang perlu memakai jaket keselamatan.'),
      items: [
        { text: b('The operator', 'Pengendali bot'), correct: true },
        { text: b('Every passenger', 'Setiap penumpang'), correct: true },
        { text: b('Only people who cannot swim', 'Hanya yang tidak pandai berenang'), correct: false },
      ],
    },
    questions: [
      q(b('Who wears a life jacket?', 'Siapa memakai jaket keselamatan?'), [b('Only children', 'Kanak-kanak sahaja'), b('Everyone on board', 'Semua orang di atas bot'), b('Only weak swimmers', 'Yang kurang pandai berenang')], 1),
      q(b('Your boat seats 6. Eight people are waiting. You…', 'Bot anda muat 6 orang. Lapan orang menunggu. Anda…'), [b('Take all eight', 'Bawa kesemua lapan'), b('Take six and come back', 'Bawa enam dan kembali semula'), b('Let them decide', 'Biar mereka putuskan')], 1),
      q(b('The current is fast. You…', 'Arus deras. Anda…'), [b('Cross quickly', 'Menyeberang dengan cepat'), b('Stay out and report it', 'Elakkan dan laporkan'), b('Go with more people for weight', 'Bawa lebih ramai untuk berat')], 1),
    ],
  },
  {
    id: 'pfa', minutes: 2, icon: 'megaphone',
    title: b('Psychological first aid', 'Pertolongan cemas psikologi'),
    requiredFor: b('Relief centre and home visit posts', 'Tugasan pusat pemindahan dan lawatan rumah'),
    cards: [
      b('Listen more than you speak. Let people tell you what they need.', 'Lebih banyak mendengar daripada bercakap. Biar mereka nyatakan keperluan.'),
      b('Stay calm and kind. Do not promise things you cannot deliver.', 'Kekal tenang dan baik hati. Jangan berjanji perkara yang tidak dapat ditunaikan.'),
      b('If someone is in deep distress, refer them to the site lead. You are not alone.', 'Jika seseorang sangat tertekan, rujuk kepada ketua tapak. Anda tidak bersendirian.'),
    ],
    activity: {
      prompt: b('Tap the helpful things to say.', 'Tekan kata-kata yang membantu.'),
      items: [
        { text: b('"I am here. Take your time."', '"Saya di sini. Ambil masa anda."'), correct: true },
        { text: b('"Everything will be fixed by tomorrow."', '"Semuanya akan selesai esok."'), correct: false },
        { text: b('"What do you need right now?"', '"Apa yang anda perlukan sekarang?"'), correct: true },
      ],
    },
    questions: [
      q(b('Someone starts crying while talking to you. You…', 'Seseorang menangis semasa bercakap dengan anda. Anda…'), [b('Change the subject', 'Tukar topik'), b('Stay calm and listen', 'Kekal tenang dan dengar'), b('Tell them to be strong', 'Suruh mereka tabah')], 1),
      q(b('A family asks when their house will be repaired. You…', 'Sebuah keluarga bertanya bila rumah mereka dibaiki. Anda…'), [b('Promise next week', 'Berjanji minggu depan'), b('Say honestly that you do not know and will ask', 'Berterus terang anda tidak pasti dan akan bertanya'), b('Ignore the question', 'Abaikan soalan')], 1),
      q(b('Someone seems in deep distress. You…', 'Seseorang kelihatan sangat tertekan. Anda…'), [b('Handle it alone', 'Uruskan sendiri'), b('Refer them to the site lead', 'Rujuk kepada ketua tapak'), b('Walk away', 'Beredar')], 1),
    ],
  },
  {
    id: 'children', minutes: 2, icon: 'shield',
    title: b('Working safely around children', 'Bekerja dengan selamat di sekeliling kanak-kanak'),
    requiredFor: b('Child-safe posts', 'Tugasan selamat kanak-kanak'),
    cards: [
      b('Never be alone with a child. Always work in sight of a teacher or another adult.', 'Jangan bersendirian dengan kanak-kanak. Sentiasa berada dalam pandangan guru atau orang dewasa lain.'),
      b('No photos or videos of pupils. Not for social media, not for memories.', 'Tiada gambar atau video murid. Bukan untuk media sosial, bukan untuk kenangan.'),
      b('If something worries you, tell the poster or coordinator the same day.', 'Jika ada perkara membimbangkan, beritahu pemohon atau penyelaras pada hari yang sama.'),
    ],
    activity: {
      prompt: b('Tap what is allowed.', 'Tekan apa yang dibenarkan.'),
      items: [
        { text: b('Reading with a group while a teacher is present', 'Membaca bersama kumpulan dengan kehadiran guru'), correct: true },
        { text: b('Taking a selfie with pupils', 'Berswafoto dengan murid'), correct: false },
        { text: b('Walking one pupil home alone', 'Menghantar seorang murid pulang bersendirian'), correct: false },
      ],
    },
    questions: [
      q(b('A pupil asks you to help in an empty classroom. You…', 'Seorang murid minta bantuan di bilik darjah kosong. Anda…'), [b('Go alone', 'Pergi seorang diri'), b('Bring a teacher or another adult', 'Bawa guru atau orang dewasa lain'), b('Close the door for quiet', 'Tutup pintu supaya senyap')], 1),
      q(b('May you photograph pupils?', 'Bolehkah anda mengambil gambar murid?'), [b('Yes, if they smile', 'Ya, jika mereka senyum'), b('No, never', 'Tidak, sama sekali'), b('Only for social media', 'Hanya untuk media sosial')], 1),
      q(b('You notice something that worries you. You…', 'Anda perasan sesuatu yang membimbangkan. Anda…'), [b('Keep it to yourself', 'Simpan sendiri'), b('Report it the same day', 'Laporkan pada hari yang sama'), b('Post about it online', 'Siarkan di internet')], 1),
    ],
  },
];

export const getModule = (id) => MODULES.find((m) => m.id === id);

const user = (id, name, area, extra = {}) => ({
  id, name, area, availability: 'weekends',
  roles: { volunteer: true, poster: 'none', admin: false },
  skills: [], assets: [], assetNotes: '', badges: {}, training: {}, override: null, profileSaved: false, ...extra,
});
const post = (id, site, poster, title, desc, o) => ({
  id, site, poster, title, desc, baseFilled: 0, skills: [], assets: [], optSkills: [], optAssets: [], badge: null,
  training: ['basics'], risk: 'low', hours: 3, mode: 'disaster', source: 'form', kind: null, status: 'live', reason: '', ...o,
});
const done = (id, postId, volunteer, dayOffset, from, to) => ({
  id, post: postId, volunteer, status: 'done', requestedAt: at(dayOffset, from - 1), checkIn: at(dayOffset, from), checkOut: at(dayOffset, to), due: at(dayOffset, to),
});

export function seed() {
  const trained = at(-40, 10); // sample: modules finished during preparedness mode in October
  return {
    version: 3,
    seq: 100,
    now: at(0, 7.5),
    mode: 'disaster',
    currentUser: 'u-aina',
    prefs: { lang: 'en', large: false, contrast: false, simple: false },
    users: [
      user('u-aina', 'Aina', 'Hulu Langat', { training: { basics: trained, driving: trained, hygiene: trained, boat: at(-400, 10) } }),
      user('u-faiz', 'Faiz', 'Shah Alam', { availability: 'anytime', training: { basics: trained, electricity: trained } }),
      user('u-rahimah', 'Cikgu Rahimah', 'Hulu Langat', { roles: { volunteer: true, poster: 'approved', admin: false }, skills: ['teaching'], training: { basics: trained }, profileSaved: true }),
      user('u-admin', 'Puan Salmah', 'Shah Alam', { roles: { volunteer: true, poster: 'approved', admin: true }, org: 'Harapan Relief', profileSaved: true }),
      user('u-daud', 'Encik Daud', 'Hulu Langat', { roles: { volunteer: true, poster: 'pending', admin: false }, skills: ['firstAid'], profileSaved: true }),
      user('u-zul', 'Encik Zulkifli', 'Shah Alam', { roles: { volunteer: true, poster: 'approved', admin: false }, profileSaved: true }),
      user('u-noraini', 'Puan Noraini', 'Hulu Langat', { roles: { volunteer: true, poster: 'approved', admin: false }, skills: ['cooking'], profileSaved: true }),
      user('u-meiling', 'Mei Ling', 'Kajang', { skills: ['cleanup'], training: { basics: trained, cleanup: trained, hygiene: trained }, profileSaved: true }),
      user('u-kumar', 'Kumar', 'Kajang', { skills: ['cleanup', 'driving'], assets: ['lorry'], training: { basics: trained, cleanup: trained, hygiene: trained, driving: trained }, profileSaved: true }),
      user('u-siti', 'Siti', 'Hulu Langat', { skills: ['cooking'], training: { basics: trained, hygiene: trained, pfa: trained }, profileSaved: true }),
      user('u-hafiz', 'Hafiz', 'Klang', { skills: ['medic', 'firstAid'], badges: { medic: { status: 'pending', file: 'sample-practising-certificate.pdf', claimedAt: at(-1, 15) } }, training: { basics: trained }, profileSaved: true }),
    ],
    posterApps: [
      { id: 'app-1', user: 'u-daud', site: 'Klinik Desa Batu 14', siteType: 'clinic', area: 'Hulu Langat', role: 'Clinic assistant', proofFile: 'sample-staff-letter.pdf', status: 'pending', reason: '', at: at(-1, 16) },
    ],
    sites: [
      { id: 's-kbl', name: 'SK Kampung Batu Lima', type: 'school', area: 'Hulu Langat', overlooked: true, poster: 'u-rahimah', pupils: 180, evacCentre: true, attention: 1 },
      { id: 's-tsb', name: 'SK Taman Seri Bayu', type: 'school', area: 'Shah Alam', overlooked: false, poster: 'u-zul', pupils: 950, evacCentre: false, attention: 14 },
      { id: 's-dewan', name: 'Dewan Kampung Sungai Lui', type: 'shelter', area: 'Hulu Langat', overlooked: false, poster: 'u-noraini', attention: 3 },
      { id: 's-klinik', name: 'Klinik Desa Batu 14', type: 'clinic', area: 'Hulu Langat', overlooked: false, poster: 'u-admin', attention: 2 },
      { id: 's-rumah', name: 'Rumah Pak Hamid, Kampung Sungai Lui', type: 'home', area: 'Hulu Langat', overlooked: true, poster: 'u-noraini', attention: 1 },
    ],
    posts: [
      post('p-tsb-clean', 's-tsb', 'u-zul', b('Classroom mud cleanup', 'Bersihkan lumpur bilik darjah'), b('Wash classrooms and corridors on the ground floor.', 'Cuci bilik darjah dan koridor di tingkat bawah.'),
        { qty: 30, baseFilled: 30, skills: ['cleanup'], training: ['basics', 'cleanup', 'hygiene'], risk: 'medium', start: at(0, 9), hours: 4, kind: 'cleanup' }),
      post('p-tsb-read', 's-tsb', 'u-zul', b('Read with pupils at the temporary reading corner', 'Membaca bersama murid di sudut bacaan sementara'), b('Read with small groups while classrooms are cleaned. A teacher is always present.', 'Membaca bersama kumpulan kecil semasa bilik darjah dibersihkan. Guru sentiasa hadir.'),
        { qty: 4, baseFilled: 1, skills: ['teaching'], badge: 'childSafe', training: ['basics', 'children'], start: at(0, 10), hours: 2 }),
      post('p-dewan-kitchen', 's-dewan', 'u-noraini', b('Kitchen helpers for evacuee meals', 'Pembantu dapur untuk makanan mangsa'), b('Prepare and serve meals for 120 evacuees.', 'Sediakan dan hidangkan makanan untuk 120 mangsa.'),
        { qty: 8, baseFilled: 5, skills: ['cooking'], training: ['basics', 'hygiene', 'pfa'], start: at(0, 7), hours: 5 }),
      post('p-dewan-boat', 's-dewan', 'u-noraini', b('Boat with operator to ferry supplies', 'Bot dengan pengendali untuk menghantar bekalan'), b('Ferry food and water to three houses cut off by water.', 'Hantar makanan dan air ke tiga rumah yang terputus hubungan.'),
        { qty: 2, assets: ['boat'], training: ['basics', 'boat', 'pfa'], risk: 'high', start: at(0, 9), hours: 3, kind: 'delivery' }),
      post('p-klinik-clean', 's-klinik', 'u-admin', b('Disinfection crew', 'Pasukan nyahkuman'), b('Wash and disinfect the waiting room and treatment rooms.', 'Cuci dan nyahkuman ruang menunggu dan bilik rawatan.'),
        { qty: 6, baseFilled: 2, skills: ['cleanup'], training: ['basics', 'cleanup', 'hygiene'], risk: 'medium', start: at(0, 14), hours: 3, kind: 'cleanup' }),
      post('p-klinik-gen', 's-klinik', 'u-admin', b('Run a generator for the vaccine fridge', 'Kendalikan penjana kuasa untuk peti sejuk vaksin'), b('Bring and operate a generator until mains power returns.', 'Bawa dan kendalikan penjana kuasa sehingga bekalan elektrik pulih.'),
        { qty: 1, assets: ['generator'], training: ['basics', 'electricity'], risk: 'medium', start: at(0, 10), hours: 6 }),
      post('p-klinik-medic', 's-klinik', 'u-admin', b('First-aid station', 'Stesen pertolongan cemas'), b('Treat small wounds and check on volunteers.', 'Rawat luka kecil dan pantau sukarelawan.'),
        { qty: 2, skills: ['medic'], badge: 'medic', risk: 'high', start: at(0, 9), hours: 4 }),
      post('p-rumah-furniture', 's-rumah', 'u-noraini', b('Carry out ruined furniture', 'Keluarkan perabot rosak'), b('Help an elderly resident clear ruined furniture from his home.', 'Bantu seorang warga emas mengeluarkan perabot rosak dari rumahnya.'),
        { qty: 4, baseFilled: 1, skills: ['cleanup'], optAssets: ['lorry'], training: ['basics', 'cleanup', 'hygiene', 'pfa'], start: at(0, 15), hours: 2, kind: 'cleanup' }),
      // Closed earlier work, kept so recorded hours have somewhere to live.
      post('p-past-sandbag', 's-dewan', 'u-noraini', b('Sandbag wall at the hall', 'Benteng beg pasir di dewan'), b('Earlier flood preparation.', 'Persediaan banjir terdahulu.'),
        { qty: 10, baseFilled: 8, skills: ['cleanup'], training: ['basics'], start: at(-5, 8), hours: 7.5, status: 'closed' }),
      // Preparedness mode: small tasks between disasters.
      post('p-prep-drains', 's-kbl', 'u-rahimah', b('Clear school drains before monsoon', 'Bersihkan longkang sekolah sebelum monsun'), b('Remove leaves and rubbish from drains around the school.', 'Buang daun dan sampah dari longkang sekitar sekolah.'),
        { qty: 6, baseFilled: 2, skills: ['cleanup'], training: ['basics'], start: at(0, 9), hours: 2, mode: 'prepare', kind: 'cleanup' }),
      post('p-prep-gen', 's-klinik', 'u-admin', b('Check clinic generators', 'Periksa penjana kuasa klinik'), b('Start and test standby generators.', 'Hidupkan dan uji penjana kuasa simpanan.'),
        { qty: 2, assets: ['generator'], training: ['basics', 'electricity'], start: at(0, 10), hours: 2, mode: 'prepare' }),
      post('p-prep-books', 's-kbl', 'u-rahimah', b('Move school library books upstairs', 'Pindahkan buku perpustakaan ke tingkat atas'), b('Carry boxes of books to the first floor.', 'Angkat kotak buku ke tingkat satu.'),
        { qty: 8, baseFilled: 3, skills: ['cleanup'], training: ['basics'], start: at(0, 14), hours: 2, mode: 'prepare' }),
      post('p-prep-drill', 's-dewan', 'u-noraini', b('Help run a flood drill', 'Bantu menjalankan latihan banjir'), b('Guide residents through the evacuation route.', 'Bimbing penduduk melalui laluan pemindahan.'),
        { qty: 5, baseFilled: 1, skills: ['driving'], optSkills: ['firstAid'], training: ['basics', 'driving', 'pfa'], start: at(0, 16), hours: 2, mode: 'prepare' }),
    ],
    shifts: [
      // Mei Ling: five days in a row, 37.5 hours this week → needs a rest day.
      ...[-5, -4, -3, -2, -1].map((d, i) => done(`sh-ml${i}`, 'p-past-sandbag', 'u-meiling', d, 8, 15.5)),
      // Kumar: 5 hours overnight plus an accepted 3-hour shift → at today's cap.
      done('sh-k1', 'p-past-sandbag', 'u-kumar', 0, 0.5, 5.5),
      { id: 'sh-k2', post: 'p-klinik-clean', volunteer: 'u-kumar', status: 'accepted', requestedAt: at(-1, 18), acceptedAt: at(-1, 19), checkIn: null, checkOut: null, due: null },
      // Siti: on site in the relief-centre kitchen since 7 am.
      { id: 'sh-s1', post: 'p-dewan-kitchen', volunteer: 'u-siti', status: 'onsite', requestedAt: at(-1, 18), acceptedAt: at(-1, 19), checkIn: at(0, 7), checkOut: null, due: at(0, 12) },
    ],
    alerts: [],
    recovery: {
      's-kbl': { evacuees: true, evacueesBy: 'u-rahimah', evacueesAt: at(-1, 17) },
      's-tsb': { evacuees: true, rooms: { classrooms: { severity: 'moderate' } }, assessedAt: at(-2, 10) },
    },
  };
}
