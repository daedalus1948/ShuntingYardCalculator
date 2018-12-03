const request = require('supertest');
const app = require('../app.js');

describe('APP calculate route', ()=>{
            
    it("POST request to '/calculate' returns a correct JSON response", () => {
        return request(app)
            .post('/calculate/')
            .send({expression: '(-7-8)/(2+3/11.22)*2^2^3-(7.001*0.2)'})
            .expect(200)
            .then((response)=>{ 
                expect(response.body.result).toEqual("-1694.9851056603773");
                expect(response.body.status).toEqual("valid");

            })
    });

    it("POST request to '/calculate' returns a JSON response with invalid expression result", () => {
        return request(app)
            .post('/calculate/')
            .send({expression: '(-7-8))))))))/(2+3/11.22)*2^2^3-(7.001*0.2)'})
            .expect(200)
            .then((response)=>{ 
                expect(response.body.result).toEqual(null);
                expect(response.body.status).toEqual("invalid");
            })
    });
})