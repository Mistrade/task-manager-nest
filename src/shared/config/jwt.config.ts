import process from 'process';

export const JwtConfig = {
  global: true,
  secret: process.env.JWT_SECRET_CODE,
  signOptions: { expiresIn: '30d' },
};
