import { makeDraggable } from './drag.js';
import { pickRandom } from './utils.js';
const playground = document.getElementById('playground');
const imageRoot = "assets/images/";
const audioRoot = "assets/audio/";
fetch('figures.json')
    .then(res => res.json())
    .then((data) => {
    const picked = pickRandom(data.figures, 3); // 랜덤 3개!
    picked.forEach((figure, i) => {
        const img = document.createElement('img');
        img.src = `${imageRoot}${figure.id}-base.png`;
        img.dataset.id = figure.id;
        img.dataset.state = 'base';
        img.classList.add('figure');
        img.style.left = `${180 + i * 180}px`;
        img.style.top = `200px`;
        makeDraggable(img, figure, data.figures, imageRoot, audioRoot);
        playground.appendChild(img);
    });
});
