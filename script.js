/**
 * INDIA HAIR ESTÚDIO E BELEZA - SCRIPT PRINCIPAL
 * Arquitetura de fácil manutenção e centralização de dados.
 */

// 1. CONFIGURAÇÕES CENTRAIS EDITÁVEIS
const CONFIG = {
  businessName: "India Hair Estúdio e Beleza",
  whatsappNumber: "5521993729779", // Formato internacional sem caracteres especiais
  instagramUrl: "https://www.instagram.com/indiamegahair",
  messages: {
    default: "Olá! Gostaria de informações e consultar horários disponíveis no India Hair.",
    servicePrefix: "Olá! Gostaria de consultar informações e agendar um horário para: ",
    locationRequest: "Olá! Gostaria de saber a localização exata e ponto de referência do estúdio."
  }
};

/**
 * Função utilitária para gerar links do WhatsApp codificados com segurança
 * @param {string} text - Texto da mensagem
 * @returns {string} - URL final pronta para uso
 */
function buildWhatsAppUrl(text) {
  return `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(text)}`;
}

// 2. INICIALIZAÇÃO APÓS CARREGAMENTO DO DOM
document.addEventListener("DOMContentLoaded", () => {
  setupDynamicLinks();
  setupYearAutoUpdate();
  setupHeaderScrollEffect();
  setupScrollAnimations();
  setupLightbox();
  setupMobileNavAutoClose();
});

/**
 * Vincula todas as ações e botões aos links corretos do WhatsApp
 */
function setupDynamicLinks() {
  const defaultUrl = buildWhatsAppUrl(CONFIG.messages.default);

  // Botões do Header, Hero, CTA e Flutuante
  const headerBtn = document.getElementById("btn-header-agendar");
  if (headerBtn) headerBtn.href = defaultUrl;

  const heroBtn = document.getElementById("btn-hero-whatsapp");
  if (heroBtn) heroBtn.href = defaultUrl;

  const ctaBtn = document.getElementById("btn-cta-agendar");
  if (ctaBtn) ctaBtn.href = defaultUrl;

  const contactBtn = document.getElementById("btn-contact-action");
  if (contactBtn) contactBtn.href = defaultUrl;

  const floatingWa = document.getElementById("floating-whatsapp");
  if (floatingWa) floatingWa.href = defaultUrl;

  const contactLink = document.getElementById("link-contact-wa");
  if (contactLink) contactLink.href = defaultUrl;

  const footerLink = document.getElementById("link-footer-wa");
  if (footerLink) footerLink.href = defaultUrl;

  const locationBtn = document.getElementById("btn-solicitar-local");
  if (locationBtn) {
    locationBtn.href = buildWhatsAppUrl(CONFIG.messages.locationRequest);
  }

  // Cards de serviços: clique individual com mensagem personalizada
  const serviceButtons = document.querySelectorAll(".service-btn");
  serviceButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const serviceName = button.getAttribute("data-service-name") || "um procedimento";
      const customMessage = `${CONFIG.messages.servicePrefix}${serviceName}.`;
      const targetUrl = buildWhatsAppUrl(customMessage);
      window.open(targetUrl, "_blank", "noopener,noreferrer");
    });
  });
}

/**
 * Atualiza automaticamente o ano dos direitos autorais no footer
 */
function setupYearAutoUpdate() {
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Adiciona sombra e encolhe o header suavemente ao rolar a página
 */
function setupHeaderScrollEffect() {
  const header = document.getElementById("main-header");
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
}

/**
 * Animações sutis com IntersectionObserver respeitando acessibilidade
 */
function setupScrollAnimations() {
  // Se o usuário preferir menos movimento, cancelamos as transições
  const mediaQueryReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (mediaQueryReducedMotion.matches) return;

  const animatableElements = document.querySelectorAll(".animate-on-scroll");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -40px 0px"
  });

  animatableElements.forEach((el) => observer.observe(el));
}

/**
 * Lightbox acessível para galeria de imagens
 */
function setupLightbox() {
  const lightbox = document.getElementById("customLightbox");
  const lightboxImg = document.getElementById("lightboxImg");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const closeBtn = document.getElementById("lightboxClose");
  const overlay = document.getElementById("lightboxOverlay");
  const galleryItems = document.querySelectorAll(".gallery-item");

  if (!lightbox || !lightboxImg || !closeBtn || !overlay) return;

  function openLightbox(imageUrl, captionText) {
    lightboxImg.src = imageUrl;
    lightboxImg.alt = captionText || "Imagem ampliada";
    lightboxCaption.textContent = captionText || "";
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    lightboxImg.src = "";
  }

  galleryItems.forEach((item) => {
    const handleOpen = () => {
      const largeSrc = item.getAttribute("data-large");
      const caption = item.getAttribute("data-caption");
      if (largeSrc) openLightbox(largeSrc, caption);
    };

    item.addEventListener("click", handleOpen);
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpen();
      }
    });
  });

  closeBtn.addEventListener("click", closeLightbox);
  overlay.addEventListener("click", closeLightbox);

  // Fechar com a tecla ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && lightbox.classList.contains("active")) {
      closeLightbox();
    }
  });
}

/**
 * Fecha o menu hambúrguer do mobile automaticamente ao clicar em uma âncora
 */
function setupMobileNavAutoClose() {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navCollapse = document.getElementById("navbarContent");

  if (!navCollapse) return;

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navCollapse.classList.contains("show")) {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });
}