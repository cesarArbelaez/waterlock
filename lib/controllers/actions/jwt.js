'use strict';

/* global waterlock */

/**
 * jwt action
 *
 * creates a new token if a session is authenticated
 *
 * GET /user/jwt
 */
module.exports = function(req, res){
  if(req.headers.password !== waterlock.config.clientId){
    return res.forbidden('You are not authorized.');
  }

  var jwtData = waterlock._utils.createJwt(req, res, req.headers.id);
  Jwt.create({token: jwtData.token, owner: req.headers.id}).exec(function(err){
    console.log(err)
    if(err){
      return res.serverError('JSON web token could not be created');
    }

    var result = {};

    result[waterlock.config.jsonWebTokens.tokenProperty] = jwtData.token || 'token';
    result[waterlock.config.jsonWebTokens.expiresProperty] = jwtData.expires || 'expires';

    if (waterlock.config.jsonWebTokens.includeUserInJwtResponse) {
      result['user'] = req.session.user;
    }

    res.json(result);
  });
};
