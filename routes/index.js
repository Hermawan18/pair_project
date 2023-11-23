const express = require('express');
const Controller = require('../controllers/controller');
const router = express.Router();
const app = express();
const nodemailer = require('nodemailer');

router.get('/register', Controller.register);
router.post('/register', Controller.registerPost);

router.get('/login', Controller.login);
router.post('/login', Controller.loginPost);

// router.get('/logout', Controller.logout)

router.use(function (req, res, next) {
  // for id
  console.log(req.session);
  if (!req.session.userId) {
    const error = `Please login First`;
    res.redirect(`/login?errors=${error}`);
  } else {
    next();
  }
});

router.use('/logout', Controller.getLogout);

router.get('/', Controller.landingPage);
// router.get('/home', Controller.home)

router.get('/category', Controller.category);

router.get('/course', Controller.course);

router.get('/material', Controller.materi);

router.get('/:courseId', Controller.courseById);

router.get('/:courseId/material/add', Controller.addMateri);

router.post('/:courseId/material/add', Controller.handlerAddMateri);

router.get('/:courseId/material/:materiId/edit', Controller.editMateri);

// router.get('/')

const isAdmin = function (req, res, next) {
    // untuk role
    // console.log(req.session);
    if (req.session.userId && req.session.admin) {
        next();
    } else {
        const error = `Cant Access`;
        res.redirect(`/login?error=${error}`);
    }
};

router.get('/:courseId/material/delete/:id', Controller.deleteMateri);

// router.get('/userLists', isAdmin, Controller.userLists)
// router.get('/userLists/delete/:id', isAdmin, Controller.userListsDelete)


//for email
// Konfigurasi Nodemailer untuk Mailtrap
var transporter = nodemailer.createTransport({
  host: 'sandbox.smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '6310e64aea615e',
    pass: '0832e7dbf3b240',
  },
});


// Route untuk mengirim email
app.get('/sendEmail', (req, res) => {
  const tanggal = req.session.date;
  const mailOptions = {
    from: 'kiriminEngine@kirimin.com',
    to: req.session.email,
    subject: 'Registrasi Berhasil',
    text: `Registrasi anda sudah berhasil pada ${tanggal}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Email tidak dapat dikirim');
    } else {
      return res.redirect('login');
      // return res.redirect(`/user/${req.session.userId}/profile`)
    }
  });
});

module.exports = router;
