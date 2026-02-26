// ==UserScript==
// @name         NekoPic Renderer
// @namespace    nekopicrender
// @version      1.0
// @match        *://www.jeuxvideo.com/*
// @grant        none
// @author       DigitalNyan
// ==/UserScript==

(function () {
    'use strict';

    function processParagraph(p) {
        const nodes = Array.from(p.childNodes);

        for (let i = 0; i < nodes.length - 2; i++) {
            const start = nodes[i];
            const link  = nodes[i + 1];
            const end   = nodes[i + 2];

            if (
                start.nodeType === Node.TEXT_NODE &&
                start.textContent.includes('<neko-safe>') &&
                link.nodeType === Node.ELEMENT_NODE &&
                link.tagName === 'A' &&
                end.nodeType === Node.TEXT_NODE &&
                end.textContent.includes('</neko-safe>')
            ) {
                const url = link.href;

                const a = document.createElement('a');
                a.href = url;
                a.target = '_blank';
                a.className = 'xXx';

                const img = document.createElement('img');
                img.src = url;
                img.className = 'img-shack';
                img.width = 68;
                img.height = 51;
                img.alt = url;

                a.appendChild(img);

                p.insertBefore(a, start);

                start.remove();
                link.remove();
                end.remove();
            }
        }
    }

    function scan() {
        document
            .querySelectorAll('.txt-msg p')
            .forEach(processParagraph);
    }

    scan();

    new MutationObserver(scan).observe(document.body, {
        childList: true,
        subtree: true
    });
})();