import bcrypt from 'bcrypt';
class AuthServices {
  constructor() {}

  async correctPassword(password: string, userPassword: string) {
    return await bcrypt.compare(password, userPassword);
  }
}

const authService = new AuthServices();
export default authService;
