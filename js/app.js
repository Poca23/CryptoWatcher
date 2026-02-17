import { fetchPrice, verifyCrypto } from "./api.js";
import {
  getCurrencySymbol,
  formatPrice,
  calculateVariation,
  createCheckbox,
  showHistory,
} from "./ui.js";

const CRYPTOS = [
  { name: "Bitcoin", symbol: "BTC" },
  { name: "Ethereum", symbol: "ETH" },
  { name: "Cardano", symbol: "ADA" },
  { name: "Polkadot", symbol: "DOT" },
  { name: "Cronos", symbol: "CRO" },
  { name: "Polygon", symbol: "MATIC" },
];

let previousPrices = {};
let currentCurrency = "EUR";
let history = {};

function initTable() {
  const tbody = document.getElementById("cryptoTable");
  const selected = CRYPTOS.filter(
    (c) => document.getElementById(`check-${c.symbol}`)?.checked,
  );

  if (!selected.length) {
    tbody.innerHTML =
      '<tr><td colspan="5" class="loading">Sélectionnez au moins une crypto</td></tr>';
    return;
  }

  tbody.innerHTML = selected
    .map(
      (c) => `<tr data-symbol="${c.symbol}">
      <td><strong>${c.name}</strong> (${c.symbol})</td>
      <td class="prev-price">—</td>
      <td class="price">Chargement...</td>
      <td class="graph"></td>
      <td><button class="history-btn" data-symbol="${c.symbol}">Historique</button></td>
    </tr>`,
    )
    .join("");

  tbody.querySelectorAll(".history-btn").forEach((btn) => {
    btn.onclick = () =>
      showHistory(btn.dataset.symbol, CRYPTOS, history, currentCurrency);
  });
}

async function updatePrices() {
  const tbody = document.getElementById("cryptoTable");
  const rows = tbody.querySelectorAll("tr[data-symbol]");

  if (!rows.length) return;

  rows.forEach(async (row) => {
    const symbol = row.dataset.symbol;

    try {
      const price = await fetchPrice(symbol, currentCurrency);
      const prev = previousPrices[symbol];

      if (!history[symbol]) history[symbol] = [];

      history[symbol].push({
        date: new Date(),
        price: price,
        prev: prev,
      });

      if (history[symbol].length > 10) {
        history[symbol].shift();
      }

      const variation = calculateVariation(price, prev);

      previousPrices[symbol] = price;

      const prevPriceDisplay =
        prev !== undefined ? formatPrice(prev, currentCurrency) : "—";

      row.children[1].textContent = prevPriceDisplay;
      row.children[1].className = "prev-price";
      row.children[2].textContent = formatPrice(price, currentCurrency);
      row.children[2].className = "price";
      row.children[3].innerHTML = variation
        ? variation.arrow + variation.percent
        : "";
      row.children[3].className = "graph";
    } catch {
      row.children[2].textContent = "Erreur";
      row.children[2].className = "error";
    }
  });
}

CRYPTOS.forEach((c) => {
  checkboxes.append(
    createCheckbox(c, () => {
      initTable();
      updatePrices();
    }),
  );
});

document.querySelectorAll('input[name="currency"]').forEach((radio) => {
  radio.onchange = () => {
    currentCurrency = radio.value;
    previousPrices = {};
    history = {};
    initTable();
    updatePrices();
  };
});

document.getElementById("addBtn").onclick = async () => {
  const input = document.getElementById("newCrypto");
  const symbol = input.value.trim().toUpperCase();

  if (!symbol) return;

  if (CRYPTOS.find((c) => c.symbol === symbol)) {
    alert("Cette crypto existe déjà");
    return;
  }

  const isValid = await verifyCrypto(symbol, currentCurrency);

  if (isValid) {
    const newCrypto = { name: symbol, symbol: symbol };
    CRYPTOS.push(newCrypto);
    checkboxes.append(
      createCheckbox(newCrypto, () => {
        initTable();
        updatePrices();
      }),
    );
    input.value = "";
    initTable();
    updatePrices();
  } else {
    alert("Crypto non reconnue par l'API");
  }
};

document.getElementById("closeHistory").onclick = () => {
  document.getElementById("historyPanel").classList.add("hidden");
};

initTable();
updatePrices();
setInterval(updatePrices, 3000);
