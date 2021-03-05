export const numbersOnlyParser = (value: string) => value.replace(/[^0-9]/g, '');

export const numbersAndLettersParser = (mask: string, padWithZeros?: boolean) => {
  const regexp = (char: string): RegExp => {
    if (char === '9' || char === '0') return /\d/;
    if (char === 'D') return /\w/;
    throw new Error(`Unexpected character in mask: ${char}`);
  };
  return (value: string) =>
    mask.split('').reduce(
      (result, letter, i, arr) => {
        const regex = letter === '-' ? regexp(arr[i + 1]) : regexp(letter);
        if (value.charAt(i).match(regex)) return result + value.charAt(i);
        return result;
      },
      padWithZeros ? '0'.repeat(mask.length - value.length - (mask.match(/-/g) ?? []).length) : ''
    );
};
