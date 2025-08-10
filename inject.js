// Localiza o botão principal de envio
function findSendButton() {
    const selector = 'button:has(span[data-icon="wds-ic-send-filled"])';
    return document.querySelector(selector);
}

// Localiza o botão de envio no footer como fallback
function findSendButtonFallback() {
    const foot = document.querySelector('footer');
    if (foot) {
        const possible = foot.querySelectorAll('button');
        for (const b of possible) {
            const span = b.querySelector('span[data-icon="wds-ic-send-filled"]');
            if (span) {
                return b;
            }
        }
    }
    return null;
}

// Tenta localizar e clicar no botão de envio
function tryClickSendButton() {
    let btn = findSendButton();
    if (!btn) {
        btn = findSendButtonFallback();
    }
    if (btn) {
        btn.click();
        return true;
    }
    return false;
}

// Função que tenta clicar no botão repetidamente
async function attemptToClickButton() {
    const start = Date.now();
    return new Promise((resolve) => {
        const tryClick = () => {
            const success = tryClickSendButton();
            if (success) return resolve(true);
            if (Date.now() - start > 6000) return resolve(false);
            setTimeout(tryClick, 500);
        };
        tryClick();
    });
}

// Executa a tentativa de clicar no botão
attemptToClickButton().then((success) => {
    if (success) {
        console.log('Botão clicado com sucesso!');
    } else {
        console.log('Falha ao clicar no botão dentro do tempo limite.');
    }
});