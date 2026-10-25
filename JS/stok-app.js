var app = new Vue({
  el: '#app',
  data: {
    // Array Data Sesuai Template dataBahanAjar.js
    upbjjList: ["Jakarta", "Surabaya", "Makassar", "Padang", "Denpasar"],
    kategoriList: ["MK Wajib", "MK Pilihan", "Praktikum", "Problem-Based"],
    stok: [
      {
        kode: "EKMA4116",
        judul: "Pengantar Manajemen",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A3",
        harga: 65000,
        qty: 28,
        safety: 20,
        catatanHTML: "<em>Edisi 2024, cetak ulang</em>"
      },
      {
        kode: "EKMA4115",
        judul: "Pengantar Akuntansi",
        kategori: "MK Wajib",
        upbjj: "Jakarta",
        lokasiRak: "R1-A4",
        harga: 60000,
        qty: 7,
        safety: 15,
        catatanHTML: "<strong>Cover baru</strong>"
      },
      {
        kode: "BIOL4201",
        judul: "Biologi Umum (Praktikum)",
        kategori: "Praktikum",
        upbjj: "Surabaya",
        lokasiRak: "R3-B2",
        harga: 80000,
        qty: 12,
        safety: 10,
        catatanHTML: "Butuh <u>pendingin</u> untuk kit basah"
      },
      {
        kode: "FISIP4001",
        judul: "Dasar-Dasar Sosiologi",
        kategori: "MK Pilihan",
        upbjj: "Makassar",
        lokasiRak: "R2-C1",
        harga: 55000,
        qty: 2,
        safety: 8,
        catatanHTML: "Stok <i>menipis</i>, prioritaskan reorder"
      }
    ],

    // State untuk Filter & Sorting
    filterUpbjj: '',
    filterKategori: '',
    filterReorder: 'ALL',
    sortBy: 'judul',

    // State Formulir Tambah/Edit
    isEdit: false,
    errorMsg: '',
    formStok: {
      kode: '',
      judul: '',
      kategori: '',
      upbjj: '',
      lokasiRak: '',
      harga: 0,
      qty: 0,
      safety: 0,
      catatanHTML: ''
    }
  },

  // WATCHERS: Memantau perubahan data
  watch: {
    // Watcher 1: Mengosongkan filterKategori saat filterUpbjj di-reset (Dependent Option)
    filterUpbjj: function(newVal) {
      if (!newVal) {
        this.filterKategori = '';
      }
    },
    // Watcher 2: Memantau validasi input harga agar tidak negatif
    'formStok.harga': function(newVal) {
      if (newVal < 0) {
        this.errorMsg = 'Harga bahan ajar tidak boleh bernilai negatif!';
      } else {
        this.errorMsg = '';
      }
    }
  },

  // COMPUTED PROPERTIES: Mengolah data tanpa re-compute berulang kali
  computed: {
    filteredStok: function() {
      let result = this.stok.slice();

      // Filter UT-Daerah
      if (this.filterUpbjj) {
        result = result.filter(item => item.upbjj === this.filterUpbjj);
      }

      // Filter Kategori (Dependent Option)
      if (this.filterUpbjj && this.filterKategori) {
        result = result.filter(item => item.kategori === this.filterKategori);
      }

      // Filter Re-Order (Menampilkan qty < safety atau qty = 0)
      if (this.filterReorder === 'CRITICAL') {
        result = result.filter(item => item.qty < item.safety || item.qty === 0);
      }

      // Sorting berdasarkan judul, stock (qty), atau harga
      result.sort((a, b) => {
        if (this.sortBy === 'judul') {
          return a.judul.localeCompare(b.judul);
        } else if (this.sortBy === 'qty') {
          return a.qty - b.qty;
        } else if (this.sortBy === 'harga') {
          return a.harga - b.harga;
        }
      });

      return result;
    }
  },

  // METHODS: Fungsi penanganan interaksi pengguna
  methods: {
    // Reset Seluruh Filter
    resetFilter: function() {
      this.filterUpbjj = '';
      this.filterKategori = '';
      this.filterReorder = 'ALL';
      this.sortBy = 'judul';
    },

    // Fungsi Tambah / Simpan Data Stok
    simpanStok: function() {
      if (this.errorMsg) return;

      if (this.isEdit) {
        // Logika Update Data
        let index = this.stok.findIndex(s => s.kode === this.formStok.kode);
        if (index !== -1) {
          Vue.set(this.stok, index, Object.assign({}, this.formStok));
        }
        this.batalEdit();
        alert('Data bahan ajar berhasil diperbarui!');
      } else {
        // Validasi Kode Unik saat Tambah Data
        let ada = this.stok.some(s => s.kode.toUpperCase() === this.formStok.kode.toUpperCase());
        if (ada) {
          this.errorMsg = 'Kode Mata Kuliah sudah terdaftar!';
          return;
        }
        this.stok.push(Object.assign({}, this.formStok));
        this.resetForm();
        alert('Bahan ajar baru berhasil ditambahkan!');
      }
    },

    // Pemicu Mode Edit Data
    editStok: function(item) {
      this.isEdit = true;
      this.formStok = Object.assign({}, item);
    },

    // Batal Edit Data
    batalEdit: function() {
      this.isEdit = false;
      this.resetForm();
    },

    // Reset Isian Form
    resetForm: function() {
      this.errorMsg = '';
      this.formStok = {
        kode: '',
        judul: '',
        kategori: '',
        upbjj: '',
        lokasiRak: '',
        harga: 0,
        qty: 0,
        safety: 0,
        catatanHTML: ''
      };
    }
  }
});