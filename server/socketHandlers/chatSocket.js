import { StoreMessages } from '../controller/Messages.js';

function SocketConnection(io)
{
    // const users = new Map();
    io.on('connection', (socket)=>
    {
        console.log('User Connected1: ',socket.id);
        // socket.on('register_user', (userID)=>
        // {
        //     users.set(userID, socket.id);
        //     // console.log('UserID: ',userID);
        //     console.log('SocketID: ',socket.id);
        // });

        socket.on("join_room", (roomID)=>
        {
            if(!roomID)
            {
                return console.log("Error! no roomID created");
            }
            socket.join(roomID); 
            console.log("ROOMID:",roomID);
        }); // join_room must be separate from send_message otherwise weird message duplication occurs.

        socket.on('send_message', async({ toUserID, fromUserID, message, roomID }, callback)=>
        {   // used callback function in order to ensure messages are stored first before retrieving.
            console.log("send_message_data: ",toUserID, fromUserID, message);
            try
            {   // send messages to store in database
                await StoreMessages({ toUserID, fromUserID, message });
                callback(true);
            }                    
            catch(err)
            {
                callback(false);
                console.log(err);
            }
            io.to(roomID).emit('receive_message', { fromUserID, message });
        });
    
        socket.on('disconnect', ()=>
        {
            console.log("User Disconnected: ", socket.id);
        });
    });
        
}
export default SocketConnection;