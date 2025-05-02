import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import avatarStyle from '../styles/avatars.module.css';

function Avatar()
{
    const navigate = useNavigate();
    const [ selectedAvatar, setSelectedAvatar ] = useState(" ");

    const avatars = ["https://img.freepik.com/premium-photo/men-design-logo-avatar_665280-69427.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",

        "https://img.freepik.com/free-vector/mysterious-mafia-man-smoking-cigarette_52683-34828.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",
        
        "https://png.pngtree.com/png-vector/20230416/ourmid/pngtree-avatar-ninja-symbol-icon-vector-png-image_6709524.png",
        
        "https://img.freepik.com/free-psd/3d-illustration-with-online-avatar_23-2151303087.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",
        
        "https://img.freepik.com/premium-vector/anime-schoolgirl-portrait-illustration-vector-icon-cartoon_674187-289.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740",
        
        "https://img.freepik.com/free-psd/3d-rendering-avatar_23-2150833548.jpg?ga=GA1.1.1173692762.1745160499&semt=ais_hybrid&w=740"];

    async function setAvatar()
    {
        try
        {
            const userID = localStorage.getItem('ID');
            
            const response = await axios.put(`${import.meta.env.VITE_CHATTER_APP_URL_SERVER}/api/avatar`,
                { avatar: selectedAvatar, userID: userID }, {withCredentials: true}
            );
        }
        catch(err)
        {
            console.log(err);
        }
    }

    function handleClick(image)
    {
        setSelectedAvatar(image);
    }
    function handleSubmit()
    {
        setAvatar();
        navigate('/chat');
    }

    return(<>
    <div className={avatarStyle.body}>
        <div className={avatarStyle.header}>Choose Avatar</div>
        <div className={avatarStyle.container}>
            {avatars.map((e, index)=>( 
            <div className={`${avatarStyle.Avatar} ${selectedAvatar === e ? avatarStyle.selected : " "}`}
                key={index} onClick={()=>handleClick(e)}>
                <img className={avatarStyle.avatarImage} src={e} alt='avatar.jpg' />
            </div>
            ))}
        </div>
        <button className={avatarStyle.submit} onClick={handleSubmit}>Okay</button>
    </div>
    </>)   
}

export default Avatar;