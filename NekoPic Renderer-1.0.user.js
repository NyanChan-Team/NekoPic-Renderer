// ==UserScript==
// @name         NekoPic Renderer Beta
// @namespace    nekopicrenderbeta
// @version      1.1
// @match        *://www.jeuxvideo.com/*
// @author       DigitalNyan
// ==/UserScript==

(function () {
    'use strict';

    function createImageBlock(url) {
        const container = document.createElement('div');
        container.setAttribute('bis_skin_checked', '1');

        const p = document.createElement('p');

        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.className = 'xXx ';

        const img = document.createElement('img');
        img.className = 'img-shack';
        img.width = 68;
        img.height = 51;
        img.src = url;
        img.alt = url;

        a.appendChild(img);
        p.appendChild(a);
        p.appendChild(document.createElement('br'));

        container.appendChild(p);

        return container;
    }

    function processParagraph(p) {
        if (p.dataset.nekoProcessed) return;

        const nodes = Array.from(p.childNodes);

        for (let i = 0; i < nodes.length - 2; i++) {
            const start = nodes[i];
            const link  = nodes[i + 1];
            const end   = nodes[i + 2];

            if (
                start.nodeType === Node.TEXT_NODE &&
                start.textContent.includes('<neko-img>') &&
                link.nodeType === Node.ELEMENT_NODE &&
                link.tagName === 'A' &&
                end.nodeType === Node.TEXT_NODE &&
                end.textContent.includes('</neko-img>')
            ) {
                const url = link.href;

                const imageBlock = createImageBlock(url);

                p.parentNode.insertBefore(imageBlock, p);

                start.remove();
                link.remove();
                end.remove();

                p.dataset.nekoProcessed = "true";
                break;
            }
        }
    }

    function scan() {
        // les posts
        document
            .querySelectorAll('.txt-msg p')
            .forEach(processParagraph);

        // les signature
        document
            .querySelectorAll('.signature-msg p, .bloc-signature-msg p')
            .forEach(processParagraph);
    }

    scan();

    new MutationObserver(scan).observe(document.body, {
        childList: true,
        subtree: true
    });

})();
