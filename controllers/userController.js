const bcryptjs = require("bcryptjs");
const models = require("../models/index");

exports.index = async (req, res, next) => {
  // =========use case select all field=============================
  // const users = await models.User.findAll();
  // =========use case select some field using attributes===========
  // const users = await models.User.findAll({
  //  attributes: ['id', 'name', 'email', 'created_at'],
  //  order: [['id','desc'],]
  // });
  //==========use case select all field except some field===========
  // const users = await models.User.findAll({
  //  attributes: { exclude: [ 'password' ] },
  //  order: [['id','desc'],]
  // });
  //==========use case create alias for email as username===========
  // const users = await models.User.findAll({
  //   attributes: ['id', 'name', ['email','username'], 'created_at'],
  //   order: [['id','desc'],]
  // });
  // =========use case select specific field with WHERE(sql)=========
  // const users = await models.User.findAll({
  //   attributes: ['id', 'name', 'email', 'created_at'],
  //   where : {
  //      email: 'mary@gmail.com'
  //   },
  //   order: [['id','desc'],]
  // });
  // ==========use case sql query command=============================
  // const sql = "select id, name, email, created_at from users order by id desc";
  // const users = await models.sequelize.query(sql, {
  //   type: models.sequelize.QueryTypes.SELECT,
  // });

  const users = await models.User.findAll({
      attributes: { exclude: ["password"] },
      include: [
        {
          model: models.Blog,
          as: "blogs",
          attributes: ["id", "title"],
        }
      ],
      order: [
        ["id", "desc"],
        ["blogs", "id", "desc"]
      ]
    });

  res.status(200).json({
    data: users,
  });
};

exports.show = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

//insert
exports.insert = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existEmail = await models.User.findOne({
      where: { email: email },
    });
    if (existEmail) {
      const error = new Error("This email is already used.");
      error.statusCode = 400;
      throw error;
    }

    //hash password
    const salt = await bcryptjs.genSalt(8);
    const passwordHash = await bcryptjs.hash(password, salt);

    //add user
    const user = await models.User.create({
      name: name,
      email: email,
      password: passwordHash,
    });

    res.status(201).json({
      message: "Data added successfully.",
      data: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

//Update
exports.update = async (req, res, next) => {
  try {
    const { id, name, email, password } = req.body;

    if (req.params.id !== id) {
      const error = new Error("There are something wrong");
      error.statusCode = 400;
      throw error;
    }

    //hash password
    const salt = await bcryptjs.genSalt(8);
    const passwordHash = await bcryptjs.hash(password, salt);

    //update user
    const user = await models.User.update(
      {
        name: name,
        email: email,
        password: passwordHash,
      },
      {
        where: {
          id: id,
        },
      }
    );

    res.status(200).json({
      message: "Data updated successfully.",
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};

//Delete
exports.destroy = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await models.User.findByPk(id);

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    //delete user by id
    await models.User.destroy({
      where: {
        id: id,
      },
    });

    res.status(200).json({
      message: "Data deleted successfully.",
    });
  } catch (error) {
    res.status(error.statusCode).json({
      error: {
        message: error.message,
      },
    });
  }
};
