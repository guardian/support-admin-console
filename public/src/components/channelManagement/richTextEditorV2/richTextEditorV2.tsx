import 'prosekit/basic/style.css';
import 'prosekit/basic/typography.css';

import { defineBasicExtension } from 'prosekit/basic';
import { createEditor, type Editor } from 'prosekit/core';
import { defineReadonly } from 'prosekit/extensions/readonly';
import { ProseKit, useEditor, useEditorDerivedValue, useExtension } from 'prosekit/react';
import React, { useCallback, useMemo, useState } from 'react';
import {
  ARTICLE_COUNT_TEMPLATE,
  CAMPAIGN_DEADLINE_TEMPLATE,
  COUNTRY_NAME_TEMPLATE,
  CURRENCY_TEMPLATE,
  DATE,
  DAY_OF_THE_WEEK,
  PRICE_DIGISUB_ANNUAL,
  PRICE_DIGISUB_MONTHLY,
  PRICE_GUARDIANWEEKLY_ANNUAL,
  PRICE_GUARDIANWEEKLY_MONTHLY,
  PRICE_PRODUCT_WEEKLY,
} from '../helpers/validation';
import { MParticleTemplateMenu } from '../richTextEditor/mParticleTemplateMenu';
import { paragraphsToArrayV2, parseCopyForParagraphs } from '../richTextEditor/utils';
import { useRichTextEditorV2Styles } from './richTextEditorV2Styles';

interface RteMenuConstraints {
  enableHtml?: boolean;
  enableBold?: boolean;
  enableItalic?: boolean;
  enableCopyTemplates?: boolean;
  enableCurrencyTemplate?: boolean;
  enableCountryNameTemplate?: boolean;
  enableArticleCountTemplate?: boolean;
  enablePriceTemplates?: boolean;
  enableProductWeeklyTemplate?: boolean;
  enableDateTemplate?: boolean;
  enableDayTemplate?: boolean;
  enableCampaignDeadlineTemplate?: boolean;
  enableLink?: boolean;
  enableStrikethrough?: boolean;
  enableMParticleTemplates?: boolean;
}

interface RichTextEditorV2Props<T = string[]> {
  disabled: boolean;
  label?: string;
  helperText?: string;
  name?: string;
  error: boolean;
  updateCopy: (item?: T) => void;
  copyData?: T;
  rteMenuConstraints?: RteMenuConstraints;
}

type ProseKitEditor = ReturnType<typeof createEditor>;
type ProseKitExtension = ReturnType<typeof defineBasicExtension>;

const deriveToolbarState = (currentEditor: Editor<ProseKitExtension>) => ({
  bold: currentEditor.marks.bold.isActive(),
  italic: currentEditor.marks.italic.isActive(),
  strike: currentEditor.marks.strike.isActive(),
});

const useProseKitToolbarState = (editor: ProseKitEditor) => {
  return useEditorDerivedValue<
    ProseKitExtension,
    { bold: boolean; italic: boolean; strike: boolean }
  >(deriveToolbarState, { editor });
};

