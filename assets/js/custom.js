import { login, loginWithOutOtp } from './auth.js'
import { loginWithOtp } from './auth.js'
import { bankList, accountList, walletBalance } from './account.js'
import { confirmPaymentSystem, paymentSystem } from './paymentSystem.js'

import { cancelTxn, checkReceiverDetailsProperties,updateBaseURL} from './utilities.js'

let receiverDetails = {
    "amount": "",
    "transferTypeId": "",
    "id": "",
    "mode": "",
    "url": "",
    "invoiceNumber":"",
    "traceNumber":""

}

let senderDetails = {
    "username": null,
    "name": null,
    "bank": null,
    "sessionId": null,
    "number": null,
    "paymentMethod": null,
    "paymentCustomValues": null

}

let confirmPayOtpRequired = false


window.addEventListener('message', function (event) {



    // SET CONFIG DATA TO RECEVER DETAILS
    receiverDetails.amount = event.data.amount
    receiverDetails.transferTypeId = event.data.transferType
    receiverDetails.id = event.data.user
    receiverDetails.mode = event.data.mode
    receiverDetails.url = event.data.client_url
    receiverDetails.invoiceNumber = event.data.invoiceNumber,
    receiverDetails.traceNumber = event.data.traceNumber
    // END SET CONFIG DATA TO RECEVER DETAILS
    


    // CHECK IF ANY VALUE SENT BY CLIENT IS EMPTY
    checkReceiverDetailsProperties(receiverDetails,event.source)

    // UPDATE BASE URL
    updateBaseURL(receiverDetails.mode,event.source)

    // CANCEL TRANSACTION
    cancelTxn(event.source)


    // LOGIN FORM

    let loginForm = document.getElementById('login_form')
    let loginFormSubmit = document.getElementById('login_form_submit')
    let username, password

    let validatorLoginForm = FormValidation.formValidation(
        loginForm,
        {
            fields: {
                'mobile': {
                    validators: {
                        notEmpty: {
                            message: 'Mobile Number is required !'
                        },
                        stringLength: {
                            min: 10,
                            message: 'Minimum Length 10 !'
                        }
                    }
                },
                'password': {
                    validators: {
                        notEmpty: {
                            message: 'Password is required !'
                        }
                    }
                }
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }
    )


    loginFormSubmit.addEventListener('click', function (e) {
        e.preventDefault()

        // Validate form before submit
        if (validatorLoginForm) {
            validatorLoginForm.validate().then(function (status) {
                
                username = $("#login_form input[name=mobile]").val()
                password = $("#login_form input[name=password]").val()

                if (status == 'Valid') {
                    // Show loading indication
                    loginFormSubmit.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    loginFormSubmit.disabled = true;

                    let LOGIN_RESPONSE;

                    const userLogin = async (data) => {
                        //    await login(data)
                        //         .then(rspnse => {
                                    
                        //             LOGIN_RESPONSE = rspnse
                        //         })
                        //         .catch(err => {
                                    
                        //             LOGIN_RESPONSE = err.response
                        //         })
                        //         .then(() => {
                        //             // Remove loading indication
                        //             loginFormSubmit.removeAttribute('data-kt-indicator');

                        //             // Enable button
                        //             loginFormSubmit.disabled = false

                                    

                        //             if (LOGIN_RESPONSE) {
                        //                 if (LOGIN_RESPONSE.status === 200) {
                        //                     Swal.fire({
                        //                         title: LOGIN_RESPONSE.data?.messages[0]?.shortMessage,
                        //                         text: '',
                        //                         icon: 'success',
                        //                         confirmButtonText: 'OK'
                        //                     })

                        //                     $('#otp_sent_number').html(username)

                        //                     $('#kt_modal_1').modal('show')

                        //                 } else if (LOGIN_RESPONSE.status != 200) {
                        //                     Swal.fire({
                        //                         title: LOGIN_RESPONSE.data?.errors[0]?.shortMessage,
                        //                         text: '',
                        //                         icon: 'error',
                        //                         confirmButtonText: 'OK'
                        //                     })
                        //                 }
                        //             }
                        //         })



                        await loginWithOutOtp(data)
                            .then(rspnse => {
                                
                                LOGIN_RESPONSE = rspnse
                            })
                            .catch(err => {
                                
                                LOGIN_RESPONSE = err.response
                            })
                            .then(() => {
                                // Remove loading indication
                                loginFormSubmit.removeAttribute('data-kt-indicator');

                                // Enable button
                                loginFormSubmit.disabled = false

                                

                                if (LOGIN_RESPONSE) {
                                    if (LOGIN_RESPONSE.status === 200) {
                                        Swal.fire({
                                            title: "Login Successful",
                                            text: '',
                                            icon: 'success',
                                            confirmButtonText: 'OK'
                                        })
                                        senderDetails.sessionId = LOGIN_RESPONSE.data.sessionId
                                        getBankList(LOGIN_RESPONSE.data.sessionId)
                                        $('#txn_details_amount span').html(receiverDetails.amount)
                                        $('#step_1').hide()
                                        $('#step_2').show()



                                    } else if (LOGIN_RESPONSE.status != 200) {
                                        Swal.fire({
                                            title: LOGIN_RESPONSE.data?.errors[0]?.shortMessage,
                                            text: '',
                                            icon: 'error',
                                            confirmButtonText: 'OK'
                                        })
                                    }
                                }
                            })
                    }

                    userLogin({ username, password })



                }
            });
        }
    })


    // END LOGIN FORM


    // OTP FORM

    let otpForm = document.getElementById('otp_form')
    let otpFormSubmit = document.getElementById('otp_form_submit')
    let otpInputs = document.getElementsByName('loginotp')

    let otpResend = document.getElementById('otp_resend_submit')

    Array.from(otpInputs).forEach(function (elt) {
        elt.addEventListener("keyup", function (event) {
            if (event.key === 'Enter' || elt.value.length == 1) {
                // Focus on the next sibling
                elt.nextElementSibling.focus()

            }
        });



    })

    let validatorOtpForm = FormValidation.formValidation(
        otpForm,
        {
            fields: {
                'loginotp': {
                    validators: {
                        notEmpty: {
                            message: false
                        }
                    }
                },
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: 'border border-danger',
                    eleValidClass: 'border border-success'
                })
            }
        }
    )

    otpFormSubmit.addEventListener('click', function (e) {
        e.preventDefault();

        // Validate form before submit
        if (validatorOtpForm) {
            validatorOtpForm.validate().then(function (status) {
                

                if (status == 'Valid') {
                    // Show loading indication
                    otpFormSubmit.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    otpFormSubmit.disabled = true;
                    let loginOTP = ""

                    for (let i = 0; i < otpInputs.length; i++) {
                        loginOTP += otpInputs[i].value
                    }

                    

                    let LOGIN_WITH_OTP

                    const userLoginWithOTP = async (data, otp) => {
                        await loginWithOtp(data, otp)
                            .then(rspnse => {
                                
                                LOGIN_WITH_OTP = rspnse
                            })
                            .catch(err => {
                                
                                LOGIN_WITH_OTP = err.response
                            }).then(() => {
                                // Remove loading indication
                                otpFormSubmit.removeAttribute('data-kt-indicator');

                                // Enable button
                                otpFormSubmit.disabled = false

                                if (LOGIN_WITH_OTP) {

                                    if (LOGIN_WITH_OTP.status === 200) {

                                        senderDetails.sessionId = LOGIN_WITH_OTP.data.sessionId
                                        getBankList(LOGIN_WITH_OTP.data.sessionId)

                                        $('#txn_details_amount span').html(receiverDetails.amount)
                                        $('#kt_modal_1').modal('hide')
                                        $('#step_1').hide()
                                        $('#step_2').show()

                                    } else if (LOGIN_WITH_OTP.status != 200) {
                                        for (let i = 0; i < otpInputs.length; i++) {
                                            otpInputs[i].value = ""
                                        }

                                        Swal.fire({
                                            title: LOGIN_WITH_OTP.data?.errors[0]?.shortMessage,
                                            text: '',
                                            icon: 'error',
                                            confirmButtonText: 'OK'
                                        })
                                    }
                                }
                            })
                    }

                    userLoginWithOTP({ username, password }, loginOTP)
                }
            });
        }
    })

    // RESEND OTP

    otpResend.addEventListener('click', function (e) {
        // Show loading indication
        otpResend.setAttribute('data-kt-indicator', 'on');

        // Disable button to avoid multiple click
        otpResend.disabled = true;

        let OTP_RESEND_STATUS

        const getOtpResend = async (data) => {
            await login(data)
                .then(rspnse => {
                    
                    OTP_RESEND_STATUS = rspnse


                })
                .catch(err => {
                    

                    OTP_RESEND_STATUS = err.response
                }).then(() => {

                    // Show loading indication
                    otpResend.setAttribute('data-kt-indicator', 'off');

                    // Disable button to avoid multiple click
                    otpResend.disabled = false;


                    if (OTP_RESEND_STATUS) {
                        if (OTP_RESEND_STATUS.status == "200") {
                            Swal.fire({
                                title: OTP_RESEND_STATUS.data?.messages[0]?.shortMessage,
                                text: '',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            })
                        } else if (OTP_RESEND_STATUS.status != "200") {
                            Swal.fire({
                                title: OTP_RESEND_STATUS.data?.errors[0]?.shortMessage,
                                text: '',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        }
                    }
                })
        }

        getOtpResend({ username, password })

    })
    // END RESEND OTP

    // END OTP FORM




    // TXN DETAILS

    let bankListArray = null

    const getBankList = (sessionId) => {
        

        bankList(sessionId).then(rspnse => {
            

            bankListArray = rspnse.data.payload.MemberDetailsList

            loadBankList(bankListArray)

        }).catch(err => {
            
            bankListArray = err.response.data?.errors[0]?.shortMessage
        })
    }


    const loadBankList = (banks) => {
        

        banks.forEach(function (bank) {


            $("#kt_docs_select2_bank")
                .append(`<option value="` +
                    bank.userName +
                    `" data-account-number="` +
                    bank.accountNo +

                    `" data-account-name="` +
                    bank.memberName +
                    `"
        data-kt-select2-bank="assets/media/banks/` + bank.userName + `.png">` +
                    bank.memberName
                    + `</option>`)
        });
    }


    $("#bank_list").hide();

    $('#payment_option input[type="radio"]').click(function () {

        if ($(this).attr("value") == "wallet") {
            $("#bank_list").hide('slow');
        }
        if ($(this).attr("value") == "bank") {

            $("#bank_list").show('slow');

        }
    })

    const format = (item) => {
        if (!item.id) {
            return item.text;
        }

        var url = item.element.getAttribute('data-kt-select2-bank');
        var img = $("<img>", {
            class: "rounded-circle me-2",
            width: 26,
            src: url
        });
        var span = $("<span>", {
            text: " " + item.text
        });

        span.prepend(img);

        return span;
    }

    // Init Select2 --- more info: https://select2.org/
    $('#kt_docs_select2_bank').select2({

        templateResult: function (item) {
            return format(item);
        }
    });

    // Define form element
    const form = document.getElementById('kt_docs_formvalidation_select2');

    // Init form validation rules. For more info check the FormValidation plugin's official documentation:https://formvalidation.io/
    var validator = FormValidation.formValidation(
        form,
        {
            fields: {
                'bank': {
                    validators: {
                        notEmpty: {
                            message: 'Bank is required'
                        }
                    }
                },
            },

            plugins: {
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }
    );

    let doPaymentResult = null

    // Submit button handler
    const submitButton = document.getElementById('kt_docs_formvalidation_select2_submit');
    submitButton.addEventListener('click', function (e) {
        // Prevent default button action
        e.preventDefault();


        let bankRadio = document.getElementById('bank_radio')
        let walletRadio = document.getElementById('wallet_radio')

        if (bankRadio.checked) {
            
            // Validate form before submit



            if (validator) {
                validator.validate().then(function (status) {
                    
                    let bankCode = $('#kt_docs_select2_bank option:selected').val()
                    
                    let accountNumber = $('#kt_docs_select2_bank option:selected').attr("data-account-number")
                    
                    let bankName = $('#kt_docs_select2_bank option:selected').attr("data-account-name")
                    


                    senderDetails.paymentMethod = "Bank"

                    senderDetails.paymentCustomValues = {
                        "bankName": bankName,
                        "accountNumber": accountNumber,
                        "bankCode": bankCode,

                    }



                    if (status == 'Valid') {
                        // Show loading indication
                        submitButton.setAttribute('data-kt-indicator', 'on');
                        walletRadio.disabled = true
                        // Disable button to avoid multiple click
                        submitButton.disabled = true;

                        let PAYMENT_SYSTEM_RESULT = null

                        const getPaymentSystem = async (sessionId, trasferTypeId, receiver, sender) => {
                            
                            await paymentSystem(sessionId, trasferTypeId, receiver, sender).then(rspnse => {
                                
                                PAYMENT_SYSTEM_RESULT = rspnse

                                
                            }).catch(err => {
                                
                                PAYMENT_SYSTEM_RESULT = err
                            }).then(() => {
                                // Remove loading indication
                                submitButton.removeAttribute('data-kt-indicator');
                                walletRadio.disabled = false

                                // Enable button
                                submitButton.disabled = false;
                                

                                if (PAYMENT_SYSTEM_RESULT) {
                                    if (PAYMENT_SYSTEM_RESULT.status == "200") {
                                        doPaymentResult = PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult
                                        {
                                            PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult.showConsolidateAmount ?
                                                $('#payment_confirm_amount span').html(PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.consolidatedFormatterAmount) :
                                                $('#payment_confirm_amount span').html(PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.formattedFinalAmount)
                                        }

                                        {
                                            PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.to?.name ?
                                                $('#payment_confirm_name span').html(PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.to?.name) :
                                                $('#payment_confirm_name span').html(PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.advanceValues.serviceName)
                                        }

                                        $('#payment_confirm_payment_option span').html('Bank')

                                        let details = `<div class="row mb-4 pb-4 border-bottom cp-border-primary">
                    <div class="col-4 fw-bolder text-start ">Bank</div>
                    <div class="col-8 text-start">: `+ senderDetails.paymentCustomValues.bankName + `</div>
                </div>
                <div class="row mb-4 pb-4">
                    <div class="col-4 fw-bolder text-start ">A/C Number</div>
                    <div class="col-8 text-start">: `+ senderDetails.paymentCustomValues.accountNumber + `</div>
                </div>`

                                        $('#payment_confirm_account_details').html(details)


                                        if (PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.isOtpEnable) {
                                            $('#confirm_pay_otp_input').show()
                                            confirmPayOtpRequired = true
                                        }
                                        $("#step_2").hide()
                                        $("#step_3").show()

                                    } else if (PAYMENT_SYSTEM_RESULT.status != 200) {
                                        Swal.fire({
                                            text: "Something Went Wrong !",
                                            icon: "error",
                                            confirmButtonText: "Ok, got it!",
                                        })
                                    }
                                }
                            })

                        }

                        getPaymentSystem(senderDetails.sessionId, receiverDetails.transferTypeId, receiverDetails, senderDetails)





                    }
                });
            }

        } else if (walletRadio) {
            
            // Show loading indication
            submitButton.setAttribute('data-kt-indicator', 'on');
            bankRadio.disabled = true
            // Disable button to avoid multiple click
            submitButton.disabled = true;

            senderDetails.paymentMethod = "Wallet"

            let WALLET_PAYMENT_SYSTEM_RESULT = null

            const getPaymentSystem = async (sessionId, trasferTypeId, receiver, sender) => {
                
                await paymentSystem(sessionId, trasferTypeId, receiver, sender)
                    .then(rspnse => {
                        
                        WALLET_PAYMENT_SYSTEM_RESULT = rspnse

                        
                    }).catch(err => {
                        
                        WALLET_PAYMENT_SYSTEM_RESULT = err
                    }).then(() => {
                        if (WALLET_PAYMENT_SYSTEM_RESULT) {
                            if (WALLET_PAYMENT_SYSTEM_RESULT.status == "200") {
                                doPaymentResult = WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult
                                {
                                    WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult.showConsolidateAmount ?
                                        $('#payment_confirm_amount span').html(WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.consolidatedFormatterAmount) :
                                        $('#payment_confirm_amount span').html(WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.formattedFinalAmount)
                                }

                                {
                                    WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.to?.name ?
                                        $('#payment_confirm_name span').html(WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.to?.name) :
                                        $('#payment_confirm_name span').html(WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.advanceValues.serviceName)
                                }

                                $('#payment_confirm_payment_option span').html('Wallet')

                                let details = `<div class="row mb-4 pb-4 border-bottom cp-border-primary">
<div class="col-4 fw-bolder text-start ">Mobile</div>
<div class="col-8 text-start">:` + WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.from?.mobileNo + `</div>
</div>
<div class="row mb-4 pb-4">
<div class="col-4 fw-bolder text-start ">Name</div>
<div class="col-8 text-start">: `+ WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.from?.name + `</div>
</div>`

                                $('#payment_confirm_account_details').html(details)

                                if (WALLET_PAYMENT_SYSTEM_RESULT?.data?.payload?.DoPaymentResult?.isOtpEnable) {
                                    $('#confirm_pay_otp_input').show()
                                    confirmPayOtpRequired = true
                                }

                                // Remove loading indication
                                submitButton.removeAttribute('data-kt-indicator');
                                bankRadio.disabled = false
                                // Enable button
                                submitButton.disabled = false;


                                $("#step_2").hide()
                                $("#step_3").show()
                            } else if (WALLET_PAYMENT_SYSTEM_RESULT.status != "200") {
                                Swal.fire({
                                    title: WALLET_PAYMENT_SYSTEM_RESULT.data?.errors[0]?.shortMessage,
                                    text: '',
                                    icon: 'error',
                                    confirmButtonText: 'OK'
                                })
                            }
                        }
                    })

            }

            let walletBalanceAmount = null

            // Simulate form submission. For more info check the plugin's official documentation: https://sweetalert2.github.io/

            const getWalletBalance = async (sessionId, walletId) => {
                await walletBalance(sessionId, walletId)
                    .then(rspnse => {
                        
                        walletBalanceAmount = rspnse
                    }).catch(err => {
                        
                        walletBalanceAmount = rspnse
                    }).then(() => {
                        getWalletBallenceAmount()
                    })
            }

            const getAccountList = async (sessionId) => {
                await accountList(sessionId).then(rspnse => {
                    
                    getWalletBalance(sessionId, rspnse.data?.payload?.MemberAccountVOList[1]?.id)

                }).catch(err => {
                    
                    walletBalance = err.response
                })
            }

            getAccountList(senderDetails.sessionId);
            const getWalletBallenceAmount = () => {


                if (walletBalanceAmount.status == "200") {

                    if (walletBalanceAmount?.data?.payload?.AccountStatusVO?.balance < receiverDetails.amount) {
                        Swal.fire({
                            text: "Issufficient Balance !",
                            icon: "error",
                            confirmButtonText: "Ok, got it!",
                        })

                        // Remove loading indication
                        submitButton.removeAttribute('data-kt-indicator');
                        bankRadio.disabled = false
                        // Enable button
                        submitButton.disabled = false;

                    } else if (walletBalanceAmount?.data?.payload?.AccountStatusVO?.balance >= receiverDetails.amount) {


                        getPaymentSystem(senderDetails.sessionId, receiverDetails.transferTypeId, receiverDetails, senderDetails)

                    }


                } else if (walletBalanceAmount.status != "200") {
                    Swal.fire({
                        text: "Something Went Wrong !",
                        icon: "error",
                        confirmButtonText: "Ok, got it!",
                    })
                }
            }




        }


    });

    //   END TXN DETAILS




    // CONFIRM PAY
    let confirmPayOtpInput = $('#confirm_pay_otp_input').hide()



    let confirmPayForm = document.getElementById('confirm_pay_form');

    let validatorConfirmPayForm = FormValidation.formValidation(
        confirmPayForm,
        {

            fields: {
                'txnPIN': {
                    validators: {
                        notEmpty: {
                            message: 'Txn Pin is required !'
                        },
                        stringLength: {
                            min: 6,
                            message: 'Minimum Length 6 !'
                        }
                    }
                },
                'otp': {
                    validators: {
                        notEmpty: {
                            message: 'OTP is required !'
                        }
                    }
                },
            },

            plugins: {
                exlcluded: new FormValidation.plugins.Excluded({
                    exlcluded: function (field, ele, eles) {
                        return (field === 'otp' && otpRequired !== 'otp') || (field === 'otp' && otpRequired === 'otp')

                    }
                }),
                trigger: new FormValidation.plugins.Trigger(),
                bootstrap: new FormValidation.plugins.Bootstrap5({
                    rowSelector: '.fv-row',
                    eleInvalidClass: '',
                    eleValidClass: ''
                })
            }
        }

    )

    let CONFIRM_PAYMENT_SYSTEM_RESULT = null

    let confirmPayFormSubmit = document.getElementById('confirm_pay_form_submit')

    confirmPayFormSubmit.addEventListener('click', function (e) {
        e.preventDefault();
        if (validatorConfirmPayForm) {
            validatorConfirmPayForm.validate().then(function (status) {


                

                if (status == 'Valid') {

                    // Show loading indication
                    confirmPayFormSubmit.setAttribute('data-kt-indicator', 'on');

                    // Disable button to avoid multiple click
                    confirmPayFormSubmit.disabled = true;

                    let confirmPayTxnPin = $('#confirm_pay_txn_pin').val()

                    let confirmPayOtp = ""

                    if (confirmPayOtpRequired) {
                        confirmPayOtp = $('#confirm_pay_otp').val()
                    } else if (!confirmPayOtpRequired) {
                        confirmPayOtp = ""
                    }


                    

                    const getConfirmPaymentSystem = async (sessionId, trasferTypeId, receiver, sender, txnPin, otp) => {
                        
                        await confirmPaymentSystem(sessionId, trasferTypeId, receiver, sender, txnPin, otp).then(rspnse => {
                            
                            CONFIRM_PAYMENT_SYSTEM_RESULT = rspnse

                        }).catch(err => {
                            
                            CONFIRM_PAYMENT_SYSTEM_RESULT = err
                        }).then(() => {
                            confirmPaymentSystemResult()
                        })

                    }


                    getConfirmPaymentSystem(senderDetails.sessionId, receiverDetails.transferTypeId, receiverDetails, senderDetails, confirmPayTxnPin, confirmPayOtp)

                    const confirmPaymentSystemResult = () => {
                        // Remove loading indication
                        confirmPayFormSubmit.removeAttribute('data-kt-indicator');

                        // Enable button
                        confirmPayFormSubmit.disabled = false;


                        if (CONFIRM_PAYMENT_SYSTEM_RESULT.status == "200") {
                            Swal.fire({
                                title: "Payment Successfull !",
                                text: '',
                                icon: 'success',
                                confirmButtonText: 'OK'
                            })

                            // PAID TO
                            let paidTo
                            if (doPaymentResult.to) {
                                paidTo = doPaymentResult.to.name
                            } else if (!doPaymentResult.to) {
                                paidTo = doPaymentResult.advanceValues.serviceName
                            }

                            // PAID AMOUNT
                            let paidAmount
                            if (doPaymentResult.showConsolidateAmount) {
                                paidAmount = doPaymentResult.consolidatedFormatterAmount
                            } else if (!doPaymentResult.showConsolidateAmount)
                                paidAmount = doPaymentResult.formattedFinalAmount


                            let txnComplete = `<div class="row mb-4 pb-4 border-bottom cp-border-primary">
                        <div class="col-4 fw-bolder text-start">Amount</div>
                        <div class="col-8 text-start">:`+ paidAmount + `</div>
                    </div>
                    <div class="row mb-4 pb-4 border-bottom cp-border-primary">
                        <div class="col-4 fw-bolder text-start ">To</div>
                        <div class="col-8 text-start">:`+

                                paidTo

                                + `</div>
                    </div>
                    <div class="row mb-4 pb-4 border-bottom cp-border-primary">
                        <div class="col-4 fw-bolder text-start ">Txn Id</div>
                        <div class="col-8 text-start">: `+ CONFIRM_PAYMENT_SYSTEM_RESULT?.data?.payload?.ConfirmPaymentResult?.id + `</div>
                    </div>
                    <div class="row mb-4 pb-4 border-bottom cp-border-primary">
                        <div class="col-4 fw-bolder text-start ">From:</div>
                        <div class="col-8 text-start"> </div>
                    </div>
                    <div class="row mb-4 pb-4 border-bottom cp-border-primary">
                        <div class="col-4 fw-bolder text-start ">Payment Option</div>
                        <div class="col-8 text-start">: `+ senderDetails?.paymentMethod + `</div>
                    </div>
                    <div class="row mb-4 pb-4 border-bottom cp-border-primary">
                    <div class="col-4 fw-bolder text-start ">Mobile </div>
                    <div class="col-8 text-start">:`+ doPaymentResult?.from?.mobileNo + `</div>
                </div>`

                            $('#txn_complete_details').html(txnComplete)

                            $('#step_3').hide()
                            $('#step_4').show()

                        } else if (CONFIRM_PAYMENT_SYSTEM_RESULT.status != 200) {
                            Swal.fire({
                                title: CONFIRM_PAYMENT_SYSTEM_RESULT.data?.errors[0]?.shortMessage,
                                text: '',
                                icon: 'error',
                                confirmButtonText: 'OK'
                            })
                        }
                    }



                }
            })
        }

    })


    // END CONFIRM PAY



    // COMPLETE PAY
    let completePay = document.getElementById('complete_form_submit')


    completePay.addEventListener('click', function () {
        // Show loading indication
        completePay.setAttribute('data-kt-indicator', 'on');

        // Disable button to avoid multiple click
        completePay.disabled = true;

        setTimeout(function () {
            // Show loading indication
            confirmPayFormSubmit.setAttribute('data-kt-indicator', 'off');

            // Disable button to avoid multiple click
            confirmPayFormSubmit.disabled = false;

            event.source.postMessage(CONFIRM_PAYMENT_SYSTEM_RESULT?.data?.payload?.ConfirmPaymentResult, '*')

        }, 2000)
    })
    // END COMPLETE PAY

});






















