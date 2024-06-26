import { app } from '../app';
import request from "supertest"
import sqlConnection from '../db/db';
describe("GET /api/v1/todos",  () => {

    beforeAll(async () => {

        try {
            await sqlConnection;
        }
        catch(err) {
            console.log("Error")
        }
    });


    it ("It should return a JSON file containing the Users Todos", async () => {

        const resp = await request(app).get("/api/v1/todos")
        expect(resp.status).toBe(200);
        expect(resp.body).toBeInstanceOf(Array);
    })

})
