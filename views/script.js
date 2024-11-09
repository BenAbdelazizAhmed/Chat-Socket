const socket = io();  // Connexion au serveur Socket.io

// Envoi d'un message lorsqu'on clique sur le bouton "Envoyer"
document.getElementById('sendButton').addEventListener('click', () => {
  const messageInput = document.getElementById('messageInput');
  const message = messageInput.value;
  const user = 'Utilisateur';  // Vous pouvez le remplacer par un nom d'utilisateur dynamique si nécessaire

  if (message.trim() !== '') {
    socket.emit('sendMessage', { user, message });
    messageInput.value = '';  // Réinitialiser le champ de message
  }
});

// Fonction pour afficher un message dans la fenêtre de chat
function displayMessage(message) {
  const messagesContainer = document.getElementById('messages');
  const messageElement = document.createElement('div');
  messageElement.classList.add('message');
  
  if (message.user === 'Utilisateur') {  // Si c'est l'utilisateur actuel
    messageElement.classList.add('current-user');
  }

  messageElement.innerHTML = `
    <div class="avatar">${message.user.charAt(0)}</div>
    <div class="content">${message.message}</div>
  `;

  messagesContainer.appendChild(messageElement);
  scrollToBottom();
}

// Écouter les messages reçus via Socket.io
socket.on('receiveMessage', (message) => {
  displayMessage(message);
});

// Faire défiler vers le bas pour afficher les nouveaux messages
function scrollToBottom() {
  const messagesContainer = document.getElementById('messages');
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
