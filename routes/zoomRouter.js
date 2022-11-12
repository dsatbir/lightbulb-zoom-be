const express = require('express');
const KJUR = require('jsrsasign')
const requestPromise = require("request-promise");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const router = express.Router();


const payload = {
  iss: process.env.API_KEY, //your API KEY
  exp: new Date().getTime() + 5000,
};
const token = jwt.sign(payload, process.env.API_SECRET); //your API SECRET HERE

router.get("/createMeeting", (req, res) => {

  console.log("meeting created");
  email = "dsatbir1@gmail.com"; // your zoom developer email account
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "Zoom Meeting Using Node JS", //meeting title
      type: 1,
      settings: {
        host_video: "true",
        participant_video: "true",
      },
    },
    auth: {
      bearer: token,
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json",
    },
    json: true, //Parse the JSON string in the response
  };

  requestPromise(options)
    .then(function (response) {
      console.log("response is: ", response);

      return res.json(201,{
        response
      })
      res.send("create meeting result: " + JSON.stringify(response));
    })
    .catch(function (err) {
      // API call failed...
      console.log("API call failed, reason ", err);
    });
});

router.post('/create-signature',function(req,res){
  console.log("create signature");
  const iat = Math.round(new Date().getTime() / 1000) - 30;
  const exp = iat + 60 * 60 * 2

  const oHeader = { alg: 'HS256', typ: 'JWT' }

  const oPayload = {
    sdkKey: process.env.SDK_KEY,
    mn: req.body.meetingNumber,
    role: req.body.role,
    iat: iat,
    exp: exp,
    appKey: process.env.SDK_KEY,
    tokenExp: iat + 60 * 60 * 2
  }

  const sHeader = JSON.stringify(oHeader)
  const sPayload = JSON.stringify(oPayload)
  const signature = KJUR.jws.JWS.sign('HS256', sHeader, sPayload, process.env.SDK_SECRET)

  res.json({
    signature: signature
  })

})



// router.post('/joinMeeting',function(req,res){

//  let result =  ZoomMtg.join({
//     signature: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzZGtLZXkiOiJrRmV5cDdVcVRubUh1TGlpckNWNXB3IiwibW4iOiI4NzM5NjU3Mjg5MCIsInJvbGUiOiIwIiwiaWF0IjoxNjY4MTU1NzQ4LCJleHAiOjE2NjgxNjI5NDgsImFwcEtleSI6ImtGZXlwN1VxVG5tSHVMaWlyQ1Y1cHciLCJ0b2tlbkV4cCI6MTY2ODE2Mjk0OH0.zzqZPd4_tJEZ68Z_mHqvePUyhi8gJIKIvUei5sWwcCE",
//     sdkKey: process.env.API_KEY,
//     userName: "Aman",
//     meetingNumber: "87396572890",
//     passWord: "yfkX6s"
//   })

//   res.json({
//    result
//   })

// })



router.post('/hello',function(req,res){
  return res.json(200,{
    mes:"hello"
  })
})


module.exports = router;