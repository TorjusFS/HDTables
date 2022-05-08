import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";


export function setupVariablePairBlock() {
    Blockly.Blocks['variable_pair'] = {
      init: function() {
        this.appendValueInput("first_val")
            .setCheck(null);
        this.appendValueInput("second_val")
            .setCheck(null)
            .appendField(",");
        this.setInputsInline(true);
        this.setOutput(true, null);
        this.setColour(230);
     this.setTooltip("Insert two variables");
     this.setHelpUrl("");
      }
    };
  
    JavaScript["variable_pair"] = function (block) {
      let firstValue = JavaScript.valueToCode(block, 'first_val', null);
      let secondValue = JavaScript.valueToCode(block, 'second_val', null);
  
      let code = [firstValue + ", " + secondValue, 0]
      return code
    };
  }