const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT;
app.use(express.static(__dirname + "/dist/cantiniere"));
app.get("/*", (req, res) => {
    res.sendFile(
        path.join(__dirname + "/dist/cantiniere/index.html")
    );
});
app.listen(PORT, () => console.log(`Server now live on ${PORT}!`));