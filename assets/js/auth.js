import { BASE_URL } from "./api_utils.js";

export const login = async (data) => {
    const body = {
        authType: "SESSION",
        webRequest: true,
        otp: "",
    };

    return await new Promise((resolve, reject) => {

        axios.post("https://" + BASE_URL.url + ".cellpay.com.np/rest/access/login", body, {
            auth: data,
        })
            .then((res) => {
                resolve(res)
            }
            )
            .catch((err) => {
                reject(err)
            }
            );
    })

}

export const loginWithOutOtp = async (data) => {


    const body = {
        authType: "SESSION",
        // webRequest: true,
        // otp: "",
    };



    return await new Promise((resolve, reject) => {

        axios.post("https://" + BASE_URL.url + ".cellpay.com.np/rest/access/login", body, {
            auth: data,
        })
            .then((res) => {
                resolve(res)
            }
            )
            .catch((err) => {
                reject(err)
            }
            );
    })

}


export const loginWithOtp = async (data, otp) => {
    const body = {
        authType: "SESSION",
        webRequest: true,
        otp: otp,
    };

    return await new Promise((resolve, reject) => {
        axios
            .post("https://" + BASE_URL.url + ".cellpay.com.np/rest/access/login", body, {
                auth: data,
            })
            .then((res) => {
                resolve(res)
            }

            )
            .catch((err) => {
                reject(err)
            }
            );
    })

}


