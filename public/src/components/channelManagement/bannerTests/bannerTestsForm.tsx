import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { getDefaultTest } from './utils/defaults';
import { BannerTest } from '../../../models/banner';
import BannerTestEditor from './bannerTestEditor';

const createDefaultBannerTest = (minArticles: number) => (
  newTestName: string,
  newTestNickname: string,
): BannerTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
  minArticlesBeforeShowingBanner: minArticles,
});

export const BannerTestsForm1 = TestsForm(
  BannerTestEditor,
  FrontendSettingsType.bannerTests,
  createDefaultBannerTest(2),
);

export const BannerTestsForm2 = TestsForm(
  BannerTestEditor,
  FrontendSettingsType.bannerTests2,
  createDefaultBannerTest(4),
);
