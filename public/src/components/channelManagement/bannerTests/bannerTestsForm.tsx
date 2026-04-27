import { BannerTest } from '../../../models/banner';
import { FrontendSettingsType } from '../../../utils/requests';
import { TestsForm } from '../testsForm';
import { ValidatedTestEditor } from '../validatedTestEditor';
import BannerTestEditor from './bannerTestEditor';
import { getDefaultTest } from './utils/defaults';

const createDefaultBannerTest = (newTestName: string, newTestNickname: string): BannerTest => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const BannerTestsForm1 = TestsForm(
  ValidatedTestEditor(BannerTestEditor),
  FrontendSettingsType.bannerTests,
  createDefaultBannerTest,
);

export const BannerTestsForm2 = TestsForm(
  ValidatedTestEditor(BannerTestEditor),
  FrontendSettingsType.bannerTests2,
  createDefaultBannerTest,
);
