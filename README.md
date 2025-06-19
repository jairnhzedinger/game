# Jogo

Este projeto agora utiliza Node.js com Express e EJS para servir o jogo "Neon Odyssey".

## Como executar

```bash
npm install
node app.js
```

Acesse `http://localhost:3000` no navegador.

O servidor agora conta com multiplayer online via Socket.IO. Ao escolher o modo
"Multiplayer" no menu é possível entrar em filas de **Co-op** ou **1x1**. O
contador de jogadores online é exibido no canto superior do menu principal.
