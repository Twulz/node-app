module.exports = {
  getToken(request, app, version) {
    return request(app)
      .post(version+'/login')
      .send({ username: 'testuser@email.com', password: 'password' })
      .then(res => {
        let token = res.header['set-cookie']!=null ? res.header['set-cookie'][0] : null;
        if (token != null) {
          token = token.slice(9, 153);
        }
        return token;
      })
      .catch(err => { throw err });
  }
}