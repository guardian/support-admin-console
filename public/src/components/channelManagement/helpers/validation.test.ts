import { invalidTemplateValidator } from './validation';

describe('invalidTemplateValidator', () => {
  it('should return true if no templates are present', () => {
    expect(invalidTemplateValidator('Blah blah')).toBeTruthy();
  });

  it('should return true if a valid template is present', () => {
    expect(invalidTemplateValidator('%%CURRENCY_SYMBOL%%')).toBeTruthy();
    expect(invalidTemplateValidator('%%COUNTRY_NAME%%')).toBeTruthy();
    expect(invalidTemplateValidator('%%ARTICLE_COUNT%%')).toBeTruthy();
  });

  it('should return an error message if template text is not valid', () => {
    expect(invalidTemplateValidator('I am from %%COUNTRY_NAM%%')).toEqual(
      'Invalid template: %%COUNTRY_NAM%%',
    );
  });

  it('should return an error message if template tags are not valid', () => {
    expect(invalidTemplateValidator('I am from %COUNTRY_NAME%%')).toEqual(
      'Invalid template: %COUNTRY_NAME%%',
    );
    expect(invalidTemplateValidator('I am from %%COUNTRY_NAME%')).toEqual(
      'Invalid template: %%COUNTRY_NAME%',
    );
  });
});
