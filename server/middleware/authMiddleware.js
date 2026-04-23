const jwt = require('jsonwebtoken');
const jwksClient = require('jwks-rsa');

const client = jwksClient({
  jwksUri: `${process.env.KINDE_DOMAIN}/.well-known/jwks.json`
});

function getKey(header, callback) {
  client.getSigningKey(header.kid, function (err, key) {
    if (err) {
      return callback(err, null);
    }
    const signingKey = key.publicKey || key.rsaPublicKey;
    callback(null, signingKey);
  });
}

const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Brak tokenu autoryzacyjnego' });
  }

  const token = authHeader.split(' ')[1];

  if (!process.env.KINDE_DOMAIN) {
    // Tryb deweloperski fallback (jeśli zapomnisz ustawić KINDE_DOMAIN)
    console.warn("Brak KINDE_DOMAIN w zmiennych środowiskowych! Przepuszczam ruch awaryjnie.");
    req.user = { id: req.body.userId || req.params.userId || '65955a8e1234567890abcdef' };
    return next();
  }

  jwt.verify(token, getKey, {}, function (err, decoded) {
    if (err) {
      return res.status(401).json({ message: 'Nieważny token autoryzacyjny' });
    }
    // Token z Kinde często ma pole sub, z którego wyciągamy user id.
    // Zapisujemy go w req.user.id
    req.user = {
      id: decoded.sub || decoded.id
    };
    next();
  });
};

module.exports = requireAuth;
