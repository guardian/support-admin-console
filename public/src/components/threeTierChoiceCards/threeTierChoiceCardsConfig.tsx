import {TestsForm} from "../channelManagement/testsForm";
import {ValidatedTestEditor} from "../channelManagement/validatedTestEditor";
import {FrontendSettingsType} from "../../utils/requests";
import ThreeTierChoiceCardsEditor from "./threeTierChoiceCardsEditor";
import {ThreeTierChoiceCards} from "../../models/threeTierChoiceCards";
import {getDefaultTest} from "./choiceCardDefaults";

const createDefaultThreeTierChoiceCards = (
  newTestName: string,
  newTestNickname: string,
): ThreeTierChoiceCards => ({
  ...getDefaultTest(),
  name: newTestName,
  nickname: newTestNickname,
});

export const ThreeTierChoiceCardsForm = TestsForm (
  ValidatedTestEditor(ThreeTierChoiceCardsEditor),
  FrontendSettingsType.threeTierChoiceCards,
  createDefaultThreeTierChoiceCards,
);
