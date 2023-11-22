import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const port = process.env.PORT || 8081; // Use port 3000 or a port defined in the environment variable

dotenv.config()
import {
    CFConfig,
    CFPaymentGateway,
    CFEnvironment,
    CFCustomerDetails,
    CFOrderRequest,
    CFOrderPayRequest,
    CFCard,
    CFCardPayment,
    CFUPI,
    CFUPIPayment,
    CFNetbanking,
    CFNetbankingPayment,
    CFPaymentMethod,
    CFApp,
    CFAppPayment,
    CFLinkCustomerDetailsEntity,
    CFLinkNotifyEntity,
    CFLinkRequest,
    CFOrderMeta
} from "cashfree-pg-sdk-nodejs";

var testCfConfig = new CFConfig(
    CFEnvironment.SANDBOX,
    "2022-09-01",
    process.env.clientId,
    process.env.secret
);


app.use(cors())
// console.log(testCfConfig)
app.use(express.json())

// Define a route
app.post('/orders', async (req, res) => {
    var customerDetails = new CFCustomerDetails();
    customerDetails.customerId = req.body.customerId;
    customerDetails.customerPhone = req.body.customerPhone;
    customerDetails.customerEmail = req.body.customerEmail;
    var d = {};
    d["order_tag_01"] = "TESTING IT";

    var cFOrderRequest = new CFOrderRequest();
    cFOrderRequest.orderAmount = req.body.orderAmount;
    cFOrderRequest.orderCurrency = "INR";
    cFOrderRequest.customerDetails = customerDetails;
    cFOrderRequest.orderTags = d;
    var orderMeta = new CFOrderMeta();
    orderMeta.returnUrl = req.body.return_url;
    cFOrderRequest.orderMeta = orderMeta
    // cfOrderRequest.order_meta.return_url = "https://development.d39ljnmw1ahtx3.amplifyapp.com/client/funds/${order_id]"
    try {
        var apiInstance = new CFPaymentGateway();

        var result = await apiInstance.orderCreate(testCfConfig, cFOrderRequest);
        if (result != null) {
            console.log(result?.cfOrder?.paymentSessionId);
            console.log(result?.cfOrder?.orderId);
            console.log(result?.cfHeaders);
            res.status(200).send(result)
        }
    } catch (e) {
        console.log(e);
        res.status(e.statusCode).json({error: e.body.message})
    }

});

// cFCard.cardNumber = "4111111111111111";
// cFCard.cardCvv = "123";
// cFCard.cardExpiryMm = "12";
// cFCard.cardExpiryYy = "25";

app.post('/order/payWithCard', async(req,res) => {
    try {
        console.log(req.body)
        let paymentSessionId = req.body.paymentSessionId
        var cFCard = new CFCard();
        cFCard.channel = "link";
        cFCard.cardBankName = CFCard.CardBankNameEnum.Test;
        cFCard.cardNumber = req.body.cardNumber;
        cFCard.cardCvv = req.body.cardCvv;
        cFCard.cardExpiryMm = req.body.cardExpiryMm;
        cFCard.cardExpiryYy = req.body.cardExpiryYy;
        console.log(cFCard)
        const cFCardPayment = new CFCardPayment();
        cFCardPayment.card = cFCard;
        var cFOrderPayRequest = new CFOrderPayRequest();
        cFOrderPayRequest.paymentSessionId = paymentSessionId;
        cFOrderPayRequest.paymentMethod = cFCardPayment;
        var apiInstance = new CFPaymentGateway();
        var cfPayResponse = await apiInstance.orderSessionsPay(
            testCfConfig,
            cFOrderPayRequest
        );
        if (cfPayResponse != null) {
            // console.log("result.OrderId");
            console.log(cfPayResponse?.cfOrderPayResponse?.paymentMethod);
            console.log(cfPayResponse?.cfOrderPayResponse?.data?.url);
            console.log(cfPayResponse?.cfHeaders);
            res.status(200).send(cfPayResponse)
        }
    } catch (e) {
        console.log(e);
                res.status(e.statusCode).json({error: e.body.message})
    }
})

