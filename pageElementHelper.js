class PageElementHelper {
    /**
     * Localiza um elemento na página usando um seletor.
     * @param {string} selector - O seletor CSS do elemento.
     * @returns {HTMLElement | null} - Retorna o elemento encontrado ou null se não encontrado.
     */
    static findElement(selector) {
        return document.querySelector(selector);
    }

    /**
     * Localiza todos os elementos na página que correspondem ao seletor.
     * @param {string} selector - O seletor CSS dos elementos.
     * @returns {NodeListOf<HTMLElement>} - Retorna uma lista de elementos encontrados.
     */
    static findAllElements(selector) {
        return document.querySelectorAll(selector);
    }

    /**
     * Clica em um elemento na página.
     * @param {string} selector - O seletor CSS do elemento.
     * @returns {boolean} - Retorna true se o clique foi realizado, false caso contrário.
     */
    static clickElement(selector) {
        const element = this.findElement(selector);
        if (element) {
            element.click();
            return true;
        }
        console.warn(`Elemento não encontrado para clique: ${selector}`);
        return false;
    }

    /**
     * Preenche um campo de entrada com um valor.
     * @param {string} selector - O seletor CSS do campo de entrada.
     * @param {string} value - O valor a ser preenchido.
     * @returns {boolean} - Retorna true se o valor foi preenchido, false caso contrário.
     */
    static fillInput(selector, value) {
        const input = this.findElement(selector);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true })); // Dispara o evento de input
            return true;
        }
        console.warn(`Campo de entrada não encontrado: ${selector}`);
        return false;
    }

    /**
     * Aguarda até que um elemento esteja presente na página.
     * @param {string} selector - O seletor CSS do elemento.
     * @param {number} timeout - Tempo máximo de espera em milissegundos.
     * @returns {Promise<HTMLElement | null>} - Retorna o elemento encontrado ou null se o tempo esgotar.
     */
    static async waitForElement(selector, timeout = 5000) {
        const interval = 100; // Intervalo de verificação em milissegundos
        const endTime = Date.now() + timeout;

        return new Promise((resolve) => {
            const check = () => {
                const element = this.findElement(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() > endTime) {
                    console.warn(`Elemento não encontrado dentro do tempo limite: ${selector}`);
                    resolve(null);
                } else {
                    setTimeout(check, interval);
                }
            };
            check();
        });
    }

    /**
     * Verifica se um elemento está visível na página.
     * @param {string} selector - O seletor CSS do elemento.
     * @returns {boolean} - Retorna true se o elemento estiver visível, false caso contrário.
     */
    static isElementVisible(selector) {
        const element = this.findElement(selector);
        return element ? element.offsetParent !== null : false;
    }

    /**
     * Aguarda até que um elemento esteja visível na página.
     * @param {string} selector - O seletor CSS do elemento.
     * @param {number} timeout - Tempo máximo de espera em milissegundos.
     * @returns {Promise<boolean>} - Retorna true se o elemento ficou visível, false caso contrário.
     */
    static async waitForElementVisible(selector, timeout = 5000) {
        const element = await this.waitForElement(selector, timeout);
        if (element && this.isElementVisible(selector)) {
            return true;
        }
        console.warn(`Elemento não ficou visível dentro do tempo limite: ${selector}`);
        return false;
    }
}