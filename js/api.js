export async function fetchPrice(symbol, currency) {
  const res = await fetch(
    `https://api.coinbase.com/v2/prices/${symbol}-${currency}/buy`,
  );
  if (!res.ok) throw new Error("Crypto non reconnue");
  const data = await res.json();
  return parseFloat(data.data.amount);
}

export async function verifyCrypto(symbol, currency) {
  try {
    await fetchPrice(symbol, currency);
    return true;
  } catch {
    return false;
  }
}
