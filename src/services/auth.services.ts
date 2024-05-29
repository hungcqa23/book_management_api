import bcrypt from 'bcrypt';
import { HTTP_STATUS } from '~/constants/httpStatus';
import User from '~/models/schemas/user';
import AppError from '~/utils/app-error';
import { signToken } from '~/utils/jwt';
class AuthServices {
  constructor() {}

  public async correctPassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }

  public async logIn(email: string, password: string) {
    const user = await User.findOne({ email })?.select('+password -avatar');

    if (!user || !(await authService.correctPassword(password, user.password)))
      throw new AppError('Incorrect password or email', 401);

    const token = signToken(
      user._id,
      process.env.JWT_ACCESS_SECRET as string,
      process.env.JWT_ACCESS_EXPIRES_IN as string
    );

    user.password = '';
    user.passwordConfirm = undefined;

    return {
      token,
      data: {
        user
      }
    };
  }

  public async signUp(
    username: string,
    email: string,
    password: string,
    passwordConfirm: string,
    role: string
  ) {}
}

const authService = new AuthServices();
export default authService;
