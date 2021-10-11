   
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
                console.log("Binded cell to" + id);
            }
        });
}

const alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];


export function saveToCurrentCell(id) {
    Excel.run(function (context) {
        var activeCell = context.workbook.getActiveCell();
        activeCell.values = document.getElementById(`${id}`).value
        return context.sync()
    }).catch(error => {
        console.log(error);
    });
}

export function addNewVariable() {
    const count = document.getElementById("variables").childElementCount
    document.getElementById("variables").innerHTML += 
        `<div class="variable">
            <p>${alphabet[count]}</p>
            <input id="${alphabet[count]}input"/>
            <button id="${alphabet[count]}button">Save to current cell</button>
        </div>`
    
    addOnClick(count)
  }

function addOnClick(count) {
    for (let i = 0; i <= count; i++) {
        document.getElementById(`${alphabet[i]}button`).addEventListener("click", function () {
            saveToCurrentCell(`${alphabet[i]}input`)
        }) 
    }
}