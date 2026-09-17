import 'prosekit/basic/style.css';
import 'prosekit/basic/typography.css';

import { Plugin, TextSelection } from '@prosekit/pm/state';
import { defineBasicExtension } from 'prosekit/basic';
import { createEditor, definePlugin, type Editor, union } from 'prosekit/core';
import { defineReadonly } from 'prosekit/extensions/readonly';
import { ProseKit, useEditor, useEditorDerivedValue, useExtension } from 'prosekit/react';
import {
  InlinePopoverPopup,
  InlinePopoverPositioner,
  InlinePopoverRoot,
} from 'prosekit/react/inline-popover';
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
import { MParticleTemplateMenu } from './mParticleTemplateMenu';
import { useRTEStyles } from './richTextEditorStyles';
import { getRteCopyLength, paragraphsToArray, parseCopyForParagraphs } from './utils';

export interface RichTextEditorProps<T = string[]> {
  disabled: boolean;
  label?: string;
  helperText?: string;
  name?: string;
  error: boolean;
  updateCopy: (item?: T) => void;
  copyData?: T;
  rteMenuConstraints?: RteMenuConstraints;
}

export interface RteMenuConstraints {
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

type ProseKitEditor = ReturnType<typeof createEditor>;
type ProseKitExtension = ReturnType<typeof defineBasicExtension>;
type LinkMarkAttrs = {
  href?: string | null;
  target?: string | null;
  rel?: string | null;
};

const removePastedHtmlExtension = definePlugin(
  () =>
    new Plugin({
      props: {
        transformPastedHTML: (html) => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const paragraphs = Array.from(doc.getElementsByTagName('p'));

          if (paragraphs.length > 0) {
            return paragraphs.map((paragraph) => `<p>${paragraph.textContent}</p>`).join(' ');
          }

          return doc.body.textContent || '';
        },
      },
    }),
);

const deriveToolbarState = (currentEditor: Editor<ProseKitExtension>) => ({
  bold: currentEditor.marks.bold.isActive(),
  italic: currentEditor.marks.italic.isActive(),
  strike: currentEditor.marks.strike.isActive(),
  link: currentEditor.marks.link.isActive(),
});

const useProseKitToolbarState = (editor: ProseKitEditor) => {
  return useEditorDerivedValue<
    ProseKitExtension,
    { bold: boolean; italic: boolean; strike: boolean; link: boolean }
  >(deriveToolbarState, { editor });
};

const FloatingLinkToolbar: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  const classes = useRTEStyles();
  const editor = useEditor<ProseKitExtension>();
  const toolbarState = useProseKitToolbarState(editor);
  const [href, setHref] = useState('');
  const [editing, setEditing] = useState(false);
  const [linkMenuOpen, setLinkMenuOpen] = useState(false);

  if (!enabled) {
    return null;
  }
  const closeLinkMenu = () => {
    setEditing(false);
    setLinkMenuOpen(false);
  };
  const openEditor = () => {
    const { $from } = editor.state.selection;
    const marks = $from.marksAcross($from);
    if (!marks) {
      return;
    }
    for (const mark of marks) {
      if (mark.type.name === 'link') {
        const attrs = mark.attrs as LinkMarkAttrs;
        const href = typeof attrs.href === 'string' ? attrs.href : '';
        setHref(href);
        setEditing(true);
        setLinkMenuOpen(true);
        return;
      }
    }
    setHref('');
    setEditing(true);
    setLinkMenuOpen(true);
  };
  const submitLink = () => {
    if (href === '') {
      editor.commands.removeLink();
    } else {
      editor.commands.addLink({ href });
    }
    closeLinkMenu();
    const { $to } = editor.state.selection;
    editor.view.dispatch(
      editor.state.tr.setSelection(TextSelection.create(editor.state.doc, $to.pos)),
    );
    editor.focus();
  };

  return (
    <InlinePopoverRoot
      open={linkMenuOpen}
      onOpenChange={(event) => {
        const nextOpen = Boolean(event.detail);
        setLinkMenuOpen(nextOpen);
        if (!nextOpen) {
          setEditing(false);
        }
      }}
    >
      <InlinePopoverPositioner placement="top">
        <InlinePopoverPopup className={classes.linkPopover} role="tooltip">
          {toolbarState.link ? (
            <>
              <button
                className={classes.button}
                onMouseDown={(event) => event.preventDefault()}
                onClick={openEditor}
              >
                Edit link
              </button>
              <button
                className={classes.button}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => {
                  editor.commands.removeLink();
                  closeLinkMenu();
                  const { $to } = editor.state.selection;
                  editor.view.dispatch(
                    editor.state.tr.setSelection(TextSelection.create(editor.state.doc, $to.pos)),
                  );
                  editor.focus();
                }}
              >
                Remove link
              </button>
            </>
          ) : (
            <button
              className={classes.button}
              onMouseDown={(event) => event.preventDefault()}
              onClick={openEditor}
            >
              Add link
            </button>
          )}
          {editing && (
            <input
              className={classes.linkInput}
              autoFocus
              placeholder="Enter link..."
              value={href}
              onChange={(event) => setHref(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  event.stopPropagation();
                  submitLink();
                }
                if (event.key === 'Escape') {
                  event.preventDefault();
                  closeLinkMenu();
                }
              }}
            />
          )}
        </InlinePopoverPopup>
      </InlinePopoverPositioner>
    </InlinePopoverRoot>
  );
};

