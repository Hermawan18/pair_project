const bcrypt = require('bcryptjs');
const { Category, Course, User, Material } = require('../models');

class Controller {
  static async landingPage(req, res) {
    try {
      res.render('home');
    } catch (error) {
      res.send(error);
    }
  }
  static async register(req, res) {
    try {
      let errors;
      if (req.query.error) {
        errors = req.query.error.split(',');
      }
      res.render('register', { errors });
    } catch (error) {
      res.send(error);
    }
  }
  static async registerPost(req, res) {
    try {
      const { username, email, password, isAdmin } = req.body;
      await User.create({ username, email, password, isAdmin });
      res.redirect('/login');
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        let errors = error.errors.map((el) => el.message);
        res.redirect(`/register?error=${errors}`);
      } else {
        res.send(error);
      }
    }
  }
  static async login(req, res) {
    try {
      const error = req.query.error;
      console.log(error);
      if (error) {
        //   errors = req.query.errors.split(',')
        res.render('login', { error });
      } else {
        res.render('login');
      }
    } catch (error) {
      res.send(error);
    }
  }
  static async loginPost(req, res) {
    try {
      const { username, password } = req.body;
      let data = await User.findOne({ where: { username } });

      if (data.username) {
        const isValidPassword = bcrypt.compareSync(password, data.password);
        if (isValidPassword) {
          req.session.userId = data.id;
          req.session.role = data.role;
          res.redirect('/');
        } else {
          const error = 'invalid_username/password';
          res.redirect(`/login?error=${error}`);
        }
      } else {
        const error = 'invalid_username/password';
        res.redirect(`/login?error=${error}`);
      }
    } catch (error) {
      res.send(error);
    }
  }
  static async getLogout(req, res) {
    try {
      req.session.destroy((err) => {
        if (err) res.send(err);
        else {
          res.redirect('/login');
        }
      });
    } catch (error) {
      res.send(error);
    }
  }
  static async category(req, res) {
    try {
      let data = await Category.findAll();
      res.render('category', { data });
    } catch (error) {
      res.send(error);
    }
  }
  static async course(req, res) {
    try {
      let data = await Course.findAll({ include: Category });
      res.render('course', { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async materi(req, res) {
    try {
      let data = await Material.findAll();
      console.log(data);
      res.render('material', { data });
    } catch (error) {
      res.send(error);
    }
  }

  static async addMateri(req, res) {
    try {
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
