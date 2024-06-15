const authService = require("../services/authService");

exports.registerUser = async (req, res) => {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.registerExpert = async (req, res) => {
  try {
    const result = await authService.registerExpert(req.body);
    res.status(201).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const result = await authService.forgotPassword(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const result = await authService.resetPassword(req.body);
    res.status(200).send(result);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
};
