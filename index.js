const express = require("express");
const axios = require("axios");
const app = express();
const baseURL = "https://www.buda.com/api/v2/";

app.get("/onespread/:marketId", function (req, res) {
  const marketId = req.params.marketId;
  axios.get(baseURL + `markets/${marketId}/ticker`).then((response) => {
    // console.log(response.data);
    minAsk = parseFloat(response.data.ticker.min_ask[0]);
    maxBid = parseFloat(response.data.ticker.max_bid[0]);
    result = minAsk - maxBid;
    resultJson = { [marketId]: result };
    res.send(resultJson);
  });
});

app.get("/allspread", async function (req, res) {
  const { data: { markets }} = await axios.get(baseURL + `markets`);
  const promises = markets.map(({ id }) => 
    axios.get(
      baseURL + `markets/${id}/ticker`
    )
  )
  const result = await Promise.all(promises)
  const resultJson = result.reduce((obj, { data }) => {
    const { ticker: { market_id, min_ask, max_bid}} = data
    const minAsk = parseFloat(min_ask[0]);
    const maxBid = parseFloat(max_bid[0]);

    return {...obj, [market_id]: minAsk - maxBid}
  }, {})

  res.send(resultJson);
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
