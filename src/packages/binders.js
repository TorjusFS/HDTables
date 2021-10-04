   
export function binder(value, binding) {
        value.value.subscribe({
            next: val => {
                if (val.hasOwnProperty('value')) {
                    Office.select(`bindings#${binding}`).getDataAsync(function (asyncResult) {
                        if (asyncResult.value !== val.value) {
                            console.log("Something");
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
                    console.log(asyncResult);
                    if (value.value !== asyncResult.value) {
                        value.value.set(asyncResult.value)
                        
                    }
                }
        )})
    
   
}


function dataChanged(value, asyncResult) {
    console.log("DATA CHANGED!!!");
    value.value.set(asyncResult.value)
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