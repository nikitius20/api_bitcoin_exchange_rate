const express = require("express");
const { env } = require("process");
const router = require("./router");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("public"));
app.use(express.json());
app.use(router);

app.listen(PORT, () => {
  try {
    console.log(`Server is running at http://localhost:${PORT}`);
  } catch (e) {
    console.log(e);
  }
});
