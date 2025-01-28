// Inisialisasi array threats dengan data yang ada di localStorage (jika ada)
const threats = JSON.parse(localStorage.getItem('threats')) || [];

// Data Ancaman berdasarkan STRIDE
const threatNames = {
  Spoofing: "Phishing Email",
  Tampering: "SQL Injection",
  Repudiation: "Log Tampering",
  "Information Disclosure": "Sensitive Data Leak",
  "Denial of Service": "Distributed Denial of Service (DDoS) Attack",
  "Elevation of Privilege": "Privilege Escalation"
};

// Rekomendasi Mitigasi
const recommendations = {
  Spoofing: "Gunakan autentikasi dua faktor.",
  Tampering: "Implementasikan checksum dan tanda tangan digital.",
  Repudiation: "Gunakan audit log yang terenkripsi.",
  "Information Disclosure": "Enkripsi data sensitif.",
  "Denial of Service": "Gunakan firewall dan pembatasan akses.",
  "Elevation of Privilege": "Gunakan hak akses minimal pada pengguna."
};

// Warna berdasarkan kategori STRIDE
const strideColors = {
  Spoofing: 'rgba(255, 99, 132, 0.6)',      // Merah muda untuk Spoofing
  Tampering: 'rgba(54, 162, 235, 0.6)',      // Biru untuk Tampering
  Repudiation: 'rgba(255, 159, 64, 0.6)',    // Oranye untuk Repudiation
  "Information Disclosure": 'rgba(75, 192, 192, 0.6)', // Hijau untuk Information Disclosure
  "Denial of Service": 'rgba(153, 102, 255, 0.6)',  // Ungu untuk DoS
  "Elevation of Privilege": 'rgba(255, 159, 223, 0.6)' // Pink untuk Elevation of Privilege
};

// Set default nama ancaman saat halaman pertama kali dimuat
window.addEventListener('load', () => {
  const defaultType = document.getElementById('stride-type').value;
  document.getElementById('threat-name').value = threatNames[defaultType];
  updateChart();  // Menampilkan grafik dengan data ancaman yang sudah ada
});

// Form Submission Handler
document.getElementById('threat-form').addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('threat-name').value;
  const type = document.getElementById('stride-type').value;
  const dreadScore = parseInt(document.getElementById('dread-score').value);
  
  // Tambahkan ancaman ke array
  threats.push({ name, type, dreadScore });
  
  // Simpan data ancaman ke localStorage
  localStorage.setItem('threats', JSON.stringify(threats));
  
  // Update Dashboard & Recommendation
  updateChart();  // Update grafik berdasarkan data ancaman yang ditambahkan
  updateRecommendation(type);
  
  // Reset Form
  e.target.reset();
  document.getElementById('threat-name').value = '';  // Reset nama ancaman
});

// Visualization Dashboard
const ctx = document.getElementById('threatChart').getContext('2d');
const threatChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: [],
    datasets: [{
      label: 'DREAD Score',
      data: [],
      backgroundColor: [],
      borderColor: 'rgba(0, 0, 0, 1)', // Border tetap hitam
      borderWidth: 1
    }]
  },
  options: {
    responsive: true,
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Update Chart
function updateChart() {
  // Menambahkan ancaman dan warnanya ke dalam chart
  threatChart.data.labels = threats.map(t => t.name);
  threatChart.data.datasets[0].data = threats.map(t => t.dreadScore);
  threatChart.data.datasets[0].backgroundColor = threats.map(t => strideColors[t.type]); // Update warna sesuai kategori STRIDE
  threatChart.update();
}

// Update Recommendation
function updateRecommendation(type) {
  document.getElementById('recommendation').innerText = `Rekomendasi: ${recommendations[type]}`;
}

// Update Nama Ancaman Berdasarkan STRIDE
document.getElementById('stride-type').addEventListener('change', (e) => {
  const selectedType = e.target.value;
  document.getElementById('threat-name').value = threatNames[selectedType];
  updateChart(); // Update grafik saat kategori STRIDE diubah
});
