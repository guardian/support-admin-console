import { MPARTICLE_LAST_SINGLE_CONTRIBUTION } from '../helpers/validation';

export const parseCopyForParagraphs = (copy: string[]): string =>
  copy.map((paragraph) => `<p>${paragraph}</p>`).join('');

export const getRteCopyLength = (copy: string[]): number => {
  let paragraphsCheck = copy.filter((paragraph) => paragraph).join('');

  paragraphsCheck = paragraphsCheck.replace(/<.*?>/g, '');
  paragraphsCheck = paragraphsCheck.replace(/%%CURRENCY_SYMBOL%%/g, ' ');
  paragraphsCheck = paragraphsCheck.replace(/%%ARTICLE_COUNT%%/g, '     ');
  paragraphsCheck = paragraphsCheck.replace(/%%COUNTRY_NAME%%/g, '          ');
  paragraphsCheck = paragraphsCheck.replace(
    new RegExp(MPARTICLE_LAST_SINGLE_CONTRIBUTION, 'g'),
    '    ',
  );

  return paragraphsCheck.length;
};

export const paragraphsToArray = (html: string): string[] => {
  const fragment = document.createElement('div');
  fragment.innerHTML = html;

  const editorContent = fragment.firstElementChild;
  const paragraphs = editorContent ? Array.from(editorContent.querySelectorAll('p')) : [];

  // When a paragraph contains only a <br> (ProseMirror trailing break), treat it as empty.
  return paragraphs.map((paragraph) => (paragraph.textContent === '' ? '' : paragraph.innerHTML));
};
