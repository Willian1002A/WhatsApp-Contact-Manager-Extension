class WhatsAppBulkSender {
    constructor() {
        /** @type {boolean} */
        this.running = false;

        /** @type {boolean} */
        this.stopRequested = false;
    }

    /**
     * Aguarda um tempo específico.
     * @param {number} ms - Tempo em milissegundos para aguardar.
     * @returns {Promise<void>}
     */
    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Abre ou encontra uma aba do WhatsApp Web.
     * @returns {Promise<chrome.tabs.Tab>} - Retorna a aba do WhatsApp Web.
     */
    async getWhatsAppTab() {
        let tabs = await chrome.tabs.query({ url: '*://web.whatsapp.com/*' });
        if (tabs && tabs.length) {
            return tabs[0];
        }
        return await chrome.tabs.create({ url: 'https://web.whatsapp.com/', active: false });
    }

    /**
     * Navega para o URL de um contato.
     * @param {number} tabId - ID da aba do WhatsApp Web.
     * @param {{ name: string, number: string }} contact - Objeto contendo o nome e número do contato.
     * @param {string} messageTemplate - Template da mensagem com placeholders.
     * @returns {Promise<void>}
     */
    async navigateToContact(tabId, contact, messageTemplate) {
        const personalized = messageTemplate.replace(/{{\s*name\s*}}/gi, contact.name || '');
        const encoded = encodeURIComponent(personalized);
        const sendUrl = `https://web.whatsapp.com/send?phone=${contact.number}&text=${encoded}`;
        await chrome.tabs.update(tabId, { url: sendUrl });
    }

    /**
     * Localiza o botão principal de envio.
     * @returns {HTMLElement | null} - Retorna o botão de envio ou null se não encontrado.
     */
    findSendButton() {
        const selector = 'button:has(span[data-icon="wds-ic-send-filled"])';
        return document.querySelector(selector);
    }

    /**
     * Injeta o script para clicar no botão de envio.
     * @param {number} tabId - ID da aba do WhatsApp Web.
     * @returns {Promise<void>}
     */
    async clickSendButton(tabId) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['inject.js'] // Carrega o arquivo externo
            });
        } catch (err) {
            console.error('Erro ao injetar script:', err);
        }
    }

    /**
     * Processa a lista de contatos e envia mensagens.
     * @param {chrome.tabs.Tab} tab - Aba do WhatsApp Web.
     * @param {Array<{ name: string, number: string }>} contacts - Lista de contatos.
     * @param {number} minDelay - Tempo mínimo de espera entre mensagens (em segundos).
     * @param {number} maxDelay - Tempo máximo de espera entre mensagens (em segundos).
     * @param {string} messageTemplate - Template da mensagem com placeholders.
     * @returns {Promise<void>}
     */
    async processMessages(tab, contacts, minDelay, maxDelay, messageTemplate) {
        for (let i = 0; i < contacts.length; i++) {
            if (this.stopRequested) break;

            const contact = contacts[i];
            await this.navigateToContact(tab.id, contact, messageTemplate);

            // Aguarda o carregamento da página e clica no botão de envio
            await this.wait(6000 + Math.floor(Math.random() * 10000));
            await this.clickSendButton(tab.id);

            // Delay aleatório antes do próximo envio
            const delaySec = minDelay + Math.floor(Math.random() * (maxDelay - minDelay + 1));
            chrome.runtime.sendMessage({ type: 'status', text: `Enviado ${i + 1}/${contacts.length} - aguardando ${delaySec}s` });
            await this.wait(delaySec * 1000);
        }
    }

    /**
     * Gerencia o loop de envio.
     * @param {Array<{ name: string, number: string }>} contacts - Lista de contatos.
     * @param {number} minDelay - Tempo mínimo de espera entre mensagens (em segundos).
     * @param {number} maxDelay - Tempo máximo de espera entre mensagens (em segundos).
     * @param {string} messageTemplate - Template da mensagem com placeholders.
     * @returns {Promise<void>}
     */
    async runSendLoop(contacts, minDelay, maxDelay, messageTemplate) {
        try {
            this.running = true;
            this.stopRequested = false;

            const tab = await this.getWhatsAppTab();
            await this.processMessages(tab, contacts, minDelay, maxDelay, messageTemplate);

            chrome.runtime.sendMessage({ type: 'status', text: 'Concluído/parado' });
        } catch (err) {
            console.error(err);
            chrome.runtime.sendMessage({ type: 'status', text: 'Erro: ' + err.message });
        } finally {
            this.running = false;
            this.stopRequested = false;
        }
    }

    /**
     * Interrompe o envio.
     */
    stop() {
        this.stopRequested = true;
    }
}

const sender = new WhatsAppBulkSender();

/**
 * Listener para mensagens recebidas.
 * @param {{ action: string, contacts: Array<{ name: string, number: string }>, minDelay: number, maxDelay: number, messageTemplate: string }} msg - Mensagem recebida.
 * @param {chrome.runtime.MessageSender} messageSender - Informações sobre quem enviou a mensagem.
 * @param {function} sendResponse - Função para enviar uma resposta.
 */
chrome.runtime.onMessage.addListener((msg, messageSender, sendResponse) => {
    if (msg.action === 'start') {
        if (sender.running) {
            chrome.runtime.sendMessage({ type: 'status', text: 'Já está rodando' });
            return;
        }
        sender.runSendLoop(msg.contacts, msg.minDelay, msg.maxDelay, msg.messageTemplate);
    }

    if (msg.action === 'stop') {
        sender.stop();
    }
});