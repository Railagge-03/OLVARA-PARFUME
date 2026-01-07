// 1. Sticky Navbar
window.addEventListener("scroll", () => {
    document.querySelector("header").classList.toggle("sticky", window.scrollY > 50);
});

// 2. Menu Hamburger
const menuBtn = document.querySelector('#mobile-menu');
const nav = document.querySelector('nav');

menuBtn.addEventListener('click', () => {
    nav.classList.toggle('active');
});

// Tutup menu kalau link diklik
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('active'));
});

// 3. Cart & WhatsApp Fonnte
let cart = [];
let count = 0;

function addToCart(item) {
    cart.push(item);
    count++;
    document.querySelector('.cart-icon').innerText = `Cart (${count})`;
    alert(item + " masuk keranjang! Cek menu Cart buat kirim ke WA.");
}

function sendToWhatsapp() {
    if (cart.length === 0) return alert("Belanja dulu bro!");

    const token = "8xtvPbSYkqBGaCJGoNfk";
    const target = "6282231195863"; // <--- GANTI NOMOR LO DI SINI!
    const list = cart.map((p, i) => `${i+1}. ${p}`).join('\n');
    const msg = `Halo Olvara Parfume, mau order:\n\n${list}\n\nMohon totalannya.`;

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
            alert("Pesanan terkirim!");
            cart = []; count = 0;
            document.querySelector('.cart-icon').innerText = "Cart (0)";
        } else alert("Gagal: " + res.reason);
    })
    .catch(() => alert("Koneksi error."));
}

// 4. Reveal Animation (Observer)
const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
        }
    });
});

document.querySelectorAll('.product-card').forEach(c => {
    c.style.opacity = "0";
    c.style.transform = "translateY(20px)";
    c.style.transition = "0.6s";
    observer.observe(c);
});
