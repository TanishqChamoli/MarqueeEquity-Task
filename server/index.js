const express = require("express");
const cors = require("cors");
const request = require("request");

const app = express();
const pool = require("./db");

// middlewares
app.use(cors());
app.use(express.json());

// get all cin
app.get("/cin", async (req, res) => {
  try {
    const cins = await pool.query("select * from cinstore");
    res.json(cins.rows);
  } catch (error) {
    console.log(err.message);
  }
});

// add one cin
app.post("/cin", async (req, res) => {
  try {
    const { cin, name } = req.body;
    const newCin = await pool.query(
      "INSERT INTO cinstore (cin,name) VALUES($1,$2) RETURNING *",
      [cin, name]
    );
    res.json(newCin.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

// delete on cin
app.get("/cin/:db_id", async (req, res) => {
  try {
    const { db_id } = req.params;
    const delCin = await pool.query("delete from cinstore where db_id=($1)", [
      db_id,
    ]);
    res.json({ message: "Row deleted" });
  } catch (err) {
    console.log(err.message);
  }
});

// search
app.post("/search", async (req, res) => {
  try {
    const { query } = req.body;
    var options = {
      method: "POST",
      url: "https://www.zaubacorp.com/custom-search",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        Cookie: "drupal.samesite=1",
      },
      body: "search=" + query + "&filter=company",
    };
    request(options, function (error, response) {
      if (error) throw new Error(error);
      res.json(response.body);
    });
  } catch (err) {
    console.log(err.message);
  }
});

// check duplicate
app.post("/check-duplicate", async (req, res) => {
  try {
    const { cin } = req.body;
    const cins = await pool.query("select * from cinstore where cin=($1)", [
      cin,
    ]);
    res.json(cins.rows);
  } catch (error) {
    console.log(err.message);
  }
});

app.listen(5000, () => {
  console.log("Server has started on port 5000");
});
