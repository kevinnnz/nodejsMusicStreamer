const express = require("express");
const path = require("path");
const fs = require("fs");


const statSync = fs.statSync;
const createReadStream = fs.createReadStream;

const app = express();
const PORT = process.env.PORT || 6789;

const ASSETS_PATH = path.join(__dirname, "ASSETS");

app.get("/audio-test", (req, res) => {
    const filePath = path.join(ASSETS_PATH, "audio.wav");
    const CHUNK_SIZE = 500 * 1e3;

    const range = req.headers.range || "0";
    const audioSize = statSync(filePath).size; // return audio size

    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE - 1, audioSize - 1);
    const contentLength = end - start + 1;

    // setting headers 
    // to do for future move this into its own function
    const header = {
        "Content-Type": "audio/wav",
        "Content-Range": `bytes ${start}-${end}/${audioSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Transfer-Encoding": "chunked"
    }

    res.writeHead(206, header);

    // creating readable stream and pipe it to response
    const stream = createReadStream(filePath, { start, end });
    stream.pipe(res);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});