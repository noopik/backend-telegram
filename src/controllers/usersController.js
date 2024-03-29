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
const cloudinary = require('cloudinary').v2;
const { configCloudinary } = require('../middleware/cloudinary');
cloudinary.config(configCloudinary);

// eslint-disable-next-line no-undef
const privateKey = process.env.PRIVATE_KEY;

module.exports = {
  getAllUsers: async (req, res, next) => {
    try {
      // console.log('userId', req.userId);
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

        // console.log('data', data);

        const dataUpdate = data.filter((user) => {
          if (user.idUser !== req.userId) {
            return user;
          }
        });

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
          srcResponse(res, 200, meta, dataUpdate);
        }
      }
      if (req.query.src) {
        srcFeature(req, res, next, UserModel.searchUsers).then(() => {
          // console.log(Object.keys(res.result));

          const { data, meta, error } = res.result;

          const dataUpdate = data.filter((user) => {
            if (user.idUser !== req.userId) {
              return user;
            }
          });

          if (error.statusCode && error.message) {
            srcResponse(
              res,
              error.statusCode,
              meta,
              {},
              error.message,
              error.message
            );
          } else {
            srcResponse(res, 200, meta, dataUpdate, {});
          }
        });
      }
    } catch (error) {
      next(error);
    }
  },
  getUserId: (req, res, next) => {
    const id = req.params.id;
    console.log('ID USER', id);
    UserModel.getUserId(id)
      .then((result) => {
        const data = result;
        response(res, 200, data);
      })
      .catch(next);
  },
  getUserByEmail: (req, res, next) => {
    const { email } = req.body;
    // console.log('email', email);
    UserModel.getUserEmail(email)
      .then((result) => {
        // console.log('result', result);
        if (result.length === 0) {
          const message = 'Account not found!';
          response(res, 404, {}, message, 'Failed');
        }

        const data = result[0];
        const token = jwt.sign(
          {
            idUser: data.idUser,
            email: data.email,
            name: data.name,
            verified: data.verified,
          },
          privateKey,
          { expiresIn: '8h' }
        );
        requestNewPasswordVerification(email, data.name, token);
        response(res, 200, 'Email verification have been send');
      })
      .catch(next);
  },
  verifyTokenUser: (req, res) => {
    const decodeResult = req.user;
    const tokenStatus = req.tokenStatus;

    let newToken;
    let newRefreshToken;

    if (tokenStatus === 'token expired') {
      newToken = jwt.sign(
        {
          email: decodeResult.email,
          name: decodeResult.name,
        },
        privateKey,
        { expiresIn: '24h' }
      );
      newRefreshToken = jwt.sign(
        {
          email: decodeResult.email,
          name: decodeResult.name,
        },
        privateKey,
        { expiresIn: `${24 * 7}h` }
      );
    }

    UserModel.getUserEmail(decodeResult.email).then((result) => {
      const dataResult = result[0];
      delete dataResult.password;
      if (newToken) {
        dataResult.token = newToken;
      }
      if (newRefreshToken) {
        dataResult.refresh = newRefreshToken;
      }
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
    // console.log('data user', dataUser);
    // console.log(dataUser);
    UserModel.createUser(dataUser)
      .then(() => {
        // const email = 'cahyaulin@gmail.com';
        // JWT Token
        const token = jwt.sign(
          {
            idUser: dataUser.idUser,
            email: dataUser.email,
            name: dataUser.name,
            verification: 0,
          },
          privateKey,
          { expiresIn: '24h' }
        );

        // Email verification
        verifiedEmail(dataUser.email, dataUser.name, token);

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
  updateUser: async (req, res, next) => {
    const id = req.params.id;
    const { name, phone, verification, avatar, biography, status } = req.body;

    let dataUpdate = {};

    // START = UPDATE AVATAR
    // UPDATE AVATAR
    const fileUpload = req.file;

    console.log('req.body', req.body);
    console.log('dataUpdate', dataUpdate);

    let oldAvatar;
    if (fileUpload) {
      dataUpdate.avatar = fileUpload.path;
      dataUpdate.updatedAt = new Date();
    }

    if (avatar) {
      dataUpdate.avatar = avatar;
      dataUpdate.updatedAt = new Date();
    }
    // END = UPDATE AVATAR

    // START = UPDATE NAME
    if (name) {
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

    // START = UPDATE BIOGRAPHY

    if (biography) {
      dataUpdate.biography = biography;
      dataUpdate.updatedAt = new Date();
    }
    // END = UPDATE BIOGRAPHY

    // START = UPDATE STATUS ONLINE OR OFFLINE

    if (status) {
      if (status === 'offline') {
        dataUpdate.status = null;
      } else {
        dataUpdate.status = status;
      }
      dataUpdate.updatedAt = new Date();
    }
    // END = UPDATE STATUS ONLINE OR OFFLINE

    // START = UPDATE VERIFIED ACCOUNT
    if (verification) {
      dataUpdate.verification = verification;
      dataUpdate.updatedAt = new Date();
    }
    // END = UPDATE VERIFIED ACCOUNT
    // console.log('dataUpdate', dataUpdate);
    UserModel.updateUser(id, dataUpdate)
      .then(async () => {
        // console.log(result);
        // if (avatar || fileUpload) {
        //   try {
        //     await fs.unlinkSync(`public/images/${oldAvatar}`);
        //     console.log(`successfully deleted ${oldAvatar}`);
        //   } catch (err) {
        //     console.error('there was an error:', err.message);
        //   }
        // }

        response(res, 200, dataUpdate, {}, 'Success updated user!');
      })
      .catch((err) => {
        next(err);
      });
  },
  updateStatus: (idUser, status) => {
    // START = UPDATE STATUS
    console.log(status);
    let dataUpdate = {
      status: status,
      updatedAt: new Date(),
    };
    // END = UPDATE STATUS
    UserModel.updateUser(idUser, dataUpdate).then(() => {
      console.log('Success update status');
    });
  },
  updatePassword: (req, res, next) => {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // COMPARE CURRENT PASSWORD WITH DB
    UserModel.getUserId(id)
      .then((result) => {
        const hashPassowrdDB = result[0].password;
        bcrypt.compare(currentPassword, hashPassowrdDB, function (err, result) {
          if (result == true) {
            const saltRounds = 10;
            bcrypt.hash(newPassword, saltRounds, function (err, hash) {
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
      .then((result) => {
        if (result.affectedRows !== 1) {
          response(res, 404, {}, {}, 'User not found');
        }
        // console.log(res);
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
        const token = jwt.sign(
          {
            idUser: dataUserRes.idUser,
            email: dataUserRes.email,
            role: dataUserRes.role,
            name: dataUserRes.name,
          },
          privateKey,
          { expiresIn: '24h' }
        );

        const refreshToken = jwt.sign(
          {
            email: dataUserRes.email,
            role: dataUserRes.role,
            name: dataUserRes.name,
          },
          privateKey,
          { expiresIn: `${24 * 7}h` }
        );

        delete dataUserRes.password;
        dataUserRes.token = token;
        dataUserRes.refresh = refreshToken;

        response(res, 200, dataUserRes, {}, 'Login success');
      })
      .catch(next);
  },
};
