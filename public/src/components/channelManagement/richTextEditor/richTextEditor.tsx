import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  BoldExtension,
  EventsExtension,
  ItalicExtension,
  LinkExtension,
  ShortcutHandlerProps,
  TextHighlightExtension,
  createMarkPositioner,
} from 'remirror/extensions';
import {
  ComponentItem,
  EditorComponent,
  FloatingToolbar,
  FloatingWrapper,
  Remirror,
  ToolbarItemUnion,
  useActive,
  useAttrs,
  useChainedCommands,
  useCurrentSelection,
  useExtension,
  useHelpers,
  useRemirror,
  useUpdateReason,
} from '@remirror/react';
import './styles.scss';
import { useRTEStyles } from './richTextEditorStyles';
import { CreateExtensionPlugin, PlainExtension, InputRule } from 'remirror';
import { Plugin } from 'prosemirror-state';
import { MarkPasteRule } from '@remirror/pm/paste-rules';

import {
  ARTICLE_COUNT_TEMPLATE,
  COUNTRY_NAME_TEMPLATE,
  CURRENCY_TEMPLATE,
  PRICE_DIGISUB_ANNUAL,
  PRICE_DIGISUB_MONTHLY,
  PRICE_GUARDIANWEEKLY_ANNUAL,
  PRICE_GUARDIANWEEKLY_MONTHLY,
} from '../helpers/validation';

// Typescript
interface RichTextEditorProps<T> {
  disabled: boolean;
  label?: string;
  helperText?: string;
  name?: string;
  error: boolean;
  updateCopy: (item?: T) => void;
  copyData?: T;
  rteMenuConstraints?: RteMenuConstraints;
}

interface RichTextMenuProps {
  disabled: boolean;
  label: string | undefined;
  rteMenuConstraints: RteMenuConstraints;
}

interface RteMenuConstraints {
  noHtml?: boolean;
  noBold?: boolean;
  noItalic?: boolean;
  noCopyTemplates?: boolean;
  noCurrencyTemplate?: boolean;
  noCountryNameTemplate?: boolean;
  noArticleCountTemplate?: boolean;
  noPriceTemplates?: boolean;
}

/**
 * Remirror extensions to override the built-in bold and italic extensions
 * These are needed because by default the built-in extensions allow markup-like input:
 * - For bold, __words__ and **words**
 * - For italic, _words_
 *
 * These extensions override that functionality
 * See Remirror discussion on GitHub: https://github.com/remirror/remirror/discussions/1526
 */
class MyBoldExtension extends BoldExtension {
  createInputRules(): InputRule[] {
    return [];
  }
}

class MyItalicExtension extends ItalicExtension {
  createInputRules(): InputRule[] {
    return [];
  }
  createPasteRules(): MarkPasteRule[] {
    return [];
  }
}

/**
 * A Remirror Extension to add a prosemirror plugin which removes html from pasted text.
 * This is important because our users often paste from Google Docs, which may inadvertently include markup.
 *
 * transformPastedHTML - https://prosemirror.net/docs/ref/version/0.17.0.html#view.EditorProps.transformPastedHTML
 * createPlugin - https://remirror.io/docs/api/core.pluginsextension.createplugin
 */
class RemovePastedHtmlExtension extends PlainExtension {
  get name() {
    return 'RemovePastedHtmlExtension' as const;
  }
  createPlugin(): CreateExtensionPlugin {
    return new Plugin({
      key: this.pluginKey,

      props: {
        transformPastedHTML: html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const paras = Array.from(doc.getElementsByTagName('p'));
          /**
           * It's important to remove all pasted html.
           * If the html contains any paras then assume all content is in <p> tags.
           */
          if (paras.length > 0) {
            return Array.from(doc.getElementsByTagName('p'))
              .map(p => `<p>${p.textContent}</p>`)
              .join(' ');
          } else {
            return doc.body.textContent || '';
          }
        },
      },
    });
  }
}

