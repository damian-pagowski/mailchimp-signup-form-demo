const express = require("express");
const request = require("request");
require("dotenv").config();

const router = express.Router();
const API_TOKEN = process.env.API_TOKEN;
const MAIL_LIST_ID = process.env.MAIL_LIST_ID;

console.log;
/* GET home page. */
router.get("/", function(req, res, next) {
  res.sendFile("public/index.html");
});

router.post("/signup", function(req, res, next) {
  console.log(API_TOKEN);
  console.log(MAIL_LIST_ID);

  console.log(req.body);
  const { firstName, lastName, email } = req.body;
  if (!firstName || !lastName || !email) {
    return res.redirect("/fail.html");
  }

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ]
  };

  const postData = JSON.stringify(data);

  const options = {
    url: `https://us4.api.mailchimp.com/3.0/lists/${MAIL_LIST_ID}`,
    method: "POST",
    headers: {
      Authorization: `auth ${API_TOKEN}`
    },
    body: postData
  };
  request(options, (err, response, body) => {
    if (err) {
      return res.redirect("/fail.html");
    } else {
      if (response.statusCode == 200) {
        return res.redirect("/success.html");
      } else {
        return res.redirect("/fail.html");
      }
    }
  });
});

module.exports = router;
