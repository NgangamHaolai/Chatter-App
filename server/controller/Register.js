import userData from '../models/profiles.js';
import bcrypt from 'bcrypt';

const Register = async(req, res)=>
{
    try
    {
        const { name, email, password } = req.body;

        const findData = await userData.findOne({ email });
        
        if(findData)
        {
            return res.status(409).json({message: 'email already exists!'});
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        
        const newUser = new userData({ name, email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({message: 'Registration successful.', newUser});
    }
    catch(err)
    {
        console.log('error in registration', err);
    }
}

export default Register;