// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function nth(n) {
    return function(d) {
        return d[n];
    };
}


// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function $(o) {
    return function(d) {
        var ret = {};
        Object.keys(o).forEach(function(k) {
            ret[k] = d[o[k]];
        });
        return ret;
    };
}



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


interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: undefined,
  ParserRules: [
    {"name": "unsigned_int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_int$ebnf$1", "symbols": ["unsigned_int$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_int", "symbols": ["unsigned_int$ebnf$1"], "postprocess": 
        function(d) {
            return parseInt(d[0].join(""));
        }
        },
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"-"}]},
    {"name": "int$ebnf$1$subexpression$1", "symbols": [{"literal":"+"}]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1$subexpression$1"], "postprocess": id},
    {"name": "int$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "int$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$2", "symbols": ["int$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "int", "symbols": ["int$ebnf$1", "int$ebnf$2"], "postprocess": 
        function(d) {
            if (d[0]) {
                return parseInt(d[0][0]+d[1].join(""));
            } else {
                return parseInt(d[1].join(""));
            }
        }
        },
    {"name": "unsigned_decimal$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$1", "symbols": ["unsigned_decimal$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "unsigned_decimal$ebnf$2$subexpression$1", "symbols": [{"literal":"."}, "unsigned_decimal$ebnf$2$subexpression$1$ebnf$1"]},
    {"name": "unsigned_decimal$ebnf$2", "symbols": ["unsigned_decimal$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "unsigned_decimal$ebnf$2", "symbols": [], "postprocess": () => null},
    {"name": "unsigned_decimal", "symbols": ["unsigned_decimal$ebnf$1", "unsigned_decimal$ebnf$2"], "postprocess": 
        function(d) {
            return parseFloat(
                d[0].join("") +
                (d[1] ? "."+d[1][1].join("") : "")
            );
        }
        },
    {"name": "decimal$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "decimal$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "decimal$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$2", "symbols": ["decimal$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "decimal$ebnf$3$subexpression$1$ebnf$1", "symbols": ["decimal$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "decimal$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "decimal$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "decimal$ebnf$3", "symbols": ["decimal$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "decimal$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "decimal", "symbols": ["decimal$ebnf$1", "decimal$ebnf$2", "decimal$ebnf$3"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "")
            );
        }
        },
    {"name": "percentage", "symbols": ["decimal", {"literal":"%"}], "postprocess": 
        function(d) {
            return d[0]/100;
        }
        },
    {"name": "jsonfloat$ebnf$1", "symbols": [{"literal":"-"}], "postprocess": id},
    {"name": "jsonfloat$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$2", "symbols": ["jsonfloat$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$3$subexpression$1$ebnf$1", "symbols": ["jsonfloat$ebnf$3$subexpression$1$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$3$subexpression$1", "symbols": [{"literal":"."}, "jsonfloat$ebnf$3$subexpression$1$ebnf$1"]},
    {"name": "jsonfloat$ebnf$3", "symbols": ["jsonfloat$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$3", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [/[+-]/], "postprocess": id},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": [/[0-9]/]},
    {"name": "jsonfloat$ebnf$4$subexpression$1$ebnf$2", "symbols": ["jsonfloat$ebnf$4$subexpression$1$ebnf$2", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "jsonfloat$ebnf$4$subexpression$1", "symbols": [/[eE]/, "jsonfloat$ebnf$4$subexpression$1$ebnf$1", "jsonfloat$ebnf$4$subexpression$1$ebnf$2"]},
    {"name": "jsonfloat$ebnf$4", "symbols": ["jsonfloat$ebnf$4$subexpression$1"], "postprocess": id},
    {"name": "jsonfloat$ebnf$4", "symbols": [], "postprocess": () => null},
    {"name": "jsonfloat", "symbols": ["jsonfloat$ebnf$1", "jsonfloat$ebnf$2", "jsonfloat$ebnf$3", "jsonfloat$ebnf$4"], "postprocess": 
        function(d) {
            return parseFloat(
                (d[0] || "") +
                d[1].join("") +
                (d[2] ? "."+d[2][1].join("") : "") +
                (d[3] ? "e" + (d[3][1] || "+") + d[3][2].join("") : "")
            );
        }
        },
    {"name": "union$ebnf$1$subexpression$1$string$1", "symbols": [{"literal":"O"}, {"literal":"R"}], "postprocess": (d) => d.join('')},
    {"name": "union$ebnf$1$subexpression$1", "symbols": ["__", "union$ebnf$1$subexpression$1$string$1", "__", "intersection"], "postprocess": nth(3)},
    {"name": "union$ebnf$1", "symbols": ["union$ebnf$1$subexpression$1"]},
    {"name": "union$ebnf$1$subexpression$2$string$1", "symbols": [{"literal":"O"}, {"literal":"R"}], "postprocess": (d) => d.join('')},
    {"name": "union$ebnf$1$subexpression$2", "symbols": ["__", "union$ebnf$1$subexpression$2$string$1", "__", "intersection"], "postprocess": nth(3)},
    {"name": "union$ebnf$1", "symbols": ["union$ebnf$1", "union$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "union", "symbols": ["intersection", "union$ebnf$1"], "postprocess": ([x, y]): Union => (['or', x, ...y])},
    {"name": "union", "symbols": ["intersection"], "postprocess": (x): Intersection | Node => x[0]},
    {"name": "intersection$ebnf$1$subexpression$1", "symbols": ["__", "group"], "postprocess": nth(1)},
    {"name": "intersection$ebnf$1", "symbols": ["intersection$ebnf$1$subexpression$1"]},
    {"name": "intersection$ebnf$1$subexpression$2", "symbols": ["__", "group"], "postprocess": nth(1)},
    {"name": "intersection$ebnf$1", "symbols": ["intersection$ebnf$1", "intersection$ebnf$1$subexpression$2"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "intersection", "symbols": ["group", "intersection$ebnf$1"], "postprocess": ([x, y]): Intersection => (['and', x, ...y])},
    {"name": "intersection", "symbols": ["group"], "postprocess": (x): Node => x[0]},
    {"name": "group", "symbols": [{"literal":"("}, "_", "union", "_", {"literal":")"}], "postprocess": (x): Union => x[2]},
    {"name": "group", "symbols": ["filter"], "postprocess": (x): Filter => x[0]},
    {"name": "filter$subexpression$1", "symbols": ["gen"]},
    {"name": "filter$subexpression$1", "symbols": ["id"]},
    {"name": "filter$subexpression$1", "symbols": ["name"]},
    {"name": "filter$subexpression$1", "symbols": ["type"]},
    {"name": "filter", "symbols": ["filter$subexpression$1"], "postprocess": (x): Filter => x[0][0]},
    {"name": "gen$string$1", "symbols": [{"literal":"g"}, {"literal":"e"}, {"literal":"n"}, {"literal":":"}], "postprocess": (d) => d.join('')},
    {"name": "gen", "symbols": ["gen$string$1", "comparator", /[1-9]/], "postprocess": x => ["gen", x[1], x[2]]},
    {"name": "id$string$1", "symbols": [{"literal":"i"}, {"literal":"d"}, {"literal":":"}], "postprocess": (d) => d.join('')},
    {"name": "id", "symbols": ["id$string$1", "comparator", "unsigned_int"], "postprocess": x => ["id", x[1], x[2]]},
    {"name": "name$string$1", "symbols": [{"literal":"n"}, {"literal":"a"}, {"literal":"m"}, {"literal":"e"}, {"literal":":"}], "postprocess": (d) => d.join('')},
    {"name": "name$ebnf$1", "symbols": [/[a-z]/]},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-z]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "name", "symbols": ["name$string$1", "name$ebnf$1"], "postprocess": x => ["name", "==", x[1].join("")]},
    {"name": "type$string$1", "symbols": [{"literal":"t"}, {"literal":"y"}, {"literal":"p"}, {"literal":"e"}, {"literal":":"}], "postprocess": (d) => d.join('')},
    {"name": "type$subexpression$1$string$1", "symbols": [{"literal":"f"}, {"literal":"i"}, {"literal":"r"}, {"literal":"e"}], "postprocess": (d) => d.join('')},
    {"name": "type$subexpression$1", "symbols": ["type$subexpression$1$string$1"]},
    {"name": "type$subexpression$1$string$2", "symbols": [{"literal":"w"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}, {"literal":"r"}], "postprocess": (d) => d.join('')},
    {"name": "type$subexpression$1", "symbols": ["type$subexpression$1$string$2"]},
    {"name": "type$subexpression$1$string$3", "symbols": [{"literal":"g"}, {"literal":"r"}, {"literal":"a"}, {"literal":"s"}, {"literal":"s"}], "postprocess": (d) => d.join('')},
    {"name": "type$subexpression$1", "symbols": ["type$subexpression$1$string$3"]},
    {"name": "type", "symbols": ["type$string$1", "type$subexpression$1"], "postprocess": x => ["type", "==", x[1][0]]},
    {"name": "comparator$subexpression$1", "symbols": [], "postprocess": () => ["=="]},
    {"name": "comparator$subexpression$1", "symbols": [{"literal":"<"}]},
    {"name": "comparator$subexpression$1", "symbols": [{"literal":">"}]},
    {"name": "comparator$subexpression$1$string$1", "symbols": [{"literal":">"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "comparator$subexpression$1", "symbols": ["comparator$subexpression$1$string$1"]},
    {"name": "comparator$subexpression$1$string$2", "symbols": [{"literal":"<"}, {"literal":"="}], "postprocess": (d) => d.join('')},
    {"name": "comparator$subexpression$1", "symbols": ["comparator$subexpression$1$string$2"]},
    {"name": "comparator", "symbols": ["comparator$subexpression$1"], "postprocess": (x): Comparator => x[0][0]},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", {"literal":" "}], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null},
    {"name": "__$ebnf$1", "symbols": [{"literal":" "}]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", {"literal":" "}], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": () => null}
  ],
  ParserStart: "union",
};

export default grammar;
