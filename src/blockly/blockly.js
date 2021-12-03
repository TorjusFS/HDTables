
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

 let variableCount = 97;
 let variableList = [];


    let currentButton;
  
    function handlePlay(event) {
      loadWorkspace(event.target);
      let code = Blockly.JavaScript.workspaceToCode(Blockly.getMainWorkspace());
      code += 'MusicMaker.play();';
      try {
        eval(code);
      } catch (error) {
        console.log(error);
      }
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
      document.body.setAttribute('mode', 'edit');
      save(currentButton);
    }
  
    function enableMakerMode() {
      document.body.setAttribute('mode', 'maker');
      document.querySelectorAll('.button').forEach(btn => {
        btn.addEventListener('click', handlePlay);
        btn.removeEventListener('click', enableBlocklyMode);
      });
    }

    function enableEditMode() {
      document.body.setAttribute('mode', 'edit');
      document.querySelectorAll('.button').forEach(btn => {
        btn.addEventListener('click', enableBlocklyMode);
      });
    }
  
    function addNewVariable() {
      console.log("Add new variable");
      const letter = String.fromCharCode(variableCount);
      variableList.push(letter)
      variableCount++;
      document.getElementById("variables").innerHTML += 
          `<div class="variable" id="${letter}wrapper">
              <p class="letter">${letter}</p>
              <p class="cell" id="${letter}cell"></p>
              <button id="${letter}button">Bind to active cell</button>
              <button class="button blockly">Add constraint</button>
          </div>`
      enableEditMode()
      addOnClick()
    }

    function addOnClick() {
      for (let i = 0; i < variableList.length; i++) {
          console.log(variableList[i]);
          document.getElementById(`${variableList[i]}button`).addEventListener("click", function () {
              saveToCurrentCell(`${variableList[i]}`)
          }) 
      }
  }
  
    



    function enableBlocklyMode(e) {
      document.body.setAttribute('mode', 'blockly');
      currentButton = e.target;
      loadWorkspace(currentButton);
    }

    
function bindValueToCell(id) {
  Office.context.document.bindings.addFromSelectionAsync(
      Office.BindingType.Text,
      { id: id },
      function (asyncResult) {
          if (asyncResult.status == Office.AsyncResultStatus.Failed) {
              console.log("Failed to bind");
          } else {
              Excel.run(function (context) {
                  var activeCell = context.workbook.getActiveCell();
                  activeCell.load("address");
              
                  return context.sync().then(function () {
                      console.log(`Binded ${activeCell.address.slice(7)} to ${id}`);
                      console.log("The active cell is " + activeCell.address);
                      document.getElementById(`${id}cell`).innerHTML = ` = ${activeCell.address.slice(7)}`
                  });
              }).catch( e => {
                  console.log("Could not get active cell");
              });
          }
      });
}


function saveToCurrentCell(id) {
  Excel.run(function (context) {
      bindValueToCell(id)
      return context.sync()
  }).catch(error => {
      console.log(error);
  });
}

    //document.querySelector('#edit').addEventListener('click', enableEditMode);
    //document.querySelector('#save').addEventListener('click', handleSave);

    document.querySelector("#addhtml").addEventListener('click', addNewVariable)
    document.querySelector('#save').addEventListener('click', handleSave);
    enableEditMode()

  
    Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById('toolbox'),
      scrollbars: false
    });
