const draggables = document.querySelectorAll('.draggable');

draggables.forEach(img => {
  img.style.left = Math.random() * 500 + 'px';
  img.style.top = Math.random() * 300 + 'px';

  img.onmousedown = function (e) {
    let shiftX = e.clientX - img.getBoundingClientRect().left;
    let shiftY = e.clientY - img.getBoundingClientRect().top;

    img.style.zIndex = 1000;

    function moveAt(pageX, pageY) {
      img.style.left = pageX - shiftX + 'px';
      img.style.top = pageY - shiftY + 'px';
      checkCollision(img);
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    img.onmouseup = function () {
      document.removeEventListener('mousemove', onMouseMove);
      img.onmouseup = null;
    };
  };

  img.ondragstart = () => false;
});

// 충돌 체크
function checkCollision(active) {
  draggables.forEach(target => {
    if (target !== active) {
      const a = active.getBoundingClientRect();
      const b = target.getBoundingClientRect();

      const isOverlap = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);

      if (isOverlap) {
        active.classList.add('glow', 'bounce');
        setTimeout(() => {
          active.classList.remove('bounce');
        }, 400);
      } else {
        active.classList.remove('glow');
      }
    }
  });
}
