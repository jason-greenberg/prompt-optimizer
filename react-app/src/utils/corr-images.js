import gmail from './assets/gmail.png'
import li from './assets/li-blue-icon.png'

export const correspondenceTypes = [
  'application follow-up',
  'initial connection',
  'informational interview',
  'thank you informational interview',
  'thank you formal interview',
  'request feedback',
  'job offer follow-up',
  'job offer accept',
  'job offer decline',
  'reconnection'
];


export const chooseIcon = (corrType) => {
  switch (corrType) {
    case 'application follow-up':
      return <img src={li} alt="li-icon" />;
    case 'initial connection':
      return <img src={li} alt="li-icon" />
    case 'informational interview':
      return <img src={li} alt="li-icon" />
    case 'thank you informational interview':
      return <img src={gmail} alt="gmail-icon" />
    case 'thank you formal interview':
      return <img src={gmail} alt="gmail-icon" />
    case 'request feedback':
      return <img src={gmail} alt="gmail-icon" />
    case 'job offer follow-up':
      return <img src={gmail} alt="gmail-icon" />
    case 'job offer accept':
      return <img src={gmail} alt="gmail-icon" />
    case 'job offer decline':
      return <img src={gmail} alt="gmail-icon" />
    case 'reconnection':
      return <img src={li} alt="li-icon" />
    default:
      return <img src={li} alt="li-icon" />
  }
}
