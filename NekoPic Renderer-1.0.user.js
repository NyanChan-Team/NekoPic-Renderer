// ==UserScript==
// @name         NekoPic Renderer
// @namespace    nekopicrender
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

        if (url.includes("noelshack.com/fichiers/")) {
            img.src = url
                .replace("fichiers", "minis")
                .replace(".jpeg", ".png")
                .replace(".jpg", ".png");
        } else {
            img.src = url;
        }

        img.alt = url;

        a.appendChild(img);
        p.appendChild(a);
        p.appendChild(document.createElement('br'));
        container.appendChild(p);

        return container;
    }

    function processParagraph(p) {
        if (p.dataset.nekoProcessed) return;

        let html = p.innerHTML;

        // <neko-img> ou &lt;neko-img&gt; ? Telle est la question :)
        const regex = /(?:<neko-img>|&lt;neko-img&gt;)\s*<a[^>]+href="([^"]+)"[^>]*>.*?<\/a>\s*(?:<\/neko-img>|&lt;\/neko-img&gt;)/gi;

        let match;
        let replaced = false;

        while ((match = regex.exec(html)) !== null) {
            const url = match[1];
            const imageBlock = createImageBlock(url);
            p.parentNode.insertBefore(imageBlock, p);
            replaced = true;
        }

        if (replaced) {
            // RIP le texte encodé
            p.innerHTML = p.innerHTML.replace(regex, '');
            p.dataset.nekoProcessed = "true";
        }
    }

    function scan() {
        // posts
        document.querySelectorAll('.txt-msg p').forEach(processParagraph);
        // signatures topics
        document.querySelectorAll('.signature-msg p, .bloc-signature-msg p').forEach(processParagraph);
        // signature page profil
        document.querySelectorAll('.bloc-signature-desc p, .bloc-signature-desc div').forEach(processParagraph);
    }

    scan();

    new MutationObserver(scan).observe(document.body, {
        childList: true,
        subtree: true
    });

})();
