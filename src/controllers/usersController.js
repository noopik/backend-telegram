const {
  response,
  srcResponse,
  pagination,
  srcFeature,
  requestNewPasswordVerification,
} = require('../helpers');
const UserModel = require('../models/users');
const short = require('short-uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const verifiedEmail = require('../helpers/verifiedEmail');

// eslint-disable-next-line no-undef
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  getAllUsers: async(req, res, next) => {
    try {
      // PAGINATION
      if (!req.query.src) {
        const result = await pagination(req, res, next, UserModel.getAllUsers);
        // console.log(Object.keys(result));
        const {
          totalPage,
          currentPage,
          limit,
          totalData,
          data,
          error,
          sortBy,
        } = result;

        // console.log(1, totalPage);

        const meta = {
          currentPage,
          totalData,
          limit,
          totalPage,
          sortBy,
        };
        // console.log(2, data.length);
        // return;
        if (data.length === 0) {
          // console.log(error);
          srcResponse(res, 404, meta, {}, error, error);
        } else {
          srcResponse(res, 200, meta, data);
        }
      }
      if (req.query.src || req.query.category) {
        srcFeature(req, res, next, UserModel.searchUsers).then(() => {
          // console.log(Object.keys(res.result));

          const { data, meta, error } = res.result;

          if (error.statusCode && error.message) {
            srcResponse(
              res,
              error.statusCode,
              meta, {},
              error.message,
              error.message
            );
          } else {
            srcResponse(res, 200, meta, data, {});
          }
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserId: (req, res, next) => {
    const id = req.params.id;
    UserModel.getUserId(id)
      .then((result) => {
        const data = result;
        response(res, 200, data);
      })
      .catch(next);
  },
  getUserByEmail: (req, res, next) => {
    const { email } = req.body;
    UserModel.getUserEmail(email)
      .then((result) => {
        if (result.length === 0) {
          const message = 'Account not found!';
          response(res, 404, {}, message, 'Failed');
        }
        const data = result[0];
        const token = jwt.sign({
            id: data.idUser,
            email: data.email,
            role: data.role,
            name: data.name,
            verified: data.verified,
          },
          privateKey, { expiresIn: '8h' }
        );
        requestNewPasswordVerification(email, data.name, token);
        response(res, 200, 'Email verification have been send');
      })
      .catch(next);
  },
  verifyTokenUser: (req, res) => {
    const decodeResult = req.user;
    UserModel.getUserEmail(decodeResult.email).then((result) => {
      const dataResult = result[0];
      delete dataResult.password;
      response(res, 200, dataResult);
    });
  },
  createUser: (req, res, next) => {
    const { email, password, name } = req.body;
    // Hashing Password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    // UUID
    const newUID = short.generate();

    let today = new Date();

    const dataUser = {
      idUser: newUID,
      email,
      password: hash,
      name,
      updatedAt: today,
    };
    console.log('data user', dataUser);
    // console.log(dataUser);
    UserModel.createUser(dataUser)
      .then(() => {
        // const email = 'cahyaulin@gmail.com';
        // JWT Token
        const token = jwt.sign({
            idUser: dataUser.idUser,
            email: dataUser.email,
            name: dataUser.name,
            verification: 0,
          },
          privateKey, { expiresIn: '24h' }
        );

        // Email verification
        // verifiedEmail(dataUser.email, dataUser.name, token);

        const dataResponse = dataUser;
        delete dataResponse.password;
        response(res, 200, dataResponse);
      })
      .catch((err) => {
        if (err.sqlState === '23000') {
          const message = 'Email alredy exist';
          response(res, 501, {}, message, 'Failed');
        }
        console.log(err);
      });
  },
  updateUser: async(req, res, next) => {
    // Request
    const id = req.params.id;
    const { name, phone, verification, avatar } = req.body;

    // if (Object.keys(req.body).length === 0) {
    //   console.log('req.body', req.body);
    //   response(res, 501, {}, {}, 'Nothing data updated!');
    // }

    let dataUpdate = {};

    // START = UPDATE AVATAR
    const dataFilesRequest = req.file;
    const locationImage = `${process.env.HOST_SERVER}/files`;

    if (dataFilesRequest) {
      dataUpdate.avatar =
        `${locationImage}/${dataFilesRequest.filename}` || null;
      dataUpdate.updatedAt = new Date();
    }

    if (avatar) {
      dataUpdate.avatar = avatar;
      dataUpdate.updatedAt = new Date();
    }
    // OLD Images
    let oldAvatar = await UserModel.getUserId(id)
      .then((result) => {
        const data = result[0].avatar;
        const filename = data.split('/').pop();
        return filename;
      })
      .catch(next);
    console.log('oldAvatar', oldAvatar);

    // END = UPDATE AVATAR

    // START = UPDATE NAME
    if (name) {
      console.log('name', name);
      dataUpdate.name = name;
      dataUpdate.updatedAt = new Date();
    }
    // END = UPDATE NAME

    // START = UPDATE PHONE
    if (phone) {
      dataUpdate.phone = phone;
      dataUpdate.updatedAt = new Date();
    }
    // END = UPDATE PHONE

    // START = UPDATE VERIFIED ACCOUNT
    if (verification) {
      dataUpdate.verification = verification;
      dataUpdate.updatedAt = new Date();
    }
    // END = UPDATE VERIFIED ACCOUNT

    UserModel.updateUser(id, dataUpdate)
      .then(async() => {
        // console.log(result);
        try {
          await fs.unlinkSync(`public/images/${oldAvatar}`);
          console.log(`successfully deleted ${oldAvatar}`);
        } catch (err) {
          console.error('there was an error:', err.message);
        }

        response(res, 200, dataUpdate, {}, 'Success updated user!');
      })
      .catch((err) => {
        next(err);
      });
  },
  updatePassword: (req, res, next) => {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // COMPARE CURRENT PASSWORD WITH DB
    UserModel.getUserId(id)
      .then((result) => {
        const hashPassowrdDB = result[0].password;
        bcrypt.compare(currentPassword, hashPassowrdDB, function(err, result) {
          if (result == true) {
            const saltRounds = 10;
            bcrypt.hash(newPassword, saltRounds, function(err, hash) {
              const newPasswordInsert = {
                password: hash,
              };
              UserModel.updateUser(id, newPasswordInsert)
                .then(() => {
                  response(res, 200, {}, {}, 'Success change password');
                })
                .catch((err) => {
                  // console.log(err);
                  response(res, 200, {}, err.message, 'Failed');
                });
            });
          } else {
            const message = new Error('Current password did not match');
            message.status = 501;
            next(message);
          }
        });
      })
      .catch((err) => {
        const message = 'Password did not match';
        console.log(err);
      });
  },
  deleteUser: (req, res, next) => {
    const id = req.params.id;
    UserModel.deleteUser(id)
      .then(() => {
        response(res, 200);
      })
      .catch(next);
  },
  loginUser: (req, res, next) => {
    const { email, password } = req.body;
    const dataUserLogin = { email, password };
    // console.log(dataUserLogin);
    UserModel.getUserEmail(dataUserLogin.email)
      .then((result) => {
        const dataUserRes = result[0];

        // console.log(dataUserRes);
        let message;

        // Email Validation
        if (!dataUserRes) {
          message = 'Account not found!';
          response(res, 404, {}, message, 'Cannot login');
        }
        // Password Validation
        const { password: passwordResponse } = dataUserRes;
        // console.log('passwordResponse', passwordResponse);
        const compareHashPassword = bcrypt.compareSync(
          password,
          passwordResponse
        );
        if (!compareHashPassword) {
          message = 'Password wrong!';
          response(res, 404, {}, message, 'Cannot login');
        }
        // JWT Token
        const token = jwt.sign({
            email: dataUserRes.email,
            role: dataUserRes.role,
            name: dataUserRes.name,
          },
          privateKey, { expiresIn: '12h' }
        );

        const refreshToken = jwt.sign({
            email: dataUserRes.email,
            role: dataUserRes.role,
            name: dataUserRes.name,
          },
          privateKey, { expiresIn: `${24 * 7}h` }
        );

        delete dataUserRes.password;
        dataUserRes.token = token;
        dataUserRes.refresh = refreshToken;

        response(res, 200, dataUserRes, {}, 'Login success');
      })
      .catch(next);
  },
};