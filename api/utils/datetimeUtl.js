const timeStringToMinutes = (time) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getTodayDDMMYYStr = () => {
  const today = new Date();
  return `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;
};

export default { timeStringToMinutes, getTodayDDMMYYStr };
