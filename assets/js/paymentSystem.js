import { BASE_URL } from "./api_utils.js";

import { transferTypeIdList } from './transferTypeIdList.js'


let customValues = (name, id, value) => {
    if (value === 'Bank') {
        return {
            "internalName": name,
            "fieldId": id,
            "value": "Account"
        }
    } else if (value === 'Wallet') {
        return {
            "internalName": name,
            "fieldId": id,
            "value": "Mobile Wallet"
        }
    } else {
        return {
            "internalName": name,
            "fieldId": id,
            "value": value
        }
    }



}




// CHECK FOR PAYMENT TYPES
let BASE_URL_MEMBER_PAYMENT
let BASE_URL_SYSTEM_PAYMENT
export const paymentSystem = async (sessionId, transferTypeId, receiver, sender) => {
    BASE_URL_MEMBER_PAYMENT = "https://" + BASE_URL.url + ".cellpay.com.np/rest/payments/memberPayment"
    BASE_URL_SYSTEM_PAYMENT = "https://" + BASE_URL.url + ".cellpay.com.np/rest/payments/systemPayment"

    let typeId = null

    switch (true) {
        case (transferTypeId === "1" && sender.paymentMethod === "Bank"):
            typeId = "50"
            break;

        case (transferTypeId === "1" && sender.paymentMethod === "Wallet"):
            typeId = "68"
            break;
        case (transferTypeId === "2" && sender.paymentMethod === "Bank"):
            typeId = "460"
            break;
        case (transferTypeId === "2" && sender.paymentMethod === "Wallet"):
            typeId = "461"
            break;
        case (transferTypeId === "3" && sender.paymentMethod === "Bank"):
            typeId = "174"
            break;
        case (transferTypeId === "3" && sender.paymentMethod === "Wallet"):
            typeId = "282"
            break;


        default:
            break;

    }

    



    if (transferTypeIdList.member.includes(typeId)) {
        

        return await new Promise((resolve, reject) => {
            memberPayment(sessionId, typeId, receiver, sender)
                .then(rspnse => {
                    
                    resolve(rspnse)
                })
                .catch(err => {
                    
                    reject(err.response)
                })
        })

    } else if (transferTypeIdList.system.includes(typeId)) {
        

        return await new Promise((resolve, reject) => {
            systemPayment(sessionId, typeId, receiver, sender)
                .then(rspnse => {
                    
                    resolve(rspnse)
                })
                .catch(err => {
                    
                    reject(err.response)
                })
        })
    }

}

// MEMBER PAYMENT

export const memberPayment = async (sessionToken, transferTypeId, receiver, sender) => {
    


    let body = {
        "transferTypeId": transferTypeId,
        "toMemberPrincipal": receiver.id,
        "amount": receiver.amount,
        "description": "Account-Account Transfer",
        "currencyId": "1",
        "webRequest": true,
        "traceNumber": receiver.traceNumber,
        "customValues": [
            customValues("PAYMENTMETHOD", "15", sender.paymentMethod),
            customValues("INVOICE_NUMBER", "99", receiver.invoiceNumber)

        ],
        "isOtpEnable": false
    }

    // FOR PAYMENT METHOD BANk
    if (sender.paymentMethod == "Bank") {
        body.customValues.push(customValues("SELECTBANK", "35", sender.paymentCustomValues.bankCode)),
            body.customValues.push(customValues("ACCOUNTNUMBER", "14", sender.paymentCustomValues.accountNumber))
    }


    const header = {
        "Content-Type": "application/json",
        "PAYNET-SESSION-TOKEN": sessionToken
    }


    

    return await new Promise((resolve, reject) => {
        axios.post(BASE_URL_MEMBER_PAYMENT, body, {
            headers: header
        }).then(rspnse => {
            
            resolve(rspnse)

        })
            .catch(err => {
                
                reject(err)
            })
    })


}

// SYSTEM PAYMENT

export const systemPayment = async (sessionToken, transferTypeId, receiver, sender) => {
    let body = {
        "transferTypeId": transferTypeId,
        "amount": receiver.amount,
        "description": receiver.invoiceNumber,
        "currencyId": "1",
        "webRequest": true,
        "traceNumber": receiver.traceNumber,
        "customValues": [
            customValues("PAYMENTMETHOD", "15", sender.paymentMethod),
            customValues("MOBILENUMBER", "16", receiver.id),


        ],
        "isOtpEnable": false
    }

    // FOR PAYMENT METHOD BANK
    if (sender.paymentMethod == "Bank") {
        body.customValues.push(customValues("SELECTBANK", "35", sender.paymentCustomValues.bankCode)),
            body.customValues.push(customValues("ACCOUNTNUMBER", "14", sender.paymentCustomValues.accountNumber))
    }


    const header = {
        "Content-Type": "application/json",
        "PAYNET-SESSION-TOKEN": sessionToken
    }


    

    return await new Promise((resolve, reject) => {
        axios.post(BASE_URL_SYSTEM_PAYMENT, body, {
            headers: header
        }).then(rspnse => {
            
            resolve(rspnse)

        })
            .catch(err => {
                
                reject(err)
            })
    })
}




