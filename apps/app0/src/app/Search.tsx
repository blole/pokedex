import { parseSearchString } from '@/search/searchStringParser';
import React, { useCallback, useState } from 'react';
import { createEditor, type BaseEditor, type Descendant, type Range, Text, BaseRange, NodeEntry } from 'slate';
import { Slate, Editable, withReact, type ReactEditor, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';

export type SearchProps = {
  initialValue: string;
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

export const Search = ({ initialValue, onSubmit, className }: SearchProps) => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));

  // maybe not the best way to do it, but keep a copy of
  // the string representation of the value
  const [value, setValue] = useState<string>(initialValue);

  const [initialElement] = useState<CustomElement[]>(() => [{ children: [{ text: initialValue }] }]);

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

  const onChange = useCallback((descendants: Descendant[]) => {
    // I think we're always given the root element, so this is always true?
    if ('children' in descendants[0]) {
      setValue(descendants[0].children[0].text);
    }
  }, []);

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onSubmit(value);
    }
  };

  return (
    <Slate editor={editor} initialValue={initialElement} onValueChange={onChange}>
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
