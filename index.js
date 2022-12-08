const express = require("express");
const axios = require("axios");
const app = express();
const baseURL = "https://www.buda.com/api/v2/";

let savedAlerts = { "BTC-CLP": 25320, "BTC-COP": 46934 };

app.get("/onespread/:marketId", function (req, res) {
  const marketId = req.params.marketId;
  axios.get(baseURL + `markets/${marketId}/ticker`).then((response) => {
    minAsk = parseFloat(response.data.ticker.min_ask[0]);
    maxBid = parseFloat(response.data.ticker.max_bid[0]);
    result = minAsk - maxBid;
    resultJson = { [marketId]: result };
    res.status(200).send(resultJson);
  });
});

app.get("/allspread", async function (req, res) {
  const {
    data: { markets },
  } = await axios.get(baseURL + `markets`);
  const promises = markets.map(({ id }) =>
    axios.get(baseURL + `markets/${id}/ticker`)
  );
  const result = await Promise.all(promises);
  const resultJson = result.reduce((obj, { data }) => {
    const {
      ticker: { market_id, min_ask, max_bid },
    } = data;
    const minAsk = parseFloat(min_ask[0]);
    const maxBid = parseFloat(max_bid[0]);

    return { ...obj, [market_id]: minAsk - maxBid };
  }, {});

  res.status(200).send(resultJson);
});

app.get("/addalert/:marketId/:spreadValue", function (req, res) {
  const marketId = req.params.marketId;
  const spreadValue = req.params.spreadValue;
  savedAlerts[marketId] = spreadValue
  res.status(200).send({messagge: `The alter has been created succesfuly`});
});

app.get("/removealert/:marketId", function (req, res) {
  const marketId = req.params.marketId;
  delete savedAlerts[marketId];
  res.status(200).send({messagge: `The alter has been removed succesfuly`});
});

app.get("/spreadalert", async function (req, res) {
  const promises = Object.keys(savedAlerts).map((id) =>
    axios.get(baseURL + `markets/${id}/ticker`)
  );
  const result = await Promise.all(promises);
  const resultJson = result.reduce((obj, { data }) => {
    const {
      ticker: { market_id, min_ask, max_bid },
    } = data;
    const minAsk = parseFloat(min_ask[0]);
    const maxBid = parseFloat(max_bid[0]);
    let response = {};
    if (savedAlerts[market_id] > minAsk - maxBid) {
      response = `ALERT: The spread has increase`;
    } else if (savedAlerts[market_id] < minAsk - maxBid) {
      response = `ALERT: The spread has decrease`;
    } else {
      response = null;
    }
    return { ...obj, [market_id]: response };
  }, {});
  Object.keys(resultJson).forEach(k => (!resultJson[k] && resultJson[k] !== undefined) && delete resultJson[k]);
  res.status(200).send(`
      <html>
        <head>
          <meta http-equiv="refresh" content="10;url=/spreadalert" />
        </head>
        <body>${JSON.stringify(resultJson)}</body>
      </html>
    `);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
