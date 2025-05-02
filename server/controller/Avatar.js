import userData from '../models/profiles.js';

const Avatar = async(req, res)=>
{
    const { avatar, userID } = req.body;
    try
    {
        // console.log(avatar, userID);
        const result = await userData.findByIdAndUpdate({ _id: userID }, { avatar: avatar });

        res.status(201).json({message: 'Avatar created'});
    }
    catch(err)
    {
        console.log(err);
    }
}

export default Avatar;