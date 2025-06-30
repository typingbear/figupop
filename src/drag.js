import { isOverlap, playSound } from './utils';
let topZ = 10;
export function makeDraggable(img, figure, figures, imageRoot, audioRoot) {
    let offsetX, offsetY;
    img.addEventListener('mousedown', (e) => {
        offsetX = e.offsetX;
        offsetY = e.offsetY;
        img.style.zIndex = (++topZ).toString();
        function onMouseMove(ev) {
            img.style.left = `${ev.pageX - offsetX}px`;
            img.style.top = `${ev.pageY - offsetY}px`;
            document.querySelectorAll('.figure').forEach(other => {
                other.classList.remove('glow');
            });
            document.querySelectorAll('.figure').forEach(other => {
                if (other === img)
                    return;
                if (isOverlap(img, other)) {
                    const otherImg = other;
                    const otherId = otherImg.dataset.id;
                    const otherFigure = figures.find(f => f.id === otherId);
                    const dragCanReact = figure.reactions.some(r => r.with === otherId && img.dataset.state !== r.resultState);
                    const targetCanReact = otherFigure.reactions.some(r => r.with === img.dataset.id && otherImg.dataset.state !== r.resultState);
                    if (dragCanReact)
                        img.classList.add('glow');
                    if (targetCanReact)
                        otherImg.classList.add('glow');
                }
            });
        }
        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            document.querySelectorAll('.figure').forEach(el => el.classList.remove('glow'));
            checkCollision(img, figure, figures, imageRoot, audioRoot);
        }
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
    img.addEventListener('dragstart', e => e.preventDefault());
}
function setFigureState(el, id, state, imageRoot) {
    el.src = `${imageRoot}${id}-${state}.png`;
    el.dataset.state = state;
}
function checkCollision(draggedEl, draggedFigure, allFigures, imageRoot, audioRoot) {
    const draggedId = draggedEl.dataset.id;
    document.querySelectorAll('.figure').forEach(targetEl => {
        if (targetEl === draggedEl)
            return;
        if (!isOverlap(draggedEl, targetEl))
            return;
        const targetImg = targetEl;
        const targetId = targetImg.dataset.id;
        const targetFigure = allFigures.find(f => f.id === targetId);
        const dragReaction = draggedFigure.reactions.find(r => r.with === targetId);
        if (dragReaction && draggedEl.dataset.state !== dragReaction.resultState) {
            setFigureState(draggedEl, draggedFigure.id, dragReaction.resultState, imageRoot);
            playSound(audioRoot + dragReaction.sound);
        }
        const targetReaction = targetFigure.reactions.find(r => r.with === draggedId);
        if (targetReaction && targetImg.dataset.state !== targetReaction.resultState) {
            setFigureState(targetImg, targetFigure.id, targetReaction.resultState, imageRoot);
            playSound(audioRoot + targetReaction.sound);
        }
    });
}
