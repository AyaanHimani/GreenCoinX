let hydrogenQty = 0;
let powerConsumption = 0;

export let lastIotData = null;

export function generateIotData() {
  const incrementHydrogen = Math.floor(Math.random() * 10) + 5;   // +5–15 kg
  const incrementPower = Math.floor(Math.random() * 50) + 20;     // +20–70 kWh

  hydrogenQty += incrementHydrogen;
  powerConsumption += incrementPower;

  const purity = (Math.random() * 0.5 + 99.5).toFixed(2);
  const renewableShare = (Math.random() * 10 + 90).toFixed(2);
  const powerFromRenewable = ((renewableShare / 100) * powerConsumption).toFixed(2);

  lastIotData = {
    hydrogenQty,
    purity,
    renewableShare,
    powerConsumption,
    powerFromRenewable,
    timestamp: new Date()
  };

  return lastIotData;
}

export function resetIotBatch() {
  hydrogenQty = 0;
  powerConsumption = 0;
  lastIotData = null;
}
