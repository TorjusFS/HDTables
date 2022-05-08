import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";

export function setupRetrun() {
  Blockly.Blocks['return_block'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("Number")
        .appendField("return")
    this.setPreviousStatement(true, null);
    this.setColour(210);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

  JavaScript['return_block'] = function(block) {
    var value_name = JavaScript.valueToCode(block, 'NAME', JavaScript.ORDER_ATOMIC);
    let code = block.getFieldValue('Return');
    return "return " + value_name + "; ";
  };
}
