
# cellpay-web-sdk-server
> ## Documentation

#### Script Tag :
``` 
<script type="text/javascript" src="https://rxsuwal.github.io/cellpay-web-sdk-server/app.js"></script>
```

### Config File Example
```
const cellpay_sdk_config = {
        "id": "", --> Insert User ID assigned for You
        "transferType": "", --> Insert Transfer type ID assigned for You
        "amount": "", --> generate  Amount to pay
        "mode": "", --> Live or test enviroment
        "invoiceNumber":"INV-1212",  --> Must be UNIQUE for evry Transaction
        "traceNumber":"TRC-1234"  --> Must be UNIQUE for evry Transaction
    }
 ```

 ### Return Data Catch Function :
```
 const txnData = (data) => {

        console.log(data)
    }
 ```

### Example HTML :
```
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CellPay Client</title>

    <!-- SDK RESOURCE FILE -->
    <script type="text/javascript" src="https://rxsuwal.github.io/cellpay-web-sdk-server/app.js"></script>
    <!--END SDK RESOURCE FILE -->

</head>

<body>

    <!-- SDK RESOURCE DOM -->
    <div id="cellpay_sdk">
    </div>
    <!--END SDK RESOURCE DOM -->

</body>

<script>

    // CONFIG DATA
    const cellpay_sdk_config = {
        "id": "0000000027",
        "transferType": "3",
        "amount": "111",
        "mode": "test",
        "invoiceNumber":"INV-1212",
        "traceNumber":"TRC-1234"
    }
    // END CONFIG DATA

    // RETURN DATA
    const txnData = (data) => {
        console.log(data)

        <!-- Get Transaction ID at => data.id -->

        <!-- Now Do what ever you want to do with the data, It is a returned data for payment -->
    }

</script>

</html>
```
