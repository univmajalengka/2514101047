
/* =========================================
   CURUG MUARA JAYA - JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const body = document.body;
    const header = document.querySelector(".header");

    // TAHUN OTOMATIS DI FOOTER
    const yearElement = document.getElementById("tahun");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // NAVBAR MOBILE
    const menuToggle = document.getElementById("menu-toggle");
    const navLinks = document.getElementById("nav-links");

    function closeMenu() {
        if (!menuToggle || !navLinks) return;

        menuToggle.classList.remove("active");
        navLinks.classList.remove("active");
        body.classList.remove("menu-open");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu navigasi");
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener("click", function () {
            const isOpen = navLinks.classList.toggle("active");

            menuToggle.classList.toggle("active", isOpen);
            body.classList.toggle("menu-open", isOpen);

            menuToggle.setAttribute("aria-expanded", String(isOpen));
            menuToggle.setAttribute(
                "aria-label",
                isOpen ? "Tutup menu navigasi" : "Buka menu navigasi"
            );
        });

        navLinks.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        document.addEventListener("click", function (event) {
            if (
                navLinks.classList.contains("active") &&
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {
                closeMenu();
            }
        });
    }

    // EFEK NAVBAR SAAT HALAMAN DIGULIR
    function handleScroll() {
        if (header) {
            header.classList.toggle("scrolled", window.scrollY > 20);
        }

        if (backToTop) {
            backToTop.classList.toggle("visible", window.scrollY > 400);
        }
    }

    // ANIMASI SAAT ELEMEN MASUK KE LAYAR
    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
            function (entries, currentObserver) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("show");
                        currentObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -35px 0px"
            }
        );

        // Aktifkan mode animasi hanya setelah observer siap.
        body.classList.add("js-ready");

        revealElements.forEach(function (element) {
            observer.observe(element);
        });
    } else {
        revealElements.forEach(function (element) {
            element.classList.add("show");
        });
    }

    // TOMBOL KEMBALI KE ATAS
    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    // KALKULATOR TIKET
    const ticketForm = document.getElementById("ticket-form");

    const adultsInput = document.getElementById("adults");
    const childrenInput = document.getElementById("children");
    const motorcyclesInput = document.getElementById("motorcycles");
    const carsInput = document.getElementById("cars");

    const totalPriceElement = document.getElementById("total-price");
    const totalDetailElement = document.getElementById("total-detail");

    // Harga dalam rupiah
    const PRICES = {
        adult: 15000,
        child: 5000,
        motorcycle: 3000,
        car: 5000
    };

    const rupiah = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    });

    function getQuantity(input) {
        if (!input) return 0;

        const value = Number(input.value);

        if (!Number.isFinite(value) || value < 0) {
            return 0;
        }

        return Math.floor(value);
    }

    function calculateTotal(event) {
        if (event) {
            event.preventDefault();
        }

        const adults = getQuantity(adultsInput);
        const children = getQuantity(childrenInput);
        const motorcycles = getQuantity(motorcyclesInput);
        const cars = getQuantity(carsInput);

        const total =
            adults * PRICES.adult +
            children * PRICES.child +
            motorcycles * PRICES.motorcycle +
            cars * PRICES.car;

        if (totalPriceElement) {
            totalPriceElement.textContent = rupiah.format(total);
        }

        if (totalDetailElement) {
            totalDetailElement.textContent =
                `${adults} dewasa · ` +
                `${children} anak · ` +
                `${motorcycles} motor · ` +
                `${cars} mobil`;
        }

        return total;
    }

    if (ticketForm) {
        ticketForm.addEventListener("submit", calculateTotal);

        [
            adultsInput,
            childrenInput,
            motorcyclesInput,
            carsInput
        ].forEach(function (input) {
            if (input) {
                input.addEventListener("input", function () {
                    if (input.value !== "" && Number(input.value) < 0) {
                        input.value = 0;
                    }

                    calculateTotal();
                });
            }
        });

        calculateTotal();
    }

    // TANGANI GAMBAR YANG GAGAL DIMUAT
    document.querySelectorAll("img").forEach(function (img) {
        img.addEventListener("error", function () {
            img.classList.add("image-error");
            img.alt = img.alt || "Gambar tidak tersedia";
        });
    });
});
