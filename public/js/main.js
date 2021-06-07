const  chatForm = document.getElementById('chat-form')
const chatMessages = document.querySelector('.chat-messages');
const url = "http://localhost:3100";

const {username, room} = Qs.parse(location.search, {
    ignoreQueryPrefix: true
})

console.log(username, room);

const socket = io(url);

socket.emit('joinRoom', {username, room});

socket.on('message', message => {
    console.log(message);
    outputMessage(message);

    chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const msg = event.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();
})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                        <p class="text">
                             ${message.text}
                        </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}