// CHECK FOR CONFIRM PAYMENT TYPES
let BASE_URL_CONFIRM_MEMBER_PAYMENT
let BASE_URL_CONFIRM_SYSTEM_PAYMENT

export const confirmPaymentSystem = async (sessionId, transferTypeId, receiver, sender, txnPin, otp) => {

    BASE_URL_CONFIRM_MEMBER_PAYMENT = "https://" + BASE_URL.url + ".cellpay.com.np/rest/payments/confirmMemberPayment"
    BASE_URL_CONFIRM_SYSTEM_PAYMENT = "https://" + BASE_URL.url + ".cellpay.com.np/rest/payments/confirmSystemPayment"


    let typeId = null

    switch (true) {
        case (transferTypeId === "1" && sender.paymentMethod === "Bank"):
            typeId = "50"
            break;

        case (transferTypeId === "1" && sender.paymentMethod === "Wallet"):
            typeId = "68"
            break;
        case (transferTypeId === "2" && sender.paymentMethod === "Bank"):
            typeId = "460"
            break;
        case (transferTypeId === "2" && sender.paymentMethod === "Wallet"):
            typeId = "461"
            break;
        case (transferTypeId === "3" && sender.paymentMethod === "Bank"):
            typeId = "174"
            break;
        case (transferTypeId === "3" && sender.paymentMethod === "Wallet"):
            typeId = "282"
            break;

        default:
            break;

    }

    if (transferTypeIdList.member.includes(typeId)) {
        

        

        return await new Promise((resolve, reject) => {
            confirmMemberPayment(sessionId, typeId, receiver, sender, txnPin, otp)
                .then(rspnse => {
                    
                    resolve(rspnse)
                })
                .catch(err => {
                    
                    reject(err.response)
                })
        })

    } else if (transferTypeIdList.system.includes(typeId)) {

        

        return await new Promise((resolve, reject) => {
            confirmSystemPayment(sessionId, typeId, receiver, sender, txnPin, otp)
                .then(rspnse => {
                    
                    resolve(rspnse)
                })
                .catch(err => {
                    
                    reject(err.response)
                })
        })
    }

}

// CONFIRM MEMBER PAYMENT

export const confirmMemberPayment = async (sessionToken, transferTypeId, receiver, sender, txnPin, otp) => {

    const body = {
        "transferTypeId": transferTypeId,
        "toMemberPrincipal": receiver.id,
        "amount": receiver.amount,
        "description": "Account-Account Transfer",
        "currencyId": "1",
        "webRequest": true,
        "traceNumber": receiver.traceNumber,
        "customValues": [
            customValues("PAYMENTMETHOD", "15", sender.paymentMethod),
            customValues("INVOICE_NUMBER", "99", receiver.invoiceNumber)

        ],
        "transactionPin": txnPin
    }

    // FOR PAYMENT METHOD BANK
    if (sender.paymentMethod == "Bank") {
        body.customValues.push(customValues("SELECTBANK", "35", sender.paymentCustomValues.bankCode)),
            body.customValues.push(customValues("ACCOUNTNUMBER", "14", sender.paymentCustomValues.accountNumber))
    }

    // FOR OTP STATUS
    if (otp === "") {
        body.isOtpEnable = "false"
    } else if (otp != "") {
        body.isOtpEnable = "true"
        body.otp = otp

    }



    const header = {
        "Content-Type": "application/json",
        "PAYNET-SESSION-TOKEN": sessionToken
    }

    return await new Promise((resolve, reject) => {
        axios.post(BASE_URL_CONFIRM_MEMBER_PAYMENT, body, {
            headers: header
        }).then(rspnse => {
            
            resolve(rspnse)

        })
            .catch(err => {
                
                reject(err)
            })
    })


}

// CONFIRM SYSTEM PAYMENT

export const confirmSystemPayment = async (sessionToken, transferTypeId, receiver, sender, txnPin, otp) => {

    const body = {
        "transferTypeId": transferTypeId,
        "amount": receiver.amount,
        "description": receiver.invoiceNumber,
        "currencyId": "1",
        "webRequest": true,
        "traceNumber": receiver.traceNumber,
        "customValues": [
            customValues("PAYMENTMETHOD", "15", sender.paymentMethod),
            customValues("MOBILENUMBER", "16", receiver.id),


        ],
        "transactionPin": txnPin
    }

    // FOR PAYMENT METHOD BANK
    if (sender.paymentMethod == "Bank") {
        body.customValues.push(customValues("SELECTBANK", "35", sender.paymentCustomValues.bankCode)),
            body.customValues.push(customValues("ACCOUNTNUMBER", "14", sender.paymentCustomValues.accountNumber))
    }

    // FOR OTP STATUS
    if (otp === "") {
        body.isOtpEnable = "false"
    } else if (otp != "") {
        body.isOtpEnable = "true"
        body.otp = otp

    }

    // HEADER
    const header = {
        "Content-Type": "application/json",
        "PAYNET-SESSION-TOKEN": sessionToken
    }

    return await new Promise((resolve, reject) => {
        axios.post(BASE_URL_CONFIRM_SYSTEM_PAYMENT, body, {
            headers: header
        }).then(rspnse => {
            
            resolve(rspnse)

        })
            .catch(err => {
                
                reject(err)
            })
    })


}