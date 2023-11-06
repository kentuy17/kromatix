const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const Jimp = require("jimp");
const fs = require('fs');

const app = express();

app.use(fileUpload());
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const resize = (length = 250, width = 250, infile, outfile = 'image.jpg') => {
  if (!infile) {
    return 'input is required'
  }

  Jimp.read(infile, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(length, width) // resize
      .quality(100) // set JPEG quality
      .greyscale() // set greyscale
      .write(outfile); // save
  });

  return outfile
}

const delay = ms => new Promise(res => setTimeout(res, ms));

app.post('/resize', async (req, res) => {
  try {
    const { image } = req.files;

    if (!image) return res.sendStatus(400)

    const outfile = './out/' + req.body.name
    const upload = __dirname + '/upload/' + image.name

    image.mv(upload).then(() => {
      return resize(550, 550, upload, outfile);
    })

    delay(1000).then(() => {
      res.sendFile(__dirname + '/out/' + req.body.name)
    })
  } catch (error) {
    res.send(500, error.message)
  }
})

var server = app.listen(8081, () => {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})

