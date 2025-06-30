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

function makeDraggable(img, figure, figures) {
  let offsetX, offsetY;

  img.addEventListener('mousedown', (e) => {
    offsetX = e.offsetX;
    offsetY = e.offsetY;

    function onMouseMove(ev) {
      img.style.left = `${ev.pageX - offsetX}px`;
      img.style.top = `${ev.pageY - offsetY}px`;
    }

    function onMouseUp(ev) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // 충돌 체크
      checkCollision(img, figure, figures);
    }

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // ✅ 브라우저 기본 drag 방지
  img.addEventListener('dragstart', (e) => e.preventDefault());
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
