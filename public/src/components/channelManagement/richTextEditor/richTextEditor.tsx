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

// Typescript
interface RichTextEditorProps<T> {
  disabled: boolean;
  label?: string;
  helperText?: string;
  name?: string;
  error: boolean;
  updateCopy: (item?: T) => void;
  copyData?: T;
}

interface RichTextMenuProps {
  disabled: boolean;
  label: string | undefined;
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
              { type: ComponentItem.ToolbarButton, onClick: () => clickEdit(), icon: 'pencilLine' },
              { type: ComponentItem.ToolbarButton, onClick: onRemove, icon: 'linkUnlink' },
            ]
          : [{ type: ComponentItem.ToolbarButton, onClick: () => clickEdit(), icon: 'link' }],
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
const RichTextMenu: React.FC<RichTextMenuProps> = ({ disabled, label }: RichTextMenuProps) => {
  const classes = useRTEStyles();
  const chain = useChainedCommands();
  const active = useActive();

  return (
    <div>
      <span className={classes.fieldLabel}>{label != null ? label : 'Editable field'}</span>
      {!disabled && (
        <>
          <button
            className={active.bold() ? 'remirror-button remirror-button-active' : 'remirror-button'}
            onClick={() => {
              chain
                .toggleBold()
                .focus()
                .run();
            }}
          >
            Bold
          </button>
          <button
            className={
              active.italic() ? 'remirror-button remirror-button-active' : 'remirror-button'
            }
            onClick={() => {
              chain
                .toggleItalic()
                .focus()
                .run();
            }}
          >
            Italic
          </button>
          <span className={classes.remirrorButtonSpacer}>&nbsp;</span>
          <button
            className="remirror-button"
            onClick={() => {
              chain.insertText('%%ARTICLE_COUNT%%').run();
            }}
          >
            Articles
          </button>
          <button
            className="remirror-button"
            onClick={() => {
              chain.insertText('%%CURRENCY_SYMBOL%%').run();
            }}
          >
            Currency
          </button>
          <button
            className="remirror-button"
            onClick={() => {
              chain.insertText('%%COUNTRY_NAME%%').run();
            }}
          >
            Country
          </button>
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
  let paragraphsCheck = copy.join('');

  paragraphsCheck = paragraphsCheck.replace(/<.*?>/g, '');
  paragraphsCheck = paragraphsCheck.replace(/%%CURRENCY_SYMBOL%%/g, ' ');
  paragraphsCheck = paragraphsCheck.replace(/%%ARTICLE_COUNT%%/g, '     ');
  paragraphsCheck = paragraphsCheck.replace(/%%COUNTRY_NAME%%/g, '          ');

  return paragraphsCheck.length;
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
}: RichTextEditorProps<string[]>) => {
  const classes = useRTEStyles();

  // Make sure the supplied copy is in an Array, for processing
  if (copyData == null) {
    copyData = [];
  }

  const hooks = [
    () => {
      const { getHTML } = useHelpers();

      const handleSaveShortcut = useCallback(
        ({ state }) => {
          const frag = document.createElement('div');
          frag.innerHTML = getHTML(state);

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

          const paragraphsCopy = paragraphs.map(p => p.innerHTML);

          updateCopy(paragraphsCopy);
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
      new BoldExtension(),
      new ItalicExtension(),
      new LinkExtension({ autoLink: true }),
      new TextHighlightExtension(),
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
          <RichTextMenu disabled={disabled} label={label} />
          <EditorComponent />
          {!disabled && <FloatingLinkToolbar />}
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
    />
  );
};

export { RichTextEditor, RichTextEditorSingleLine, getRteCopyLength };
