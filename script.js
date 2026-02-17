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

function getCurrencySymbol() {
  return currentCurrency === "EUR" ? "€" : "$";
}

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
      <td><button class="history-btn" onclick="showHistory('${c.symbol}')">Historique</button></td>
    </tr>`,
    )
    .join("");
}

async function updatePrices() {
  const tbody = document.getElementById("cryptoTable");
  const rows = tbody.querySelectorAll("tr[data-symbol]");

  if (!rows.length) return;

  rows.forEach(async (row) => {
    const symbol = row.dataset.symbol;

    try {
      const res = await fetch(
        `https://api.coinbase.com/v2/prices/${symbol}-${currentCurrency}/buy`,
      );
      const price = parseFloat((await res.json()).data.amount);
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

      let arrow = "";
      let percent = "";

      if (prev !== undefined) {
        if (price > prev) {
          arrow = '<span class="arrow up">↗</span>';
          percent = `<span class="percent up">+${(((price - prev) / prev) * 100).toFixed(2)}%</span>`;
        } else if (price < prev) {
          arrow = '<span class="arrow down">↘</span>';
          percent = `<span class="percent down">${(((price - prev) / prev) * 100).toFixed(2)}%</span>`;
        } else {
          arrow = '<span class="arrow neutral">—</span>';
        }
      }

      previousPrices[symbol] = price;

      const prevPriceDisplay =
        prev !== undefined
          ? `${prev.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${getCurrencySymbol()}`
          : "—";

      row.children[1].textContent = prevPriceDisplay;
      row.children[1].className = "prev-price";
      row.children[2].textContent = `${price.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${getCurrencySymbol()}`;
      row.children[2].className = "price";
      row.children[3].innerHTML = arrow + percent;
      row.children[3].className = "graph";
    } catch {
      row.children[2].textContent = "Erreur";
      row.children[2].className = "error";
    }
  });
}

function showHistory(symbol) {
  const crypto = CRYPTOS.find((c) => c.symbol === symbol);
  const panel = document.getElementById("historyPanel");
  const title = document.getElementById("historyTitle");
  const tbody = document.getElementById("historyTable");

  title.textContent = `Historique - ${crypto.name} (${symbol})`;

  if (!history[symbol] || history[symbol].length === 0) {
    tbody.innerHTML =
      '<tr><td colspan="3" class="loading">Aucun historique disponible</td></tr>';
  } else {
    tbody.innerHTML = history[symbol]
      .slice()
      .reverse()
      .map((entry) => {
        let variation = "—";
        let variationClass = "neutral";

        if (entry.prev !== undefined) {
          const diff = ((entry.price - entry.prev) / entry.prev) * 100;
          if (diff > 0) {
            variation = `+${diff.toFixed(2)}%`;
            variationClass = "up";
          } else if (diff < 0) {
            variation = `${diff.toFixed(2)}%`;
            variationClass = "down";
          } else {
            variation = "0%";
          }
        }

        return `<tr>
          <td>${entry.date.toLocaleString("fr-FR")}</td>
          <td>${entry.price.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${getCurrencySymbol()}</td>
          <td class="${variationClass}">${variation}</td>
        </tr>`;
      })
      .join("");
  }

  panel.classList.remove("hidden");
}

document.getElementById("closeHistory").onclick = () => {
  document.getElementById("historyPanel").classList.add("hidden");
};

function createCheckbox(crypto) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `check-${crypto.symbol}`;
  checkbox.checked = true;
  checkbox.onchange = () => {
    initTable();
    updatePrices();
  };
  label.append(checkbox, `${crypto.name} (${crypto.symbol})`);
  return label;
}

CRYPTOS.forEach((c) => {
  checkboxes.append(createCheckbox(c));
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

  try {
    const res = await fetch(
      `https://api.coinbase.com/v2/prices/${symbol}-${currentCurrency}/buy`,
    );
    if (!res.ok) throw new Error();

    const newCrypto = { name: symbol, symbol: symbol };
    CRYPTOS.push(newCrypto);
    checkboxes.append(createCheckbox(newCrypto));
    input.value = "";
    initTable();
    updatePrices();
  } catch {
    alert("Crypto non reconnue par l'API");
  }
};

initTable();
updatePrices();
setInterval(updatePrices, 3000);