const RichTextMenuV2: React.FC<{
  disabled: boolean;
  label?: string;
  constraints: RteMenuConstraints;
}> = ({ disabled, label, constraints }) => {
  const classes = useRichTextEditorV2Styles();
  const editor = useEditor<ProseKitExtension>();
  const toolbarState = useProseKitToolbarState(editor);
  const [priceButtonsVisible, setPriceButtonsVisible] = useState(false);
  const {
    enableHtml,
    enableBold,
    enableItalic,
    enableStrikethrough,
    enableCopyTemplates,
    enableCurrencyTemplate,
    enableCountryNameTemplate,
    enableArticleCountTemplate,
    enablePriceTemplates,
    enableProductWeeklyTemplate,
    enableDateTemplate,
    enableDayTemplate,
    enableCampaignDeadlineTemplate,
    enableMParticleTemplates,
  } = constraints;
  const hasFormatting =
    (enableBold ?? false) || (enableItalic ?? false) || (enableStrikethrough ?? false);

  const insertTemplate = (template: string) => {
    editor.commands.insertText({ text: template });
  };

  const buttonProps = {
    type: 'button' as const,
    className: 'button',
    onMouseDown: (event: React.MouseEvent<HTMLButtonElement>) => event.preventDefault(),
  };

  return (
    <div className={classes.menuContainer}>
      <span className={classes.fieldLabel}>{label ?? 'Editable field'}</span>
      {!disabled && (
        <>
          {enableHtml && (
            <>
              {enableBold && (
                <button
                  {...buttonProps}
                  className={`${buttonProps.className} ${toolbarState.bold ? 'button-active' : ''}`}
                  onClick={() => editor.commands.toggleBold()}
                >
                  Bold
                </button>
              )}
              {enableItalic && (
                <button
                  {...buttonProps}
                  className={`${buttonProps.className} ${toolbarState.italic ? 'button-active' : ''}`}
                  onClick={() => editor.commands.toggleItalic()}
                >
                  Italic
                </button>
              )}
              {enableStrikethrough && (
                <button
                  {...buttonProps}
                  className={`${buttonProps.className} ${toolbarState.strike ? 'button-active' : ''}`}
                  onClick={() => editor.commands.toggleStrike()}
                >
                  Strikethrough
                </button>
              )}
            </>
          )}
          {enableCopyTemplates && (
            <>
              {hasFormatting && <span className={classes.buttonSpacer}>&nbsp;</span>}
              {enableArticleCountTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(ARTICLE_COUNT_TEMPLATE)}>
                  Articles
                </button>
              )}
              {enableCampaignDeadlineTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(CAMPAIGN_DEADLINE_TEMPLATE)}>
                  Countdown Deadline
                </button>
              )}
              {enableCurrencyTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(CURRENCY_TEMPLATE)}>
                  Currency
                </button>
              )}
              {enableCountryNameTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(COUNTRY_NAME_TEMPLATE)}>
                  Country
                </button>
              )}
              {enableDayTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(DAY_OF_THE_WEEK)}>
                  Day of week
                </button>
              )}
              {enableDateTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(DATE)}>
                  Date
                </button>
              )}
              {enableMParticleTemplates && (
                <MParticleTemplateMenu insertTemplate={insertTemplate} />
              )}
              {enableProductWeeklyTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(PRICE_PRODUCT_WEEKLY)}>
                  Product weekly price
                </button>
              )}
              {enablePriceTemplates && (
                <>
                  <span className={classes.buttonSpacer}>&nbsp;</span>
                  <button
                    {...buttonProps}
                    onClick={() => setPriceButtonsVisible((visible) => !visible)}
                  >
                    {priceButtonsVisible ? 'Prices ↑' : 'Prices ↓'}
                  </button>
                  {priceButtonsVisible && (
                    <>
                      <button
                        {...buttonProps}
                        onClick={() => insertTemplate(PRICE_DIGISUB_MONTHLY)}
                      >
                        Digisub monthly
                      </button>
                      <button {...buttonProps} onClick={() => insertTemplate(PRICE_DIGISUB_ANNUAL)}>
                        Digisub annual
                      </button>
                      <button
                        {...buttonProps}
                        onClick={() => insertTemplate(PRICE_GUARDIANWEEKLY_MONTHLY)}
                      >
                        GW monthly
                      </button>
                      <button
                        {...buttonProps}
                        onClick={() => insertTemplate(PRICE_GUARDIANWEEKLY_ANNUAL)}
                      >
                        GW annual
                      </button>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const RichTextEditorV2Content: React.FC<RichTextEditorV2Props & { editor: ProseKitEditor }> = ({
  disabled,
  editor,
  label,
  name,
  error,
  helperText,
  updateCopy,
  rteMenuConstraints,
}) => {
  const classes = useRichTextEditorV2Styles();
  const readonlyExtension = useMemo(() => (disabled ? defineReadonly() : null), [disabled]);
  useExtension(readonlyExtension);

  const save = () => {
    if (rteMenuConstraints?.enableHtml) {
      updateCopy(paragraphsToArrayV2(editor.getDocHTML()));
      return;
    } else {
      updateCopy(
        Array.from(
          { length: editor.state.doc.childCount },
          (_, index) => editor.state.doc.child(index).textContent,
        ),
      );
    }
  };

  const mountEditor = useCallback(
    (element: HTMLDivElement | null) => {
      if (element) {
        editor.mount(element);
      } else {
        editor.unmount();
      }
    },
    [editor],
  );

  // Control the look of the editor dependant on whether the user is in Edit or Read-Only Mode
  const wrapperClasses = disabled ? 'prosekit-theme editor-disabled' : 'prosekit-theme';

  return (
    <div className={classes.prosekitCustom}>
      <RichTextMenuV2 disabled={disabled} label={label} constraints={rteMenuConstraints ?? {}} />
      <div id={name ? `RTE-${name}` : undefined} className={wrapperClasses}>
        <div
          ref={mountEditor}
          className={`${classes.editorWrapper} ProseMirror`}
          aria-readonly={disabled}
          onBlur={save}
        />
      </div>
      {helperText && <p className={error ? classes.errorText : classes.helperText}>{helperText}</p>}
    </div>
  );
};

const RichTextEditorV2: React.FC<RichTextEditorV2Props> = ({ copyData = [], ...props }) => {
  const [initialContent] = useState(() => parseCopyForParagraphs(copyData));
  const editor = useMemo(
    () =>
      createEditor({
        extension: defineBasicExtension(),
        defaultContent: initialContent,
      }),
    [initialContent],
  );

  return (
    <ProseKit editor={editor}>
      <RichTextEditorV2Content {...props} copyData={copyData} editor={editor} />
    </ProseKit>
  );
};

const RichTextEditorV2SingleLine: React.FC<RichTextEditorV2Props<string>> = ({
  copyData,
  updateCopy,
  ...props
}) => {
  const onUpdate = (paras?: string[]): void => {
    if (paras) {
      updateCopy(paras.join(' '));
    } else {
      updateCopy(undefined);
    }
  };

  return (
    <RichTextEditorV2
      {...props}
      updateCopy={onUpdate}
      copyData={copyData ? [copyData] : undefined}
    />
  );
};

export { RichTextEditorV2, RichTextEditorV2Props, RichTextEditorV2SingleLine };
