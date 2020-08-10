const request = require('supertest');
const {Genre} = require('../../models/genre');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
let server;

describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index'); });
    afterEach(async () => { 
        server.close();
        await Genre.remove({}); 
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            await Genre.collection.insertMany([
                {name: 'genre1'},
                {name: 'genre2'},
            ]);
            const response = await request(server).get('/api/genres');
            expect(response.status).toBe(200);
            expect(response.body.length).toBe(2);
            expect(response.body.some(genre => genre.name === 'genre1')).toBeTruthy();
            expect(response.body.some(genre => genre.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return genre if valid id is passed', async () => {
            const genre = new Genre({name: 'genre1'});
            await genre.save();

            const response = await request(server).get('/api/genres/' + genre._id);

            expect(response.status).toBe(200);
            expect(response.body).toHaveProperty('name', genre.name);
        });

        it('should return 404 if invalid id is passed', async () => {
            const response = await request(server).get('/api/genres/1');

            expect(response.status).toBe(404);
        });
    });


    describe('POST /', () => {
        it('should return 401 if client is not logged in', async () => {
            const response = await request(server).post('/api/genres').send({
                name: 'genres1' 
            });
            expect(response.status).toBe(401);
        });

        it('should return 400 if genre is less than 5 chars', async () => {
            const token = new User().generateAuthToken();

            const response = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({
                name: '1234' 
            });
            expect(response.status).toBe(400);
        });

        it('should return 400 if genre is more than 50 chars', async () => {
            const token = new User().generateAuthToken();
            const name = new Array(53).join('a'); //generate long string
            const response = await request(server)
            .post('/api/genres')
            .set('x-auth-token', token)
            .send({
                name: name 
            });
            expect(response.status).toBe(400);
        });
    });

});