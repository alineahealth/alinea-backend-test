export const parseDateString = (value: string): Date | undefined => {
  const [day, month, year] = value.split("/").map(Number);

  if (
    !value ||
    isNaN(day) ||
    isNaN(month) ||
    isNaN(year) ||
    day <= 0 ||
    month <= 0 ||
    year <= 0 ||
    month > 12 ||
    day > getDaysInMonth(year, month)
  ) {
    return undefined;
  }

  const date = new Date(year, month - 1, day);

  return date;
};

const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month, 0).getDate();
};

// TODO - Fix to save date correctly
export const forceParseDateString = (value: string): Date => {
  const [day, month, year] = value.split("/").map(Number);
  return new Date(year, month - 1, day);
};

export const calculateAge = (utcDateString: string) => {
  const currentDate = new Date();
  const birthDate = new Date(utcDateString);
  let age = currentDate.getFullYear() - birthDate.getFullYear();
  if (
    currentDate.getMonth() < birthDate.getMonth() ||
    (currentDate.getMonth() === birthDate.getMonth() &&
      currentDate.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};
