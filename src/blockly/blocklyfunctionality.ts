import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";
import {
  Component,
  defaultConstraintSystem,
  ConstraintSpec,
  Method,
  maskNone,
} from "../hotdrink/hotdrink";
import { binder } from "../packages/binders";
let variableCount = 97;
let variableList = [];

const system = defaultConstraintSystem;
let comp = new Component("Component");
system.addComponent(comp);
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

export function setupVariableBlock() {
  Blockly.Blocks["variables"] = {
    init: function () {
      this.appendDummyInput().appendField("").appendField(new Blockly.FieldDropdown(this.onchange), "FIELD_NAME");
      this.setColour(230);
      this.setOutput(true);
    },
    onchange: function (e) {
      return variableList.length > 0 ? variableList : [["", ""]];
    },
  };

  JavaScript["variables"] = function (block) {
    let code = block.getFieldValue("FIELD_NAME");
    return [code, 0];
  };
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
    

    let success = addConstraint(currentButton.id);
    if (success) {
      if (!constraintList.includes(currentButton.id)) {
        constraintList.push(currentButton.id)
      }
      document.body.setAttribute("mode", "edit");
      save(currentButton);
    }
    return context.sync();
  }).catch((error) => {
    console.log(error);
  });
}

function cancelButton() {
  document.getElementById("blockly-error").innerHTML = "";
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

function changeName(event, index, name) {
  if (!event) {
    let tempVar = variableList[index];
    tempVar = [name, tempVar[1]];
    variableList[index] = tempVar;
    return;
  }
  let tempVar = variableList[index];
  tempVar = [event.target.value, tempVar[1]];
  variableList[index] = tempVar;
}

export function addNewVariable() {
  const letter = String.fromCharCode(variableCount);
  variableList.push([letter, letter]);
  const index = letter.charCodeAt(0) - 97;
  const variableName = variableList[index][0];
  variableCount++;
  const wrapper = document.createElement("div");
  wrapper.classList.add("variable");
  wrapper.id = `${letter}wrapper`;
  wrapper.innerHTML = ` <input value=${variableName} id="${letter}input" class="letter"></input>
                        <p class="cell" id="${letter}cell"></p>
                        <button id="${letter}button" class="knapp">Bind to active cell</button>`;
  document.getElementById("variables").appendChild(wrapper);
  document.getElementById(`${letter}input`).addEventListener("change", function (event) {
    changeName(event, index, null);
  });
  document.getElementById(`${letter}button`).addEventListener("click", function () {
    saveToCurrentCell(`${letter}`);
  });

  comp.emplaceVariable(letter, null);
  binder(comp.vs[letter], letter);
  setupVariableBlock();
}

function addOnClick() {
  Excel.run(function (context) {
    for (let i = 0; i < variableList.length; i++) {
      document.getElementById(`${variableList[i]}button`).addEventListener("click", function () {
        saveToCurrentCell(`${variableList[i]}`);
      });
    }
    return context.sync();
  }).catch((error) => {
    console.log(error);
  });
}

let totalConstraintsMade = 0;
let activeConstraints = []
let constraintList = [];

function makeNewConstraint() {
  const cCount = ++totalConstraintsMade;
  activeConstraints.push(cCount)
  const wrapper = document.createElement("div");
  wrapper.classList.add("constraint");
  wrapper.id = `${cCount}wrapper`;
  wrapper.innerHTML = ` <input value="Constraint ${cCount}" class="letter"></input>
                        <button id=${cCount} class="button blockly knapp">Edit</button>
                        <button id="${cCount}delete" class="delete">Delete</button>`;
  document.getElementById("constraints").appendChild(wrapper);
  wrapper.querySelector(".button").addEventListener("click", enableBlocklyMode);
  document.querySelector(".button").addEventListener("click", enableBlocklyMode);
  document.getElementById(`${cCount}delete`).addEventListener("click", function () {
    deleteConstraint(`${cCount}`);
  });  
}

function enableBlocklyMode(e) {
  document.body.setAttribute("mode", "blockly");
  currentButton = e.target;
  loadWorkspace(currentButton);
}

function bindValueToCell(id) {
  Office.context.document.bindings.addFromSelectionAsync(Office.BindingType.Text, { id: id }, function (asyncResult) {
    if (asyncResult.status == Office.AsyncResultStatus.Failed) {

    } else {
      Excel.run(function (context) {
        var activeCell = context.workbook.getActiveCell();
        activeCell.load("address");

        return context.sync().then(function () {
          document.getElementById(`${id}cell`).innerHTML = ` = ${activeCell.address}`;
        });
      }).catch((e) => {
      });
    }
  });
}

function bindRange() {
  Excel.run(async (context) => {
    let range = context.workbook.getSelectedRange();

    range.load("address");
    range.load("columnCount");

    context.sync().then(() => {
      if (range.columnCount !== 1) {
        return;
      }
      const sheet = context.workbook.worksheets.getActiveWorksheet();
      let newRange = sheet.getRange(range.address);
      newRange.load(["values"]);

      context.sync().then(() => {
        let myValues = newRange.values;
        for (let i = 0; i < myValues.length; i++) {
          addNewVariable();
          var inputF = document.getElementById(`${variableList[variableList.length - 1][1]}input`);
          inputF.setAttribute("value", myValues[i][0]);
          changeName(null, variableList.length - 1, myValues[i][0]);
        }
      });
    });
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
  document.querySelector("#create-new-variable").addEventListener("click", addNewVariable);
  document.querySelector("#save").addEventListener("click", handleSave);
  document.querySelector("#cancel").addEventListener("click", cancelButton);
  document.querySelector("#new-constraint").addEventListener("click", makeNewConstraint);
  document.querySelector("#create-variable-range").addEventListener("click", bindRange);

  enableEditMode();
}

function addConstraint(constraintId) {
  let workspace = Blockly.getMainWorkspace();
  let code = JavaScript.workspaceToCode(workspace);
  try {
    code = code.replace(/(\n)/gm, "");

    let newCode = `
      {
        "methods": [${code.slice(0, code.length - 1)}]
      }
    `;

    try {
      code = JSON.parse(newCode);
    } catch (e) {
      document.getElementById("blockly-error").innerHTML = "There is something wrong with your code";
      return false;
    }
    const allVars = [];
    code["methods"].forEach((elem) => {
      elem.inputs.forEach((input) => {
        if (!allVars.includes(input)) {
          allVars.push(input);
        }
      });
      elem.outputs.forEach((output) => {
        if (!allVars.includes(output)) {
          allVars.push(output);
        }
      });
    });

    const methods = code["methods"].map((method) => {
      const inPositions = method.inputs.map((inn) => allVars.indexOf(inn));
      const outPositions = method.outputs.map((out) => allVars.indexOf(out));
      return new Method(allVars.length, inPositions, outPositions, [maskNone], eval(`(${method.inputs.join(",")}) => {
        ${method.code}
        }`)
      );
    }); 
    const oldConstraint = comp.cs[constraintId];
    if (oldConstraint) {
      return addNewComponent(constraintId, methods, allVars);
    }

    const vars = allVars.map((v) => {
      return comp.getVariableReference(v);
    });
    const cspec = new ConstraintSpec(Array.from(methods));
    comp.emplaceConstraint(constraintId, cspec, vars, false);
    system.update();
    document.getElementById("blockly-error").innerHTML = "";
    return true;
  } catch (error) {
    console.log(error);

    document.getElementById("blockly-error").innerHTML = "There is something wrong with your code";
    return false;
  }
}

let componentNumber = 0
function addNewComponent(constraintId, methods, allVars) {
  try {
    
    if (constraintList.includes(constraintId)) {
      
      if (!methods && !allVars) {
        constraintList = constraintList.filter(elem => elem != constraintId)
      }
    
    system.removeComponent(comp);
    componentNumber++;
    let newComp = new Component(`Component${componentNumber}`);
    system.addComponent(newComp);
    for (let i = 0; i < variableList.length; i++) {
      newComp.emplaceVariable(variableList[i][1], null);
      binder(newComp.vs[variableList[i][1]], variableList[i][1]);
    }
    for (let id in constraintList) {
      if (constraintList[id] !== constraintId) {
        
        const compVars = comp.cs[constraintList[id]]["_varRefs"];
        const compCspec = comp.cs[constraintList[id]]["_cspec"];
        const someVars = compVars.map((v) => {
            return newComp.getVariableReference(v.name);
        });
        
        newComp.emplaceConstraint(constraintList[id], compCspec, someVars, false);
        system.update();
        
      }
    }
    if (methods && allVars) {
    const vars = allVars.map((v) => {
      return newComp.getVariableReference(v);
    });
    const cspec = new ConstraintSpec(Array.from(methods));
    newComp.emplaceConstraint(constraintId, cspec, vars, false);
  }
    
    comp = newComp;
    
    system.update();
    document.getElementById("blockly-error").innerHTML = "";
    return true;
}
  } catch (e) {
    console.log(e);
    document.getElementById("blockly-error").innerHTML = "There is something wrong with your code";
    return false;
  }
}

function deleteConstraint(constraintId) {
  addNewComponent(constraintId, null, null)
  document.getElementById(`${constraintId}wrapper`).remove()
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
