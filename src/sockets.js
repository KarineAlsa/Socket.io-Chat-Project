


module.exports = function(io,){
    const fs = require('fs');
    const path = require('path')

    let users = {}

    io.on('connection',socket =>{

        socket.on("upload", (data) => {
            const name=data.filename// <Buffer 25 50 44 ...>
            const file=data.file

            fs.writeFile(path.join(__dirname,"public","uploads", name), file, (err) => {

                console.log(err)
            });
            const advise=" ha subido un archivo"
            io.sockets.emit('archivoMessage', {
                msg:advise,
                nick: socket.nickname
            });
        });


        console.log('New user connected');


        socket.on('message',(data,cb)=> {
            var msg=data.trim();

            if(msg.substr(0,3)=== '/p '){
                msg = msg.substr(3);
                const index=msg.indexOf(' ');
                if (index!== -1){
                    var name = msg.substring(0, index);
                    var msg= msg.substring(index+1)
                    console.log(name.toString());
                    if (name in users){
                        users[name].emit('p', {
                            msg,
                            nick:socket.nickname
                        });
                    }
                    else{
                        cb('Este usuario no existe');
                    }
                }else {
                    cb('Pon un mensaje');
                }


            }else {
                if(msg!==""){
                    io.sockets.emit('new message', {
                        msg:data,
                        nick: socket.nickname
                    });
                }

            }

        });

        socket.on('new user', (data,cb) => {

            console.log(data);
            if(data in users || data==="") {
                cb(false, data);
            }else{
                cb(true, data);
                socket.nickname = data;
                users[socket.nickname]=socket;
                updateNicknames();
            }
        })

        socket.on('disconnect', data=>{
            if(!socket.nickname)return;
            delete users[socket.nickname]
            updateNicknames();

        });
        function updateNicknames(){
            io.sockets.emit('usernames', Object.keys(users));

        }
    });
}