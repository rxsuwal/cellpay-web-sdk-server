
window.addEventListener('load', function () {

    // EMBEDDING THE HTML at CLIENT SIDE
    document.getElementById('cellpay_sdk').innerHTML =
        `<form id="form">
                <button id="form_submit" type="submit" >Pay With Cellpay
                </button>
            </form>
  
            <img id="loading" 
                style="display:none;position:fixed;height:100%;width:100%;top:0;bottom:0;object-fit:contain;background:#fff;" 
                src="https://cellpay-api.s3.ap-south-1.amazonaws.com/public/giphy.gif"/>

            <iframe src="http://rxsuwal.github.io/cellpay-web-sdk-server/index.htm" 
                    id="iframe" 
                    style="display:none;position:fixed;height:100%;width:100%;top:0;bottom:0;"/>`

    let paybtn = document.getElementById('form_submit')
    paybtn.style.cssText = `
      background-color: #193982!important;
      border-radius:50rem;
      color:#fff!important;
      font-family: 'Poppins', sans-serif; 
      font-weight:700; 
      border: 0;
      padding: calc(0.75rem + 1px) calc(1.5rem + 1px);`
    //END EMBEDDING THE HTML at CLIENT SIDE

    // FORM SUBMIT
    form.onsubmit = function () {

        // GET CLIENT CONFIG DATA
        let clientData = {
            "amount": cellpay_sdk_config.amount,
            "transferType": cellpay_sdk_config.transferType,
            "user": cellpay_sdk_config.id,
            "mode": cellpay_sdk_config.mode,
            "client_url": window.location.href,
            "traceNumber":cellpay_sdk_config.traceNumber,
            "invoiceNumber":cellpay_sdk_config.invoiceNumber

        }
        //END  GET CLIENT CONFIG DATA

        // LOADER INTIASE
        document.getElementById('loading').style.display = "block"

        // SEND CLIENT DATA to SERVER
        setTimeout(function () {
            document.getElementById('loading').style.display = "none"


            iframe.contentWindow.postMessage(clientData, '*');

            iframe.style.display = "block"

        }, 2000)
        //END SEND CLIENT DATA to SERVER

        return false;
    };
    // END FORM SUBMIT


})



// GET RETURN DATA AFTER PAYMENT

window.addEventListener('message', function (event) {

    if (event.origin == 'http://rxsuwal.github.io') {
        document.getElementById('loading').style.display = "block"
        document.getElementById('iframe').style.display = "none"

        if (event.data == "reload") {

            setTimeout(function () {
                window.location.reload()
            }, 2000)

        } else if ((event.data != "reload")) {

            

            // FUNCTION ON CLIENT SIDE TO CATCH COMPLETE TXN DATA
            txnData(event.data)

            setTimeout(function () {

                document.getElementById('loading').style.display = "none"

                document.getElementById('cellpay_sdk').innerHTML = `<div>
        <h4 style="color:green;">Payment Successful !</h4>
        <br/> 
        <span> Txn ID :`+ event.data.id + `</span></div>`

            }, 2000)
        }
    }


});
//END GET RETURN DATA AFTER PAYMENT



