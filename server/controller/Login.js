import userData from '../models/profiles.js';
import bcrypt from 'bcrypt'

const Login = async(req, res)=>
{
    const { username, password } = req.body;
    
    try
    {
        const findData = await userData.findOne({ name: username });

        if(!findData)
        {
            return res.status(404).json({message: 'username not found!'});
        }
        
        const storedPassword = findData.password;
        const comparePassword = await bcrypt.compare(password, storedPassword);
        
        if(!comparePassword)
        {
            return res.status(401).json({message: 'Pasword did not match'});
        }

        const userID = findData._id;
        
        res.status(200).json({message: 'Login successful', userID});
    }
    catch(err)
    {
        console.log('error in login', err);
    }
}

export default Login;
