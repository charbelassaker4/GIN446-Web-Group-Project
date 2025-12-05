(function () {
  const form = document.getElementById("bmi-form");
  if (!form) return; // not on bmi page

  const weightEl = document.getElementById("bmi-weight");
  const heightEl = document.getElementById("bmi-height");
  const goalEl = document.getElementById("bmi-goal");

  const resultBox = document.getElementById("bmi-result");

  // New animated UI elements (if they exist)
  const numberEl =
    document.getElementById("bmi-number") || document.getElementById("bmi-value");
  const ringEl = document.getElementById("bmi-ring-value");
  const categoryEl = document.getElementById("bmi-category");
  const statusLineEl =
    document.getElementById("bmi-status-line") || categoryEl;
  const tipEl = document.getElementById("bmi-tip");
  const pillWrapper = document.getElementById("bmi-cat-pill-wrapper");

  function getCategory(bmi) {
    if (bmi < 18.5) return "underweight";
    if (bmi < 25) return "normal";
    if (bmi < 30) return "overweight";
    return "obesity";
  }

  function categoryLabel(cat) {
    switch (cat) {
      case "underweight":
        return "Underweight";
      case "normal":
        return "Normal weight";
      case "overweight":
        return "Overweight";
      case "obesity":
        return "Obesity";
      default:
        return "";
    }
  }

  function goalTip(cat, goal) {
    if (goal === "cut") {
      if (cat === "underweight") {
        return "You are already underweight — a cutting phase is not recommended. Talk to a health professional first.";
      }
      if (cat === "normal") {
        return "When cutting in the normal range, use a small calorie deficit, high protein intake, and resistance training.";
      }
      return "For cutting, use a light calorie deficit, walk more, and keep lifting to protect muscle.";
    }

    if (goal === "bulk") {
      if (cat === "obesity") {
        return "Before bulking, it is usually safer to reduce body fat a bit with a moderate cut and strength training.";
      }
      return "For bulking, eat in a small surplus, focus on progressive overload, and keep protein high.";
    }

    // maintain
    if (cat === "normal") {
      return "Great! Staying active, sleeping well, and tracking your nutrition will help you maintain this range.";
    }
    if (cat === "underweight") {
      return "Try to slowly increase your calories with nutrient-dense foods and resistance training.";
    }
    return "Keep your calories around maintenance, stay active, and monitor your weight trend over time.";
  }

  function animateNumber(el, from, to, duration) {
    if (!el) return;
    const start = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const value = from + (to - from) * t;
      el.textContent = value.toFixed(1);
      if (t < 1) requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const w = parseFloat(weightEl.value);
    const h = parseFloat(heightEl.value);
    if (!w || !h) return;

    const hMeters = h / 100;
    const bmi = w / (hMeters * hMeters);
    const rounded = Math.round(bmi * 10) / 10;

    const cat = getCategory(rounded);
    const catLabel = categoryLabel(cat);
    const goal = goalEl.value;

    // Show result box
    if (resultBox) {
      resultBox.classList.remove("hidden");
      // if you added CSS for .visible (animated card), this will trigger it
      resultBox.classList.add("visible");
    }

    // Animate / write BMI number
    if (numberEl) {
      const current = parseFloat(numberEl.textContent) || 0;
      animateNumber(numberEl, current, rounded, 600);
    }

    // Ring animation (if SVG ring is present)
    if (ringEl) {
      const maxBmiForRing = 40;
      const clamped = Math.max(0, Math.min(maxBmiForRing, rounded));
      const percent = clamped / maxBmiForRing;
      const circumference = 440; // stroke-dasharray in the SVG
      const offset = circumference * (1 - percent);
      ringEl.style.strokeDasharray = String(circumference);
      ringEl.style.strokeDashoffset = String(offset);
    }

    // Category + status line text
    if (categoryEl) {
      categoryEl.textContent = `Category: ${catLabel}`;
    }
    if (statusLineEl && statusLineEl !== categoryEl) {
      statusLineEl.textContent = `Your BMI is ${rounded} kg/m².`;
    }

    // Category pill under the number (if wrapper exists)
    if (pillWrapper) {
      pillWrapper.innerHTML = "";
      const pill = document.createElement("span");
      pill.className =
        "bmi-category-pill " +
        (cat === "underweight"
          ? "bmi-category-underweight"
          : cat === "normal"
          ? "bmi-category-normal"
          : cat === "overweight"
          ? "bmi-category-overweight"
          : "bmi-category-obesity");
      pill.textContent = catLabel;
      pillWrapper.appendChild(pill);
    }

    // Tip text (depends on goal and category)
    if (tipEl) {
      tipEl.textContent = goalTip(cat, goal);
    }
  });
})();

