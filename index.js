const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");
let subscriptionTmp;
const app = express();
// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicKey =
  "BAlXBmk-zwngHeFZlUwkxJfOKB09iU9OMnuglCMpE7y-wvckoKO88rLBUaWqEH_76NKBnNvxP6H-ozxeHhZeKhE";
const privateKey = "sfS_WveKZYFfy0Mf8UHB7hlEFaw2k8KDo3YPJRblwIY";
webpush.setVapidDetails(
  "mailto:quangdung100194@gmail.com",
  publicKey,
  privateKey
);
app.get('/test', (req, res)=> {
    res.status(201).json({});

    // Create payload
    const payload = JSON.stringify({ title: "Re Push Test" });
  
    // Pass object into sendNotification
    webpush
      .sendNotification(subscriptionTmp, payload)
      .catch(err => console.error(err));
});
// Subscribe Route
app.post("/subscribe", (req, res) => {
  // Get pushSubscription object
  const subscription = req.body;
  subscriptionTmp = subscription;
  // Send 201 - resource created
  res.status(201).json({});

  // Create payload
//   const payload = JSON.stringify({ title: "Push Test" });

  // Pass object into sendNotification
//   webpush
//     .sendNotification(subscription, payload)
//     .catch(err => console.error(err));
});

const port = 3000;

app.listen(port, () => console.log(`Server started on port ${port}`));