// "testsuccess@gocash"
app.post('/order/payWithUPICollect', async(req,res) => {
    try {
        let payment_session_id = req.body.paymentSessionId
        var cfUpi = new CFUPI();
        cfUpi.channel = CFUPI.ChannelEnum.Collect;
        cfUpi.upiId = req.body.upiId;
        var cFUPIPayment = new CFUPIPayment();
        cFUPIPayment.upi = cfUpi;
        var cFOrderPayRequest = new CFOrderPayRequest();
        cFOrderPayRequest.paymentSessionId = payment_session_id;
        cFOrderPayRequest.paymentMethod = cFUPIPayment;
        var apiInstance = new CFPaymentGateway();
        var cfPayResponse = await apiInstance.orderSessionsPay(
            testCfConfig,
            cFOrderPayRequest
        );
        if (cfPayResponse != null) {
            // console.log("result.OrderId");
            console.log(cfPayResponse?.cfOrderPayResponse?.data);
            console.log(cfPayResponse?.cfHeaders);
            res.status(200).send(cfPayResponse)

        }
    } catch (e) {
        console.log(e);
        res.status(e.statusCode).json({error: e.body.message})
    }
})


app.post('/order/payWithUPIIntent', async(req,res) => {
    try {
        let paymentSessionId = req.body.paymentSessionId
        var cfUpi = new CFUPI();
        cfUpi.channel = CFUPI.ChannelEnum.Link;
        var cFUPIPayment = new CFUPIPayment();
        cFUPIPayment.upi = cfUpi;
        var cFOrderPayRequest = new CFOrderPayRequest();
        cFOrderPayRequest.paymentSessionId = paymentSessionId;
        cFOrderPayRequest.paymentMethod = cFUPIPayment;
        var apiInstance = new CFPaymentGateway();
        var cfPayResponse = await apiInstance.orderSessionsPay(
            testCfConfig,
            cFOrderPayRequest
        );
        if (cfPayResponse != null) {
            // console.log("result.OrderId");
            console.log(cfPayResponse?.cfOrderPayResponse?.data);
            console.log(cfPayResponse?.cfHeaders);
            res.status(200).send(cfPayResponse)

        }
    } catch (e) {
        console.log(e);
                res.status(e.statusCode).json({error: e.body.message})
    }
})




app.post('/order/payWithUPIQRCode', async(req,res) => {
    try {
            let paymentSessionId = req.body.paymentSessionId
            var cfUpi = new CFUPI();
            cfUpi.channel = CFUPI.ChannelEnum.Qrcode;
            var cFUPIPayment = new CFUPIPayment();
            cFUPIPayment.upi = cfUpi;
            var cFOrderPayRequest = new CFOrderPayRequest();
            cFOrderPayRequest.paymentSessionId = paymentSessionId;
            cFOrderPayRequest.paymentMethod = cFUPIPayment;
            var apiInstance = new CFPaymentGateway();
            var cfPayResponse = await apiInstance.orderSessionsPay(
                testCfConfig,
                cFOrderPayRequest
            );
            if (cfPayResponse != null) {
                console.log("result.OrderId");
                console.log(cfPayResponse?.cfOrderPayResponse?.data);
                console.log(cfPayResponse?.cfHeaders);
                res.status(200).send(cfPayResponse)
            }
        } catch (e) {
            console.log(e);
                    res.status(e.statusCode).json({error: e.body.message})
        }h
})

app.post('/order/payWithNetBanking', async(req,res) => {
    
    try {
        let paymentSessionId = req.body.paymentSessionId
        console.log(paymentSessionId)
        var cfnetBanking = new CFNetbanking();
        cfnetBanking.channel = "link";
        cfnetBanking.netbankingBankCode = 3003;
        var cFPaymentMethod = new CFPaymentMethod();
        cFPaymentMethod.netbanking = cfnetBanking;
        var cFOrderPayRequest = new CFOrderPayRequest();
        cFOrderPayRequest.paymentMethod = cFPaymentMethod;
    
        cFOrderPayRequest.paymentSessionId = paymentSessionId;
        var apiInstance = new CFPaymentGateway();
        var cfPayResponse = await apiInstance.orderSessionsPay(
            testCfConfig,
            cFOrderPayRequest
        );
        if (cfPayResponse != null) {
            console.log("result.OrderId");
            console.log(cfPayResponse?.cfOrderPayResponse?.data?.url);
            console.log(cfPayResponse?.cfHeaders);
            res.status(200).send(cfPayResponse)
        }
    } catch (e) {
        console.log(e);
                res.status(e.statusCode).json({error: e.body.message})
    }

})



// Note: Below is the list of all values for all the wallet providers supported by Cashfree:-
//  phonepe paytm amazon airtel freecharge mobikwik jio ola


