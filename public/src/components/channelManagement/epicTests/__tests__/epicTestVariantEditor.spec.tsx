import {getInvalidTemplateError} from "../../helpers/copyTemplates";

describe('maxViewsEditor tests', () => {
  describe('getInvalidTemplateError tests', () => {
    it('should return null if no templates', () => {
      expect(getInvalidTemplateError('Blah blah')).toEqual(null)
    });

    it('should return null if template is ok', () => {
      expect(getInvalidTemplateError('I am from %%COUNTRY_NAME%%')).toEqual(null)
    });

    it('should return an error message if template is not ok', () => {
      expect(getInvalidTemplateError('I am from %%COUNTRY_NAM%%'))
        .toEqual('Invalid template: %%COUNTRY_NAM%%')
    });
  })
});
