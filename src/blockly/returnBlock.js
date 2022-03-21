import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";

export function setupRetrun() {
  let returnBlock = {
    "message0": "set %1 to %2",
    "args0": [
      {
        "type": "field_variable",
        "name": "VAR",
        "variable": "item",
        "variableTypes": [""]
      },
      {
        "type": "input_value",
        "name": "VALUE"
      }
    ]
  }
  
  Blockly.Blocks["return"] = {
    init: function () {
      this.appendValueInput("NAME").appendField("Return");
      this.setInputsInline(false);
      this.setPreviousStatement(true, null);
      this.setColour(210);
      this.setTooltip("");
      this.setHelpUrl("");
    },
  };

  JavaScript['return'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', JavaScript.ORDER_ATOMIC);
    var code = 'return ;\n';
    return code;
  };
}
