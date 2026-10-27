/**
 * PT TRIMIZ SINERGY MANDALA (TSM) - JAVASCRIPT LOGIC
 * Features:
 * 1. Mobile menu toggle & active navigation state
 * 2. Sticky navbar dynamic blur & shadows
 * 3. Interactive Concrete Volume & Mixer Truck Estimator
 * 4. WhatsApp lead generation generator
 * 5. Fleet tab filtering
 * 6. FAQ accordion
 * 7. Back-to-top handler
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Nav Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isExpanded = navMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  // Header scroll state
  const header = document.querySelector('.header-nav');
  const backToTopBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (header) {
      if (scrollPos > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    if (backToTopBtn) {
      if (scrollPos > 400) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }

    highlightActiveNavLink();
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // Active Nav Link on Scroll
  function highlightActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="#${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }

  // ================= CONCRETE VOLUME CALCULATOR =================
  const lengthInput = document.getElementById('calcLength');
  const widthInput = document.getElementById('calcWidth');
  const thickInput = document.getElementById('calcThick');
  const countInput = document.getElementById('calcCount');
  const wasteSelect = document.getElementById('calcWaste');
  const calcTypeBtns = document.querySelectorAll('.calc-type-btn');

  const volDisplay = document.getElementById('calcVolumeValue');
  const totalVolDisplay = document.getElementById('calcTotalVolume');
  const standardTruckCount = document.getElementById('standardTruckCount');
  const minimixTruckCount = document.getElementById('minimixTruckCount');
  const sendCalcWhatsAppBtn = document.getElementById('sendCalcWhatsApp');

  let currentType = 'dak';

  calcTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      calcTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentType = btn.getAttribute('data-type');

      // Adjust default thickness depending on type
      if (currentType === 'dak') {
        thickInput.value = '12'; // 12 cm
        document.getElementById('labelThick').textContent = 'Ketebalan Dak';
      } else if (currentType === 'jalan') {
        thickInput.value = '15'; // 15 cm
        document.getElementById('labelThick').textContent = 'Ketebalan Cor Jalan';
      } else if (currentType === 'kolom') {
        thickInput.value = '25'; // lebar / tebal kolom
        document.getElementById('labelThick').textContent = 'Tinggi Kolom (Meter)';
      } else if (currentType === 'pondasi') {
        thickInput.value = '30';
        document.getElementById('labelThick').textContent = 'Kedalaman Pondasi';
      }
      calculateConcrete();
    });
  });

  function calculateConcrete() {
    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(widthInput.value) || 0;
    const thickVal = parseFloat(thickInput.value) || 0;
    const count = parseInt(countInput.value) || 1;
    const wastePercent = parseFloat(wasteSelect.value) || 0.05;

    let baseVolume = 0;

    if (currentType === 'dak' || currentType === 'jalan' || currentType === 'pondasi') {
      // thick is in cm -> convert to m
      const thickInMeters = thickVal / 100;
      baseVolume = length * width * thickInMeters * count;
    } else if (currentType === 'kolom') {
      // length (cm), width (cm), height (m)
      const lengthInMeters = length / 100;
      const widthInMeters = width / 100;
      baseVolume = lengthInMeters * widthInMeters * thickVal * count;
    }

    const totalWithWaste = baseVolume * (1 + wastePercent);
    const roundedTotal = Math.round(totalWithWaste * 100) / 100;

    // Display
    volDisplay.textContent = roundedTotal.toFixed(2);
    if (totalVolDisplay) {
      totalVolDisplay.textContent = baseVolume.toFixed(2) + ' m³ (Netto)';
    }

    // Mixer Truck calculation: Standard = 5 m3, Minimix = 3 m3
    const stdTrucks = Math.ceil(roundedTotal / 5) || 0;
    const miniTrucks = Math.ceil(roundedTotal / 3) || 0;

    standardTruckCount.textContent = stdTrucks + ' Rit';
    minimixTruckCount.textContent = miniTrucks + ' Rit';

    return {
      type: currentType,
      volume: roundedTotal,
      stdTrucks,
      miniTrucks
    };
  }

  // Event listeners for calculator inputs
  [lengthInput, widthInput, thickInput, countInput, wasteSelect].forEach(input => {
    if (input) {
      input.addEventListener('input', calculateConcrete);
      input.addEventListener('change', calculateConcrete);
    }
  });

  // Calculate initially
  calculateConcrete();

  // Send Calculator Result to WhatsApp
  if (sendCalcWhatsAppBtn) {
    sendCalcWhatsAppBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const calcData = calculateConcrete();
      const typeNames = {
        dak: 'Plat Dak / Lantai Beton',
        jalan: 'Cor Rigid Jalan / Akses',
        kolom: 'Kolom & Balok Struktur',
        pondasi: 'Pondasi / Sloof'
      };

      const message = `Halo PT Trimiz Sinergy Mandala (TSM), saya ingin konsultasi dan penawaran beton ready mix berdasarkan hitungan kalkulator web:%0A` +
        `• *Jenis Pekerjaan*: ${typeNames[calcData.type] || calcData.type}%0A` +
        `• *Estimasi Kebutuhan*: ${calcData.volume} m³%0A` +
        `• *Rekomendasi Truk Molen Standar (5m³)*: ± ${calcData.stdTrucks} Rit%0A` +
        `• *Atau Truk Minimix (3m³)*: ± ${calcData.miniTrucks} Rit%0A` +
        `Mohon info harga per m³ dan jadwal pengiriman ke lokasi kami di Garut. Terima kasih!`;

      window.open(`https://wa.me/6282116938147?text=${message}`, '_blank');
    });
  }

  // ================= FLEET TABS FILTER =================
  const fleetTabBtns = document.querySelectorAll('.fleet-tab-btn');
  const fleetCards = document.querySelectorAll('.fleet-card');

  fleetTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      fleetTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      fleetCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // ================= FAQ ACCORDION =================
  const faqHeaders = document.querySelectorAll('.faq-header');

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      // Close all others
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // ================= CONTACT / ORDER FORM TO WHATSAPP =================
  const contactForm = document.getElementById('orderForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('orderName').value.trim();
      const phone = document.getElementById('orderPhone').value.trim();
      const location = document.getElementById('orderLocation').value.trim();
      const grade = document.getElementById('orderGrade').value;
      const fleet = document.getElementById('orderFleet').value;
      const volume = document.getElementById('orderVolume').value.trim();
      const pump = document.getElementById('orderPump').value;
      const notes = document.getElementById('orderNotes').value.trim();

      const text = `*FORM PERMINTAAN PENAWARAN HARGA READY MIX*%0A` +
        `*PT TRIMIZ SINERGY MANDALA (TSM)*%0A%0A` +
        `• *Nama Pemesan*: ${name}%0A` +
        `• *No. Telepon / WA*: ${phone}%0A` +
        `• *Lokasi Pengecoran*: ${location}%0A` +
        `• *Mutu Beton*: ${grade}%0A` +
        `• *Pilihan Armada*: ${fleet}%0A` +
        `• *Perkiraan Volume*: ${volume} m³%0A` +
        `• *Kebutuhan Concrete Pump*: ${pump}%0A` +
        (notes ? `• *Catatan Tambahan*: ${notes}%0A%0A` : `%0A`) +
        `Mohon dikirimkan surat penawaran harga resmi dan konfirmasi survei lokasi. Terima kasih.`;

      window.open(`https://wa.me/6282116938147?text=${text}`, '_blank');
    });
  }
});
