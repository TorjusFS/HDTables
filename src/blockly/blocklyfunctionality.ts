import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";
import { ConstraintSystem, Component, defaultConstraintSystem, component, ConstraintSpec, Method, maskNone  } from "../hotdrink/hotdrink";
import {binder} from "../packages/binders"
let variableCount = 97;
let variableList = [];

const system = defaultConstraintSystem;
const comp = new Component("Component");
system.addComponent(comp);

export function siHei() {}

let currentButton;

function handlePlay(event) {
  loadWorkspace(event.target);
  let code = JavaScript.workspaceToCode(Blockly.getMainWorkspace());
  code += "MusicMaker.play();";
  try {
    eval(code);
  } catch (error) {
    console.log(error);
  }
}

function testCode() {
  let workspace = Blockly.getMainWorkspace();
  let code = JavaScript.workspaceToCode(workspace);
  try {
    console.log(code)
  } catch (error) {
    console.log(error);
  }
}

export function setupVariableBlock() {
  Blockly.Blocks['variables'] = {
    init: function() {
      this.appendDummyInput()
          .appendField("")
          .appendField(new Blockly.FieldDropdown(this.onchange), "FIELD_NAME");
      this.setColour(230);
      this.setOutput(true);
      
    },
    onchange: function (e) {
      return variableList.length > 0 ? variableList : [["", ""]]
    }
  };

  JavaScript["variables"] = function (block) {
    let code = block.getFieldValue("FIELD_NAME");
    return [code, 99]
  };
}

export function setupMethodBlock() {
  Blockly.Blocks['method_block'] = {
    init: function() {
      this.appendDummyInput()
      .appendField("set")
      .appendField(new Blockly.FieldDropdown(this.onchange), "drop_down")
      .appendField("to be");
      this.appendStatementInput("METHOD")
          .setCheck(null);
      this.setColour(230);
   this.setTooltip("");
   this.setHelpUrl("");
    },
    onchange: function (e) {
      return variableList.length > 0 ? variableList : [["", ""]]
    }
  };

  JavaScript["method_block"] = function (block) {
    let chosenVariable = block.getFieldValue("drop_down");
    let variables = getVariables(block);
    let code = JavaScript.statementToCode(block, 'METHOD');
    return `{
      "inputs": [${variables}],
      "outputs": "${chosenVariable}",
      "code": "${code}"
    },`
  };
}

function getVariables(block) {
  const children = block.getDescendants()
  let variables = []
  children.forEach(elem => {
    if (elem["type"] === "variables") {
      let str = `"${elem.getFieldValue("FIELD_NAME")}"`
      variables.push(str)
    }
  }
  )
  
  return variables
}

function save(button) {
  button.blocklyXml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
}

function loadWorkspace(button) {
  let workspace = Blockly.getMainWorkspace();
  workspace.clear();
  if (button.blocklyXml) {
    Blockly.Xml.domToWorkspace(button.blocklyXml, workspace);
  }
}

function handleSave() {
  Excel.run(function (context) {
    console.log("HandleSave");
    
    addConstraint(currentButton.id)
    document.body.setAttribute("mode", "edit");
    save(currentButton);
    return context.sync();
  }).catch((error) => {
    console.log(error);
  });
}

function cancelButton () {
  document.body.setAttribute("mode", "edit");
}

function enableMakerMode() {
  Excel.run(function (context) {
    document.body.setAttribute("mode", "maker");
    document.querySelectorAll(".button").forEach((btn) => {
      btn.addEventListener("click", handlePlay);
      btn.removeEventListener("click", enableBlocklyMode);
    });
    return context.sync();
  }).catch((error) => {
    console.log(error);
  });
}

export function enableEditMode() {
  //document.body.setAttribute("mode", "edit");
  document.querySelectorAll(".button").forEach((btn) => {
    btn.addEventListener("click", enableBlocklyMode);
  });
}

function changeName(event, index) {
  let tempVar = variableList[index]
  tempVar = [event.target.value, tempVar[1]]
  variableList[index] = tempVar
}

export function addNewVariable() {
  console.log("Add new variable");
  const letter = String.fromCharCode(variableCount);
  variableList.push([letter, letter]);
  console.log(letter);
  const index = letter.charCodeAt(0)-97
  const variableName = variableList[index][0]
  variableCount++;
  const wrapper = document.createElement("div");
  wrapper.classList.add("variable");
  wrapper.id = `${letter}wrapper`;
  wrapper.innerHTML = ` <input value=${variableName} id="${letter}input" class="letter"></input>
                        <p class="cell" id="${letter}cell"></p>
                        <button id="${letter}button" class="knapp">Bind to active cell</button>`;
  document.getElementById("variables").appendChild(wrapper)
  document.getElementById(`${letter}input`).addEventListener("change", function (event) {
    changeName(event, index)
  });
  document.getElementById(`${letter}button`).addEventListener("click", function () {
    saveToCurrentCell(`${letter}`);
  });
  
  comp.emplaceVariable(letter, null);
  binder(comp.vs[letter], letter);
  setupVariableBlock()
}

