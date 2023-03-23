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

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const currentDate = new Date();
  const seconds = Math.floor((currentDate - date) / 1000);

  if (seconds < 60) {
    return seconds <= 1 ? 'a few seconds ago' : `${seconds} seconds ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? 'a minute ago' : `${minutes} minutes ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? 'an hour ago' : `${hours} hours ago`;
  }

  const days = Math.floor(hours / 24);
  return days === 1 ? 'a day ago' : `${days} days ago`;
};

