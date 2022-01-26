import React, { useCallback, useEffect, useLayoutEffect, useMemo, useState } from 'react';
import {
  BoldExtension,
  ItalicExtension,
  createMarkPositioner,
  LinkExtension,
  ShortcutHandlerProps,
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
  useRemirror,
  useUpdateReason,
} from '@remirror/react';

import { createStyles, WithStyles, withStyles } from '@material-ui/core';

const styles = createStyles({
  fieldLabel: {
    display: 'inline-block',
    fontSize: '85%',
    color: 'rgba(0 0 0 / 0.6)',
    margin: '0 1.5em',
  },
  helperText: {
    fontSize: '85%',
    color: 'rgba(0 0 0 / 0.6)',
    margin: '0.5em 0 0 1.5em',
  },
  errorText: {
    color: 'rgba(0 0 0 / 1)',
    backgroundColor: 'rgba(0 255 255 / 1)',
    margin: '0.5em 0 0 1.5em',
  },
});

interface RichTextEditorProps extends WithStyles<typeof styles> {
  disabled: boolean;
  copyContent: string | undefined;
  label: string | undefined;
  helperText: string | undefined;
  name: string | undefined;
  error: boolean;
  inputRef: (item?: any) => void;
  onBlur: () => void;
}

interface RichTextMenuProps extends WithStyles<typeof styles> {
  disabled: boolean;
  label: string | undefined;
}

// LINK FUNCTIONALITY
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

// FLOATING LINK MENU BUTTONS
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
              // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              { type: ComponentItem.ToolbarButton, onClick: () => clickEdit(), icon: 'pencilLine' },
              { type: ComponentItem.ToolbarButton, onClick: onRemove, icon: 'linkUnlink' },
            ]
          : [
              // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
              { type: ComponentItem.ToolbarButton, onClick: () => clickEdit(), icon: 'link' },
            ],
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
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          onChange={event => setHref(event.target.value)}
          value={href}
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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

// TOP MENU BUTTONS
const RichTextMenu: React.FC<RichTextMenuProps> = ({
  classes,
  disabled,
  label,
}: RichTextMenuProps) => {
  const chain = useChainedCommands();
  const active = useActive();

  return (
    <div>
      <span className={classes.fieldLabel}>{label != null ? label : 'Editable field'}</span>
      {!disabled && (
        <>
          <button
            className={active.bold() ? 'remirror-button-active' : 'remirror-button'}
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
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
            className={active.italic() ? 'remirror-button-active' : 'remirror-button'}
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            onClick={() => {
              chain
                .toggleItalic()
                .focus()
                .run();
            }}
          >
            Italic
          </button>
        </>
      )}
    </div>
  );
};

const parseCopyForParagraphs = (copy: string | undefined): string | undefined => {
  if (copy) {
    const search = /\n/gm;
    return copy.replace(search, '</p><p>');
  }
  return copy;
};

// const unparseCopyForParagraphs = (copy: string | undefined): string | undefined => {
//   if (copy) {
//     const search = /<\/p>.*?<p>/gm;
//     return copy.replace(search, '\n');
//   }
//   return copy;
// };

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  classes,
  inputRef,
  disabled,
  copyContent,
  name,
  label,
  helperText,
  onBlur,
  error,
}: RichTextEditorProps) => {
  console.log(copyContent, typeof inputRef, typeof onBlur);

  const editorId =
    name != null ? `RTE-for-${name.replace(/ /g, '')}` : `RTE-${Math.random().toFixed(6)}`;

  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new LinkExtension({ autoLink: true }),
    ],
    content: `<p>${parseCopyForParagraphs(copyContent)}</p>`,
    selection: 'start',
    stringHandler: 'html',
  });

  useEffect(() => {
    const editorHandle = document.querySelector(`#${editorId} .remirror-editor`);

    if (editorHandle) {
      if (disabled) {
        editorHandle.classList.add('editor-disabled');
      } else {
        editorHandle.classList.remove('editor-disabled');
      }
    }
  });

  return (
    <div className="remirror-theme" id={editorId}>
      <Remirror manager={manager} initialContent={state} editable={!disabled}>
        <RichTextMenu classes={classes} disabled={disabled} label={label} />
        <EditorComponent />
        {!disabled && <FloatingLinkToolbar />}
        <p className={error ? classes.errorText : classes.helperText}>{helperText}</p>
      </Remirror>
    </div>
  );
};

export default withStyles(styles)(RichTextEditor);
