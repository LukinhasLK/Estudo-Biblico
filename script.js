const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const menuButton = document.querySelector(".menu-toggle");
const navLinks = document.querySelectorAll(".nav-links a");
const form = document.querySelector(".signup");
const formMessage = document.querySelector(".form-message");
const motionAllowed = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const updateHeader = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const updateHeroParallax = () => {
  if (!motionAllowed || !hero) return;
  const offset = Math.min(window.scrollY * 0.14, 72);
  hero.style.setProperty("--parallax-y", `${offset}px`);
};

menuButton.addEventListener("click", () => {
  document.body.classList.toggle("menu-open");
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    document.body.classList.remove("menu-open");
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.textContent =
    "Pronto. Sua proxima trilha de estudo chegara em breve.";
  form.reset();
});

window.addEventListener("scroll", updateHeader);
window.addEventListener("scroll", updateHeroParallax);
updateHeader();
updateHeroParallax();

if (motionAllowed) {
  const revealItems = document.querySelectorAll(
    ".welcome-copy, .product-scene, .method-head, .method-item, .section-title, .feature-card, .menu-hero, .menu-card, .library-toolbar, .study-grid article, .testimony-row figure, .footer-contact"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  revealItems.forEach((item, index) => {
    item.classList.add("reveal");
    item.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
    revealObserver.observe(item);
  });

  hero?.classList.add("is-parallax");
}
