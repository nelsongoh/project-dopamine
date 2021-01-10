import EnglishContent from './en';

const Content = (langType) => {
  switch (langType) {
    case 'en':
      return EnglishContent;

    default:
      return EnglishContent;
  }
}

export default Content;