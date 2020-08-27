export const currencyTemplate = "%%CURRENCY_SYMBOL%%";
export const countryNameTemplate = "%%COUNTRY_NAME%%";
export const articleCountTemplate = "%%ARTICLE_COUNT%%";

const validTemplates = [currencyTemplate, countryNameTemplate, articleCountTemplate];

export const getInvalidTemplateError = (text: string): string | null => {
  const templates: string[] | null = text.match(/%%[A-Za-z_]*%%/g);

  if (templates !== null) {
    const invalidTemplate: string | undefined =
      templates.find(template => !validTemplates.includes(template));
    if (invalidTemplate) return `Invalid template: ${invalidTemplate}`;
    else return null;
  } else {
    return null
  }
};