function addOnClick() {
  Excel.run(function (context) {
    for (let i = 0; i < variableList.length; i++) {
      //console.log(variableList[i]);
      document.getElementById(`${variableList[i]}button`).addEventListener("click", function () {
        saveToCurrentCell(`${variableList[i]}`);
      });
    }
    return context.sync();
  }).catch((error) => {
    console.log(error);
  });
}

let constraintCount = 0
let constraintList = []

function makeNewConstraint() {
  constraintCount++;
  const wrapper = document.createElement("div");
  wrapper.classList.add("constraint");
  wrapper.id = `${constraintCount}wrapper`;
  wrapper.innerHTML = ` <p class="letter">Constrant ${constraintCount}</p>
                        <button id=${constraintCount} class="button blockly knapp">Edit</button>`;
  document.getElementById("constraints").appendChild(wrapper)
  wrapper.querySelector(".button").addEventListener("click", enableBlocklyMode);
  document.querySelector(".button").addEventListener("click", enableBlocklyMode);
}

function enableBlocklyMode(e) {
  document.body.setAttribute("mode", "blockly");
  currentButton = e.target;
  loadWorkspace(currentButton);
}

function bindValueToCell(id) {
  Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, { id: id }, function (asyncResult) {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {
      console.log("Failed to bind");
    } else {
      Excel.run(function (context) {
        var activeCell = context.workbook.getActiveCell();
        activeCell.load("address");

        return context.sync().then(function () {
          console.log(`Binded ${activeCell.address.slice(7)} to ${id}`);
          console.log("The active cell is " + activeCell.address);
          document.getElementById(`${id}cell`).innerHTML = ` = ${activeCell.address.slice(7)}`;
        });
      }).catch((e) => {
        console.log("Could not get active cell");
      });
    }
  });
}

function saveToCurrentCell(id) {
  Excel.run(function (context) {
    bindValueToCell(id);
    return context.sync();
  }).catch((error) => {
    console.log(error);
  });
}

//document.querySelector('#edit').addEventListener('click', enableEditMode);
//document.querySelector('#save').addEventListener('click', handleSave);

export function setupEvent() {
  console.log("setupEvent");
  document.querySelector("#create-new-variable").addEventListener("click", addNewVariable);
  document.querySelector("#save").addEventListener("click", handleSave);
  document.querySelector("#cancel").addEventListener("click", cancelButton);
  document.querySelector("#new-constraint").addEventListener("click", makeNewConstraint);

  enableEditMode();
  
}


function addConstraint(constraintId) {
  let workspace = Blockly.getMainWorkspace();
  let code = JavaScript.workspaceToCode(workspace);
  try {
    console.log(code);
    
    let newCode = `
      {
        "methods": [${code.slice(0, code.length-1)}]
      }
    `
    code = JSON.parse(newCode)
    console.log(code.length);
    const allVars = []
    code["methods"].forEach(elem => {
      elem.inputs.forEach(input => {
        if (!allVars.includes(input)) {
          allVars.push(input)
        }
      })
      if (!allVars.includes(elem.outputs)) {
        allVars.push(elem.outputs)
      }
    })
    console.log(allVars);
    
    const methods = code["methods"].map(elem => {
      const inPositions = elem.inputs.map(inn =>
        allVars.indexOf(inn))
      const outPositions = allVars.indexOf(elem.outputs)
      return new Method(allVars.length, inPositions, [outPositions], [maskNone], eval(`(${elem.inputs.join(',')}) => {
        ${elem.code}
    }`));
    })

    if (comp.cs[constraintId]){
      console.log(comp.cs[constraintId])
      system.removeConstraint(comp.cs[constraintId])
      system.update();
      console.log(comp.cs[constraintId])
    }
    
    const vars = allVars.map(v => {return comp.getVariableReference(v)})
    const cspec = new ConstraintSpec(Array.from(methods));
    comp.emplaceConstraint(constraintId, cspec, vars, false);
    console.log(comp.constraintName(constraintId));
    system.update();

  } catch (error) {
    console.log(error);
  }
}


function lol() {
  /*
  component`
        var income = 500000, percentage = 30, time = 12, finnmark = false, deduction, tax, net_income;
        
        constraint {
            (income, percentage, deduction -> tax, net_income) => {
                var newTax = (income * percentage / 100) - deduction;
                var newNet_income = income - newTax;
                return [newTax, newNet_income];
            }
            (tax, net_income, deduction, percentage -> income) => {
                var newIncome = parseInt(net_income) + parseInt(tax);
                return newIncome;
            }
        }
        
        constraint {
            (finnmark, time -> deduction) => {
                var timeDeduction = 9163 * time;
                var finnmarkDeduction = 20000;
                if (finnmark) {
                    return timeDeduction + finnmarkDeduction;
                } else {
                    return timeDeduction;
                }
            }
        }
    `
    */
}