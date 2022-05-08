import { ConstraintSystem, Component, defaultConstraintSystem, component, ConstraintSpec, Method, maskNone  } from "../hotdrink/hotdrink";

//TODO add global list with all variables
let variableCount = 97
let variableList = []

export function binder(value, binding) {
        console.log(value)
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
                    if (value.value._value !== asyncResult.value) {
                        console.log("AsyncResult " + asyncResult.value);
                        value.value.set(asyncResult.value)
                    }
                }
        )})
    
   
}

export function bindToFahrenheit() {
    Office.context.document.bindings.addFromSelectionAsync(
        Office.BindingType.Text,
        { id: "fahrenheitBinding" },
        function (asyncResult) {
            if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                console.log("Failed to bind");
            } else {
                Excel.run(function (context) {
                    return context.sync()
                }).catch( e => {
                    console.log("Could not get active cell");
                });
            }
        });
}



export function bindToCelsius() {
    Office.context.document.bindings.addFromSelectionAsync(
        Office.BindingType.Text,
        { id: "celciusBinding" },
        function (asyncResult) {
            if (asyncResult.status == Office.AsyncResultStatus.Failed) {
                console.log("Failed to bind");
            } else {
                Excel.run(function (context) {
                    return context.sync()
                }).catch( e => {
                    console.log("Could not get active cell");
                });
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

const alphabet = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","w","r","s","t","u","v","w","x","y","z"];


export function saveToCurrentCell(id) {
    Excel.run(function (context) {
        bindValueToCell(id)
        return context.sync()
    }).catch(error => {
        console.log(error);
    });
}

export function addNewVariable() {
    console.log("MOHAHAHAH");
    console.log("Add new variable");
    const letter = String.fromCharCode(variableCount);
    variableList.push(letter)
    variableCount++;
    document.getElementById("variables").innerHTML += 
        `<div class="variable" id="${letter}wrapper">
            <p class="letter">${letter}</p>
            <p class="cell" id="${letter}cell"></p>
            <button id="${letter}button">Bind to active cell</button>
        </div>`
    
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


export function makeConstraint() {
    console.log("YAHAHAH");
    /*
    const system = defaultConstraintSystem;
    let comp = system.getComponentByName("Component");
    if(comp == null){
        comp = new Component("Component");
        system.addComponent(comp);
    }
    */
    const constraint = document.getElementById("constraint-field").value
    
    try {
        console.log("Started try");
        const regex = /^(.+)=(\s*([a-z]?)(.*)?)/;
        const match = regex.exec(constraint)
        if (!match) {
            throw "The expression is not correctly typed"
        }
        console.log(match[1]);
        console.log(match[2]);
        console.log(match[3]);
        const method1 = new Method(2, [1], [0], [maskNone], eval(`(${match[3]}) => {
            return ${match[2]}
        }`));
    
        const cspec = new ConstraintSpec(Array.from([method1]));
        console.log(cspec);
        
        const varA = comp.emplaceVariable("a");
        const varB = comp.emplaceVariable("b");
    
        comp.emplaceConstraint("C", cspec, [varA, varB], false);
        /*
        const vars = ["a","b"]
        const constraints = ["(a -> b) => a * 2;","(b -> a) => b / 2;"]

        const comp = component`
         var ${vars.join(", ")};
         constraint {
             ${constraints.join("\n")}
         }
        `
        */
        //TODO remove old comp
        system.addComponent(comp)
        system.update();
    
        //TODO unsubscribe before re-binding
        //TODO binder(comp.vs[match[1].replace(" ", "")], match[1].replace(" ", ""));
        binder(comp.vs.a, match[1].replace(" ", ""));
        binder(comp.vs.b, match[3]);

        document.getElementById("added-constraints").innerHTML += `<p>${constraint}</p>`
    }
    catch(e) {
        console.log(e);
        document.getElementById("error-message").innerHTML = `<p>Your variables or constraints are not correctly typed</p>`
        return
    }
}