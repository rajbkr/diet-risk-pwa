const foodTranslations = {'en': ['Whole grains', 'Vegetables', 'Fruits', 'Legumes', 'Nuts and seeds', 'Fish', 'Red meat', 'Processed meat', 'Sugar-sweetened beverages', 'Refined grains', 'Milk', 'Cheese'], 'no': ['Fullkorn', 'Grønnsaker', 'Frukt', 'Belgfrukter', 'Nøtter og frø', 'Fisk', 'Rødt kjøtt', 'Bearbeidet kjøtt', 'Sukkerholdige drikker', 'Raffinerte kornprodukter', 'Melk', 'Ost'], 'it': ['Cereali integrali', 'Verdure', 'Frutta', 'Legumi', 'Noci e semi', 'Pesce', 'Carne rossa', 'Carne lavorata', 'Bevande zuccherate', 'Cereali raffinati', 'Latte', 'Formaggio']};

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

const countryMultipliers = {
  "World": 1.0,
  "Norway": 0.92,
  "USA": 1.15,
  "UK": 1.1,
  "Italy": 0.85,
  "Iran": 1.05
};

;


function updateLanguage() {
  const lang = document.getElementById("langSelect").value;
  const t = translations[lang];
  document.getElementById("appTitle").innerText = t.title;

  // Update the dropdown labels (using parent elements)
  const sexLabel = document.getElementById("sexSelect").parentElement;
  sexLabel.childNodes[0].textContent = t.sex + ": ";

  const ageLabel = document.getElementById("ageSelect").parentElement;
  ageLabel.childNodes[0].textContent = t.age + ": ";

  const countryLabel = document.getElementById("countrySelect").parentElement;
  countryLabel.childNodes[0].textContent = t.country + ": ";

  document.querySelector("h3").innerText = t.results;
  document.getElementById("calculateBtn").innerText = t.calculate;
  document.querySelector("p strong").previousSibling.textContent = t.totalRisk + " ";

  // Rebuild sliders and preserve values
  const values = [];
  for (let i = 0; i < foodGroups.length; i++) {
    const val = document.getElementById(`slider-${i}`)?.value || "0";
    values.push(parseInt(val));
  }
  createSliders();
  values.forEach((val, i) => {
    const slider = document.getElementById(`slider-${i}`);
    if (slider) {
      slider.value = val;
      document.getElementById(`val-${i}`).innerText = val;
    }
  });
}
document.getElementById("langSelect").onchange = updateLanguage;
window.addEventListener("load", updateLanguage);


function createSliders() {
  const lang = document.getElementById("langSelect").value || "en";
  const names = foodTranslations[lang] || foodGroups.map(f => f.name);
  const container = document.getElementById("slidersContainer");
  container.innerHTML = "";
  foodGroups.forEach((group, index) => {
    const div = document.createElement("div");
    div.className = "slider-group";
    div.innerHTML = `
      <label id="label-${index}">${names[index]} (<span id="val-${index}">0</span> g)</label>
      <input type="range" min="0" max="200" value="0" step="1" id="slider-${index}">
    `;
    container.appendChild(div);
    document.getElementById(`slider-${index}`).oninput = function () {
      document.getElementById(`val-${index}`).innerText = this.value;
    };
  });
}
