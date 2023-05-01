import React from "react";

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
  if (!currentResume) return;
  
  let count = 0;
  for (const resume of resumesArray) {
    if (!resume) continue;
    
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
  return days === 1 ? 'Yesterday' : `${days} days ago`;
};

export const formatCorrType = (corrType) => {
  switch (corrType) {
    case 'application follow-up':
      return 'Follow-up';
    case 'initial connection':
      return 'Connect'
    case 'informational interview':
      return 'Info interview'
    case 'thank you informational interview':
      return 'TY info interview'
    case 'thank you formal interview':
      return 'TY formal interview'
    case 'request feedback':
      return 'Feedback'
    case 'job offer follow-up':
      return 'Offer follow-up'
    case 'job offer accept':
      return 'Accept offer'
    case 'job offer decline':
      return 'Decline offer'
    case 'reconnection':
      return 'Reconnect'
    default:
      return 'Correspondence';
  }
}

export const formatSalary = (jobObject) => {
  switch (jobObject.job_salary_period) {
    case 'YEAR':
      return `${jobObject.job_min_salary / 1000}k–${jobObject.job_max_salary / 1000}k a year`;
    case 'HOUR':
      return `${jobObject.job_min_salary}–${jobObject.job_max_salary} an hour`
    default:
      return '';
  }
}

export const highlightBracketedWords = (text) => {
  const wrappedInBracketsRegex = /(\[[^\]]+\])/g;
  const parts = text.split(wrappedInBracketsRegex);

  return parts.map((part, index) => {
    if (part.match(wrappedInBracketsRegex)) {
      return (
        <span key={index} className="bracketed-highlight">
          {part}
        </span>
      );
    } else {
      return part;
    }
  });
};

// Format resume for website ------------

export const makeCapsWordsBold = (text) => {
  const allCapsRegex = /(\b[A-Z]{4,}(?:\s[A-Z]{4,})?\b)(?=\n|$)/g;
  const parts = text.split(allCapsRegex);

  return parts.map((part, index) => {
    if (part.match(allCapsRegex)) {
      return (
        <React.Fragment key={index}>
          <span className="res-section-header">{part}</span>
        </React.Fragment>
      );
    } else {
      return part;
    }
  });
};

export const joinWithLineBreaks = (elements) => {
  return elements.map((element, index) => {
    if (index < elements.length - 1) {
      return (
        <React.Fragment key={index}>
          {element}
          <br />
        </React.Fragment>
      );
    } else {
      return element;
    }
  });
};

export const highlightRevisions = (text) => {
  const revisionsStart = text.indexOf("REVISIONS");
    
  // If the revisions section does not exist, format the text and replace newlines with <br> elements
  if (revisionsStart === -1) {
    const formattedText = joinWithLineBreaks(makeCapsWordsBold(text));
    return formattedText;
  }
    
  const beforeRevisions = text.slice(0, revisionsStart);
  const revisionsEnd = text.indexOf("\n\n\n", revisionsStart);
  const revisionsSection = text.slice(revisionsStart, revisionsEnd);
  const afterRevisions = text.slice(revisionsEnd);

  return (
    <>
      {joinWithLineBreaks(makeCapsWordsBold(beforeRevisions))}
      <span className="revisions-highlight">{revisionsSection}</span>
      {joinWithLineBreaks(makeCapsWordsBold(afterRevisions))}
    </>
  );
};
// --------------------------------------------

// Format resume for Copy & Paste -------------
export const convertResumeTextToHtml = (text) => {
  const sectionKeywords = ['SKILLS', 'WORK EXPERIENCE', 'EDUCATION', 'PROJECTS', 'EXPERIENCE', 'TRAINING', 'CERTIFICATIONS', 'PUBLICATIONS', 'SUMMARY'];
  const sectionHeaderRegex = new RegExp(`(${sectionKeywords.join('|')})`);

  const sections = text.trim().split(/\n{2,}/g);
  const formattedSections = sections.map((section) => {
    const lines = section.trim().split(/\n/g);
    const formattedLines = lines.map((line, index) => {
      if (line.match(sectionHeaderRegex) && (index === 0 || index === lines.length - 1)) {
        // If this line is a section header and it's either the first or last line of the section, put it on a new line and make it bold
        const sectionHeader = line.match(sectionHeaderRegex)[0];
        const restOfLine = line.split(sectionHeader)[1];
        return `${index > 0 ? '<br>' : ''}<strong>${sectionHeader}</strong>${restOfLine}`;
      } else {
        return line;
      }
    });
    return formattedLines.join("<br>");
  });
  return formattedSections.join("<br><br>");
};
