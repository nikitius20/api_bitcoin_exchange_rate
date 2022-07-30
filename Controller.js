const axios = require("axios");
const fs = require("fs");
const nodemailer = require("nodemailer");
const mailjet = require("node-mailjet").apiConnect(
  "656d3e64db09b88d9ee70e92684b826b",
  "e10b72a13a5a843f28aa947081dc6a48"
);

class Controller {
  async GetCurrentBTC(req, res) {
    try {
      const response = await GetBTCRate();
      if (response) {
        res.status(200).send(`Поточний курс 1 BTC : ${response.UAH} UAH `);
      } else {
        res.status(500).send("Error Occurred");
      }
    } catch (e) {
      console.log(e);
      res.status(500).send("Error Occurred");
    }
  }
  async SendMails(req, res) {
    try {
      const response = await GetBTCRate();
      if (!response) {
        res.status(500).send("Error Occurred");
      }
      fs.readFile("MailData.txt", "utf8", (err, data) => {
        if (err) {
          res.status(500).send("Error Occurred");
          console.log(err);
          return;
        }
        const emails = data.split(",");

        emails.map((email) => {
          sendMailJet(response.UAH, email);
        });
        res.status(200).send("Emails has send");
      });
    } catch (e) {
      console.log(e);
      res.status(500).send("Error Occurred");
    }
  }
  async SubscribeMail(req, res) {
    try {
      const newMail = req.body.email;
      if (!CheckMail(newMail)) {
        throw { message: "This is not email" };
      }
      fs.readFile("MailData.txt", "utf8", (err, data) => {
        if (err) {
          res.status(500).send("Error Occurred");
          console.log(err);
          return;
        }
        const emails = data.split(",");
        if (emails.includes(newMail)) {
          res.status(500).send("email already exist");
        } else {
          emails.push(newMail);
          fs.writeFile("MailData.txt", emails.join(","), (err) => {
            if (err) {
              res.status(500).send("Error Occurred");
              console.log(err);
            }
          });
          res.status(200).send("email added");
        }
      });
    } catch (e) {
      res.status(500).send("Error Occurred");
      console.log(e);
    }
  }
  async UnSubscribeMail(req, res) {
    try {
    } catch (e) {
      console.log(e);
    }
  }
}

function CheckMail(email) {
  const regexForMail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  return email.match(regexForMail);
}
async function GetBTCRate() {
  return await axios
    .get(
      "https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD,UAH&api_key=998026ea291fa58a098667575c13c27f0f204accea7a2828a7d440f5173d250a"
    )
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return null;
    });
}

async function sendMailJet(uah, email) {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "nekihc992@gmail.com",
          Name: "BTC Exchange",
        },
        To: [
          {
            Email: email,
            Name: "User",
          },
        ],
        Subject: "Bincoin to UAH",
        HTMLPart: `<h3>Dear User current exchange rate for 1 BTC is ${uah} UAH </h3>`,
        CustomID: "BTCExchangeRate",
      },
    ],
  });
  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
}

module.exports = new Controller();
