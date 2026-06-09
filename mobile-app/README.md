# SPA do Doguinho - App Mobile

Aplicativo mobile em React Native com Expo, conectado na API existente do SPA do Doguinho.

## API usada

```txt
https://www.spadodoguinho.com.br/api
```

## Telas iniciais

- Login do cliente
- Cadastro do cliente
- Início
- Meus pets
- Agendar
- Minha agenda
- Perfil

## Como rodar no computador

```bash
cd mobile-app
npm install
npx expo start
```

Depois, abra pelo aplicativo Expo Go no celular ou rode no emulador Android.

## Como gerar APK

Instale o EAS CLI:

```bash
npm install -g eas-cli
```

Faça login na Expo:

```bash
eas login
```

Configure o projeto:

```bash
eas build:configure
```

Gere o APK de teste:

```bash
npm run build:apk
```

## Observações

Antes de publicar oficialmente, ainda é recomendado:

- Trocar os ícones provisórios por artes oficiais.
- Testar login real de cliente.
- Testar cadastro de pet.
- Testar agendamento com serviço e horário disponível.
- Melhorar seleção de data com calendário nativo.
- Adicionar tela administrativa em versão futura.
