@preprocessor typescript
@builtin "number.ne"
@builtin "postprocessors.ne"

main         -> _ union _                   {% (x): Node => x[1] %}

union        -> intersection (
                  __ "OR" __ intersection   {% nth(3) %}
                ):+                         {% ([x, y]): Union => (['or', x, ...y]) %}
              | intersection                {% (x): Node => x[0] %}

intersection -> group (
                  __ group                  {% nth(1) %}
                ):+                         {% ([x, y]): Intersection => (['and', x, ...y]) %}
              | group                       {% (x): Node => x[0] %}

group  -> "(" _ union _ ")"  {% (x): Union => x[2] %}
        | filter             {% (x): Filter => x[0] %}

filter -> ( gen
          | id
          | name
          | type
          )        {% (x): Filter => x[0][0] %}

gen  -> "gen:"  comparator [1-9]               {% x => ["gen", x[1], parseInt(x[2])] %}
id   -> "id:"   comparator unsigned_int        {% x => ["id", x[1], x[2]] %}
name -> "name:" [a-z]:+                        {% x => ["name", "==", x[1].join("")] %}
type -> "type:" ("fire" | "water" | "grass")   {% x => ["type", "==", x[1][0]] %}

comparator -> ( null   {% () => ["=="] %}
              | "<"
              | ">"
              | ">="
              | "<="
              )        {% (x): Comparator => x[0][0] %}

_  -> " ":*   {% () => null %}
__ -> " ":+   {% () => null %}

@{%

export enum Comparator {
  EQ = "==",
  GT = ">",
  GTE = ">=",
  LT = "<",
  LTE = "<=",
}
export enum Field {
  GEN = "gen",
  ID = "id",
  NAME = "name",
  TYPE = "type",
}

export type Node = Union | Intersection | Filter;
export type Union = ["or", Node, Node, ...Node[]];
export type Intersection = ["and", Node, Node, ...Node[]];
export type Filter =
  | [Field.GEN, Comparator, number]
  | [Field.ID, Comparator, number]
  | [Field.NAME, Comparator.EQ, string]
  | [Field.TYPE, Comparator.EQ, string];

%}