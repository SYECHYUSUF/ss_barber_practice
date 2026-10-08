/* =========================================================
   SS BARBERSHOP — barber.js
   Semua logika bisnis dipertahankan + fitur UI baru
   ========================================================= */

// ===== DATA =====
const BUKA_JAM  = 9;
const TUTUP_JAM = 21;

const daftarLayanan = [
  { id: "P01", nama: "Potong Rambut Dewasa",    harga: 40000, durasi: "40 Menit", detail: "Konsultasi model, pemotongan presisi clipper & gunting, finishing pomade premium.",        kategori: "potong" },
  { id: "P02", nama: "Cukur Lengkap SS (Favorit)", harga: 50000, durasi: "60 Menit", detail: "Potong rambut, keramas air hangat, tonic, pijat kepala leher pundak, dan vacuum pembersih.", kategori: "potong" },
  { id: "P03", nama: "Beard Trim & Clean Shave",harga: 25000, durasi: "30 Menit", detail: "Perapian kumis & jenggot, pisau steril baru, handuk hangat, dan aftershave soothing oil.", kategori: "grooming" },
  { id: "P04", nama: "Hair Tattoo & Custom Line",harga: 35000, durasi: "25 Menit", detail: "Ukiran garis artistik samping kepala, tribal retro, atau aksen garis minimalis.",         kategori: "grooming" },
  { id: "P05", nama: "Creambath Relaksasi",      harga: 45000, durasi: "45 Menit", detail: "Pembersihan mendalam ketombe, pijat relaksasi 20 menit, dan handuk aromaterapi.",         kategori: "grooming" },
  { id: "P06", nama: "Potong Rambut Anak (Junior Rider)", harga: 35000, durasi: "35 Menit", detail: "Pemotongan sabar & ramah anak, mainan miniatur Vespa, dan bedak wangi.",  kategori: "junior"  }
];

const daftarBarber = [
  "Reza Mahardika (Master Barber & Founder)",
  "Iqra Fadillah (Fade & Taper Specialist)",
  "Haikal Pratama (Modern Crop & Hair Tattoo)"
];

const EKSTRA = {
  "chk-pomade" : 10000,
  "chk-handuk" : 5000,
  "chk-kopi"   : 15000
};

const labelKategori = {
  "potong"  : "Hair Styling",
  "grooming": "Grooming & Art",
  "junior"  : "Junior"
};

// ===== INISIALISASI DROPDOWN LAYANAN =====
function inisialisasiDropdownLayanan() {
  const sel = document.getElementById("select-layanan");
  if (!sel) return;
  sel.innerHTML = "";
  for (let i = 0; i < daftarLayanan.length; i++) {
    const opt = document.createElement("option");
    opt.value = daftarLayanan[i].id;
    opt.text  = daftarLayanan[i].nama + " – Rp " + daftarLayanan[i].harga.toLocaleString("id-ID");
    sel.appendChild(opt);
  }
}

// ===== RENDER PRICING CARDS =====
function renderPricingCards(filterKat) {
  const grid = document.getElementById("pricingGrid");
  if (!grid) return;
  grid.innerHTML = "";

  for (let i = 0; i < daftarLayanan.length; i++) {
    const l = daftarLayanan[i];
    const show = (filterKat === "all" || l.kategori === filterKat);
    const card = document.createElement("div");
    card.className = "price-card" + (show ? "" : " hidden");
    card.innerHTML =
      '<span class="price-cat-badge">' + labelKategori[l.kategori] + '</span>' +
      '<h3 class="price-name">' + l.nama + '</h3>' +
      '<p class="price-detail">' + l.detail + '</p>' +
      '<div class="price-footer">' +
        '<span class="price-duration">' + l.durasi + '</span>' +
        '<span class="price-amount">Rp ' + l.harga.toLocaleString("id-ID") + '</span>' +
      '</div>';
    grid.appendChild(card);
  }
}

