import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ChoiceCard } from '../../../models/choiceCards';
import ChoiceCardsEditor from './ChoiceCardsEditor';

jest.mock('./ChoiceCardEditor', () => ({
  ChoiceCardEditor: () => null,
}));

const makeChoiceCard = (isDefault: boolean): ChoiceCard => ({
  product: { supportTier: 'Contribution', ratePlan: 'Monthly' },
  label: '',
  benefits: [],
  isDefault,
});

const renderEditor = (choiceCards: ChoiceCard[]): string =>
  renderToStaticMarkup(
    React.createElement(ChoiceCardsEditor, {
      showChoiceCards: true,
      channel: 'epic',
      allowNoChoiceCards: true,
      choiceCardsSettings: { choiceCards },
      updateChoiceCardsSettings: () => undefined,
      isDisabled: false,
      onValidationChange: () => undefined,
    }),
  );

describe('ChoiceCardsEditor no-default warning', () => {
  it('shows a prominent warning when no custom choice card is selected by default', () => {
    const markup = renderEditor([makeChoiceCard(false), makeChoiceCard(false)]);

    expect(markup).toContain('MuiAlert-filledWarning');
    expect(markup).toContain('Warning: no default choice card.');
    expect(markup).toContain('No choice card will be selected by default for users.');
  });

  it('does not show the warning when a custom choice card is selected by default', () => {
    const markup = renderEditor([makeChoiceCard(true), makeChoiceCard(false)]);

    expect(markup).not.toContain('Warning: no default choice card.');
  });
});
