var app = new Vue({
  el: '#app',
  data: {
    pengirimanList: [
      { kode: "REG", nama: "JNE Regular" },
      { kode: "EXP", nama: "JNE Express" }
    ],
    paket: [
      { kode: "PAKET-UT-001", nama: "PAKET IPS Dasar", isi: ["EKMA4116", "EKMA4115"], harga: 120000 },
      { kode: "PAKET-UT-002", nama: "PAKET IPA Dasar", isi: ["BIOL4201", "FISIP4001"], harga: 140000 }
    ],
    tracking: {
      "DO2025-0001": {
        nim: "123456789",
        nama: "Rina Wulandari",
        status: "Dalam Perjalanan",
        ekspedisi: "JNE Regular",
        tanggalKirim: "2025-08-25",
        paket: "PAKET-UT-001",
        total: 120000,
        perjalanan: [
          { waktu: "2025-08-25 10:12:20", keterangan: "Penerimaan di Loket: TANGSEL" },
          { waktu: "2025-08-25 14:07:56", keterangan: "Tiba di Hub: JAKSEL" },
          { waktu: "2025-08-26 08:44:01", keterangan: "Diteruskan ke Kantor Tujuan" }
        ]
      }
    },

    // Counter untuk generasi nomor default selanjutnya
    sequenceCounter: 2,

    // Variabel Pencarian
    searchKey: '',
    searchResult: null,
    searchResultKey: '',
    searchPerformed: false,

    // Form Binding (Nilai awal noDO bisa langsung diubah / diketik oleh pengguna)
    formDO: {
      noDO: 'DO' + new Date().getFullYear() + '-0002',
      nim: '',
      nama: '',
      ekspedisi: '',
      kodePaket: '',
      tanggalKirim: new Date().toISOString().slice(0, 10)
    }
  },

  computed: {
    // Ambil detail paket yang dipilih pada dropdown
    selectedPaketDetail: function() {
      if (!this.formDO.kodePaket) return null;
      return this.paket.find(p => p.kode === this.formDO.kodePaket);
    }
  },

  methods: {
    // Fungsi Pencarian Nomor DO
    cariDO: function() {
      this.searchPerformed = true;
      let key = this.searchKey.trim();
      if (this.tracking[key]) {
        this.searchResult = this.tracking[key];
        this.searchResultKey = key;
      } else {
        this.searchResult = null;
        this.searchResultKey = '';
      }
    },

    // Fungsi Simpan / Tambah Delivery Order Baru
    tambahDO: function() {
      let noDOInput = this.formDO.noDO.trim();

      if (!noDOInput) {
        alert("Nomor DO tidak boleh kosong!");
        return;
      }

      if (!this.formDO.nim || !this.formDO.nama || !this.formDO.ekspedisi || !this.formDO.kodePaket) {
        alert("Mohon lengkapi seluruh data formulir!");
        return;
      }

      let detailPaket = this.selectedPaketDetail;

      let newDOObj = {
        nim: this.formDO.nim,
        nama: this.formDO.nama,
        status: "Diproses di Hub Central",
        ekspedisi: this.formDO.ekspedisi,
        tanggalKirim: this.formDO.tanggalKirim,
        paket: this.formDO.kodePaket,
        total: detailPaket ? detailPaket.harga : 0,
        perjalanan: [
          { 
            waktu: new Date().toLocaleString('sv').replace('T', ' '), 
            keterangan: "Pemesanan berhasil dibuat & diproses Gudang Pusat" 
          }
        ]
      };

      // PENTING: Gunakan Vue.set agar data baru yang ditambahkan bersifat reaktif di Vue 2
      Vue.set(this.tracking, noDOInput, newDOObj);

      alert('Delivery Order dengan nomor ' + noDOInput + ' berhasil disimpan!');

      // Siapkan nomor DO otomatis berikutnya
      this.sequenceCounter++;
      let tahun = new Date().getFullYear();
      let nextSeq = String(this.sequenceCounter).padStart(4, '0');

      // Reset Isian Form
      this.formDO.noDO = 'DO' + tahun + '-' + nextSeq;
      this.formDO.nim = '';
      this.formDO.nama = '';
      this.formDO.ekspedisi = '';
      this.formDO.kodePaket = '';
      this.formDO.tanggalKirim = new Date().toISOString().slice(0, 10);
    }
  }
});