// ===== CATEGORY TABS =====
function initCategoryTabs() {
  const tabs = document.querySelectorAll(".cat-tab");
  tabs.forEach(function(tab) {
    tab.addEventListener("click", function() {
      tabs.forEach(function(t) { t.classList.remove("active"); });
      tab.classList.add("active");
      renderPricingCards(tab.getAttribute("data-cat"));
    });
  });
}

// ===== STATUS OPERASIONAL =====
function cekStatusOperasional() {
  const sekarang = new Date();
  const jam   = sekarang.getHours();
  const menit = sekarang.getMinutes();
  const badge  = document.getElementById("badge-operasional");
  const ketJam = document.getElementById("keterangan-jam");
  if (!badge) return;

  const menitStr = menit < 10 ? "0" + menit : menit;

  if (jam >= BUKA_JAM && jam < TUTUP_JAM) {
    badge.textContent = "BUKA HARI INI";
    badge.className   = "op-badge";
    badge.style.background = "#27ae60";
    if (ketJam) ketJam.textContent = "(09.00 – 21.00 WITA | Sekarang pk " + jam + ":" + menitStr + ")";
  } else {
    badge.textContent = "SEDANG TUTUP";
    badge.className   = "op-badge closed";
    badge.style.background = "#c0392b";
    if (ketJam) ketJam.textContent = "(Buka kembali pk 09.00 WITA)";
  }
}

// ===== HITUNG TOTAL BIAYA =====
function hitungTotalBiaya(hargaDasar, jumlahOrang, biayaEkstra) {
  return (hargaDasar * jumlahOrang) + biayaEkstra;
}

function perbaruiKalkulasiTotal() {
  const sel    = document.getElementById("select-layanan");
  const jml    = document.getElementById("jumlah_orang");
  const label  = document.getElementById("label-estimasi-total");
  if (!sel || !jml || !label) return;

  const kode = sel.value;
  let harga  = 40000;
  for (let i = 0; i < daftarLayanan.length; i++) {
    if (daftarLayanan[i].id === kode) { harga = daftarLayanan[i].harga; break; }
  }

  let jumlah = parseInt(jml.value) || 1;
  if (jumlah < 1) jumlah = 1;

  let ekstra = 0;
  Object.keys(EKSTRA).forEach(function(id) {
    const el = document.getElementById(id);
    if (el && el.checked) ekstra += EKSTRA[id];
  });

  const total = hitungTotalBiaya(harga, jumlah, ekstra);
  label.textContent = "Rp " + total.toLocaleString("id-ID");
}

// ===== KODE PROMO ACAK =====
function buatKodePromoAcak() {
  const angka    = Math.floor(Math.random() * 9000) + 1000;
  const kode     = "SS90MKS-" + angka;
  const el       = document.getElementById("kode-promo-text");
  if (!el) return;
  el.textContent = "KODE: " + kode + " (Diskon 10%)";
  el.style.color = "#2ecc71";
}

// ===== REKOMENDASI BARBER =====
function acakBarberRekomendasi() {
  const idx  = Math.floor(Math.random() * daftarBarber.length);
  const div  = document.getElementById("hasil-rekomendasi");
  if (!div) return;
  div.textContent = "Rekomendasi Hari Ini: " + daftarBarber[idx];
}

