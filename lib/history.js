export const createHistoryEvent = (type, details = {}) => ({ id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, timestamp: new Date().toISOString(), ...details });

export const historyDateLabel = (timestamp, now = new Date()) => {
  const date = new Date(timestamp);
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const days = Math.round((start - target) / 86400000);
  if (days === 0) return 'TODAY';
  if (days === 1) return 'YESTERDAY';
  return target.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: target.getFullYear() !== now.getFullYear() ? 'numeric' : undefined }).toUpperCase();
};
