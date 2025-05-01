import messageData from '../models/messagesModel.js';
import userData from '../models/profiles.js';

const StoreMessages = async({ toUserID, fromUserID, message })=>
{
    try
    {
        console.log("TOUserID:", toUserID,"FromUserID:", fromUserID,"the_Text:", message);
        
        const findsender = await userData.findOne({ _id: fromUserID }).select('name');
        const findreceiver = await userData.findOne({ _id: toUserID }).select('name');

        const From = findsender.name;
        const To = findreceiver.name;
        const date = new Date().toLocaleDateString();
        const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }).toUpperCase();

        const newMessage = new messageData({ From, senderID: fromUserID, To, receiverID: toUserID, message, localTime: time, localDate: date });
        
        await newMessage.save();
    }
    catch(err)
    {
        console.log(err);
    }
}

const RetrieveMessages = async(req, res)=>
{
    const { selectedUserID, currentUserID } = req.query;
    console.log('currentID:',currentUserID, "selectedUserID:",selectedUserID);
    try
    {
        const result = await messageData.find(
            {
                $or:
                [
                    { senderID: currentUserID, receiverID: selectedUserID },
                    { senderID: selectedUserID, receiverID: currentUserID },
                ]            
            }
        ).sort({createdAt: 1}).select('message localTime senderID');
        // console.log("resultRetrieved: ", result);
        
        if(!result)
        {
            console.log('no data dounf')
        }
        
        res.status(200).json({message: 'found messages', result});
    }
    catch(err)
    {
        console.log(err);
    }
}

export { StoreMessages, RetrieveMessages };