const User = require("../models/user");
const { omit } = require("lodash");
const httpStatus = require("http-status");

exports.load = async (req, res, next, id) => {
  try {
    const user = await User.get(id);
    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.user.transform());

exports.loggedIn = (req, res) => res.json(req.user.transform());

exports.create = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const savedUser = await user.save();
    res.status(savedUser.CREATED);
    res.json(savedUser.transform());
  } catch (error) {
    return next(User.checkDublicateEmail(error));
  }
};

exports.replace = async (req, res, next) => {
  try {
    const { user } = req.locals;
    const newUser = new User(req.body);
    const omitRole = user.role !== "admin" ? "role" : "";
    const newUserObject = omit(newUser.toObject(), "_id", omitRole);
    await user.updateOne(newUserObject, { override: true, upsert: true });
    const savedUser = await User.findById(user._id);
    res.json(savedUser.transform());
  } catch (error) {
    return next(User.checkDublicateEmail(error));
  }
};

exports.update = async (req, res, next) => {
  const ommitRole = req.locals.user.role !== "admin" ? "role" : "";
  const updatedUser = omit(req.body, ommitRole);
  const user = Object.assign(req.locals.user, updatedUser);
  await user
    .save()
    .then((savedUser) => res.json(savedUser.transform()))
    .catch((e) => next(User.checkDublicateEmail(e)));
};

exports.listUser = async (req, res, next) => {
  try {
    const users = await User.list(req.query);
    const transformedUsers = users.map((user) => user.transform());
    res.json(transformedUsers);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { user } = req.locals;
  await user
    .remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end)
    .catch((e) => next(e));
};
