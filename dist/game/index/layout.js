import { renderCatalog } from "./renderIndex";
export function setupCatalogOverlay() {
    const openBtn = document.getElementById('open-catalog-btn');
    const closeBtn = document.getElementById('close-catalog-btn');
    const overlay = document.getElementById('catalog-overlay');
    if (!openBtn || !closeBtn || !overlay)
        return;
    // 열기
    openBtn.addEventListener('click', () => {
        overlay.classList.add('active');
        renderCatalog(); // ← 이 시점에 렌더링 호출!
    });
    // 닫기
    closeBtn.addEventListener('click', () => {
        overlay.classList.remove('active');
    });
    // ESC로 닫기
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            overlay.classList.remove('active');
        }
    });
}
