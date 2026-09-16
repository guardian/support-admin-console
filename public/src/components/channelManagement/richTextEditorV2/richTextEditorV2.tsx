import 'prosekit/basic/style.css';
import 'prosekit/basic/typography.css';

import { defineBasicExtension } from 'prosekit/basic';
import { createEditor } from 'prosekit/core';
import { defineReadonly } from 'prosekit/extensions/readonly';
import { ProseKit, useExtension } from 'prosekit/react';
import React, { useCallback, useMemo, useState } from 'react';
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
