const foodGroups = [
  { name: "Whole grains", rrPer100g: 0.85 },
  { name: "Vegetables", rrPer100g: 0.90 },
  { name: "Fruits", rrPer100g: 0.88 },
  { name: "Legumes", rrPer100g: 0.92 },
  { name: "Nuts and seeds", rrPer100g: 0.94 },
  { name: "Fish", rrPer100g: 0.93 },
  { name: "Red meat", rrPer100g: 1.15 },
  { name: "Processed meat", rrPer100g: 1.20 },
  { name: "Sugar-sweetened beverages", rrPer100g: 1.18 },
  { name: "Refined grains", rrPer100g: 1.10 },
  { name: "Milk", rrPer100g: 0.95 },
  { name: "Cheese", rrPer100g: 0.97 }
];

const presets = {
  Western: [20, 60, 50, 15, 10, 10, 90, 70, 100, 120, 60, 40],
  Healthy: [100, 150, 150, 80, 40, 50, 20, 10, 0, 30, 200, 50]
};

const baselineRiskMultipliers = {
  Male: { "18-29": 1.00, "30-49": 1.05, "50-64": 1.15, "65+": 1.30 },
  Female: { "18-29": 0.95, "30-49": 1.00, "50-64": 1.10, "65+": 1.20 }
};

function createSliders() {
  const container = document.getElementById("slidersContainer");
  container.innerHTML = "";
  foodGroups.forEach((group, index) => {
    const div = document.createElement("div");
    div.className = "slider-group";
    div.innerHTML = `
      <label>${group.name} (<span id="val-${index}">0</span> g)</label>
      <input type="range" min="0" max="200" value="0" step="1" id="slider-${index}">
    `;
    container.appendChild(div);
    document.getElementById(`slider-${index}`).oninput = function () {
      document.getElementById(`val-${index}`).innerText = this.value;
    };
  });
}

function applyPreset(values) {
  values.forEach((val, i) => {
    const slider = document.getElementById(`slider-${i}`);
    if (slider) {
      slider.value = val;
      document.getElementById(`val-${i}`).innerText = val;
    }
  });
}

function createPresets() {
  const presetContainer = document.getElementById("presetContainer");
  presetContainer.innerHTML = "";
  Object.entries(presets).forEach(([name, values]) => {
    const btn = document.createElement("button");
    btn.innerText = name;
    btn.onclick = () => applyPreset(values);
    presetContainer.appendChild(btn);
  });
}

function getBaselineMultiplier() {
  const sex = document.getElementById("sexSelect").value;
  const age = document.getElementById("ageSelect").value;
  return baselineRiskMultipliers[sex][age] || 1;
}

function calculateRisk() {
  let total = 1;
  const labels = [], risks = [];
  foodGroups.forEach((group, i) => {
    const val = parseInt(document.getElementById(`slider-${i}`).value || "0");
    const multiplier = Math.pow(group.rrPer100g, val / 100);
    total *= multiplier;
    labels.push(group.name);
    risks.push(multiplier.toFixed(2));
  });

  const baseline = getBaselineMultiplier();
  total *= baseline;
  document.getElementById("totalRisk").innerText = total.toFixed(2);
  plotChart(labels, risks);
}

function plotChart(labels, risks) {
  const ctx = document.getElementById("barChart").getContext("2d");
  if (window.bar) window.bar.destroy();
  window.bar = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Risk Multiplier",
        data: risks,
      }]
    },
    options: {
      responsive: true,
      scales: { y: { beginAtZero: true } }
    }
  });
}

document.getElementById("calculateBtn").onclick = calculateRisk;
createSliders();
createPresets();
