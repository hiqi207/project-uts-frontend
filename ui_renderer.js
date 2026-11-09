// =====================================
// 1. FORMAT ANGKA
// =====================================

function formatNumber(value) {
    return Number(value).toLocaleString("id-ID", {
        maximumFractionDigits: 2
    });
}

// =====================================
// 2. RENDER DASHBOARD
// =====================================

export function renderDashboard(lahan, tanaman) {
    const totalLahan = lahan.length;

    const totalLuas = lahan.reduce(
        (total, item) => total + Number(item.luas || 0),
        0
    );

    const totalTanaman = tanaman.length;

    document.getElementById("total-lahan").textContent =
        formatNumber(totalLahan);

    document.getElementById("total-luas").textContent =
        formatNumber(totalLuas);

    document.getElementById("total-tanaman").textContent =
        formatNumber(totalTanaman);
}

// =====================================
// 3. RENDER TABEL LAHAN
// =====================================

export function renderLahan(lahan) {
    const tbody = document.getElementById("daftar-lahan");

    tbody.replaceChildren();

    if (lahan.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 5;
        cell.textContent = "Belum ada data lahan.";

        row.appendChild(cell);
        tbody.appendChild(row);

        return;
    }

    lahan.forEach((item, index) => {
        const row = document.createElement("tr");

        const values = [
            index + 1,
            item.nama,
            item.lokasi,
            `${formatNumber(item.luas)} ha`
        ];

        values.forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Kolom aksi
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "btn-edit";
        editButton.dataset.action = "edit-lahan";
        editButton.dataset.id = item.id;
        editButton.setAttribute(
            "aria-label",
            `Edit lahan ${item.nama}`
        );

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.className = "btn-delete";
        deleteButton.dataset.action = "delete-lahan";
        deleteButton.dataset.id = item.id;
        deleteButton.setAttribute(
            "aria-label",
            `Hapus lahan ${item.nama}`
        );

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

// =====================================
// 4. RENDER PILIHAN LAHAN
// =====================================

export function renderLahanOptions(lahan, selectedId = "") {
    const select = document.getElementById("lahan-tanaman");

    select.replaceChildren();

    const defaultOption = document.createElement("option");
    defaultOption.value = "";

    if (lahan.length === 0) {
        defaultOption.textContent =
            "-- Belum ada lahan, tambahkan lahan dulu --";
    } else {
        defaultOption.textContent = "-- Pilih Lahan --";
    }

    select.appendChild(defaultOption);

    lahan.forEach((item) => {
        const option = document.createElement("option");

        option.value = String(item.id);
        option.textContent = `${item.nama} - ${item.lokasi}`;

        if (String(item.id) === String(selectedId)) {
            option.selected = true;
        }

        select.appendChild(option);
    });

    select.disabled = lahan.length === 0;

    const hint = document.getElementById("hint-lahan-tanaman");

    if (hint) {
        hint.textContent =
            lahan.length === 0
                ? "Tambahkan minimal satu lahan pada form di atas " +
                  "atau di bagian Manajemen Data Lahan sebelum " +
                  "mengisi form tanaman ini."
                : "";
    }
}

// =====================================
// 5. RENDER TABEL TANAMAN
// =====================================

export function renderTanaman(tanaman, lahan) {
    const tbody = document.getElementById("daftar-tanaman");

    tbody.replaceChildren();

    if (tanaman.length === 0) {
        const row = document.createElement("tr");
        const cell = document.createElement("td");

        cell.colSpan = 8;
        cell.textContent = "Belum ada data tanaman.";

        row.appendChild(cell);
        tbody.appendChild(row);

        return;
    }

    tanaman.forEach((item, index) => {
        const row = document.createElement("tr");

        // Cari nama lahan berdasarkan ID
        const lahanTerkait = lahan.find(
            (dataLahan) =>
                String(dataLahan.id) === String(item.lahanId)
        );

        const namaLahan = lahanTerkait
            ? lahanTerkait.nama
            : "Lahan tidak ditemukan";

        const values = [
            index + 1,
            item.nama,
            item.jenis,
            namaLahan,
            item.tanggalTanam,
            `${formatNumber(item.jumlah)} batang`
        ];

        values.forEach((value) => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        // Kolom status pertumbuhan
        const statusCell = document.createElement("td");
        const statusBadge = document.createElement("span");

        statusBadge.classList.add("status");

        const statusClasses = {
            "Baru Ditanam": "status-baru",
            "Dalam Perawatan": "status-perawatan",
            "Siap Panen": "status-panen",
            "Sudah Dipanen": "status-selesai"
        };

        statusBadge.classList.add(
            statusClasses[item.status] || "status-baru"
        );

        statusBadge.textContent = item.status;
        statusCell.appendChild(statusBadge);
        row.appendChild(statusCell);

        // Kolom aksi
        const actionCell = document.createElement("td");

        const editButton = document.createElement("button");
        editButton.type = "button";
        editButton.textContent = "Edit";
        editButton.className = "btn-edit";
        editButton.dataset.action = "edit-tanaman";
        editButton.dataset.id = item.id;
        editButton.setAttribute(
            "aria-label",
            `Edit tanaman ${item.nama}`
        );

        const deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.textContent = "Hapus";
        deleteButton.className = "btn-delete";
        deleteButton.dataset.action = "delete-tanaman";
        deleteButton.dataset.id = item.id;
        deleteButton.setAttribute(
            "aria-label",
            `Hapus tanaman ${item.nama}`
        );

        actionCell.append(editButton, deleteButton);
        row.appendChild(actionCell);
        tbody.appendChild(row);
    });
}

// =====================================
// 6. MENAMPILKAN PESAN
// =====================================

export function showMessage(elementId, message, type = "success") {
    const element = document.getElementById(elementId);

    if (!element) return;

    element.textContent = message;

    element.classList.remove("success", "error");
    element.classList.add(type === "error" ? "error" : "success");
}
