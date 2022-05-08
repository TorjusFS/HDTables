import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";

export function setupTempVarSetter() {
  Blockly.Blocks["temp_var_setter"] = {
    init: function () {
      this.appendValueInput("TEMP_VAR_NAME")
        .setCheck(null)
        .appendField("new var")
        .appendField(new Blockly.FieldTextInput("default"), "TEMP_VAR_VAL")
        .appendField("=");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(60);
      this.setTooltip("Creates a new temporary variable");
      this.setHelpUrl("");
    },
  };
  JavaScript["temp_var_setter"] = function (block) {
    let name = block.getFieldValue("TEMP_VAR_VAL");
    let value = JavaScript.valueToCode(block, "TEMP_VAR_NAME", 99);
    let code = "let " + name + " = " + value + ";";
    return code;
  };
}

export function setupUpdateTempVar() {
  Blockly.Blocks["temp_var_update"] = {
    init: function () {
      this.appendValueInput("TEMP_VAR_NAME")
        .setCheck(null)
        .appendField(new Blockly.FieldTextInput("default"), "TEMP_VAR_VAL")
        .appendField("=");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
      this.setColour(60);
      this.setTooltip("Updates a created temporary variable");
      this.setHelpUrl("");
    },
  };
  JavaScript["temp_var_update"] = function (block) {
    let name = block.getFieldValue("TEMP_VAR_VAL");
    let value = JavaScript.valueToCode(block, "TEMP_VAR_NAME", 99);
    let code = + name + " = " + value + ";";
    return code;
  };
}

export function setupTempVarGetter() {
  Blockly.Blocks["temp_var_getter"] = {
    init: function () {
      this.appendDummyInput().appendField(new Blockly.FieldTextInput("default"), "TEMP_VAR");
      this.setOutput(true, null);
      this.setColour(60);
      this.setTooltip("Gives the value of the named temporary variable");
      this.setHelpUrl("");
    },
  };

  JavaScript["temp_var_getter"] = function (block) {
    let name = block.getFieldValue("TEMP_VAR");
    return [name, 0];
  };
}