// ===== SCROLL KE RESERVASI =====
function pesanSekarang() {
  const el = document.getElementById("reservasi");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

// ===== VALIDASI FORM =====
function validasiFormReservasi(event) {
  if (event) event.preventDefault();

  const nama  = document.getElementById("nama_lengkap").value;
  const email = document.getElementById("email_pemesan").value;
  const hp    = document.getElementById("no_hp").value;
  const tgl   = document.getElementById("tanggal_booking").value;

  if (!nama.trim() || !email.trim() || !hp.trim() || !tgl.trim()) {
    alert("Mohon lengkapi semua kolom yang wajib diisi (*).");
    return false;
  }
  if (nama.trim().length < 3) {
    alert("Nama lengkap minimal 3 karakter.");
    return false;
  }

  const sel         = document.getElementById("select-layanan");
  const layananNama = sel.options[sel.selectedIndex].text;
  const total       = document.getElementById("label-estimasi-total").textContent;

  alert(
    "RESERVASI BERHASIL!\n\n" +
    "Nama     : " + nama + "\n" +
    "WhatsApp : " + hp   + "\n" +
    "Layanan  : " + layananNama + "\n" +
    "Tanggal  : " + tgl  + "\n" +
    "Estimasi : " + total + "\n\n" +
    "Terima kasih! Kami akan menghubungi Anda segera."
  );
  return true;
}

// ===== SWITCH KATEGORI (helper, dipertahankan) =====
function tentukanKategori(kode) {
  switch (kode) {
    case "P01": case "P02": return "Potong Rambut";
    case "P03": case "P05": return "Grooming & Shaving";
    case "P04":              return "Art & Design";
    case "P06":              return "Junior Kids";
    default:                 return "Layanan Umum";
  }
}

// ===== NAVBAR SCROLL =====
function initNavbar() {
  const header = document.getElementById("main-header");
  if (!header) return;
  function onScroll() {
    if (window.scrollY > 60) header.classList.add("scrolled");
    else                     header.classList.remove("scrolled");
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// ===== HAMBURGER MENU =====
function initHamburger() {
  const btn     = document.getElementById("hamburger");
  const overlay = document.getElementById("mobileOverlay");
  if (!btn || !overlay) return;

  function toggle(open) {
    btn.classList.toggle("active", open);
    overlay.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  btn.addEventListener("click", function() {
    toggle(!overlay.classList.contains("open"));
  });

  document.querySelectorAll(".mob-link").forEach(function(link) {
    link.addEventListener("click", function() { toggle(false); });
  });
}

// ===== HERO BG =====
function initHeroBg() {
  const bg = document.getElementById("heroBg");
  if (!bg) return;
  requestAnimationFrame(function() {
    setTimeout(function() { bg.classList.add("loaded"); }, 80);
  });
  window.addEventListener("scroll", function() {
    bg.style.transform = "translateY(" + (window.scrollY * 0.22) + "px) scale(1)";
  }, { passive: true });
}

// ===== SCROLL REVEAL =====
function initScrollReveal() {
  const els = document.querySelectorAll(".reveal");
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  els.forEach(function(el) { obs.observe(el); });
}

// ===== HERO REVEAL (on load) =====
function heroReveal() {
  document.querySelectorAll(".hero .reveal").forEach(function(el, i) {
    setTimeout(function() { el.classList.add("visible"); }, 150 + i * 130);
  });
}

// ===== ACTIVE NAV LINK =====
function initActiveNav() {
  const sections = document.querySelectorAll("section[id], footer[id]");
  const links    = document.querySelectorAll("#nav-menu a");
  const obs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        links.forEach(function(a) {
          const isActive = a.getAttribute("href") === "#" + id;
          a.style.color = isActive ? "var(--gold-light)" : "";
        });
      }
    });
  }, { threshold: 0.3 });
  sections.forEach(function(s) { obs.observe(s); });
}

// ===== EVENT LISTENERS =====
function initFormListeners() {
  const fields = ["select-layanan", "jumlah_orang", "chk-pomade", "chk-handuk", "chk-kopi"];
  fields.forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener(id === "select-layanan" ? "change" : (el.type === "number" ? "input" : "change"), perbaruiKalkulasiTotal);
  });

  const btnRek = document.getElementById("btn-rekomendasi");
  if (btnRek) btnRek.addEventListener("click", acakBarberRekomendasi);
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", function() {
  initNavbar();
  initHamburger();
  initHeroBg();
  initScrollReveal();
  initActiveNav();
  inisialisasiDropdownLayanan();
  renderPricingCards("all");
  initCategoryTabs();
  cekStatusOperasional();
  initFormListeners();
  perbaruiKalkulasiTotal();
});

window.addEventListener("load", heroReveal);
