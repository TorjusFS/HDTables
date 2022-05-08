// Block for variable getter.
export function variableGetter() {
  Blockly.Blocks["variables_get_panda"] = {
    init: function () {
      this.appendDummyInput().appendField(new Blockly.FieldVariable("VAR_NAME", ["Panda"], "Panda"), "TEMP_FIELD");
      this.setOutput(true, "Panda");
    },
  };
}
// Block for variable setter.
export function variableSetter() {

  Blockly.Blocks["variables_set_panda"] = {
    init: function () {
      this.appendValueInput("NAME")
        .setCheck("Panda")
        .appendField("set")
        .appendField(new Blockly.FieldVariable("TEMP_VAR", null, ["Panda"], "Panda"), "TEMP_FIELD")
        .appendField("to");
      this.setPreviousStatement(true, null);
      this.setNextStatement(true, null);
    },
  };
}
