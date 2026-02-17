export function getCurrencySymbol(currency) {
  return currency === "EUR" ? "€" : "$";
}

export function formatPrice(price, currency) {
  return `${price.toLocaleString("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ${getCurrencySymbol(currency)}`;
}

export function calculateVariation(current, previous) {
  if (previous === undefined) return null;

  const diff = ((current - previous) / previous) * 100;
  let arrow = "";
  let percent = "";
  let type = "neutral";

  if (current > previous) {
    arrow = '<span class="arrow up">↗</span>';
    percent = `<span class="percent up">+${diff.toFixed(2)}%</span>`;
    type = "up";
  } else if (current < previous) {
    arrow = '<span class="arrow down">↘</span>';
    percent = `<span class="percent down">${diff.toFixed(2)}%</span>`;
    type = "down";
  } else {
    arrow = '<span class="arrow neutral">—</span>';
  }

  return { arrow, percent, diff, type };
}

export function createCheckbox(crypto, onChange) {
  const label = document.createElement("label");
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `check-${crypto.symbol}`;
  checkbox.checked = true;
  checkbox.onchange = onChange;
  label.append(checkbox, `${crypto.name} (${crypto.symbol})`);
  return label;
}

export function showHistory(symbol, cryptos, history, currency) {
  const crypto = cryptos.find((c) => c.symbol === symbol);
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
        const variation = calculateVariation(entry.price, entry.prev);
        const variationText = variation
          ? `${variation.diff > 0 ? "+" : ""}${variation.diff.toFixed(2)}%`
          : "—";
        const variationClass = variation ? variation.type : "neutral";

        return `<tr>
          <td>${entry.date.toLocaleString("fr-FR")}</td>
          <td>${formatPrice(entry.price, currency)}</td>
          <td class="${variationClass}">${variationText}</td>
        </tr>`;
      })
      .join("");
  }

  panel.classList.remove("hidden");
}
