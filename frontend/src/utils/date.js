/**
 * Helper to get the next 7 days list for booking.
 * @returns {Array} List of date objects.
 */
export const getNextSevenDays = () => {
  const dates = [];
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      dayName: days[d.getDay()],
      dayNum: d.getDate(),
      month: months[d.getMonth()],
      fullDateString: d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
      isoString: d.toISOString().split('T')[0]
    });
  }
  return dates;
};
