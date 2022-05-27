/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// images references in the manifest
import { component, defaultConstraintSystem } from "../hotdrink/hotdrink";
import "../../assets/icon-16.png";
import "../../assets/icon-32.png";
import "../../assets/icon-80.png";
import {binder} from "../packages/binders"
//import {setupSoundBlocks} from "../blockly/sound_blocks"
import {setupVariableBlock} from "../blockly/blocklyfunctionality"
import { setupToolbox } from "../blockly/toolbox";
import { setupRetrun } from "../blockly/returnBlock";
import {setupEvent} from "../blockly/blocklyfunctionality"
import { setupTempVarSetter, setupTempVarGetter, setupUpdateTempVar} from "../blockly/tempVarBlock";
import { setupMethodBlock } from "../blockly/methodBlock";
import { setupVariablePairBlock } from "../blockly/hotdrinkVarPairBlock";


Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    setupToolbox()
    setupRetrun()
    setupMethodBlock()
    setupVariableBlock()
    setupVariablePairBlock()
    setupEvent()
    setupTempVarSetter()
    setupTempVarGetter()
    setupUpdateTempVar()
    
    
  }
});


export async function run() {
  try {
    await Excel.run(async (context) => {
      console.log("Clicked run");
      
      const system = defaultConstraintSystem;
      const comp = component`
           component comp {
               var c = 1, f;
               constraint {
                   (f -> c) => (f - 31) / 1.8;
                   (c -> f) => (c * 1.8) + 31;
               }
           }
       `;
      system.addComponent(comp);
      binder(comp.vs.c, "celciusBinding");
      binder(comp.vs.f, "fahrenheitBinding");
      system.update();
      await context.sync();
    });
  } catch (error) {
    console.error(error);
  }
}

