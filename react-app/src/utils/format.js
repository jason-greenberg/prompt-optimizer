export const capitalizeResumeTitle = (string) => {
  const output = []
  const arr = string?.split(' ')
  arr?.forEach(word => output.push(word[0]?.toUpperCase() + word.slice(1)?.toLowerCase()))
  return output.join(' ');
}

export const numberToRoman = (num) => {
  const romanNumerals = [
    ['M', 1000],
    ['CM', 900],
    ['D', 500],
    ['CD', 400],
    ['C', 100],
    ['XC', 90],
    ['L', 50],
    ['XL', 40],
    ['X', 10],
    ['IX', 9],
    ['V', 5],
    ['IV', 4],
    ['I', 1],
  ];
  let roman = '';
  for (const [numeral, value] of romanNumerals) {
    while (num >= value) {
      roman += numeral;
      num -= value;
    }
  }
  return roman;
}

export const getRomanIndex = (currentResume, resumesArray) => {
  let count = 0;
  for (const resume of resumesArray) {
    if (resume.position_type === currentResume.position_type) {
      count++;
      if (resume.id === currentResume.id) {
        break;
      }
    }
  }
  return count;
};
