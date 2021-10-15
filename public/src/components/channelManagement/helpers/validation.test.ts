import { templateValidatorForPlatform } from './validation';

describe('templateValidatorForPlatform', () => {
  describe('When platform is a dotcom article', () => {
    const templateValidator = templateValidatorForPlatform('ARTICLE');

    it('should return true if no templates are present', () => {
      expect(templateValidator('Blah blah')).toBeTruthy();
    });

    it('should return true if a valid template is present', () => {
      expect(templateValidator('%%CURRENCY_SYMBOL%%')).toBeTruthy();
      expect(templateValidator('%%COUNTRY_NAME%%')).toBeTruthy();
      expect(templateValidator('%%ARTICLE_COUNT%%')).toBeTruthy();
    });

    it('should return an error message if template text is not valid', () => {
      expect(templateValidator('I am from %%COUNTRY_NAM%%')).toEqual(
        'Invalid template: %%COUNTRY_NAM%%',
      );
    });

    it('should return an error message if template tags are not valid', () => {
      expect(templateValidator('I am from %COUNTRY_NAME%%')).toEqual(
        'Invalid template: %COUNTRY_NAME%%',
      );
      expect(templateValidator('I am from %%COUNTRY_NAME%')).toEqual(
        'Invalid template: %%COUNTRY_NAME%',
      );
    });
  });

  describe('When platform is a dotcom liveblog', () => {
    const templateValidator = templateValidatorForPlatform('LIVEBLOG');

    it('should return true if no templates are present', () => {
      expect(templateValidator('Blah blah')).toBeTruthy();
    });

    it('should return true if a valid template is present', () => {
      expect(templateValidator('%%CURRENCY_SYMBOL%%')).toBeTruthy();
      expect(templateValidator('%%COUNTRY_NAME%%')).toBeTruthy();
      expect(templateValidator('%%ARTICLE_COUNT%%')).toBeTruthy();
    });

    it('should return an error message if template text is not valid', () => {
      expect(templateValidator('I am from %%COUNTRY_NAM%%')).toEqual(
        'Invalid template: %%COUNTRY_NAM%%',
      );
    });

    it('should return an error message if template tags are not valid', () => {
      expect(templateValidator('I am from %COUNTRY_NAME%%')).toEqual(
        'Invalid template: %COUNTRY_NAME%%',
      );
      expect(templateValidator('I am from %%COUNTRY_NAME%')).toEqual(
        'Invalid template: %%COUNTRY_NAME%',
      );
    });
  });

  describe('When platform is an AMP article', () => {
    const templateValidator = templateValidatorForPlatform('AMP');

    it('should return true if no templates are present', () => {
      expect(templateValidator('Blah blah')).toBeTruthy();
    });

    it('should return true if a valid template is present', () => {
      expect(templateValidator('%%CURRENCY_SYMBOL%%')).toBeTruthy();
      expect(templateValidator('%%COUNTRY_NAME%%')).toBeTruthy();
    });

    it('should return an error message if template is unsupported by platform', () => {
      expect(templateValidator('You have read %%ARTICLE_COUNT%%')).toEqual(
        'Invalid template: %%ARTICLE_COUNT%%',
      );
    });

    it('should return an error message if template text is not valid', () => {
      expect(templateValidator('I am from %%COUNTRY_NAM%%')).toEqual(
        'Invalid template: %%COUNTRY_NAM%%',
      );
    });

    it('should return an error message if template tags are not valid', () => {
      expect(templateValidator('I am from %COUNTRY_NAME%%')).toEqual(
        'Invalid template: %COUNTRY_NAME%%',
      );
      expect(templateValidator('I am from %%COUNTRY_NAME%')).toEqual(
        'Invalid template: %%COUNTRY_NAME%',
      );
    });
  });

  describe('When platform is an Apple News article', () => {
    const templateValidator = templateValidatorForPlatform('APPLE_NEWS');

    it('should return true if no templates are present', () => {
      expect(templateValidator('Blah blah')).toBeTruthy();
    });

    it('should return true if a valid template is present', () => {
      expect(templateValidator('%%CURRENCY_SYMBOL%%')).toBeTruthy();
    });

    it('should return an error message if template is unsupported by platform', () => {
      expect(templateValidator('You have read %%ARTICLE_COUNT%%')).toEqual(
        'Invalid template: %%ARTICLE_COUNT%%',
      );
      expect(templateValidator('I am from %%COUNTRY_NAME%%')).toEqual(
        'Invalid template: %%COUNTRY_NAME%%',
      );
    });

    it('should return an error message if template text is not valid', () => {
      expect(templateValidator('From as little as %%CURRENCY_SYMBO%%')).toEqual(
        'Invalid template: %%CURRENCY_SYMBO%%',
      );
    });

    it('should return an error message if template tags are not valid', () => {
      expect(templateValidator('From as little as %CURRENCY_SYMBOL%%')).toEqual(
        'Invalid template: %CURRENCY_SYMBOL%%',
      );
      expect(templateValidator('From as little as %%CURRENCY_SYMBOL%')).toEqual(
        'Invalid template: %%CURRENCY_SYMBOL%',
      );
    });
  });
});
