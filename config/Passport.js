const passport = require('passport');
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt');
const User = require('../models/modelUser');

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET, // Usa la variable de entorno para mayor seguridad
};

passport.use(
  new JWTStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      // Busca al usuario por ID en el payload del token
      const user = await User.findById(jwtPayload.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'User not found' });
      }
    } catch (error) {
      return done(error, false);
    }
  })
);

module.exports = passport;
