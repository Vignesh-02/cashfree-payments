import dotenv from 'dotenv'
import express from 'express';
const app = express();
const port = process.env.PORT || 3000; // Use port 3000 or a port defined in the environment variable

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
    CFLinkRequest
} from "cashfree-pg-sdk-nodejs";

var testCfConfig = new CFConfig(
    CFEnvironment.SANDBOX,
    "2022-09-01",
    process.env.clientId,
    process.env.secret
);

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
        res.status(400).json({error: e})
    }

});

app.post('/order/payWithCard', async(req,res) => {
    try {
        console.log(req.body)
        let paymentSessionId = req.body.paymentSessionId
        var cFCard = new CFCard();
        cFCard.channel = "link";
        cFCard.cardBankName = CFCard.CardBankNameEnum.Test;
        cFCard.cardNumber = "4111111111111111";
        cFCard.cardCvv = "123";
        cFCard.cardExpiryMm = "12";
        cFCard.cardExpiryYy = "25";
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
        let paymentSessionId = req.body.paymentSessionId
        var cfUpi = new CFUPI();
        cfUpi.channel = CFUPI.ChannelEnum.Collect;
        cfUpi.upiId = req.body.upiId;
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
        }
})

app.post('/order/payWithNetBanking', async(req,res) => {
    
    try {
        let paymentSessionId = req.body.paymentSessionId
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


// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
