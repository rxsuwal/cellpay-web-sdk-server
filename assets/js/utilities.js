
// CHECK FOR EMPTY PROPERTIES 
export const checkReceiverDetailsProperties = (object, source) => {

    let status = 0

    let length = Object.keys(object).length

    for (let key in object) {
        if (object[key] !== null && object[key] != "") {
            status = status + 1
        }
    }


    if (status === length) {
        return true
    } else if (status != length) {
        Swal.fire({
            title: "Config Data Missing !",
            text: '',
            icon: 'error',
            confirmButtonText: 'OK'
        })

        setTimeout(function () {
            source.postMessage('reload', "*")
        }, 2000)
    }





}

// UPDATE BASE URL
import { BASE_URL } from './api_utils.js'
export const updateBaseURL = (mode,source) => {
    if (mode === "test" || mode === "live") {
        if (mode == "test") {
            BASE_URL.url = "test"
            $('#cellpay_sdk_mode em').text(BASE_URL.url)

        } else if (mode == "live") {
            BASE_URL.url = "web"
            $('#cellpay_sdk_mode em').text('live')

        }
    } else if (mode != "test" || mode != "live") {
        Swal.fire({
            title: "Mode Mismatched !",
            text: '',
            icon: 'error',
            confirmButtonText: 'OK'
        })

        setTimeout(function () {
            source.postMessage('reload', "*")
        }, 2000)
    }
}

// CANCEL TRANSACTION
export const cancelTxn = (source) => {

    let cancelbtn = document.querySelectorAll("button[type=reset]");

    for (let i = 0; i < cancelbtn.length; i++) {
        cancelbtn[i].addEventListener('click', function () {
            

            source.postMessage('reload', "*")
        })
    }
}