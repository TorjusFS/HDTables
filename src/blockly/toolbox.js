import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";

export function setupToolbox() {
  var toolbox = {
    kind: "categoryToolbox",
    contents: [
      {
        kind: "category",
        name: "Method",
        contents: [
          {
            kind: "block",
            type: "method_block"
          },
        ],
      },
      {
        kind: "category",
        name: "Variables",
        contents: [
          {
            kind: "block",
            type: "variables",
          },
          {
            kind: "block",
            type: "math_number",
          },
          {
            kind: "block",
            type: "variable_pair",
          },
          {
            kind: "block",
            type: "temp_var_setter"
          },
          {
            kind: "block",
            type: "temp_var_update"
          },
          {
            kind: "block",
            type: "temp_var_getter"
          },
        ],
      },
      {
        kind: "category",
        name: "Math",
        contents: [
          {
            kind: "block",
            type: "math_arithmetic",
          },
        ],
      },
      {
        kind: "category",
        name: "Return",
        contents: [
          {
              kind: "block",
              type: "return_block"
          },
        ],
      },
      {
        kind: "category",
        name: "Loops",
        contents: [
          {
            kind: "block",
            type: "controls_repeat_ext",
            value: "TIMES",
            field: {
              name: "NUM",
            }
          },
        ],
      },
      {
        kind: "category",
        name: "Control",
        contents: [
          {
            kind: "block",
            type: "controls_if",
          },
        ],
      },
      {
        kind: "category",
        name: "Logic",
        contents: [
          {
            kind: "block",
            type: "logic_compare",
          },
          {
            kind: "block",
            type: "logic_operation",
          },
          {
            kind: "block",
            type: "logic_boolean",
          },
        ],
      },
      
    ],
  };
  //Blockly.Variables.createVariableButtonHandler("blocklyDiv", null, 'panda');
  Blockly.inject("blocklyDiv", { toolbox: toolbox });
}
