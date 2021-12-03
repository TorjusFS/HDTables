/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */
 import {addOnClick} from './binders'

 let variableCount = 97;
 let variableList = [];

 (function() {

    let currentButton;
    

    function enableEditMode() {
      console.log("osnefioe");
    document.body.setAttribute('mode', 'edit');
    document.querySelectorAll('.button').forEach(btn => {
      btn.addEventListener('click', enableBlocklyMode);
    });
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
  
   
  
    function enableBlocklyMode(e) {
      document.body.setAttribute('mode', 'blockly');
      currentButton = e.target;
      loadWorkspace(currentButton);
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
  
    //document.querySelector('#edit').addEventListener('click', enableEditMode);
    //document.querySelector('#save').addEventListener('click', handleSave);
    document.querySelector("#create-new-variable").addEventListener('click', addNewVariable)
    enableEditMode();
  
    Blockly.inject('blocklyDiv', {
      toolbox: document.getElementById('toolbox'),
      scrollbars: false
    });
  
  })();
  