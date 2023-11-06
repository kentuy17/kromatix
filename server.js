const express = require('express');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const Jimp = require("jimp");

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
}

app.post('/resize', async (req, res) => {
  const { image } = req.files;

  if (!image) return res.sendStatus(400)

  const outfile = `./out/${req.body.name}`
  const upload = __dirname + '/upload/' + image.name

  image.mv(upload).then(() => {
    resize(550, 550, upload, outfile);
  })

  res.sendStatus(200)
})

var server = app.listen(8081, () => {
  var host = server.address().address
  var port = server.address().port

  console.log("Example app listening at http://%s:%s", host, port)
})

