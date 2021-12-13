/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// images references in the manifest
import { ConstraintSystem, component, defaultConstraintSystem } from "../hotdrink/hotdrink";
import "../../assets/icon-16.png";
import "../../assets/icon-32.png";
import "../../assets/icon-80.png";
import {binder, addNewVariable, makeConstraint, bindToCelsius, bindToFahrenheit} from "../packages/binders"
import {siHei} from "../blockly/blockly"

/* global console, document, Excel, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    //document.getElementById("run").onclick = run;
    //document.getElementById("bindCellCelsius").onclick = bindToCelsius;
    //document.getElementById("bindCellFahrenheit").onclick = bindToFahrenheit;
    //document.getElementById("create-new-variable").onclick = addNewVariable;
    //document.getElementById("add-constraint").onclick = makeConstraint;
    siHei()

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

