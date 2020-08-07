const request = require('supertest');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(() => { server.close(); });
    describe('GET /', () => {
        it('should return all genres', async () => {
            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200);
        });
    });
});