app.post('/order/payWithAppWallet', async(req,res) => {
    
    try {
        let paymentSessionId = req.body.paymentSessionId
        var cfApp = new CFApp();
        cfApp.channel = CFApp.ChannelEnum.Link;
        cfApp.phone = "8904216227";
        cfApp.provider = "test";
        var cFAppPayment = new CFAppPayment();
        cFAppPayment.app = cfApp;
        var cFOrderPayRequest = new CFOrderPayRequest();
        cFOrderPayRequest.paymentSessionId = paymentSessionId;
        cFOrderPayRequest.paymentMethod = cFAppPayment;
        var apiInstance = new CFPaymentGateway();
        var cfPayResponse = await apiInstance.orderSessionsPay(
            testCfConfig,
            cFOrderPayRequest
        );
        if (cfPayResponse != null) {
            console.log("result.OrderId");
            console.log(cfPayResponse?.cfOrderPayResponse?.paymentMethod);
            console.log(cfPayResponse?.cfOrderPayResponse?.data?.url);
            console.log(cfPayResponse?.cfHeaders);
            res.status(200).send(cfPayResponse)
        }
    } catch (e) {
        console.log(e);
                res.status(e.statusCode).json({error: e.body.message})
    }

})


app.get('/order', async(req,res) => {
    try {
        let order_id = req.body.order_id
        var apiInstance = new CFPaymentGateway();
        var cfOrderResponse = await apiInstance.getOrder(
            testCfConfig,
            order_id
        );

    if (cfOrderResponse != null) {
            console.log("result.OrderId");
            console.log(cfOrderResponse?.cfOrder?.orderId);
            console.log(cfOrderResponse?.cfOrder?.payments);
            console.log(cfOrderResponse?.cfHeaders);
            res.status(200).send(cfOrderResponse)
        }
    } catch (e) {
        console.log(e);
                res.status(e.statusCode).json({error: e.body.message})
    }
})


app.get('/order/payments', async(req,res) => {
    try {
        let order_id = req.body.order_id
        var apiInstance = new CFPaymentGateway();
        var response = await apiInstance.getPaymentsForOrder(
            testCfConfig,
            order_id
        );
        if (response !== null) {
            if (response?.cfPaymentsEntities)
                console.log(response?.cfPaymentsEntities[0].cfPaymentId);
            console.log(response?.cfHeaders);
            res.status(200).send(response)
        }
    } catch (e) {
        console.log(e);
                res.status(e.statusCode).json({error: e.body.message})
    }
})


app.post('/paymentLinks', async(req,res) => {
    try {
        var apiInstance = new CFPaymentGateway();

        var customerDetails = new CFLinkCustomerDetailsEntity();
        customerDetails.customerEmail = "bhaskar.aggarwal@cashfree.com";
        customerDetails.customerPhone = "9953844999";
        customerDetails.customerName = "Bhaskar";
        var linkNotify = new CFLinkNotifyEntity();
        linkNotify.sendEmail = true;
        linkNotify.sendSms = true;
        var cFLinkRequest = new CFLinkRequest(); //"link_id_02", 1, "INR", "TESTING", customerDetails, false, null, null, linkNotify, false, null, null;
        cFLinkRequest.linkId = "link_id_102";
        cFLinkRequest.linkAmount = 1;
        cFLinkRequest.linkCurrency = "INR";
        cFLinkRequest.linkPurpose = "TESTING";
        cFLinkRequest.customerDetails = customerDetails;
        cFLinkRequest.linkPartialPayments = false;
        cFLinkRequest.linkNotify = linkNotify;
        cFLinkRequest.linkAutoReminders = false;
        var response = await apiInstance.createPaymentLink(
            testCfConfig,
            cFLinkRequest
        );

        if (response != null) {
            console.log("response.cfRefunds.Count");
            console.log(response?.cfLink?.linkUrl);
            console.log(response?.cfHeaders);
            res.status(200).send(response)
        
        }
    } catch (e) {
        console.log(e);
                res.status(e.statusCode).json({error: e.body.message})
    
    }
})


app.post('/subscription/plan',async (req,res) => {
    const generateRandomNumber = () => {
        const randomNumber = Math.floor(100000 + Math.random() * 900000);
        return randomNumber.toString().substring(0, 6); // Ensure exactly 6 digits
    };

    const randomSixDigitNumber = generateRandomNumber();
    
        const data = {
            "planId": `test-periodic-plan-${randomSixDigitNumber}` ,
            "planName": `Plan test-periodic-plan-${randomSixDigitNumber}`,
            "type": "PERIODIC",
            "recurringAmount": req.body.recurringAmount,
            "intervals": 1,
            "intervalType": "month",
            "maxAmount": 10000000
        }

    try{

        const response = await axios.post('https://test.cashfree.com/api/v2/subscription-plans',data, {
            headers: {
                "Content-Type": "application/json",
                "X-Client-Id": process.env.subClientId,
                "X-Client-Secret": process.env.subSecretKey
            }
        })

        console.log(response.data);

         res.status(200).send(response.data);
    } catch(err){
        console.log(err)
        res.status(400).json({ error: err})
    }
})


