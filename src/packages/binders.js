import { ConstraintSystem, Component, defaultConstraintSystem, ConstraintSpec, Method, maskNone  } from "../hotdrink/hotdrink";

export function binder(value, binding) {
        value.value.subscribe({
            next: val => {
                if (val.hasOwnProperty('value')) {
                    Office.select(`bindings#${binding}`).getDataAsync(function (asyncResult) {
                        if (asyncResult.value !== val.value) {
                            Office.select(`bindings#${binding}`).setDataAsync(val.value, function (asyncResult3) {

                            })
                    }
                    })
                    
                    
                }
            }
        });
        Office.select(`bindings#${binding}`).addHandlerAsync(
            Office.EventType.BindingDataChanged, function() {
                Office.select(`bindings#${binding}`).getDataAsync(function (asyncResult) {
                    if (value.value !== asyncResult.value) {
                        value.value.set(asyncResult.value)
                        
                    }
                }
        )})
    
   
}

export function bindCellCelsius() {
  Office.context.document.bindings.addFromSelectionAsync(
    Office.BindingType.Text,
    { id: "celciusBinding" },
    function (asyncResult) {
        if (asyncResult.status == Office.AsyncResultStatus.Failed) {
            console.log("Failed to bind");
        } else {
            console.log("Binded cell to celsius");
        }
    });
}

export function bindCellFahrenheit() {
    Office.context.document.bindings.addFromSelectionAsync(
      Office.BindingType.Text,
      { id: "fahrenheitBinding" },
      function (asyncResult) {
          if (asyncResult.status == Office.AsyncResultStatus.Failed) {
              console.log("Failed to bind");
          } else {
              console.log("Binded cell to fahrenheit");
          }
      });
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

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];


export function saveToCurrentCell(id) {
    Excel.run(function (context) {
        bindValueToCell(id)
        return context.sync()
    }).catch(error => {
        console.log(error);
    });
}

export function addNewVariable() {
    console.log("Add new variable");
    const count = document.getElementById("variables").childElementCount
    document.getElementById("variables").innerHTML += 
        `<div class="variable" id="${alphabet[count]}wrapper">
            <p class="letter">${alphabet[count]}</p>
            <p class="cell" id="${alphabet[count]}cell"></p>
            <button id="${alphabet[count]}button">Bind to active cell</button>
        </div>`
    
    addOnClick(count)
  }

function addOnClick(count) {
    for (let i = 0; i <= count; i++) {
        document.getElementById(`${alphabet[i]}button`).addEventListener("click", function () {
            saveToCurrentCell(`${alphabet[i]}`)
        }) 
    }
}


export function makeConstraint() {
    const system = defaultConstraintSystem;
    const constraint = document.getElementById("constraint-field").value
    const constraint2 = document.getElementById("constraint-field2").value

    const firstVal = document.getElementById("first-val").value
    const secondVal = document.getElementById("second-val").value

    try {
        const test = eval(`(${secondVal}) => {
            return ${constraint}
        }`)
        const test2 = eval(`(${firstVal}) => {
            return ${constraint2}
        }`)
        test(firstVal)
        test2(secondVal)
        document.getElementById("added-constraints").innerHTML += `<p>${firstVal} = ${constraint}</p>`
        document.getElementById("added-constraints").innerHTML += `<p>${secondVal} = ${constraint2}</p>`
    }
    catch {
        document.getElementById("error-message").innerHTML = `<p color="red">Your variables or constraints are not correctly typed</p>`
        return
    }
    const method1 = new Method(2, [1], [0], [maskNone], eval(`(${secondVal}) => {
        return ${constraint}
    }`));
    const method2 = new Method(2, [1], [0], [maskNone], eval(`(${firstVal}) => {
        return ${constraint2}
    }`));

    const cspec = new ConstraintSpec(Array.from([method1, method2]));

    const comp = new Component("Component");
    const varA = comp.emplaceVariable(firstVal);
    const varB = comp.emplaceVariable(secondVal);

    comp.emplaceConstraint("C", cspec, [varA, varB], false);
    
    system.addComponent(comp);
    system.update();


    binder(comp.vs.b, firstVal);
    binder(comp.vs.a, secondVal);
}