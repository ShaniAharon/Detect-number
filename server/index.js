
const express = require('express')
const cors = require('cors');

const multer = require('multer')
const _ = require('underscore')

const tesseract = require("node-tesseract-ocr")


const path = require('path')

const app = express()

app.use(express.static(path.join(__dirname + '/uploads')))
app.use(express.json());
app.use(cors());

app.set('view engine', "ejs")

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname)
        )
    }
})

const upload = multer({ storage })

app.get('/', (req, res) => {
    // res.sendFile(__dirname + '/index.html')
    res.render('index', { data: '' })
})

// app.post('/extracttextfromimage',upload.single('file'),(req, res) => {
//     //can send to the tesseract method the file - req.file.path
// })


app.post('/api/test', async (req, res) => {
    const { imgUrl } = req.body;
    // console.log('imgUrl', imgUrl);
    // const file = JSON.parse(req.body.file);
    // const { file } = req.body;
    // console.log('server file:', file);
    const config = {
        lang: "eng",
        oem: 'digits --oem 1 --psm 7 -c tessedit_char_whitelist=0123456789',
        psm: 3,
    }
    // custom_oem = 'digits --oem 1 --psm 7 -c tessedit_char_whitelist=0123456789'

    // text = tess.image_to_string(croped, config = custom_oem)


    tesseract
        .recognize(imgUrl, config)
        .then((recognizedText) => {
            // console.log("Result:", text)
            //{ data: text }
            // recognizedText = recognizedText.replaceAll("[^0-9]+", " ")
            res.send(recognizedText)
        })
        .catch((error) => {
            console.log(error.message)
        })

});


app.listen(3030, () => {
    console.log('app is listening on pot 3030');
})

