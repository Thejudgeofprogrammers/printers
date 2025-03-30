console.clear();
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config('./.env');

const app = express()

app.use(express.static(path.join(__dirname, 'public')));

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PORT = parseInt(process.env.PORT, 10) || 3000
const HOST = process.env.HOST || 'localhost'

app.get('/', (req, res) => {
    const cameraIps = [];
    const count_cam = parseInt(process.env.COUNT_CAM, 10);
    for (let i = 1; i <= count_cam; i++) {
        const camIp = process.env[`PORT_CAM${i}`];
        if (camIp) {
            cameraIps.push(camIp);
        }
    }

    res.render('index', { ipx: cameraIps });
});

app.get('/auth', (req, res) => {
    res.render('auth');
});

app.listen(PORT, HOST, () => {
    console.log(`Server located is http://${HOST}:${PORT}`);
})

