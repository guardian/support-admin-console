import 'prosekit/basic/style.css';
import 'prosekit/basic/typography.css';

import { defineBasicExtension } from 'prosekit/basic';
import { createEditor } from 'prosekit/core';
import { defineReadonly } from 'prosekit/extensions/readonly';
import { ProseKit, useExtension } from 'prosekit/react';
import React, { useCallback, useMemo, useState } from 'react';
import { useRichTextEditorV2Styles } from './richTextEditorV2Styles';

interface RichTextEditorV2Props {
  disabled: boolean;
  copyData?: string[];
  label?: string;
  name?: string;
}

interface RichTextEditorV2SingleLineProps {
  disabled: boolean;
  copyData?: string;
  label?: string;
  name?: string;
}

type ProseKitEditor = ReturnType<typeof createEditor>;

const parseCopyForParagraphs = (copy: string[]): string =>
  copy.map((paragraph) => `<p>${paragraph}</p>`).join('');

const RichTextEditorV2Content: React.FC<RichTextEditorV2Props & { editor: ProseKitEditor }> = ({
  disabled,
  editor,
  label,
  name,
}) => {
  const classes = useRichTextEditorV2Styles();
  const readonlyExtension = useMemo(() => (disabled ? defineReadonly() : null), [disabled]);
  useExtension(readonlyExtension);

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
  const wrapperClasses = disabled ? 'remirror-theme editor-disabled' : 'remirror-theme';

  return (
    <div className={classes.remirrorCustom}>
      {label && (
        <label className={classes.fieldLabel} htmlFor={name ? `RTE-${name}` : undefined}>
          {label}
        </label>
      )}
      <div id={name ? `RTE-${name}` : undefined} className={wrapperClasses}>
        <div
          ref={mountEditor}
          className={`${classes.remirrorEditorWrapper} ProseMirror`}
          aria-readonly={disabled}
        />
      </div>
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

const RichTextEditorV2SingleLine: React.FC<RichTextEditorV2SingleLineProps> = ({
  copyData,
  ...props
}) => <RichTextEditorV2 {...props} copyData={copyData ? [copyData] : undefined} />;

export { RichTextEditorV2, RichTextEditorV2Props, RichTextEditorV2SingleLine };
