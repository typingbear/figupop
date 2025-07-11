import { renderCatalog } from "./render/catalogRenderer.js";

export function setupCatalogOverlay(): void {
  const openBtn = document.getElementById('open-catalog-btn') as HTMLElement | null;
  const closeBtn = document.getElementById('close-catalog-btn') as HTMLElement | null;
  const overlay = document.getElementById('catalog-overlay') as HTMLElement | null;

  if (!openBtn || !closeBtn || !overlay) {
    console.warn("Catalog overlay elements not found.");
    return;
  }

  // 도감 열기
  openBtn.addEventListener('click', () => {
    overlay.classList.add('active');
    renderCatalog(); // ✅ 도감 렌더링 호출
  });

  // 도감 닫기
  closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
  });

  // ESC 키로도 닫기
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      overlay.classList.remove('active');
    }
  });
}
