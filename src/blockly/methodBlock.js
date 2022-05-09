import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";

export function setupMethodBlock() {
    Blockly.Blocks['method_block'] = {
      init: function() {
        this.appendValueInput("variable")
          .setCheck(["variables", "variable_pair"])
          .appendField("set");   
      this.appendDummyInput()
          .appendField("to be");
      this.appendStatementInput("METHOD")
          .setCheck(null);
      this.appendValueInput("RETURN")
          .setCheck(null)
          .appendField("return");
      this.setColour(180);
     this.setTooltip("Insert the variables you want to make contraints on at the top");
     this.setHelpUrl("");
      }
    };
  
    JavaScript["method_block"] = function (block) {
      try {
      let inputs = getVariables(block.getInputTargetBlock("METHOD"), "FIELD_NAME");
  
      let outputs = block.getInputTargetBlock("variable")
      if (outputs && outputs["type"] === "variable_pair") {
        outputs = getVariables(block.getInputTargetBlock("variable"), "FIELD_NAME");
      }
      else if (outputs) {
        outputs = [`"${outputs.getFieldValue("FIELD_NAME")}"`]
      }
      else {
        throw "No variables in the top placeholder of a method block"
      }
  
      let returnBlock = block.getInputTargetBlock("RETURN")
      let returnValue = JavaScript.valueToCode(block, 'RETURN', 99)
      let returnValueList = []
      if (returnBlock && returnBlock["type"] === "variable_pair") {
        returnValue = "[" + returnValue + "]"
        returnValueList = returnValue.split(',')
        const variablesInReturn = getVariables(returnBlock, "FIELD_NAME")
        variablesInReturn.forEach(elem => inputs.push(elem))
      }
      else if (returnBlock) {
        returnValueList = [1]
        const variablesInReturn = getVariables(returnBlock, "FIELD_NAME")
        variablesInReturn.forEach(elem => inputs.push(elem))
      }
      else {
        throw "No blocks in the return placeholder of a mehtod block"
      }
      
      let uniqueInputs = inputs.filter((element, index) => {
        return inputs.indexOf(element) === index;
    });
    let uniqueOutputs = outputs.filter((element, index) => {
      return outputs.indexOf(element) === index;

  });
  if (uniqueOutputs.length !== returnValueList.length) {
    throw "Not same amount of output and return values in a method block"
  }

      let code = JavaScript.statementToCode(block, 'METHOD') + " \nreturn " + returnValue + "; "
      return `{
        "inputs": [${uniqueInputs}],
        "outputs": [${uniqueOutputs}],
        "code": "${code}"
      },`
    }
    catch (e) {
      document.getElementById('blockly-error').innerHTML = e
    }
    };
  }

  function getVariables(block, name) {
    try {
    const children = block.getDescendants()
    let variables = []
    children.forEach(elem => {
      if (elem["type"] === "variables") {
        let str = `"${elem.getFieldValue(name)}"`
        variables.push(str)
      }
    }
    )

    return variables
  }
  catch {
    return []
  } 
}
  