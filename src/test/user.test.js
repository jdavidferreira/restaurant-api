const mongoose = require('mongoose')
const request = require('supertest')
const app = require('../app')

beforeEach(async () => {
  for (const i in mongoose.connection.collections) {
    await mongoose.connection.collections[i].deleteMany({})
  }
})

afterAll(async () => {
  await mongoose.connection.dropDatabase() //because first beforeeach is not working
  await mongoose.disconnect()
})

const data = {
  EMAIL: 'user@example.com',
  PASSWORD: 'p4ssw0rd'
}

describe('Create user ( POST /user )', () => {
  test('Response status 204 - user created OK', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        email: data.EMAIL,
        password: data.PASSWORD
      })
    expect(response.statusCode).toBe(200)
    expect(response.header['content-type']).toBe(
      'application/json; charset=utf-8'
    )
  })

  test('Response status 409 with blank email and password', async () => {
    const response = await request(app)
      .post('/user')
      .send({
        email: '',
        password: ''
      })

    expect(response.statusCode).toBe(400)
  })

  test('Response status 409 with email already in use', async () => {
    //create user
    await request(app)
      .post('/user')
      .send({
        email: data.EMAIL,
        password: data.PASSWORD
      })
    //create user with the same data
    const response = await request(app)
      .post('/user')
      .send({
        email: data.EMAIL,
        password: data.PASSWORD
      })

    expect(response.statusCode).toBe(409)
    expect(response.body.message).toBe('Already exists in database')
  })
})

describe('Change password ( POST /user/:id/password )', () => {
  // test('Response status 204 - OK', async () => {
  //   //create user
  //   const response = await request(app)
  //     .post('/user')
  //     .send({
  //       email: data.EMAIL,
  //       password: data.PASSWORD
  //     })
  //     //get token
  //     //get user data (id)
  //     //with the id and the token request change_password
  // })
})
