export const standardizePhoneNumber = (value: string) => {
  const phone = value.replace(/\D/gi, '');

  console.log('Номер был: ', value, ', стал: ', phone);

  if (phone.startsWith('7')) {
    return phone;
  }

  if (phone.startsWith('+7')) {
    return phone.replace('+7', '7');
  }

  if (phone.startsWith('8')) {
    return phone.replace('8', '7');
  }

  if (phone.startsWith('9') && phone.length === 10) {
    return `7${phone}`;
  }

  return phone;
};
