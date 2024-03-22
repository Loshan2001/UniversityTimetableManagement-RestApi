const { Registration } = require('../../ControllerValidation/registerController');
const User = require('../../models/User');
jest.mock('../../models/User');





// i test registerValidation

const { registerValidation } = require('../../Validation/userValidation');

describe('registerValidation function', () => {
  it('should return error if input is invalid', () => {
    const invalidInput = {
        id: 1,
        name: 'namessdsd',
        email: 'emgmail.com',
        password: 'password',
        role : 'student',
        semester: 's1',  
        year: 'y2' 
    };

    const { error } = registerValidation(invalidInput);
    expect(error).toBeDefined();
  });

  it('should return undefined error if input is valid', () => {
    const validInput = {
        name: 'fakeName',
        email: 'fakeName@gmail.com',
        password: 'fakeName',
        role: 'student' , 
        semester: 's1',  
        year: '2024'  
    };

    const { error } = registerValidation(validInput);
    expect(error).toBeNull(); 
  });

 
});


//should send status code of 400 when Email exists
const req = {
    body: {
        name: 'fakeName',
        email: 'fakeName@gmail.com',
        password: 'fakeName',
        role : 'student',
        semester: 's1',
        year : 'y2'

        // name: 'fakeName',
        // email: 'fakeName@gmail.com',
        // password: 'fakeName',
        // role : 'faculty',
        // f_Code : 'CS',
        // totalRooms : 20
    }
};

const res = {
    status: jest.fn().mockReturnValue({
        send: jest.fn() // Mocking the send function
    })
};

//when we perform more test we use describe
describe('Registration Controller', () => {
    it('should send status code of 400 when Email exists', async () => {
        // Mocking findOne method of User model
        User.findOne = jest.fn().mockResolvedValueOnce({
            email: 'fakeName@gmail.com',
            
        });

        // Calling the Registration controller function
        await Registration(req, res);

        // Asserting that status code 400 is sent
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.status().send).toHaveBeenCalledWith('Email already exists'); // Assertion for sending the message
    });
});


