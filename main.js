import {
    getLahan,
    saveLahan,
    deleteLahan,
    getTanaman,
    saveTanaman,
    deleteTanaman
} from "./data_service.js";

import {
    renderDashboard,
    renderLahan,
    renderTanaman,
    renderLahanOptions,
    showMessage
} from "./ui_renderer.js";

import {
    validateLahan,
    validateTanaman
} from "./form_validator.js";

// Ekspos ke objek window agar bisa diakses langsung via Developer Tools Console
window.getLahan = getLahan;
window.getTanaman = getTanaman;

// =====================================
// 1. INISIALISASI APLIKASI
// =====================================

document.addEventListener("DOMContentLoaded", () => {
    console.log("Aplikasi AgriManage berhasil dimuat.");

    // Menampilkan data awal ke Console saat halaman pertama kali dibuka
    console.log("=== Data Lahan Saat Ini ===");
    console.table(getLahan());

    console.log("=== Data Tanaman Saat Ini ===");
    console.table(getTanaman());

    renderAll();
    setupLahanForm();
    setupTanamanForm();
    setupTableActions();
});

// =====================================
// 2. MENAMPILKAN SEMUA DATA
// =====================================

function renderAll() {
    const lahan = getLahan();
    const tanaman = getTanaman();

    renderDashboard(lahan, tanaman);
    renderLahan(lahan);
    renderLahanOptions(lahan);
    renderTanaman(tanaman, lahan);
}

// =====================================
// 3. FORM DATA LAHAN
// =====================================

function setupLahanForm() {
    const form = document.getElementById("form-lahan");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            id: document.getElementById("lahan-id").value,
            nama: document.getElementById("nama-lahan").value.trim(),
            lokasi: document.getElementById("lokasi-lahan").value.trim(),
            luas: Number(document.getElementById("luas-lahan").value)
        };

        const hasil = validateLahan(data);

        clearErrors([
            "error-nama-lahan",
            "error-lokasi-lahan",
            "error-luas-lahan"
        ]);

        if (!hasil.valid) {
            displayErrors(hasil.errors);
            showMessage(
                "pesan-lahan",
                "Periksa kembali data lahan yang dimasukkan.",
                "error"
            );
            console.warn("[Validasi Gagal - Lahan]:", hasil.errors);
            return;
        }

        const isEdit = Boolean(data.id);

        saveLahan(data);

        // Menampilkan data ke Console browser
        console.log(
            isEdit ? "[Lahan Diperbarui]:" : "[Lahan Ditambahkan]:",
            data
        );
        console.log("Daftar Lahan Saat Ini:");
        console.table(getLahan());

        form.reset();
        document.getElementById("lahan-id").value = "";

        showMessage(
            "pesan-lahan",
            isEdit
                ? "Data lahan berhasil diperbarui."
                : "Data lahan berhasil ditambahkan.",
            "success"
        );

        renderAll();
    });

    form.addEventListener("reset", () => {
        document.getElementById("lahan-id").value = "";
        clearErrors([
            "error-nama-lahan",
            "error-lokasi-lahan",
            "error-luas-lahan"
        ]);
    });
}

// =====================================
// 4. FORM DATA TANAMAN
// =====================================

function setupTanamanForm() {
    const form = document.getElementById("form-tanaman");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const data = {
            id: document.getElementById("tanaman-id").value,
            nama: document.getElementById("nama-tanaman").value.trim(),
            jenis: document.getElementById("jenis-tanaman").value,
            lahanId: document.getElementById("lahan-tanaman").value,
            tanggalTanam: document.getElementById("tanggal-tanam").value,
            jumlah: Number(
                document.getElementById("jumlah-tanaman").value
            ),
            status: document.getElementById("status-tanaman").value
        };

        const hasil = validateTanaman(data);

        clearErrors([
            "error-nama-tanaman",
            "error-jenis-tanaman",
            "error-lahan-tanaman",
            "error-tanggal-tanam",
            "error-jumlah-tanaman",
            "error-status-tanaman"
        ]);

        if (!hasil.valid) {
            displayErrors(hasil.errors);
            showMessage(
                "pesan-tanaman",
                "Periksa kembali data tanaman yang dimasukkan.",
                "error"
            );
            console.warn("[Validasi Gagal - Tanaman]:", hasil.errors);
            return;
        }

        const isEdit = Boolean(data.id);

        saveTanaman(data);

        // Menampilkan data ke Console browser
        console.log(
            isEdit ? "[Tanaman Diperbarui]:" : "[Tanaman Ditambahkan]:",
            data
        );
        console.log("Daftar Tanaman Saat Ini:");
        console.table(getTanaman());

        form.reset();
        document.getElementById("tanaman-id").value = "";

        showMessage(
            "pesan-tanaman",
            isEdit
                ? "Data tanaman berhasil diperbarui."
                : "Data tanaman berhasil ditambahkan.",
            "success"
        );

        renderAll();
    });

    form.addEventListener("reset", () => {
        document.getElementById("tanaman-id").value = "";
        clearErrors([
            "error-nama-tanaman",
            "error-jenis-tanaman",
            "error-lahan-tanaman",
            "error-tanggal-tanam",
            "error-jumlah-tanaman",
            "error-status-tanaman"
        ]);
    });
}

