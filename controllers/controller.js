const bcrypt = require('bcryptjs')

class Controller {
    static async landingPage(req, res) {
        try {
            res.render('home')
        } catch (error) {
            res.send(err);
        }
    }
    static async register(req, res) {
        try {
            let errors
            if (req.query.errors) {
                errors = req.query.errors.split(',')
            }
            res.render('register', { errors })
        } catch (error) {
            res.send(err);
        }
    }
    static async registerPost(req, res) {
        try {
            
        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                let errors = err.errors.map(el => el.message);
                res.redirect(`/register?errors=${errors}`);
            } else {
                res.send(err);
            }
        }
    }
    static async login(req, res) {
        try {
            let errors
            if (req.query.errors) {
                errors = req.query.errors.split(',')
            }
            res.render('login', { errors })
        } catch (error) {
            res.send(err);
        }
    }
    static async loginPost(req, res) {
        try {
            
        } catch (error) {
            res.send(err);
        }
    }
    static async getLogout(req, res) {
        try {
            req.session.destroy((err) => {
                if(err) res.send(err)
                else{
                    res.redirect('/login')
                }
            })
        } catch (error) {
            res.send(err);
        }
    }
    static async aaaaa(req, res) {
        try {
            
        } catch (error) {
            res.send(err);
        }
    }
    static async aaaaa(req, res) {
        try {
            
        } catch (error) {
            res.send(err);
        }
    }
    static async aaaaa(req, res) {
        try {
            
        } catch (error) {
            res.send(err);
        }
    }
}

module.exports = Controller