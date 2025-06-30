const playground = document.getElementById('playground');

fetch('figures.json')
  .then(res => res.json())
  .then(data => {
    const figures = data.figures.map(figure => {
      const img = document.createElement('img');
      img.src = figure.states.base;
      img.dataset.id = figure.id;
      img.dataset.state = 'base';
      img.classList.add('figure');
      img.style.left = `${Math.random() * 80 + 10}px`;
      img.style.top = `${Math.random() * 80 + 10}px`;

      makeDraggable(img, figure, data.figures);
      playground.appendChild(img);
      return img;
    });
  });

function makeDraggable(element, figureData, allFiguresData) {
  let offsetX, offsetY, isDragging = false;

  element.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - element.offsetLeft;
    offsetY = e.clientY - element.offsetTop;
    element.style.zIndex = 10;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    element.style.zIndex = '';
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    element.style.left = `${e.clientX - offsetX}px`;
    element.style.top = `${e.clientY - offsetY}px`;

    document.querySelectorAll('.figure').forEach(other => {
      if (other === element) return;
      if (isOverlap(element, other)) {
        const otherId = other.dataset.id;
        const reaction = figureData.reactions.find(r => r.with === otherId);
        if (reaction && element.dataset.state !== reaction.resultState) {
          element.dataset.state = reaction.resultState;
          element.src = figureData.states[reaction.resultState];
          element.classList.add('glow', 'bounce');
          setTimeout(() => {
            element.classList.remove('glow', 'bounce');
          }, 300);
        }
      }
    });
  });
}

function isOverlap(el1, el2) {
  const rect1 = el1.getBoundingClientRect();
  const rect2 = el2.getBoundingClientRect();
  return !(
    rect1.right < rect2.left || 
    rect1.left > rect2.right || 
    rect1.bottom < rect2.top || 
    rect1.top > rect2.bottom
  );
}
