import { Methodology } from './shared';

export const addMethodologyToTestName = (testName: string, methodology: Methodology): string => {
  // Handle the regional suffix, e.g. MY_TEST__UK becomes MY_TEST_ABTest__UK
  const [firstPart, secondPart] = testName.split('__');
  const suffix = secondPart ? `__${secondPart}` : '';
  if (methodology.name === 'EpsilonGreedyBandit') {
    return `${firstPart}_EpsilonGreedyBandit-${methodology.epsilon}${suffix}`;
  } else {
    return `${firstPart}_ABTest${suffix}`;
  }
};