// =====================================
// 5. AKSI EDIT DAN HAPUS DATA
// =====================================

function setupTableActions() {
    // Aksi pada tabel lahan
    document.getElementById("daftar-lahan")
        .addEventListener("click", (event) => {
            const button = event.target.closest("button");

            if (!button) return;

            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === "edit-lahan") {
                editLahan(id);
            }

            if (action === "delete-lahan") {
                hapusLahan(id);
            }
        });

    // Aksi pada tabel tanaman
    document.getElementById("daftar-tanaman")
        .addEventListener("click", (event) => {
            const button = event.target.closest("button");

            if (!button) return;

            const id = button.dataset.id;
            const action = button.dataset.action;

            if (action === "edit-tanaman") {
                editTanaman(id);
            }

            if (action === "delete-tanaman") {
                hapusTanaman(id);
            }
        });
}

// =====================================
// 6. EDIT DATA LAHAN
// =====================================

function editLahan(id) {
    const lahan = getLahan().find(
        (item) => String(item.id) === String(id)
    );

    if (!lahan) return;

    document.getElementById("lahan-id").value = lahan.id;
    document.getElementById("nama-lahan").value = lahan.nama;
    document.getElementById("lokasi-lahan").value = lahan.lokasi;
    document.getElementById("luas-lahan").value = lahan.luas;

    document.getElementById("btn-simpan-lahan").textContent =
        "Perbarui Lahan";

    document.getElementById("data-lahan").scrollIntoView({
        behavior: "smooth"
    });
}

// =====================================
// 7. HAPUS DATA LAHAN
// =====================================

function hapusLahan(id) {
    const tanamanTerkait = getTanaman().some(
        (item) => String(item.lahanId) === String(id)
    );

    if (tanamanTerkait) {
        showMessage(
            "pesan-lahan",
            "Lahan tidak dapat dihapus karena masih memiliki data tanaman.",
            "error"
        );
        return;
    }

    const konfirmasi = confirm(
        "Apakah Anda yakin ingin menghapus data lahan ini?"
    );

    if (!konfirmasi) return;

    deleteLahan(id);

    console.log(`[Lahan Dihapus]: ID ${id}`);
    console.log("Daftar Lahan Saat Ini:");
    console.table(getLahan());

    showMessage(
        "pesan-lahan",
        "Data lahan berhasil dihapus.",
        "success"
    );

    renderAll();
}

// =====================================
// 8. EDIT DATA TANAMAN
// =====================================

function editTanaman(id) {
    const tanaman = getTanaman().find(
        (item) => String(item.id) === String(id)
    );

    if (!tanaman) return;

    document.getElementById("tanaman-id").value = tanaman.id;
    document.getElementById("nama-tanaman").value = tanaman.nama;
    document.getElementById("jenis-tanaman").value = tanaman.jenis;
    document.getElementById("tanggal-tanam").value =
        tanaman.tanggalTanam;
    document.getElementById("jumlah-tanaman").value = tanaman.jumlah;
    document.getElementById("status-tanaman").value = tanaman.status;

    renderLahanOptions(getLahan(), tanaman.lahanId);

    document.getElementById("lahan-tanaman").value =
        String(tanaman.lahanId);

    document.getElementById("btn-simpan-tanaman").textContent =
        "Perbarui Tanaman";

    document.getElementById("data-tanaman").scrollIntoView({
        behavior: "smooth"
    });
}

// =====================================
// 9. HAPUS DATA TANAMAN
// =====================================

function hapusTanaman(id) {
    const konfirmasi = confirm(
        "Apakah Anda yakin ingin menghapus data tanaman ini?"
    );

    if (!konfirmasi) return;

    deleteTanaman(id);

    console.log(`[Tanaman Dihapus]: ID ${id}`);
    console.log("Daftar Tanaman Saat Ini:");
    console.table(getTanaman());

    showMessage(
        "pesan-tanaman",
        "Data tanaman berhasil dihapus.",
        "success"
    );

    renderAll();
}

// =====================================
// 10. FUNGSI BANTU VALIDASI
// =====================================

function clearErrors(ids) {
    ids.forEach((id) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = "";
        }
    });
}

function displayErrors(errors) {
    Object.entries(errors).forEach(([id, message]) => {
        const element = document.getElementById(id);

        if (element) {
            element.textContent = message;
        }
    });
}
