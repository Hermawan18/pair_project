const express = require('express')
const Controller = require('../controllers/controller')
const router = express.Router()


router.get('/register', Controller.register)
router.post('/register', Controller.registerPost)

router.get('/login', Controller.login)
router.post('/login', Controller.loginPost)

// router.get('/logout', Controller.logout)

router.use(function (req, res, next) {  // for id
    console.log(req.session);
    if(!req.session.userId){
        const error = `Please login First`
        res.redirect(`/login?errors=${error}`)
    }else{
        next()
    }
})

router.get('/', Controller.landingPage)
// router.get('/home', Controller.home)

router.get('/category', Controller.category)

router.get('/course', Controller.course)

router.get('/material', Controller.materi)

router.use('/logout', Controller.getLogout)


module.exports = router