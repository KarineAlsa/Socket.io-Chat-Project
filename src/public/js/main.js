const socket = io();
const fileInput= document.getElementById('file')
const fileForm=document.getElementById('uploadForm')

fileForm.addEventListener('submit', (e)=>{
    e.preventDefault();

    const file=fileInput.files[0];
    const filename=file.name;
    console.log(file)
    console.log(filename)
    socket.emit("upload", {file, filename});


    fileInput.value=""
    alert("Tu archivo se ha subido correctamente")
})

function boton(boton){
    const id= boton.id
    console.log(id);
    const mensajePrivado= document.getElementById('message');
    mensajePrivado.value="/p " + id +" ";
}


$(function() {
    //var stream = ss.createStream();
    //Obtaining DOM element from the interface
    const messageForm= $('#message-form');
    const messageBox= $('#message');
    const chat= $('#chat');
    const nickusername=$('#UserName')
    const nickForm = $('#nickForm');
    const nickError = $('#nickError');
    const nickName = $('#nickName');
    let currentName= ""
    const users = $('#usernames');


    nickForm.submit(e=>{
        e.preventDefault();
        socket.emit('new user',nickName.val(), data=>{
            if(data){
                currentName = nickName.val();
                $('#nickWrap').hide();
                $('#contentWrap').removeClass('contentWrap');
                nickusername.html(`
            <div class="font-bold text-red-700">
              Bienvenido ${currentName}
            </div>
               `);
            }else{
               nickError.html(`
            <div class="font-bold text-red-700">
                El nombre del usuario ya existe o es inválido
            </div>
               `);
            }

            nickName.val('');
        });
    });

    messageForm.submit( e => {
        e.preventDefault();
        socket.emit('message',messageBox.val(), data =>{
            chat.append(`<p class="error"> ${data}</p>`)
        });
        messageBox.val('');
    });

    socket.on('new message', function(data) {
        chat.append('<b>' + data.nick + '</b>'+' : '+ data.msg + '<br/>');
    });

    socket.on('archivoMessage', function(data) {
        chat.append('<b style="color: darkgray">' + data.nick + data.msg +  '</b>'+ '<br/>');
    });

    socket.on('usernames', data=>{
        let html= '';
        for (let i=0; i<data.length; i++){
            console.log(data[i] + " " + currentName);
            if(data[i]!==currentName){
                html += `<button class="usuario-lista" id="${data[i]}" onclick="boton(this)"><i class="fas fa-user"> </i>    ${data[i]}</button><br>`
            }

        }
        users.html(html);
    });
    socket.on('p', data =>{
        chat.append(`<p class="pm"> Mensaje privado<b>${data.nick}: </b> ${data.msg}</p>`)
    })
});

