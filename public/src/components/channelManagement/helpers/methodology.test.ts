import { addMethodologyToTestName } from './methodology';
import { Methodology } from './shared';

describe('addMethodologyToTestName', () => {
  it('should add EpsilonGreedyBandit to name', () => {
    const methodology: Methodology = {
      name: 'EpsilonGreedyBandit',
      epsilon: 0.5,
    };
    expect(addMethodologyToTestName('MY_TEST', methodology)).toBe(
      'MY_TEST_EpsilonGreedyBandit-0.5',
    );
  });

  it('should add ABTest to name', () => {
    const methodology: Methodology = {
      name: 'ABTest',
    };
    expect(addMethodologyToTestName('MY_TEST', methodology)).toBe('MY_TEST_ABTest');
  });

  it('should add ABTest to name with regional suffix', () => {
    const methodology: Methodology = {
      name: 'ABTest',
    };
    expect(addMethodologyToTestName('MY_TEST__UK_AU', methodology)).toBe('MY_TEST_ABTest__UK_AU');
  });
});
