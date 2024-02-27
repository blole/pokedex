import { useCallback, useEffect, useState, type KeyboardEvent } from 'react';
import { parseSearchString } from '@/search/searchStringParser';
import { createEditor, type BaseEditor, type Descendant, type Range, Text, BaseRange, NodeEntry } from 'slate';
import { Slate, Editable, withReact, type ReactEditor, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';

export type SearchProps = {
  value: string;
  setValue: (value: string) => void;
  onSubmit: (value: string) => void;
  className?: string;
};

type CustomElement = { children: [CustomText] };
type CustomRange = BaseRange & { underlined: boolean };
type CustomText = { text: string; underlined?: boolean };

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor;
    Element: CustomElement;
    Range: CustomRange;
    Text: CustomText;
  }
}

const RenderLeaf = ({ attributes, leaf, children }: RenderLeafProps) => {
  if (leaf.underlined) {
    return (
      <span {...attributes} className='underline underline-red'>
        {children}
      </span>
    );
  } else {
    return <span {...attributes}>{children}</span>;
  }
};

export const Search = ({ value, setValue, onSubmit, className }: SearchProps) => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  const parsedSearch = parseSearchString(value);
  const errorAtOffset: number | null =
    parsedSearch.kind === 'err' && parsedSearch.error.code === 'UnexpectedAtOffset' ? parsedSearch.error.offset : null;
  const decorate = ([node, path]: NodeEntry): Range[] => {
    if (errorAtOffset !== null && Text.isText(node)) {
      return [
        {
          anchor: { path, offset: errorAtOffset },
          focus: { path, offset: Number.MAX_SAFE_INTEGER },
          underlined: true,
        },
      ];
    } else {
      return [];
    }
  };

  useEffect(() => {
    // this is a workaround to make slate behave like a controlled component, but
    // works ok since we're only using slate to decorate the input
    // https://github.com/ianstormtaylor/slate/issues/4612#issuecomment-1781245820
    const descendants: Descendant[] = editor.children;
    if ('children' in descendants[0] && descendants[0].children[0].text !== value) {
      editor.children = [{ children: [{ text: value }] }];
      editor.onChange();
    }
  }, [editor, value]);

  const onChange = useCallback(
    (descendants: Descendant[]) => {
      // I think we're always given the root element, so this is always true?
      if ('children' in descendants[0]) {
        setValue(descendants[0].children[0].text);
      }
    },
    [setValue],
  );

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <Slate editor={editor} initialValue={[{ children: [{ text: value }] }]} onValueChange={onChange}>
      <Editable
        decorate={decorate}
        renderLeaf={RenderLeaf}
        onKeyDown={onKeyDown}
        placeholder='Search'
        className={className}
      />
    </Slate>
  );
};
