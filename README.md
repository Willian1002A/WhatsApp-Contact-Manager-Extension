# WhatsApp Contact Manager Extension

Uma extensão para o Google Chrome que permite o envio automatizado de mensagens no WhatsApp Web para uma lista de contatos. Ideal para suporte, marketing ou comunicação em massa.

## 🚀 Funcionalidades

- Envio automatizado de mensagens personalizadas para múltiplos contatos.
- Suporte a placeholders como `{{name}}` para personalizar mensagens.
- Controle de tempo entre mensagens com delays configuráveis.
- Interface simples para gerenciar o envio.

## 📂 Estrutura do Projeto
```
wa-bulk-extension/
├── background.js       # Lógica principal da extensão
├── inject.js           # Script injetado no WhatsApp Web para interagir com a interface
├── manifest.json       # Configuração da extensão para o Chrome
├── icons/              # Ícones da extensão
└── README.md           # Documentação do projeto
```

## 🛠️ Como Usar

### 1. Instalar a Extensão
1. Clone este repositório:
   ```bash
   git clone https://github.com/Willian1002A/WhatsappBulkSender.git
   ```
2. Abra o Google Chrome e vá para `chrome://extensions/`.
3. Ative o **Modo do Desenvolvedor** no canto superior direito.
4. Clique em **Carregar sem compactação** e selecione a pasta do projeto.

### 2. Configurar e Usar
1. Abra o WhatsApp Web no Chrome.
2. Configure a lista de contatos e a mensagem no painel da extensão.
3. Clique em **Iniciar** para começar o envio.

## ⚙️ Configurações

- **Lista de Contatos**: Um array de objetos contendo `name` e `number`.
- **Template de Mensagem**: Use `{{name}}` para personalizar mensagens.
- **Delay entre Mensagens**: Configure o tempo mínimo e máximo entre os envios.

## 🧩 Tecnologias Utilizadas

- **JavaScript**: Lógica principal.
- **Chrome Extensions API**: Para interagir com o navegador.
- **HTML/CSS**: Interface da extensão.

## 🛡️ Segurança e Privacidade

- Esta extensão não coleta nem armazena dados dos usuários.
- Todas as mensagens são enviadas diretamente pelo WhatsApp Web.

## 🐞 Como Contribuir

1. Faça um fork do projeto.
2. Crie uma branch para sua feature:
   ```bash
   git checkout -b minha-feature
   ```
3. Faça commit das suas alterações:
   ```bash
   git commit -m "Adiciona nova funcionalidade"
   ```
4. Envie para o repositório remoto:
   ```bash
   git push origin minha-feature
   ```
5. Abra um Pull Request.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT. Consulte o arquivo [MIT License](LICENSE) para mais detalhes.

## 📞 Contato

- **Autor**: Willian A. S. D'Amico
- **Email**: wasdamico@gmail.com
- **GitHub**: [Willian1002A](https://github.com/Willian1002A)