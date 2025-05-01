import userData from '../models/profiles.js';
// import messageData from '../models/messagesModel.js';

const Contacts = async(req, res)=>
{
    try
    {
        const contacts = await userData.find().select('name avatar');
        // console.log(contacts);
        // let ID = contacts.wa
        // const latestMessage = await messageData.find().select('localTime');
        // console.log(latestMessage);

        // const abs = await messageData.aggregate([
        //     {
        //         $group: 
        //         {
        //             _id: 
        //             {
        //                 sender: '$senderID',
        //                 receiver: '$receiverID',
        //                 date: '$localDate',
        //                 // createdAt: '$createdAt',
        //             },
        //             latestText: 
        //             {
        //                 $max: '$createdAt'
        //             },
        //         }
        //     },
        //     {
        //         $project:
        //         {
        //             _id: 1,
        //             message: 1,
        //             latestText: 1,
        //         }
        //     }
        // ]);
        // const abs = await messageData.aggregate([
        //     {
        //       $sort: {
        //         createdAt: -1 // sort newest messages first
        //       }
        //     },
        //     {
        //       $group: {
        //         _id: {
        //           sender: '$senderID',
        //           receiver: '$receiverID',
        //           date: '$localDate'
        //         },
        //         latestMessage: { $first: '$$ROOT' } // get the full document
        //       }
        //     },
        //     {
        //       $project: {
        //         _id: 1,
        //         message: '$latestMessage.message',
        //         localTime: '$latestMessage.localTime',
        //         createdAt: '$latestMessage.createdAt'
        //       }
        //     }
        //   ]);
        // console.log('abs', abs);
        
        res.status(201).json(contacts);
    }
    catch(err)
    {
        console.log(err);
    }
}

export default Contacts;