app.post('/subscriptionForPlan',async (req,res) => {

    const getFormattedDate = () => {
        const currentDate = new Date();
        const futureDate = new Date(currentDate);
        
        // Set the date for two days from now
        futureDate.setDate(currentDate.getDate() + 2);
    
        // Get year, month, and day
        const year = futureDate.getFullYear();
        const month = String(futureDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const day = String(futureDate.getDate()).padStart(2, '0');
    
        // Format the date as "yyyy-mm-dd"
        const formattedDate = `${year}-${month}-${day}`;
    
        return formattedDate;
    };
    
    const twoDaysFromNow = getFormattedDate();

    const data = {
        "subscriptionId": req.body.planId,
        "planId": req.body.planId,
        "customerName": "Vignesh K",
        "customerPhone": "9821081677",
        "customerEmail": "vignesh@onelabventures.com",
        "returnUrl": "https://www.axcelate.onrender.com",
        "authAmount": 1,
        "firstChargeDate": twoDaysFromNow,
        "expiresOn": "2024-12-02 00:00:00",
        "notes": {
            "key1": "value1",
            "key2": "value2",
            "key3": "value3",
            "key4": "value4"
        },
        "linkExpiry": 43200,
        "notificationChannels": [
            "EMAIL",
            "SMS"
        ]
    }

try{

    const response = await axios.post('https://test.cashfree.com/api/v2/subscriptions/nonSeamless/subscription',data, {
        headers: {
            "Content-Type": "application/json",
            "X-Client-Id": process.env.subClientId,
            "X-Client-Secret": process.env.subSecretKey
        }
    })

    console.log(response.data);

     res.status(200).send(response.data);
} catch(err){
    console.log(err)
    res.status(400).json({ error: err})
}
})


app.get('/subscription/details',async (req,res) => {
    
    try{

        const subId = req.body.subId;
        const response = await axios.get(`https://test.cashfree.com/api/v2/subscriptions/${subId}`,{
            headers: {
                "Content-Type": "application/json",
                "X-Client-Id": process.env.subClientId,
                "X-Client-Secret": process.env.subSecretKey
            }
        })

        console.log(response.data);

         res.status(200).send(response.data);
    } catch(err){
        console.log(err)
        res.status(400).json({ error: err})
    }
})

app.put('/subscription/update',async (req,res) => {
    
    try{

        const subId = req.body.subId;
        const recurringAmount = req.body.recurringAmount
        const response = await axios.put(`https://test.cashfree.com/api/v2/subscriptions/${subId}/recurring-amount`, {
            recurringAmount
        },{
            headers: {
                "Content-Type": "application/json",
                "X-Client-Id": process.env.subClientId,
                "X-Client-Secret": process.env.subSecretKey
            }
        })

        console.log(response.data);

         res.status(200).send(response.data);
    } catch(err){
        console.log(err)
        res.status(400).json({ error: err})
    }
})

app.get('/subscription/details',async (req,res) => {
    
    try{

        const subId = req.body.subId;
        const response = await axios.get(`https://test.cashfree.com/api/v2/subscriptions/${subId}`,{
            headers: {
                "Content-Type": "application/json",
                "X-Client-Id": process.env.subClientId,
                "X-Client-Secret": process.env.subSecretKey
            }
        })

        console.log(response.data);

         res.status(200).send(response.data);
    } catch(err){
        console.log(err)
        res.status(400).json({ error: err})
    }
})

app.get('/subscription/cancel',async (req,res) => {
    
    try{

        const subId = req.body.subId;
        const response = await axios.get(`https://test.cashfree.com/api/v2/subscriptions/${subId}/cancel`,{
            headers: {
                "Content-Type": "application/json",
                "X-Client-Id": process.env.subClientId,
                "X-Client-Secret": process.env.subSecretKey
            }
        })

        console.log(response.data);

         res.status(200).send(response.data);
    } catch(err){
        console.log(err)
        res.status(400).json({ error: err})
    }
})





// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
