export const cpfMask = '000.000.000-00';
export const cpfFormatter = (value: string = '') => {
  return value.split('').reduce((result, digit, index) => {
    if (index === 3 || index === 6) return `${result}.${digit}`;
    if (index === 9) return `${result}-${digit}`;
    return `${result}${digit}`;
  }, '');
};

export const cnpjMask = '00.000.000/0000-00';
export const cnpjFormatter = (value: string = '') => {
  return value.split('').reduce((result, digit, index) => {
    if (index === 2 || index === 5) return `${result}.${digit}`;
    if (index === 8) return `${result}/${digit}`;
    if (index === 12) return `${result}-${digit}`;
    return `${result}${digit}`;
  }, '');
};

export const birthdayMask = '00/00/0000';
export const birthdayFormatter = (value: string = '') => {
  return value.split('').reduce((result, digit, index) => {
    if (index === 2 || index === 4) return `${result}/${digit}`;
    return `${result}${digit}`;
  }, '');
};

export const dateMask = '00/00';
export const dateFormatter = (value: string = '') => {
  return value.split('').reduce((result, digit, index) => {
    if (index === 2) return `${result}/${digit}`;
    return `${result}${digit}`;
  }, '');
};

export const hyphenFormatter = (hyphenLocation: number) => (value: string | undefined) => {
  if (!value) return '';
  if (hyphenLocation < 0) return value;
  if (value.length <= hyphenLocation) return value;
  return [value.slice(0, hyphenLocation), value.slice(hyphenLocation)].join('-');
};

export const cepMask = '00000-000';
export const cepFormatter = hyphenFormatter(5);

export const phoneMask = '(11) 99999-9999';
export const phoneFormatter = (value: string | undefined | null) => {
  let formatedNumber = '';
  if (value) {
    const ddd = value.slice(0, 2);
    const firstPart = value.slice(2, 7);
    const secondPart = value.slice(7, 11);
    if (secondPart === '' && firstPart !== '') {
      formatedNumber = `(${ddd}) ${firstPart}`;
    } else if (secondPart === '' && firstPart === '') {
      formatedNumber = `(${ddd}`;
    } else {
      formatedNumber = `(${ddd}) ${firstPart}-${secondPart}`;
    }
  }
  return formatedNumber;
};

export const cardMask = '0000 0000 0000 0000';
export const cardFormatter = (value: string = '') => {
  const regex = /^(\d{0,4})(\d{0,4})(\d{0,4})(\d{0,4})$/g;
  const onlyNumbers = value.replace(/[^\d]/g, '');

  return onlyNumbers.replace(regex, (regex, $1, $2, $3, $4) =>
    [$1, $2, $3, $4].filter((group) => !!group).join(' ')
  );
};
