
const foodGroups = [
  { name: "Whole grains", weight: -0.02 },
  { name: "Vegetables", weight: -0.015 },
  { name: "Fruits", weight: -0.015 },
  { name: "Legumes", weight: -0.01 },
  { name: "Nuts and seeds", weight: -0.01 },
  { name: "Fish", weight: -0.01 },
  { name: "Red meat", weight: 0.02 },
  { name: "Processed meat", weight: 0.025 },
  { name: "Sugar-sweetened beverages", weight: 0.03 },
  { name: "Refined grains", weight: 0.01 },
  { name: "Milk", weight: -0.005 },
  { name: "Cheese", weight: -0.005 }
];

const baselineMultipliers = {
  male: { "18-29": 1.00, "30-49": 1.05, "50-64": 1.15, "65+": 1.30 },
  female: { "18-29": 0.95, "30-49": 1.00, "50-64": 1.10, "65+": 1.20 }
};

const countryMultipliers = {
  "World": 1.00,
  "Norway": 0.92,
  "USA": 1.15,
  "UK": 1.10,
  "Italy": 0.85,
  "Iran": 1.05
};

const presets = {
  healthy: [90, 300, 250, 100, 30, 50, 50, 20, 0, 50, 200, 40],
  western: [10, 100, 90, 30, 5, 10, 100, 80, 250, 200, 50, 60]
};

let chart = null;

function createSliders() {
  const container = document.getElementById("slidersContainer");
  container.innerHTML = "";
  foodGroups.forEach((group, index) => {
    const div = document.createElement("div");
    div.className = "slider-group";
    div.innerHTML = `
      <label>${group.name} (<span id="val-${index}">0</span> g)</label>
      <input type="range" min="0" max="300" value="0" step="1" id="slider-${index}">
    `;
    container.appendChild(div);
    document.getElementById(`slider-${index}`).oninput = function () {
      document.getElementById(`val-${index}`).innerText = this.value;
    };
  });
}

function applyPreset(type) {
  const values = presets[type];
  values.forEach((val, index) => {
    const slider = document.getElementById(`slider-${index}`);
    slider.value = val;
    document.getElementById(`val-${index}`).innerText = val;
  });
}

function getCountryMultiplier() {
  const selected = document.getElementById("countrySelect").value;
  return countryMultipliers[selected] || 1.0;
}

function calculateRisk() {
  let risk = 1.0;
  let values = [];

  foodGroups.forEach((group, index) => {
    const amount = parseFloat(document.getElementById(`slider-${index}`).value || 0);
    values.push(amount);
    risk += group.weight * amount / 100;
  });

  const sex = document.getElementById("sexSelect").value;
  const age = document.getElementById("ageSelect").value;
  const baseMult = baselineMultipliers[sex][age] || 1;
  const countryMult = getCountryMultiplier();

  const finalRisk = (risk * baseMult * countryMult).toFixed(2);
  document.getElementById("riskResult").innerText = finalRisk;

  renderChart(values);
}

function renderChart(values) {
  const ctx = document.getElementById("riskChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: foodGroups.map(f => f.name),
      datasets: [{
        label: "g per day",
        data: values,
        backgroundColor: "rgba(100, 149, 237, 0.6)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

document.getElementById("calculateBtn").onclick = calculateRisk;
window.onload = createSliders;
