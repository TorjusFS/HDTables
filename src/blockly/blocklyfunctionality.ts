import * as Blockly from "blockly";
import * as JavaScript from "blockly/javascript";

let variableCount = 97;
let variableList = [];

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
    return [code, 0]
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
    let code = JavaScript.statementToCode(block, 'METHOD');
    return code
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
    console.log("HandleSave");
    testCode()
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


export function addNewVariable() {
  console.log("Add new variable");
  const letter = String.fromCharCode(variableCount);
  variableList.push([letter, letter]);
  console.log(letter);

  variableCount++;
  const wrapper = document.createElement("div");
  wrapper.classList.add("variable");
  wrapper.id = `${letter}wrapper`;
  wrapper.innerHTML = ` <p class="letter">${letter}</p>
                        <p class="cell" id="${letter}cell"></p>
                        <button id="${letter}button">Bind to active cell</button>
                        <button class="button blockly">Edit constraint</button>`;
  document.getElementById("variables").appendChild(wrapper)
  wrapper.querySelector(".button").addEventListener("click", enableBlocklyMode);
  document.getElementById(`${letter}button`).addEventListener("click", function () {
    saveToCurrentCell(`${letter}`);
  });
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
  enableEditMode();
  
}
