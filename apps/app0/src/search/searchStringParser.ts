import nearley from 'nearley';
import grammar, { type Node } from './grammar';
import { Result, err, ok } from '@/util/result';

export type UnexpectedAtOffset = {
  code: 'UnexpectedAtOffset';
  offset: number;
};

export type UnexpectedEndOfInput = {
  code: 'UnexpectedEndOfInput';
};

type ParserError = {
  offset: number;
};

const isParserError = (error: unknown): error is ParserError => {
  return !!(error && typeof error === 'object' && 'offset' in error && typeof error.offset === 'number');
};

export const parseSearchString = (search: string): Result<Node, UnexpectedAtOffset | UnexpectedEndOfInput> => {
  const parser = new nearley.Parser(nearley.Grammar.fromCompiled(grammar));
  try {
    parser.feed(search);
    const results = parser.results as Node[];

    if (results.length > 1) {
      // alert the developers
      throw Error(`ambiguous grammar! results: ${JSON.stringify(results)}`);
    }

    if (results.length != 1) {
      return err({ code: 'UnexpectedEndOfInput' });
    }

    return ok(results[0]);
  } catch (error) {
    if (isParserError(error)) {
      return err({ code: 'UnexpectedAtOffset', offset: error.offset });
    }
    throw error;
  }
};