// ===== WORKOUT GOAL FILTER =====
(function () {
  const chips = document.querySelectorAll("[data-goal-filter]");
  if (!chips.length) return;

  const cards = document.querySelectorAll(".split-card");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const goal = chip.dataset.goalFilter;

      cards.forEach((card) => {
        if (goal === "all") {
          card.style.display = "";
        } else {
          const goals = (card.dataset.goal || "").split(" ");
          card.style.display = goals.includes(goal) ? "" : "none";
        }
      });
    });
  });
})();

// ===== NUTRITION CATEGORY FILTER =====
(function () {
  const chips = document.querySelectorAll("[data-food-filter]");
  if (!chips.length) return;

  const rows = document.querySelectorAll("[data-food-cat]");

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      chips.forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      const cat = chip.dataset.foodFilter;

      rows.forEach((row) => {
        if (cat === "all") {
          row.style.display = "";
        } else {
          const rowCats = (row.dataset.foodCat || "").split(" ");
          row.style.display = rowCats.includes(cat) ? "" : "none";
        }
      });
    });
  });
})();

// ===== PROGRESS TRACKER (localStorage) =====
(function () {
  const form = document.getElementById("progress-form");
  if (!form) return;

  const STORAGE_KEY = "dreamfit-progress-v1";

  const dateEl = document.getElementById("pg-date");
  const weightEl = document.getElementById("pg-weight");
  const noteEl = document.getElementById("pg-note");
  const bodyEl = document.getElementById("progress-body");
  const summaryBox = document.getElementById("progress-summary");
  const countEl = document.getElementById("pg-count");
  const changeEl = document.getElementById("pg-change");

  function loadEntries() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }

  function saveEntries(entries) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  function render() {
    const entries = loadEntries();
    bodyEl.innerHTML = "";

    if (!entries.length) {
      summaryBox.classList.add("hidden");
      return;
    }

    entries.forEach((e, idx) => {
      const tr = document.createElement("tr");

      const tdDate = document.createElement("td");
      tdDate.textContent = e.date;

      const tdWeight = document.createElement("td");
      tdWeight.textContent = e.weight.toFixed(1);

      const tdNote = document.createElement("td");
      tdNote.textContent = e.note || "";

      const tdRemove = document.createElement("td");
      const btn = document.createElement("button");
      btn.textContent = "Delete";
      btn.addEventListener("click", () => {
        const fresh = loadEntries();
        fresh.splice(idx, 1);
        saveEntries(fresh);
        render();
      });
      tdRemove.appendChild(btn);

      tr.appendChild(tdDate);
      tr.appendChild(tdWeight);
      tr.appendChild(tdNote);
      tr.appendChild(tdRemove);

      bodyEl.appendChild(tr);
    });

    // Summary
    const weights = entries.map((e) => e.weight);
    const first = weights[0];
    const last = weights[weights.length - 1];
    const diff = Math.round((last - first) * 10) / 10;

    countEl.textContent = `Total entries: ${entries.length}`;
    if (diff === 0) {
      changeEl.textContent = "Weight change: 0.0 kg (no change yet).";
    } else if (diff > 0) {
      changeEl.textContent = `Weight change: +${diff} kg since first entry.`;
    } else {
      changeEl.textContent = `Weight change: ${diff} kg since first entry.`;
    }
    summaryBox.classList.remove("hidden");
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const date = dateEl.value;
    const weight = parseFloat(weightEl.value);
    const note = noteEl.value.trim();

    if (!date || !weight) return;

    const entries = loadEntries();
   // Check if an entry for this date already exists
const existing = entries.findIndex(e => e.date === date);

if (existing !== -1) {
  // Overwrite the existing entry
  entries[existing] = { date, weight, note };
} else {
  // Add new entry
  entries.push({ date, weight, note });
}

    entries.sort((a, b) => a.date.localeCompare(b.date)); // keep chronological
    saveEntries(entries);
    form.reset();
    render();
  });

  // set default date to today
  if (!dateEl.value) {
    const today = new Date().toISOString().split("T")[0];
    dateEl.value = today;
  }

  render();
})();