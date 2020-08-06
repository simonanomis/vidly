const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('shouldd return a valid JWT', () => {
        const paayload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const user = new User(paayload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        expect(decoded).toMatchObject(paayload);
    });
});