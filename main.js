/**
 * Chinese Learning Hub - Main Logic (Fresh Sky Blue Edition)
 */

document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentCategory = 'all';
  let currentLevel = 'all';
  let searchQuery = '';
  let activeTag = null;
  let viewMode = 'grid'; // 'grid' | 'list'

  // DOM Elements
  const appsContainer = document.getElementById('apps-container');
  const categoryFilters = document.getElementById('category-filters');
  const levelSelect = document.getElementById('level-select');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const activeFiltersBar = document.getElementById('active-filters-bar');
  const appCountEl = document.getElementById('app-count');
  const totalCountBadge = document.getElementById('total-count-badge');
  const gridViewBtn = document.getElementById('grid-view-btn');
  const listViewBtn = document.getElementById('list-view-btn');

  // Preview Modal Elements
  const previewModal = document.getElementById('preview-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalIframe = document.getElementById('modal-iframe');
  const modalOpenExternal = document.getElementById('modal-open-external');
  const modalCopyLink = document.getElementById('modal-copy-link');
  const modalReload = document.getElementById('modal-reload');

  // Toast
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  // Initialize
  initCategories();
  renderApps();
  setupEventListeners();

  /**
   * カテゴリボタンの初期化
   */
  function initCategories() {
    categoryFilters.innerHTML = CATEGORIES.map(cat => {
      const count = cat.id === 'all' 
        ? CHINESE_APPS_DATA.length 
        : CHINESE_APPS_DATA.filter(a => a.category === cat.id).length;

      return `
        <button 
          data-category="${cat.id}"
          class="category-btn px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
            cat.id === currentCategory 
              ? 'bg-sky-500 text-white shadow-md shadow-sky-200' 
              : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
          }"
        >
          <i class="fa-solid ${cat.icon}"></i>
          <span>${cat.name}</span>
          <span class="text-xs px-2 py-0.5 rounded-full ${
            cat.id === currentCategory ? 'bg-sky-600/60 text-white' : 'bg-slate-100 text-slate-500'
          }">${count}</span>
        </button>
      `;
    }).join('');

    if (totalCountBadge) {
      totalCountBadge.textContent = `${CHINESE_APPS_DATA.length} アプリ`;
    }
  }

  /**
   * アプリ一覧のフィルタリングと描画
   */
  function renderApps() {
    const filteredApps = CHINESE_APPS_DATA.filter(app => {
      // カテゴリ判定
      const matchesCategory = (currentCategory === 'all' || app.category === currentCategory);
      
      // レベル判定
      const matchesLevel = (currentLevel === 'all' || app.level === currentLevel || app.level === 'all');
      
      // タグ判定
      const matchesTag = !activeTag || app.tags.includes(activeTag);

      // 検索判定
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || (
        app.title.toLowerCase().includes(q) ||
        (app.subtitle && app.subtitle.toLowerCase().includes(q)) ||
        app.description.toLowerCase().includes(q) ||
        (app.teacherNote && app.teacherNote.toLowerCase().includes(q)) ||
        app.tags.some(t => t.toLowerCase().includes(q)) ||
        app.categoryName.toLowerCase().includes(q) ||
        app.levelName.toLowerCase().includes(q)
      );

      return matchesCategory && matchesLevel && matchesTag && matchesSearch;
    });

    // カウント更新
    appCountEl.textContent = `${filteredApps.length} 件`;

    // アクティブフィルターバーの描画
    renderActiveFilters();

    // 空状態のハンドリング
    if (filteredApps.length === 0) {
      appsContainer.innerHTML = `
        <div class="col-span-full py-16 text-center">
          <div class="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
            <i class="fa-solid fa-magnifying-glass"></i>
          </div>
          <h3 class="text-lg font-bold text-slate-700 mb-1">該当するアプリが見つかりませんでした</h3>
          <p class="text-slate-500 text-sm mb-4">検索条件や絞り込みを変更してお試しください。</p>
          <button id="reset-filters-btn" class="px-4 py-2 bg-sky-500 text-white rounded-lg text-sm hover:bg-sky-600 transition">
            すべてのフィルターをリセット
          </button>
        </div>
      `;
      document.getElementById('reset-filters-btn')?.addEventListener('click', resetAllFilters);
      return;
    }

    // グリッド / リストの切り替え描画
    if (viewMode === 'grid') {
      appsContainer.className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6";
      appsContainer.innerHTML = filteredApps.map(app => createGridCard(app)).join('');
    } else {
      appsContainer.className = "flex flex-col gap-4";
      appsContainer.innerHTML = filteredApps.map(app => createListCard(app)).join('');
    }

    // カード内イベント（タグクリック、URLコピー、プレビューなど）の登録
    attachCardEventListeners();
  }

  /**
   * グリッドカードHTML生成
   */
  function createGridCard(app) {
    return `
      <div class="app-card bg-white rounded-2xl border border-slate-200/90 overflow-hidden flex flex-col justify-between shadow-sm relative">
        <div class="p-6">
          <!-- 上部ヘッダー -->
          <div class="flex items-start justify-between gap-3 mb-4">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-xl ${app.iconColor} flex items-center justify-center text-xl shadow-inner shrink-0">
                <i class="fa-solid ${app.icon}"></i>
              </div>
              <div>
                <h3 class="font-bold text-slate-800 text-lg leading-snug">${escapeHtml(app.title)}</h3>
                <p class="text-xs font-medium text-slate-500 mt-0.5 tracking-wide">${escapeHtml(app.subtitle || '')}</p>
              </div>
            </div>
            
            <!-- レベルバッジ -->
            <span class="text-xs font-semibold px-2.5 py-1 rounded-full border ${app.badgeColor} shrink-0">
              ${escapeHtml(app.levelName)}
            </span>
          </div>

          <!-- 説明文 -->
          <p class="text-slate-600 text-sm leading-relaxed mb-4">
            ${escapeHtml(app.description)}
          </p>

          <!-- 先生のおすすめポイント (Teacher Note) -->
          ${app.teacherNote ? `
            <div class="bg-sky-50/70 border border-sky-200/70 rounded-xl p-3 mb-4 text-xs text-sky-950 flex items-start gap-2">
              <span class="text-sky-600 font-bold shrink-0 mt-0.5"><i class="fa-solid fa-graduation-cap"></i></span>
              <div class="leading-relaxed">
                <strong class="font-semibold text-sky-900">ワンポイント：</strong> ${escapeHtml(app.teacherNote)}
              </div>
            </div>
          ` : ''}

          <!-- タグ一覧 -->
          <div class="flex flex-wrap gap-1.5 mb-2">
            ${app.tags.map(tag => `
              <button 
                class="tag-btn text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition flex items-center gap-1 ${
                  activeTag === tag ? 'bg-sky-50 text-sky-700 font-semibold ring-1 ring-sky-300' : ''
                }"
                data-tag="${escapeHtml(tag)}"
              >
                <span>#${escapeHtml(tag)}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- 下部アクションバー -->
        <div class="bg-slate-50/80 px-6 py-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
          <div class="flex items-center gap-1.5 text-xs text-slate-500">
            <i class="fa-regular fa-clock"></i>
            <span>目安: ${escapeHtml(app.estimatedTime || '5分')}</span>
          </div>

          <div class="flex items-center gap-2">
            <!-- 共有URLコピーボタン -->
            <button 
              class="copy-url-btn p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition text-xs font-medium flex items-center gap-1.5"
              data-url="${escapeHtml(app.url)}"
              data-title="${escapeHtml(app.title)}"
              title="共有リンクをコピー"
            >
              <i class="fa-regular fa-clone"></i>
              <span class="hidden sm:inline">共有</span>
            </button>

            <!-- プレビューボタン -->
            <button 
              class="preview-app-btn p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70 rounded-lg transition text-xs font-medium flex items-center gap-1.5"
              data-url="${escapeHtml(app.url)}"
              data-title="${escapeHtml(app.title)}"
              title="この画面でプレビュー"
            >
              <i class="fa-solid fa-expand"></i>
              <span class="hidden sm:inline">プレビュー</span>
            </button>

            <!-- アプリを直接開く -->
            <a 
              href="${escapeHtml(app.url)}" 
              target="_blank" 
              rel="noopener noreferrer"
              class="px-3.5 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold shadow-sm transition flex items-center gap-1.5"
            >
              <span>開く</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * リストカードHTML生成 (Compact View)
   */
  function createListCard(app) {
    return `
      <div class="app-card bg-white rounded-xl border border-slate-200 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div class="flex items-center gap-4 flex-1">
          <div class="w-12 h-12 rounded-xl ${app.iconColor} flex items-center justify-center text-xl shrink-0">
            <i class="fa-solid ${app.icon}"></i>
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 flex-wrap">
              <h3 class="font-bold text-slate-800 text-base">${escapeHtml(app.title)}</h3>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full border ${app.badgeColor}">
                ${escapeHtml(app.levelName)}
              </span>
              <span class="text-xs text-slate-500 font-medium">${escapeHtml(app.categoryName)}</span>
            </div>
            <p class="text-slate-600 text-xs mt-1 line-clamp-1">${escapeHtml(app.description)}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 justify-end shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
          <button 
            class="copy-url-btn px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            data-url="${escapeHtml(app.url)}"
            data-title="${escapeHtml(app.title)}"
          >
            <i class="fa-regular fa-clone"></i>
            <span>リンク共有</span>
          </button>

          <button 
            class="preview-app-btn px-3 py-1.5 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-medium transition flex items-center gap-1.5"
            data-url="${escapeHtml(app.url)}"
            data-title="${escapeHtml(app.title)}"
          >
            <i class="fa-solid fa-expand"></i>
            <span>プレビュー</span>
          </button>

          <a 
            href="${escapeHtml(app.url)}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="px-4 py-1.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <span>起動</span>
            <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
          </a>
        </div>
      </div>
    `;
  }

  /**
   * カード内のボタンイベント登録
   */
  function attachCardEventListeners() {
    // タグクリックで絞り込み
    document.querySelectorAll('.tag-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const tag = e.currentTarget.getAttribute('data-tag');
        activeTag = (activeTag === tag) ? null : tag;
        renderApps();
      });
    });

    // リンクコピー
    document.querySelectorAll('.copy-url-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.getAttribute('data-url');
        const title = e.currentTarget.getAttribute('data-title');
        copyToClipboard(url, `「${title}」のURLをコピーしました！`);
      });
    });

    // プレビューモーダル
    document.querySelectorAll('.preview-app-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const url = e.currentTarget.getAttribute('data-url');
        const title = e.currentTarget.getAttribute('data-title');
        openPreviewModal(url, title);
      });
    });
  }

  /**
   * アクティブフィルター表示バー
   */
  function renderActiveFilters() {
    const hasActiveFilters = currentCategory !== 'all' || currentLevel !== 'all' || activeTag !== null || searchQuery.trim() !== '';
    
    if (!hasActiveFilters) {
      activeFiltersBar.classList.add('hidden');
      activeFiltersBar.innerHTML = '';
      return;
    }

    activeFiltersBar.classList.remove('hidden');
    let pills = [];

    if (currentCategory !== 'all') {
      const catObj = CATEGORIES.find(c => c.id === currentCategory);
      pills.push(`
        <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-sky-100 text-sky-800 text-xs rounded-full font-medium">
          カテゴリ: ${catObj ? catObj.name : currentCategory}
          <button data-clear="category" class="hover:text-sky-950 font-bold ml-1">&times;</button>
        </span>
      `);
    }

    if (currentLevel !== 'all') {
      const lvlObj = LEVELS.find(l => l.id === currentLevel);
      pills.push(`
        <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
          レベル: ${lvlObj ? lvlObj.name : currentLevel}
          <button data-clear="level" class="hover:text-blue-950 font-bold ml-1">&times;</button>
        </span>
      `);
    }

    if (activeTag) {
      pills.push(`
        <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full font-medium">
          タグ: #${escapeHtml(activeTag)}
          <button data-clear="tag" class="hover:text-cyan-950 font-bold ml-1">&times;</button>
        </span>
      `);
    }

    if (searchQuery.trim()) {
      pills.push(`
        <span class="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-200 text-slate-800 text-xs rounded-full font-medium">
          検索: "${escapeHtml(searchQuery)}"
          <button data-clear="search" class="hover:text-slate-950 font-bold ml-1">&times;</button>
        </span>
      `);
    }

    activeFiltersBar.innerHTML = `
      <div class="flex items-center gap-2 flex-wrap text-xs text-slate-500">
        <span>絞り込み中:</span>
        ${pills.join('')}
        <button id="clear-all-pill-btn" class="text-xs text-sky-600 hover:text-sky-700 underline font-medium ml-2">すべて解除</button>
      </div>
    `;

    // 個別解除ボタン
    activeFiltersBar.querySelectorAll('button[data-clear]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const type = e.currentTarget.getAttribute('data-clear');
        if (type === 'category') currentCategory = 'all';
        if (type === 'level') {
          currentLevel = 'all';
          levelSelect.value = 'all';
        }
        if (type === 'tag') activeTag = null;
        if (type === 'search') {
          searchQuery = '';
          searchInput.value = '';
          clearSearchBtn.classList.add('hidden');
        }
        initCategories();
        renderApps();
      });
    });

    document.getElementById('clear-all-pill-btn')?.addEventListener('click', resetAllFilters);
  }

  /**
   * 全フィルターリセット
   */
  function resetAllFilters() {
    currentCategory = 'all';
    currentLevel = 'all';
    activeTag = null;
    searchQuery = '';
    searchInput.value = '';
    levelSelect.value = 'all';
    clearSearchBtn.classList.add('hidden');
    initCategories();
    renderApps();
  }

  /**
   * イベントリスナー設定
   */
  function setupEventListeners() {
    // カテゴリ切り替え
    categoryFilters.addEventListener('click', (e) => {
      const btn = e.target.closest('.category-btn');
      if (!btn) return;
      currentCategory = btn.getAttribute('data-category');
      initCategories();
      renderApps();
    });

    // レベル選択
    levelSelect.addEventListener('change', (e) => {
      currentLevel = e.target.value;
      renderApps();
    });

    // 検索入力 (インクリメンタルサーチ)
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value;
      if (searchQuery.length > 0) {
        clearSearchBtn.classList.remove('hidden');
      } else {
        clearSearchBtn.classList.add('hidden');
      }
      renderApps();
    });

    // 検索クリア
    clearSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      searchInput.value = '';
      clearSearchBtn.classList.add('hidden');
      renderApps();
    });

    // グリッド / リスト 表示切替
    gridViewBtn.addEventListener('click', () => {
      viewMode = 'grid';
      gridViewBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
      gridViewBtn.classList.remove('text-slate-400');
      listViewBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
      listViewBtn.classList.add('text-slate-400');
      renderApps();
    });

    listViewBtn.addEventListener('click', () => {
      viewMode = 'list';
      listViewBtn.classList.add('bg-white', 'shadow-sm', 'text-slate-800');
      listViewBtn.classList.remove('text-slate-400');
      gridViewBtn.classList.remove('bg-white', 'shadow-sm', 'text-slate-800');
      gridViewBtn.classList.add('text-slate-400');
      renderApps();
    });

    // プレビューモーダル操作
    modalCloseBtn.addEventListener('click', closePreviewModal);
    previewModal.addEventListener('click', (e) => {
      if (e.target === previewModal) closePreviewModal();
    });

    modalReload.addEventListener('click', () => {
      if (modalIframe.src) {
        modalIframe.src = modalIframe.src;
      }
    });

    modalCopyLink.addEventListener('click', () => {
      if (modalIframe.src) {
        copyToClipboard(modalIframe.src, 'アプリのURLをコピーしました！');
      }
    });

    // ESCキーでモーダルを閉じる
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && previewModal.classList.contains('active')) {
        closePreviewModal();
      }
    });

    // 先生向けガイドモーダル開閉
    const guideModal = document.getElementById('guide-modal');
    const openGuideBtn = document.getElementById('open-guide-btn');
    const closeGuideBtn = document.getElementById('close-guide-btn');

    openGuideBtn?.addEventListener('click', () => {
      guideModal.classList.add('active');
    });
    closeGuideBtn?.addEventListener('click', () => {
      guideModal.classList.remove('active');
    });
    guideModal?.addEventListener('click', (e) => {
      if (e.target === guideModal) guideModal.classList.remove('active');
    });
  }

  /**
   * プレビューモーダルを開く
   */
  function openPreviewModal(url, title) {
    modalTitle.textContent = title;
    modalOpenExternal.href = url;
    modalIframe.src = url;
    previewModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  /**
   * プレビューモーダルを閉じる
   */
  function closePreviewModal() {
    previewModal.classList.remove('active');
    modalIframe.src = 'about:blank';
    document.body.style.overflow = '';
  }

  /**
   * クリップボードコピー & トースト通知
   */
  function copyToClipboard(text, message = 'URLをクリップボードにコピーしました！') {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(message);
      }).catch(() => {
        fallbackCopyText(text, message);
      });
    } else {
      fallbackCopyText(text, message);
    }
  }

  function fallbackCopyText(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(message);
    } catch (err) {
      alert('コピーに失敗しました。URLを手動でコピーしてください: ' + text);
    }
    document.body.removeChild(textArea);
  }

  function showToast(msg) {
    toastMessage.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }

  /**
   * XSS防止サニタイズ
   */
  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