const RichTextMenu: React.FC<{
  disabled: boolean;
  label?: string;
  constraints: RteMenuConstraints;
}> = ({ disabled, label, constraints }) => {
  const classes = useRTEStyles();
  const editor = useEditor<ProseKitExtension>();
  const toolbarState = useProseKitToolbarState(editor);
  const [priceButtonsVisible, setPriceButtonsVisible] = useState(false);
  const {
    enableHtml,
    enableBold,
    enableItalic,
    enableStrikethrough,
    enableCopyTemplates,
    enablePriceTemplates,
    enableProductWeeklyTemplate,
    enableCurrencyTemplate,
    enableCountryNameTemplate,
    enableArticleCountTemplate,
    enableDateTemplate,
    enableDayTemplate,
    enableCampaignDeadlineTemplate,
    enableMParticleTemplates,
  } = constraints;
  const hasFormatting =
    (enableBold ?? false) || (enableItalic ?? false) || (enableStrikethrough ?? false);

  const insertTemplate = (template: string) => {
    editor.commands.insertText({ text: template });
    editor.focus();
  };

  const toggleBold = () => {
    editor.commands.toggleBold();
    editor.focus();
  };

  const toggleItalic = () => {
    editor.commands.toggleItalic();
    editor.focus();
  };

  const toggleStrikethrough = () => {
    editor.commands.toggleStrike();
    editor.focus();
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
                  onClick={toggleBold}
                >
                  Bold
                </button>
              )}
              {enableItalic && (
                <button
                  {...buttonProps}
                  className={`${buttonProps.className} ${toolbarState.italic ? 'button-active' : ''}`}
                  onClick={toggleItalic}
                >
                  Italic
                </button>
              )}
              {enableStrikethrough && (
                <button
                  {...buttonProps}
                  className={`${buttonProps.className} ${toolbarState.strike ? 'button-active' : ''}`}
                  onClick={toggleStrikethrough}
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
                <button
                  {...buttonProps}
                  onClick={() => insertTemplate(CAMPAIGN_DEADLINE_TEMPLATE)}
                  title="This will be swapped out with either: 'Final day', '1 day left' or 'x days left' to match the countdown deadline."
                >
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
                <MParticleTemplateMenu
                  insertTemplate={insertTemplate}
                  buttonClassName={classes.button}
                />
              )}
              {enableProductWeeklyTemplate && (
                <button {...buttonProps} onClick={() => insertTemplate(PRICE_PRODUCT_WEEKLY)}>
                  Product weekly price
                </button>
              )}
              {enablePriceTemplates && (
                <>
                  <span className={classes.buttonSpacer}>&nbsp;</span>
                  <div className={classes.dropdownMenu}>
                    <button
                      {...buttonProps}
                      className={`${buttonProps.className} ${classes.dropdownMenuToggle}`}
                      onClick={() => setPriceButtonsVisible((visible) => !visible)}
                    >
                      {priceButtonsVisible ? 'Prices ↑' : 'Prices ↓'}
                    </button>
                    <menu
                      className={
                        priceButtonsVisible
                          ? classes.dropdownMenuContent
                          : classes.dropdownMenuContentHidden
                      }
                    >
                      <div className={classes.fieldLabelPrices}>Price templates:</div>
                      <button
                        {...buttonProps}
                        className={`${buttonProps.className} ${classes.dropdownMenuItem}`}
                        onClick={() => insertTemplate(PRICE_DIGISUB_MONTHLY)}
                      >
                        Digisub monthly
                      </button>
                      <button
                        {...buttonProps}
                        className={`${buttonProps.className} ${classes.dropdownMenuItem}`}
                        onClick={() => insertTemplate(PRICE_DIGISUB_ANNUAL)}
                      >
                        Digisub annual
                      </button>
                      <button
                        {...buttonProps}
                        className={`${buttonProps.className} ${classes.dropdownMenuItem}`}
                        onClick={() => insertTemplate(PRICE_GUARDIANWEEKLY_MONTHLY)}
                      >
                        GW monthly
                      </button>
                      <button
                        {...buttonProps}
                        className={`${buttonProps.className} ${classes.dropdownMenuItem}`}
                        onClick={() => insertTemplate(PRICE_GUARDIANWEEKLY_ANNUAL)}
                      >
                        GW annual
                      </button>
                    </menu>
                  </div>
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

const RichTextEditorContent: React.FC<RichTextEditorProps & { editor: ProseKitEditor }> = ({
  disabled,
  editor,
  label,
  name,
  error,
  helperText,
  updateCopy,
  rteMenuConstraints,
}) => {
  const classes = useRTEStyles();
  const readonlyExtension = useMemo(() => (disabled ? defineReadonly() : null), [disabled]);
  useExtension(readonlyExtension);

  const save = () => {
    if (rteMenuConstraints?.enableHtml) {
      updateCopy(paragraphsToArray(editor.getDocHTML()));
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
      <RichTextMenu disabled={disabled} label={label} constraints={rteMenuConstraints ?? {}} />
      <div id={name ? `RTE-${name}` : undefined} className={wrapperClasses}>
        <div
          ref={mountEditor}
          className={`${classes.editorWrapper} ProseMirror`}
          aria-readonly={disabled}
          onBlur={disabled ? undefined : save}
        />
        {!disabled && rteMenuConstraints?.enableHtml && rteMenuConstraints.enableLink && (
          <FloatingLinkToolbar enabled />
        )}
      </div>
      {helperText && <p className={error ? classes.errorText : classes.helperText}>{helperText}</p>}
    </div>
  );
};

const RichTextEditor: React.FC<RichTextEditorProps> = ({ copyData = [], ...props }) => {
  const [initialContent] = useState(() => parseCopyForParagraphs(copyData));
  const editor = useMemo(
    () =>
      createEditor({
        extension: union(defineBasicExtension(), removePastedHtmlExtension),
        defaultContent: initialContent,
      }),
    [initialContent],
  );

  return (
    <ProseKit editor={editor}>
      <RichTextEditorContent {...props} copyData={copyData} editor={editor} />
    </ProseKit>
  );
};

const RichTextEditorSingleLine: React.FC<RichTextEditorProps<string>> = ({
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
    <RichTextEditor {...props} updateCopy={onUpdate} copyData={copyData ? [copyData] : undefined} />
  );
};

export { getRteCopyLength, RichTextEditor, RichTextEditorSingleLine };
