export const numbersOnlyParser = (value: string) => value.replace(/[^0-9]/g, '');

export const numbersAndLettersParser = (mask: string) => {
  const regexp = (char: string): RegExp => {
    if (char === '9' || char === '0') return /\d/;
    if (char === 'D') return /\w/;
    if (char === '-') return /-/;
    throw new Error('Unexpected character in mask.');
  };
  return (value: string) =>
    mask.split('').reduce((result, letter, i) => {
      if (value.charAt(i).match(regexp(letter))) return result + value.charAt(i);
      return result;
    }, '');
};
