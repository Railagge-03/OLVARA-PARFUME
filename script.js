// ==========================================
// 1. KONFIGURASI FIREBASE (Tetap Sama)
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyA7_ujIyDHPaefbOI10mmOhIilm53wqC68",
  authDomain: "olvara-parfume.firebaseapp.com",
  databaseURL: "https://olvara-parfume-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "olvara-parfume",
  storageBucket: "olvara-parfume.firebasestorage.app",
  messagingSenderId: "637688213084",
  appId: "1:637688213084:web:9ee8589557737f7098099",
  measurementId: "G-J5H8ZTB6ZL"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const database = firebase.database();

// ==========================================
// 2. FITUR NAVIGASI & CART
// ==========================================
let cart = [];
let count = 0;

function addToCart(item) {
    cart.push(item);
    count++;
    document.querySelector('.cart-icon').innerText = `Cart (${count})`;
    alert(item + " masuk keranjang!");
}

// ==========================================
// 3. WHATSAPP DENGAN IDENTITAS LENGKAP
// ==========================================
function sendToWhatsapp() {
    if (cart.length === 0) return alert("Kamu belum menambahkan produk ke keranjang, mohon isi terlebih dahulu!");

    // INPUT IDENTITAS
    let name = prompt("Masukkan Nama Lengkap:");
    if (!name) return alert("Nama wajib diisi!");

    let phone = prompt("Masukkan Nomor WhatsApp Aktif (Contoh: 0812xxx):");
    if (!phone) return alert("Nomor WA wajib diisi!");

    let location = prompt("Masukkan Daerah/Alamat Tujuan:");
    if (!location) return alert("Daerah tujuan wajib diisi!");

    const token = "8xtvPbSYkqBGaCJGoNfk"; 
    const target = "6282231195863"; 
    const list = cart.map((p, i) => `${i+1}. ${p}`).join('\n');
    
    // FORMAT PESAN SUPER RAPI
    const msg = `*PESANAN BARU - OLVARA PARFUME*\n\n` +
                `*Identitas Pembeli:*\n` +
                `- Nama: ${name.toUpperCase()}\n` +
                `- WA: ${phone}\n` +
                `- Tujuan: ${location}\n\n` +
                `*Daftar Order:*\n${list}\n\n` +
                `Mohon segera diproses ya Min!`;

    const data = new FormData();
    data.append('target', target);
    data.append('message', msg);

    fetch('https://api.fonnte.com/send', {
        method: 'POST',
        headers: { 'Authorization': token },
        body: data
    })
    .then(res => res.json())
    .then(res => {
        if(res.status) {
            alert(`Siap ${name}, pesanan sedang di konfirmasi oleh admin!`);
            cart = []; count = 0;
            document.querySelector('.cart-icon').innerText = "Cart (0)";
        } else alert("Error: " + res.reason);
    })
    .catch(() => alert("Koneksi error!"));
}

// ==========================================
// 4. RATING & REVIEW (Tetap Sama)
// ==========================================
let selectedRating = 0;
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('star')) {
        selectedRating = parseInt(e.target.getAttribute('data-value'));
        document.querySelectorAll('.star').forEach(s => {
            s.classList.toggle('active', parseInt(s.getAttribute('data-value')) <= selectedRating);
        });
    }
});

function submitReview() {
    const n = document.getElementById('reviewer-name').value;
    const t = document.getElementById('review-text').value;
    if (!n || !t || selectedRating === 0) return alert("Data ulasan belum lengkap!");

    database.ref('reviews').push({
        username: n, message: t, rating: selectedRating, timestamp: Date.now()
    }).then(() => {
        alert("Review Terkirim!");
        document.getElementById('reviewer-name').value = '';
        document.getElementById('review-text').value = '';
        selectedRating = 0;
        document.querySelectorAll('.star').forEach(s => s.classList.remove('active'));
    });
}

database.ref('reviews').on('value', (snapshot) => {
    const list = document.getElementById('review-list');
    if(!list) return;
    list.innerHTML = '';
    const data = snapshot.val();
    if (data) {
        Object.keys(data).reverse().forEach(key => {
            const r = data[key];
            const stars = "★".repeat(r.rating) + "☆".repeat(5 - r.rating);
            list.innerHTML += `<div class="review-item"><div class="review-header"><strong>${r.username}</strong><span class="stars-static">${stars}</span></div><p>"${r.message}"</p></div>`;
        });
    }
});

// Hamburgermenu logic
const menuBtn = document.querySelector('#mobile-menu');
const nav = document.querySelector('nav');
if(menuBtn) menuBtn.addEventListener('click', () => { nav.classList.toggle('active'); });
