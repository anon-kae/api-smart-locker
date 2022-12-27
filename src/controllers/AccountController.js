const {
  RegisterUseCase,
  LoginWithEmailAndPasswordUseCase,
  RefreshAccessTokenUseCase,
  GetCurrentAccountUseCase
} = require('../usecases/accounts');
const repositories = require('../repositories');
const services = require('../services');


exports.getAccount = async (req, res, next) => {
  try {
    const { user: account } = req;
    const useCase = new GetCurrentAccountUseCase(services, repositories);
    const result = await useCase.execute(account);

    return res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.loginValidations = LoginWithEmailAndPasswordUseCase.getValidators;
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const useCase = new LoginWithEmailAndPasswordUseCase(services, repositories);
    const result = await useCase.execute(email, password);

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.registerValidations = RegisterUseCase.getValidators;
exports.register = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const useCase = new RegisterUseCase(services, repositories);
    const result = await useCase.execute({ email, password, firstName, lastName });

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};

exports.refreshAccessTokenValidations = RefreshAccessTokenUseCase.getValidators;
exports.refreshAccessToken = async (req, res, next) => {
  try {
    const { accessToken, refreshToken } = req.body;

    const useCase = new RefreshAccessTokenUseCase(services, repositories);
    const result = await useCase.execute(accessToken, refreshToken);

    res.status(200).json({ data: result });
  } catch (err) {
    next(err);
  }
};
