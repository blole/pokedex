import { expect, test } from '@jest/globals';
import { parseSearchString } from './searchStringParser';
import { err, ok } from '@/util/result';
import { Field, NumberComparator, StringComparator } from './grammar';

test('can parse single fields', () => {
  expect(parseSearchString('id:<42')).toEqual(ok([Field.ID, NumberComparator.LT, 42]));
  expect(parseSearchString(' name:pika')).toEqual(ok([Field.NAME, StringComparator.REGEX, 'pika']));
  expect(parseSearchString('gen:>=9 ')).toEqual(ok([Field.GEN, NumberComparator.GTE, 9]));
});

test('can parse more complicated examples', () => {
  expect(parseSearchString('id:<42 name:pika OR gen:>=9')).toEqual(
    ok([
      'or',
      ['and', [Field.ID, NumberComparator.LT, 42], [Field.NAME, StringComparator.REGEX, 'pika']],
      [Field.GEN, NumberComparator.GTE, 9],
    ]),
  );
  expect(parseSearchString('  ( id:2  OR  name:rai (gen:3) ) ( gen:5 )  ')).toEqual(
    ok([
      'and',
      [
        'or',
        [Field.ID, NumberComparator.EQ, 2],
        ['and', [Field.NAME, StringComparator.REGEX, 'rai'], [Field.GEN, NumberComparator.EQ, 3]],
      ],
      [Field.GEN, NumberComparator.EQ, 5],
    ]),
  );
});

test('handles unfinished input', () => {
  expect(parseSearchString('id')).toEqual(err({ code: 'UnexpectedEndOfInput' }));
  expect(parseSearchString('id:')).toEqual(err({ code: 'UnexpectedEndOfInput' }));
  expect(parseSearchString('id:<')).toEqual(err({ code: 'UnexpectedEndOfInput' }));
  expect(parseSearchString('name:')).toEqual(err({ code: 'UnexpectedEndOfInput' }));
  expect(parseSearchString('gen:>=9 (')).toEqual(err({ code: 'UnexpectedEndOfInput' }));
});

test('handles unexpected input', () => {
  expect(parseSearchString('id ')).toEqual(err({ code: 'UnexpectedAtOffset', offset: 2 }));
  expect(parseSearchString(' id: ')).toEqual(err({ code: 'UnexpectedAtOffset', offset: 4 }));
  expect(parseSearchString('id:a')).toEqual(err({ code: 'UnexpectedAtOffset', offset: 3 }));
  expect(parseSearchString('id:< ')).toEqual(err({ code: 'UnexpectedAtOffset', offset: 4 }));
});
