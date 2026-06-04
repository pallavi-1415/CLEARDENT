/**
 * Helper to convert time string like "9:00 AM" to minutes since midnight.
 * @param {string} timeStr 
 * @returns {number} Minutes since midnight.
 */
export const timeToMinutes = (timeStr) => {
  const [time, period] = timeStr.split(' ');
  const [h, m] = time.split(':').map(Number);
  let hour = h % 12;
  if (period === 'PM') hour += 12;
  return hour * 60 + m;
};
