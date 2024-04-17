import jwt from 'jsonwebtoken';

export const signToken = (id: string, secretToken: string, expiresIn: string) => {
  if (!/^\d+[smhdwMy]$/i.test(expiresIn)) {
    throw new Error('expiresIn format is invalid');
  }

  return jwt.sign({ id }, secretToken, {
    expiresIn,
    algorithm: 'HS256'
  });
};

export function verifyToken(token: string, secretToken: string) {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretToken, (err, decoded) => {
      if (err) {
        switch (err.name) {
          case 'TokenExpiredError':
            reject(new Error('jwt expired'));
            break;
          case 'JsonWebTokenError':
            if (err.message === 'invalid signature') {
              reject(new Error('invalid signature'));
            } else if (err.message === 'invalid algorithm') {
              reject(new Error('invalid algorithm')); // Fix: Ensure to reject with 'invalid algorithm'
            } else {
              reject(new Error('jwt malformed'));
            }
            break;
          case 'NotBeforeError':
            reject(new Error('jwt malformed'));
            break;
          default:
            reject(err);
        }
      }

      resolve(decoded);
    });
  });
}
