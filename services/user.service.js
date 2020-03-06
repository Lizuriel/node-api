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
 * Authenticate an User with email & password
 * @param {Object} param0 
 * @param {string} email | param0
 * @param {string} password | param0
 */
function authenticate({ email, password }) {

    let days = 1; // numb of day for expiry date
    let isSha1 = /^[0-9a-f]{40}$/i;
    return MODELS.user.findOne({ //Query
        where: {
            email: email,
            password: (isSha1.test(password)) ? password : sha1(password),
            active: true
        }
    }).then(
        user => {
            if(user) {
                const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: days +' days' }); // Synchronously create token
                user.access_token = token;
                let expirDate = new Date();
                expirDate.setDate(expirDate.getDate() + days)
                user.access_token_expire_date = expirDate;
                delete expirDate;
                updateToken(user.id, user);
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
            email: data.email
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

function updateToken(id, data) {
    return MODELS.user.findOne({
        attributes: ['id', 'access_token', 'access_token_expire_date'],
        where: { id: id }
    }).then(
        async user => {
            user.access_token = data.access_token;
            user.access_token_expire_date = data.access_token_expire_date;
            await user.save();
        }
    )
}

/**
 * update an existant user
 * @param { number } id 
 * @param { User } data 
 * @return { User } user
 */
function updateUser(id, data) {
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
                    // user = MODELS.user.build(data)
                    // await user.save();
                    // return new Promise(function(resolve, reject) {
                    //     resolve({
                    //         user: userUpdated
                    //     })
                    // })
                    return user.update(data, {where: { id: data.id }}).then(
                        userUpdated => {
                            return new Promise(function(resolve, reject) {
                                resolve({
                                    user: userUpdated
                                })
                            })
                        },
                        error => {
                            return new Promise(function (resolve, reject) {
                                reject(error);
                            });
                        }
                    )
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