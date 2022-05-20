import { BASE_URL } from "./api_utils.js";


export const bankList = async (sessionToken) => {

    console.log(sessionToken)
    const header = {
        "Content-Type": "application/json",

        "PAYNET-SESSION-TOKEN": sessionToken
    }

    return await new Promise((resolve, reject) => {
        axios.get('https://' + BASE_URL.url + '.cellpay.com.np/rest/memberRecord/accounts', {
            headers: header
        }).then(rspnse => {
            console.log(rspnse)
            resolve(rspnse)
        })
            .catch(err => {
                console.log(err)
                reject(err)
            })
    })
}



export const walletBalance = async (sessionId, walletId) => {
    const header = {
        "Content-Type": "application/json",

        "PAYNET-SESSION-TOKEN": sessionId
    }

    return await new Promise((resolve, reject) => {
        axios.get('https://' + BASE_URL.url + '.cellpay.com.np/rest/accounts/' + walletId + '/status', {
            headers: header
        }).then(rspnse => {
            resolve(rspnse)
        }).catch(err => {
            reject(err)
        })
    })
}


export const accountList = async (sessionId) => {
    const header = {
        "Content-Type": "application/json",

        "PAYNET-SESSION-TOKEN": sessionId
    }

    return await new Promise((resolve, reject) => {
        axios.get('https://' + BASE_URL.url + '.cellpay.com.np/rest/accounts', {
            headers: header
        }).then(rspnse => {
            resolve(rspnse)

        }).catch(err => {
            reject(err)
        })

    })
}