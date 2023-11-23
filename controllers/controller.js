const bcrypt = require('bcryptjs');
const { Category, Course, User, Material, Profile } = require('../models');
// const { formatDate, getCurrentTime } = require('../helpers/helper')
const { Op } = require('sequelize');

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
      let { search } = req.query;
      let opt = {
        include: Category,
      };
      if (search) {
        opt.where.name = {
          [Op.iLike]: `%${search}%`,
        };
      }
      let data = await Course.findAll(opt);
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

  static async courseById(req, res) {
    try {
      let { notification } = req.query;
      let { courseId } = req.params;
      let data = await Course.findByPk(courseId, {
        include: Material,
      });
      res.render('detailCourse', { data, courseId, notification });
    } catch (error) {
      res.send(error);
    }
  }

  static async addMateri(req, res) {
    try {
      let { error } = req.query;
      const { courseId } = req.params;
      let data = await Course.findByPk(courseId, {
        include: Material,
        where: {
          id: courseId,
        },
      });
      res.render('addMateri', { data, error });
    } catch (error) {
      res.send(error);
    }
  }

  static async handlerAddMateri(req, res) {
    try {
      const { courseId } = req.params;
      const { title, content } = req.body;
      await Material.create({ CourseId: courseId, title, content });
      res.redirect(`/course/${courseId}`);
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        let err = error.errors.map((el) => el.message);
        res.send(err);
      } else {
        res.send(error);
      }
    }
  }

  static async editMateri(req, res) {
    try {
      let { error } = req.query;
      const { courseId } = req.params;
      const { materiId } = req.params;
      let dataCourse = await Course.findByPk(courseId);
      let dataMateri = await Material.findByPk(materiId);
      let data = await Material.findOne({
        where: {
          id: courseId,
        },
      });
      res.render('editMaterial', { data, dataCourse, dataMateri, error });
    } catch (error) {
      if (error.name == 'SequelizeValidationError') {
        let err = error.errors.map((el) => el.message);
        res.send(err);
      } else {
        res.send(error);
      }
    }
  }

  static async handlerEditMateri(req, res) {
    try {
      const { courseId } = req.params;
      const { materiId } = req.params;
      const { title, content } = req.body;
      await Material.update({ title, content }, { where: {id: materiId}});
      res.redirect(`/course/${courseId}`);
    } catch (error) {
      const { courseId } = req.params;
      const { materiId } = req.params;
      if (error.name == 'SequelizeValidationError') {
        let err = error.errors.map((el) => el.message);
        res.redirect(`/course/${courseId}/material/:materiId/edit?error=${err}`);
      } else {
        res.send(error);
      }
    }
  }

  static async deleteMateri(req, res) {
    try {
      const id = req.query.id;
      await Material.destroy({
        where: {
          id,
        },
      });
      res.redirect('/material');
    } catch (error) {
      res.send(error);
    }
  }

  static async userLists(req, res) {
    try {
      const data = await User.findAll({
        include: [Profile],
      });
      res.render('userLists', { data });
    } catch (error) {
      res.send(error);
    }
  }
}

module.exports = Controller;