// ReMirror/ProseMirror LINK functionality
function useLinkShortcut() {
  const [linkShortcut, setLinkShortcut] = useState<ShortcutHandlerProps | undefined>();
  const [isEditing, setIsEditing] = useState(false);

  useExtension(
    LinkExtension,
    ({ addHandler }) =>
      addHandler('onShortcut', props => {
        if (!isEditing) {
          setIsEditing(true);
        }
        return setLinkShortcut(props);
      }),
    [isEditing],
  );
  return { linkShortcut, isEditing, setIsEditing };
}

function useFloatingLinkState() {
  const chain = useChainedCommands();
  const { isEditing, linkShortcut, setIsEditing } = useLinkShortcut();
  const { to, empty } = useCurrentSelection();

  const url = (useAttrs().link()?.href as string) ?? '';
  const [href, setHref] = useState<string>(url);

  const linkPositioner = useMemo(() => createMarkPositioner({ type: 'link' }), []);

  const onRemove = useCallback(() => {
    return chain
      .removeLink()
      .focus()
      .run();
  }, [chain]);

  const updateReason = useUpdateReason();

  useLayoutEffect(() => {
    if (!isEditing) {
      return;
    }

    if (updateReason.doc || updateReason.selection) {
      setIsEditing(false);
    }
  }, [isEditing, setIsEditing, updateReason.doc, updateReason.selection]);

  useEffect(() => {
    setHref(url);
  }, [url]);

  const submitHref = useCallback(() => {
    setIsEditing(false);
    const range = linkShortcut ?? undefined;

    if (href === '') {
      chain.removeLink();
    } else {
      chain.updateLink({ href, auto: false }, range);
    }
    chain.focus(range?.to ?? to).run();
  }, [setIsEditing, linkShortcut, chain, href, to]);

  const cancelHref = useCallback(() => {
    setIsEditing(false);
  }, [setIsEditing]);

  const clickEdit = useCallback(() => {
    if (empty) {
      chain.selectLink();
    }

    setIsEditing(true);
  }, [chain, empty, setIsEditing]);

  return useMemo(
    () => ({
      href,
      setHref,
      linkShortcut,
      linkPositioner,
      isEditing,
      clickEdit,
      onRemove,
      submitHref,
      cancelHref,
    }),
    [href, linkShortcut, linkPositioner, isEditing, clickEdit, onRemove, submitHref, cancelHref],
  );
}

// ReMirror/ProseMirror FLOATING LINK MENU BUTTONS
const FloatingLinkToolbar = () => {
  const {
    isEditing,
    linkPositioner,
    clickEdit,
    onRemove,
    submitHref,
    href,
    setHref,
    cancelHref,
  } = useFloatingLinkState();
  const active = useActive();
  const activeLink = active.link();
  const { empty } = useCurrentSelection();
  const linkEditItems: ToolbarItemUnion[] = useMemo(
    () => [
      {
        type: ComponentItem.ToolbarGroup,
        label: 'Link',
        items: activeLink
          ? [
              { type: ComponentItem.ToolbarButton, onClick: () => clickEdit(), label: 'Edit link' },
              { type: ComponentItem.ToolbarButton, onClick: onRemove, label: 'Remove link' },
            ]
          : [{ type: ComponentItem.ToolbarButton, onClick: () => clickEdit(), label: 'Add link' }],
      },
    ],
    [clickEdit, onRemove, activeLink],
  );

  const items: ToolbarItemUnion[] = useMemo(() => linkEditItems, [linkEditItems]);

  return (
    <>
      <FloatingToolbar items={items} positioner="selection" placement="top" enabled={!isEditing} />
      <FloatingToolbar
        items={linkEditItems}
        positioner={linkPositioner}
        placement="bottom"
        enabled={!isEditing && empty}
      />
      <FloatingWrapper
        positioner="always"
        placement="bottom"
        enabled={isEditing}
        renderOutsideEditor
      >
        <input
          style={{ zIndex: 20 }}
          autoFocus
          placeholder="Enter link..."
          onChange={event => setHref(event.target.value)}
          value={href}
          onKeyDown={event => {
            const { key } = event;
            if (key === 'Enter') {
              submitHref();
            }
            if (key === 'Escape') {
              cancelHref();
            }
          }}
        />
      </FloatingWrapper>
    </>
  );
};

