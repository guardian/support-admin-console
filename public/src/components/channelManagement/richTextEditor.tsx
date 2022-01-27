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

// CSS
// Note that ReMirror/ProseMirror CSS has been added to the /src/style.css file
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
    backgroundColor: 'rgba(255 255 0 / 1)',
    margin: '0.5em 0 0 1.5em',
  },
});

// Typescript
interface RichTextEditorProps extends WithStyles<typeof styles> {
  disabled: boolean;
  label?: string;
  helperText?: string;
  name?: string;
  error: boolean;
  updateCopy: (item?: any) => void;
  copyData?: string | string[];
}

interface RichTextMenuProps extends WithStyles<typeof styles> {
  disabled: boolean;
  label: string | undefined;
}

// ReMirror/ProseMirror LINK functionality
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

// ReMirror/ProseMirror FLOATING LINK MENU BUTTONS
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

// ReMirror/ProseMirror TOP MENU BUTTONS
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

// Helper function - converts an array of strings into a set of (stringified) HTML <p> elements
const parseCopyForParagraphs = (copy: string[]): string => {
  let res = '';

  copy.forEach(paragraph => {
    res += `<p>${paragraph}</p>`;
  });
  return res;
};

// Component function
const RichTextEditor: React.FC<RichTextEditorProps> = ({
  classes,
  disabled,
  label,
  helperText,
  name,
  error,
  updateCopy,
  copyData,
}: RichTextEditorProps) => {
  // Make sure the supplied copy is in an Array, for processing
  if (copyData == null) {
    copyData = [];
  }
  if (!Array.isArray(copyData)) {
    copyData = [copyData];
  }

  const { manager, state } = useRemirror({
    extensions: () => [
      new BoldExtension(),
      new ItalicExtension(),
      new LinkExtension({ autoLink: true }),
    ],
    content: parseCopyForParagraphs(copyData),
    selection: 'start',
    stringHandler: 'html',
  });

  // Handle to the ProseMirror <div> element containing all the RTE text
  // - There's probably a better way of doing this, but I can't get my head around React refs at the moment and it's just as easy to grab a handle to the ProseMirror <div> element and suck child elements out of it
  let ref: any = false;
  useEffect(() => {
    ref = document.querySelector(`#RTE-${name} .ProseMirror`);
  });

  // Helper function - extracts copy from an array of HTML child elements
  const blurAction = () => {
    if (name && ref && !disabled) {
      const elements = [...ref.children];

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
    }
  };

  // Control the look of the ReMirror RTE dependant on whether the user is in Edit or Read-Only Mode
  const wrapperClasses = disabled ? 'remirror-theme editor-disabled' : 'remirror-theme';

  return (
    <div id={`RTE-${name}`} className={wrapperClasses} onBlur={blurAction}>
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
