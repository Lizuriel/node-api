let MODELS = require('./../models/index');
const config = require('./../config/config.json');
const jwt = require('jsonwebtoken');
const sha1 = require('sha1');

const {Op} = require('sequelize');

// const bcrypt = require('bcryptjs');
// const db = require('_helpers/db');
// const User = db.User;

module.exports = {
    authenticate, // ok
    getAll,
    getById, 
    create, // ok
    update: updateUser, // ok
    delete: deleteUser // ok
};

/**
 * Authenticate an User with username & password
 * @param {Object} param0 
 * @param {string} username | param0
 * @param {string} password | param0
 */
function authenticate({ username, password }) {

    let days = 1; // numb of day for expiry date
    let isSha1 = /^[0-9a-f]{40}$/i;
    return MODELS.user.findOne({ //Query
        where: {
            username: username,
            password: (isSha1.test(password)) ? password : sha1(password),
            active: true
        }
    }).then(
        user => {
            if(user) {
                const token = jwt.sign({ sub: user.id, name: user.username }, config.secret, { expiresIn: days +' days' }); // Synchronously create token
                user.access_token = token;
                let expirDate = new Date();
                expirDate.setDate(expirDate.getDate() + days)
                user.access_token_expire_date = expirDate;
                delete expirDate;
                updateUser(user.id, user);
                return new Promise(function(resolve) {
                    resolve({
                        success: true,
                        // token: token,
                        user: user
                    })
                })
            } else {
                return new Promise(function(resolve, reject) {
                    reject({
                        success: false,
                        error: 'bad.password'
                    })
                })
            }
        },
        error => {
            return new Promise(function (resolve, reject) {
                reject(error);
            });
        }
    )
}

/**
 * get all user
 * @return {User}
 */
async function getAll() {
    return await MODELS.user.findAll({});
}


function getById(id) {
    return MODELS.user.findOne({
        where: {
            id: id
        }
    }).then(
        user => {
            let _return = null
            if(user) {
                _return = user;
            }
            return _return;
        }
    )
}


function create(data) {
    let query = {
        where: {
            [Op.or]: [{
                username: data.username
            }, {
                email: data.email
            }]
        }
    };

    return MODELS.user.findOne(query).then(
        user => {
            let errors = [];
            if (user) {
                if (user.email === data.email) {
                    errors.push({
                        type: 'body',
                        field: 'email',
                        value: data.email,
                        message: 'validation.body.unique.email'
                    });
                }
                if (user.username === data.username) {
                    errors.push({
                        type: 'body',
                        field: 'username',
                        value: data.email,
                        message: 'validation.body.unique.username'
                    });
                }
            }
            if (data.password !== data.password_repeat) {
                errors.push({
                    type: 'body',
                    field: 'password_repeat',
                    value: data.password_repeat,
                    message: 'validation.body.repeat.password'
                });
            }

            if (errors.length > 0) {
                return new Promise(function (resolve) {
                    resolve({
                        success: false,
                        errors: errors
                    });
                });
            } else {
                // Encrypt password
                data.password = sha1(data.password);
                return MODELS.user.create(data).then(
                    user => {
                        return new Promise(function (resolve) {
                            resolve({
                                success: true,
                                user: user,
                            });
                        });
                    },
                    error => {
                        return new Promise(function (resolve, reject) {
                            reject(error);
                        });
                    }
                );
            }
        },
        error => {
            return new Promise(function (resolve, reject) {
                reject(error);
            });
        }
    );
}

/**
 * update an existant user
 * @param { number } id 
 * @param { User } data 
 * @return { User } user
 */
function updateUser(id, data) {
    // get user by id
    return MODELS.user.findOne({
        where: {
            id: id
        }
    }).then(
        async user => {
            if(user) {
                let errors = [];
                if (data.password && data.password_repeat && data.password !== data.password_repeat) {
                    errors.push({
                        type: 'body',
                        field: 'password_repeat',
                        value: data.password_repeat,
                        message: 'validation.body.repeat.password'
                    });
                }
                if (errors.length > 0) {
                    return new Promise(function (resolve) {
                        resolve({
                            success: false,
                            errors: errors
                        });
                    });
                } else {
                    user = data;
                    await user.save();
                    return new Promise(function(resolve, reject) {
                        resolve({
                            user: user
                        })
                    })
                } 
            } else {
                return new Promise(function (resolve, reject) {
                    reject(new Errors.ErrorNotFound('error.not_found.user'));
                });
            }
        },
        error => {
            return new Promise(function (resolve, reject) {
                reject(error);
            });
        }
    );
}

/**
 * delete an user by id
 * @param {number} id 
 * @return { boolean }
 */
async function deleteUser(id) {
    return await MODELS.user.destroy({ where: { id: id }});
}