// ReMirror/ProseMirror TOP MENU BUTTONS
const RichTextMenu: React.FC<RichTextMenuProps> = ({
  disabled,
  label,
  rteMenuConstraints,
}: RichTextMenuProps) => {
  const classes = useRTEStyles();
  const chain = useChainedCommands();
  const active = useActive();

  const [priceButtonsVisible, setPriceButtonsVisible] = useState<boolean>(false);

  const {
    noHtml,
    noBold,
    noItalic,
    noCopyTemplates,
    noPriceTemplates,
    noCurrencyTemplate,
    noCountryNameTemplate,
    noArticleCountTemplate,
  } = rteMenuConstraints;

  const clickBold = () => {
    chain
      .toggleBold()
      .focus()
      .run();
  };
  const clickItalic = () => {
    chain
      .toggleItalic()
      .focus()
      .run();
  };

  const insertArticleCount = () => {
    chain.insertText(ARTICLE_COUNT_TEMPLATE).run();
  };
  const insertCurrencySymbol = () => {
    chain.insertText(CURRENCY_TEMPLATE).run();
  };
  const insertCountryName = () => {
    chain.insertText(COUNTRY_NAME_TEMPLATE).run();
  };
  const insertPriceDigisubMonthly = () => {
    chain.insertText(PRICE_DIGISUB_MONTHLY).run();
  };
  const insertPriceDigisubAnnual = () => {
    chain.insertText(PRICE_DIGISUB_ANNUAL).run();
  };
  const insertPriceGwMonthly = () => {
    chain.insertText(PRICE_GUARDIANWEEKLY_MONTHLY).run();
  };
  const insertPriceGwAnnual = () => {
    chain.insertText(PRICE_GUARDIANWEEKLY_ANNUAL).run();
  };

  return (
    <div>
      <span className={classes.fieldLabel}>{label != null ? label : 'Editable field'}</span>
      {!disabled && (
        <>
          {!noHtml && (
            <>
              {!noBold && (
                <button
                  className={`remirror-button ${active.bold() && 'remirror-button-active'}`}
                  onClick={() => clickBold()}
                >
                  Bold
                </button>
              )}
              {!noItalic && (
                <button
                  className={`remirror-button ${active.italic() && 'remirror-button-active'}`}
                  onClick={() => clickItalic()}
                >
                  Italic
                </button>
              )}
            </>
          )}
          {!noCopyTemplates && (
            <>
              {(!noBold || !noItalic) && (
                <span className={classes.remirrorButtonSpacer}>&nbsp;</span>
              )}
              {!noArticleCountTemplate && (
                <button className="remirror-button" onClick={() => insertArticleCount()}>
                  Articles
                </button>
              )}
              {!noCurrencyTemplate && (
                <button className="remirror-button" onClick={() => insertCurrencySymbol()}>
                  Currency
                </button>
              )}
              {!noCountryNameTemplate && (
                <button className="remirror-button" onClick={() => insertCountryName()}>
                  Country
                </button>
              )}
              {!noPriceTemplates && (
                <>
                  <span className={classes.remirrorButtonSpacer}>&nbsp;</span>
                  <div className={classes.dropdownMenu}>
                    <button
                      className={`remirror-button ${classes.dropdownMenuToggle}`}
                      onClick={() => setPriceButtonsVisible(!priceButtonsVisible)}
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
                        className={`remirror-button ${classes.dropdownMenuItem}`}
                        onClick={() => insertPriceDigisubMonthly()}
                      >
                        Digisub monthly
                      </button>
                      <button
                        className={`remirror-button ${classes.dropdownMenuItem}`}
                        onClick={() => insertPriceDigisubAnnual()}
                      >
                        Digisub annual
                      </button>
                      <button
                        className={`remirror-button ${classes.dropdownMenuItem}`}
                        onClick={() => insertPriceGwMonthly()}
                      >
                        GW monthly
                      </button>
                      <button
                        className={`remirror-button ${classes.dropdownMenuItem}`}
                        onClick={() => insertPriceGwAnnual()}
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

// Helper function - converts an array of strings into a set of (stringified) HTML <p> elements
const parseCopyForParagraphs = (copy: string[]): string => {
  let res = '';

  copy.forEach(paragraph => {
    res += `<p>${paragraph}</p>`;
  });
  return res;
};

const getRteCopyLength = (copy: string[]): number => {
  let paragraphsCheck = copy.filter(p => p).join('');

  paragraphsCheck = paragraphsCheck.replace(/<.*?>/g, '');
  paragraphsCheck = paragraphsCheck.replace(/%%CURRENCY_SYMBOL%%/g, ' ');
  paragraphsCheck = paragraphsCheck.replace(/%%ARTICLE_COUNT%%/g, '     ');
  paragraphsCheck = paragraphsCheck.replace(/%%COUNTRY_NAME%%/g, '          ');

  return paragraphsCheck.length;
};

const paragraphsToArray = (html: string): string[] => {
  const frag = document.createElement('div');
  frag.innerHTML = html;

  const elements = Array.from(frag.children);

  const paragraphs = elements.filter(p => {
    if (p == null) {
      return false;
    }
    if (p.tagName === 'P') {
      return true;
    }
    return false;
  });

  return paragraphs.map(p => p.innerHTML);
};

// Component function
const RichTextEditor: React.FC<RichTextEditorProps<string[]>> = ({
  disabled,
  label,
  helperText,
  name,
  error,
  updateCopy,
  copyData,
  rteMenuConstraints,
}: RichTextEditorProps<string[]>) => {
  const classes = useRTEStyles();

  const menuConstraints = rteMenuConstraints || {};

  const { noHtml } = menuConstraints;

  // Make sure the supplied copy is in an Array, for processing
  if (copyData == null) {
    copyData = [];
  }

  const hooks = [
    () => {
      const { getHTML, getText } = useHelpers();

      const handleSaveShortcut = useCallback(
        ({ state }) => {
          if (noHtml) {
            // getText gives us the plain text representation with line breaks
            updateCopy(getText(state).split('\n'));
          } else {
            updateCopy(paragraphsToArray(getHTML(state)));
          }
          return true;
        },
        [getHTML],
      );
      manager.getExtension(EventsExtension).addHandler('blur', handleSaveShortcut);
    },
  ];

  // Instantiate the Remirror RTE component
  const { manager, state } = useRemirror({
    extensions: () => [
      new MyBoldExtension(),
      new MyItalicExtension(),
      new LinkExtension({ autoLink: true }),
      new TextHighlightExtension(),
      new RemovePastedHtmlExtension(),
    ],
    content: parseCopyForParagraphs(copyData),
    selection: 'start',
    stringHandler: 'html',
  });

  // Control the look of the ReMirror RTE dependant on whether the user is in Edit or Read-Only Mode
  const wrapperClasses = disabled ? 'remirror-theme editor-disabled' : 'remirror-theme';

  return (
    <div className={classes.remirrorCustom}>
      <div id={`RTE-${name}`} className={wrapperClasses}>
        <Remirror manager={manager} initialContent={state} editable={!disabled} hooks={hooks}>
          <RichTextMenu disabled={disabled} label={label} rteMenuConstraints={menuConstraints} />
          <EditorComponent />
          {!disabled && !noHtml && <FloatingLinkToolbar />}
          <p className={error ? classes.errorText : classes.helperText}>{helperText}</p>
        </Remirror>
      </div>
    </div>
  );
};

const RichTextEditorSingleLine: React.FC<RichTextEditorProps<string>> = ({
  disabled,
  label,
  helperText,
  name,
  error,
  updateCopy,
  copyData,
  rteMenuConstraints,
}: RichTextEditorProps<string>) => {
  const onUpdate = (paras: string[] | undefined): void => {
    if (!!paras) {
      updateCopy(paras.join(' '));
    } else {
      updateCopy(undefined);
    }
  };

  return (
    <RichTextEditor
      disabled={disabled}
      label={label}
      helperText={helperText}
      name={name}
      error={error}
      updateCopy={onUpdate}
      copyData={!!copyData ? [copyData] : undefined}
      rteMenuConstraints={rteMenuConstraints}
    />
  );
};

export { RichTextEditor, RichTextEditorSingleLine, getRteCopyLength, RteMenuConstraints };
