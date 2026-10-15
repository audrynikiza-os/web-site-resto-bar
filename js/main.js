// ============================================================
//  UMUCO RESTO-BAR — SCRIPT PRINCIPAL
//  Menu dynamique, bilinguisme FR/EN, galerie, formulaire
//  de réservation WhatsApp et animations.
// ============================================================

(function () {
  "use strict";

  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  var WA_ICON =
    '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">' +
    '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>' +
    "</svg>";

  var lang = localStorage.getItem("umuco-lang") || "fr";
  var activeTab = "drinks";
  var revealObserver = null;

  function t(path) {
    return path.split(".").reduce(function (obj, key) {
      return obj && obj[key] !== undefined ? obj[key] : undefined;
    }, I18N[lang]);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat(lang === "fr" ? "fr-FR" : "en-US").format(price) + " FBu";
  }

  function waLink(message) {
    return "https://wa.me/" + UMUCO_INFOS.whatsapp + "?text=" + encodeURIComponent(message);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------------- Menu ---------------- */

  function orderMessage(name, price) {
    return lang === "fr"
      ? "Bonjour Umuco Resto-Bar ! Je souhaite commander : " + name + " (" + formatPrice(price) + ")."
      : "Hello Umuco Resto-Bar! I would like to order: " + name + " (" + formatPrice(price) + ").";
  }

  function renderMenu() {
    var wrap = $("#menu-content");
    if (!wrap) return;
    var data = UMUCO_MENU[activeTab];
    wrap.innerHTML = data.groups.map(function (group) {
      var items = group.items.map(function (item) {
        var name = lang === "fr" ? item.name_fr : item.name_en;
        return (
          '<div class="menu-item">' +
            '<span class="menu-item-name">' + escapeHtml(name) + "</span>" +
            '<span class="menu-item-price">' + formatPrice(item.price) + "</span>" +
            '<a class="order-btn" href="' + waLink(orderMessage(name, item.price)) + '" target="_blank" rel="noopener"' +
              ' title="' + escapeHtml(t("menu.order")) + '" aria-label="' + escapeHtml(t("menu.order") + " : " + name) + '">' +
              WA_ICON +
            "</a>" +
          "</div>"
        );
      }).join("");
      return (
        '<div class="menu-group">' +
          '<h3 class="menu-group-title">' + escapeHtml(lang === "fr" ? group.name_fr : group.name_en) + "</h3>" +
          '<div class="menu-items">' + items + "</div>" +
        "</div>"
      );
    }).join("");
  }

  /* ---------------- Activités ---------------- */

  function activityMessage(activity, name) {
    var template = activity.free ? t("wa.activityInfo") : t("wa.activity");
    return template.replace("{name}", name);
  }

  function renderActivities() {
    var grid = $("#activities-grid");
    if (!grid) return;
    grid.innerHTML = UMUCO_INFOS.activities.map(function (activity) {
      var info = t("activities." + activity.id);
      var priceLabel = activity.free ? t("activities.free") : formatPrice(activity.price);
      var unit = activity.free ? t("activities.freeUnit") : t("activities.perPerson");
      var btnLabel = activity.free ? t("activities.info") : t("activities.reserve");
      return (
        '<article class="activity-card reveal">' +
          '<div class="activity-media">' +
            '<img src="' + activity.img + '" alt="' + escapeHtml(info.name) + '" loading="lazy">' +
            '<span class="activity-price-tag">' + escapeHtml(priceLabel) + "</span>" +
          "</div>" +
          '<div class="activity-body">' +
            "<h3>" + escapeHtml(info.name) + "</h3>" +
            '<p class="activity-desc">' + escapeHtml(info.desc) + "</p>" +
            '<div class="activity-meta">' + escapeHtml(unit) + "</div>" +
            '<a class="btn btn--outline btn--small" href="' + waLink(activityMessage(activity, info.name)) + '" target="_blank" rel="noopener">' +
              escapeHtml(btnLabel) + " " + WA_ICON +
            "</a>" +
          "</div>" +
        "</article>"
      );
    }).join("");
    observeReveals();
  }

  /* ---------------- Boutons WhatsApp ---------------- */

  function updateWaButtons() {
    $$("[data-wa]").forEach(function (el) {
      var key = el.getAttribute("data-wa");
      el.setAttribute("href", waLink(t("wa." + key)));
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    });
  }

  /* ---------------- Traductions ---------------- */

  function applyTranslations() {
    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n"));
      if (value !== undefined) el.textContent = value;
    });

    $$("[data-i18n-placeholder]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-placeholder"));
      if (value !== undefined) el.setAttribute("placeholder", value);
    });

    $$("[data-i18n-title]").forEach(function (el) {
      var value = t(el.getAttribute("data-i18n-title"));
      if (value !== undefined) el.setAttribute("title", value);
    });

    var langBtn = $("#lang-btn");
    if (langBtn) langBtn.textContent = lang === "fr" ? "EN" : "FR";

    renderMenu();
    renderActivities();
    updateWaButtons();
  }

  /* ---------------- Animations au scroll ---------------- */

  function observeReveals() {
    if (!("IntersectionObserver" in window)) {
      $$(".reveal").forEach(function (el) { el.classList.add("visible"); });
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
    }
    $$(".reveal:not(.visible)").forEach(function (el) { revealObserver.observe(el); });
  }

  /* ---------------- Navigation ---------------- */

  function initNav() {
    var navbar = $("#navbar");
    var toggle = $("#nav-toggle");
    var links = $("#nav-links");
    if (!navbar || !toggle || !links) return;

    var onScroll = function () {
      navbar.classList.toggle("scrolled", window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    var closePanel = function () {
      links.classList.remove("open");
      toggle.classList.remove("active");
      toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    toggle.addEventListener("click", function () {
      var isOpen = links.classList.toggle("open");
      toggle.classList.toggle("active", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    $$("a", links).forEach(function (a) {
      a.addEventListener("click", closePanel);
    });
  }

  /* ---------------- Onglets du menu ---------------- */

  function initTabs() {
    var tabs = $$(".menu-tab");
    tabs.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activeTab = btn.getAttribute("data-tab");
        tabs.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle("active", active);
          b.setAttribute("aria-selected", String(active));
        });
        renderMenu();
      });
    });
  }

  /* ---------------- Galerie / lightbox ---------------- */

  function initLightbox() {
    var lightbox = $("#lightbox");
    if (!lightbox) return;
    var imgEl = $("#lightbox-img");
    var capEl = $("#lightbox-caption");
    var items = $$(".gallery-item");
    var current = 0;

    var show = function (index) {
      current = (index + items.length) % items.length;
      var img = items[current].querySelector("img");
      var cap = items[current].querySelector(".gallery-caption");
      imgEl.src = img.getAttribute("src");
      imgEl.alt = img.getAttribute("alt") || "";
      capEl.textContent = cap ? cap.textContent : "";
    };

    var open = function (index) {
      show(index);
      lightbox.classList.add("open");
      document.body.style.overflow = "hidden";
    };

    var close = function () {
      lightbox.classList.remove("open");
      document.body.style.overflow = "";
    };

    items.forEach(function (item, index) {
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
      item.addEventListener("click", function () { open(index); });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(index);
        }
      });
    });

    $("#lightbox-close").addEventListener("click", close);
    $("#lightbox-prev").addEventListener("click", function () { show(current - 1); });
    $("#lightbox-next").addEventListener("click", function () { show(current + 1); });
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) close();
    });
    document.addEventListener("keydown", function (e) {
      if (!lightbox.classList.contains("open")) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") show(current - 1);
      if (e.key === "ArrowRight") show(current + 1);
    });
  }

  /* ---------------- Formulaire de réservation ---------------- */

  function initForm() {
    var form = $("#res-form");
    if (!form) return;
    var dateInput = $("#res-date");

    if (dateInput) {
      var now = new Date();
      var iso = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().split("T")[0];
      dateInput.min = iso;
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = $("#res-name").value.trim();
      var date = dateInput ? dateInput.value : "";
      var time = $("#res-time").value;
      var persons = $("#res-persons").value;
      var msg = $("#res-msg").value.trim();

      var lines = lang === "fr"
        ? [
            "Bonjour Umuco Resto-Bar !",
            "",
            "Je souhaite réserver une table.",
            "",
            "Nom : " + name,
            "Date : " + date,
            "Heure : " + time,
            "Personnes : " + persons
          ]
        : [
            "Hello Umuco Resto-Bar!",
            "",
            "I would like to book a table.",
            "",
            "Name: " + name,
            "Date: " + date,
            "Time: " + time,
            "Guests: " + persons
          ];

      if (msg) lines.push((lang === "fr" ? "Message : " : "Message: ") + msg);
      window.open(waLink(lines.join("\n")), "_blank", "noopener");
    });
  }

  /* ---------------- Changement de langue ---------------- */

  function initLang() {
    var btn = $("#lang-btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      lang = lang === "fr" ? "en" : "fr";
      localStorage.setItem("umuco-lang", lang);
      applyTranslations();
      observeReveals();
    });
  }

  /* ---------------- Initialisation ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    applyTranslations();
    initNav();
    initTabs();
    initForm();
    initLightbox();
    initLang();
    observeReveals();

    var yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  });
})();
