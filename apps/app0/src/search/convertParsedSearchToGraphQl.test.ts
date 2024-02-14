import { expect, test } from "@jest/globals";
import { convertParsedSearchToGraphQl } from "./convertParsedSearchToGraphQl";
import { Field, NumberComparator, StringComparator } from "./grammar";
import { ValueTypes } from "@/zeus";

test("can convert single fields", () => {
  expect(
    convertParsedSearchToGraphQl([Field.ID, NumberComparator.LT, 42]),
  ).toEqual({
    id: { _lt: 42 },
  });
  expect(
    convertParsedSearchToGraphQl([Field.NAME, StringComparator.REGEX, "pika"]),
  ).toEqual({
    name: { _iregex: "pika" },
  });
  expect(
    convertParsedSearchToGraphQl([Field.GEN, NumberComparator.GTE, 9]),
  ).toEqual({
    generation_id: { _gte: 9 },
  });
});

test("can convert more complicated examples", () => {
  expect(
    convertParsedSearchToGraphQl([
      "or",
      [
        "and",
        [Field.ID, NumberComparator.LT, 42],
        [Field.NAME, StringComparator.REGEX, "pika"],
      ],
      [Field.GEN, NumberComparator.GTE, 9],
    ]),
  ).toEqual({
    _or: [
      {
        _and: [
          {
            id: { _lt: 42 },
          },
          {
            name: { _iregex: "pika" },
          },
        ],
      },
      {
        generation_id: { _gte: 9 },
      },
    ],
  } satisfies ValueTypes["pokemon_v2_pokemonspecies_bool_exp"]);

  expect(
    convertParsedSearchToGraphQl([
      "and",
      [
        "or",
        [Field.ID, NumberComparator.EQ, 2],
        [
          "and",
          [Field.NAME, StringComparator.REGEX, "rai"],
          [Field.GEN, NumberComparator.EQ, 3],
        ],
      ],
      [Field.GEN, NumberComparator.EQ, 5],
    ]),
  ).toEqual({
    _and: [
      {
        _or: [
          {
            id: { _eq: 2 },
          },
          {
            _and: [
              {
                name: { _iregex: "rai" },
              },
              {
                generation_id: { _eq: 3 },
              },
            ],
          },
        ],
      },
      {
        generation_id: { _eq: 5 },
      },
    ],
  } satisfies ValueTypes["pokemon_v2_pokemonspecies_bool_exp"]);
});
