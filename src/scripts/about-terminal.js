/**
 * Behaviour for AboutTerminal.astro: the "Quién soy" section shaped like a VS Code window
 * (explorer, tabbed read-only editor, quick open, integrated terminal, resizable panel).
 * Every lookup is scoped to the component root, and the data it needs (images, file icons)
 * comes from the JSON block the component renders.
 */
const initAboutTerminal = () => {
	const root = document.querySelector('[data-about-term]');
	if (!root || root.dataset.ready === 'true') return;
	root.dataset.ready = 'true';

	const DATA = JSON.parse(root.querySelector('[data-about-data]').textContent);
	const IMGS = DATA.images;
	const ICONS = DATA.icons;
	const reduceMotion = window.matchMedia(
		'(prefers-reduced-motion: reduce)',
	).matches;
	const esc = (s) =>
		String(s)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	const pad = (n) => String(n).padStart(2, '0');
	const posadasNow = () => new Date(Date.now() - 3 * 3600 * 1000);
	const icon = (name, cls = 'mi') =>
		`<span class="${cls}" aria-hidden="true">${ICONS[name] || ''}</span>`;
	root
		.querySelectorAll('[data-icon]')
		.forEach((el) => (el.innerHTML = ICONS[el.dataset.icon] || ''));

	/* ---------- File system ---------- */
	const LINKS = {
		github: 'https://github.com/facurodrij',
		linkedin: 'https://www.linkedin.com/in/facundo-joel-rodriguez/',
		cv: '/curriculum_vitae.pdf',
		email: 'facurodri00@gmail.com',
	};
	const S = (cls, text) => `<span class="${cls}">${esc(text)}</span>`;
	const A = (href, text) =>
		`<a class="s-link" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(text)}</a>`;

	const FILES = {
		'README.md': {
			lang: 'Markdown',
			icon: 'readme',
			text: [
				'# Facundo Joel Rodriguez',
				'',
				'Full Stack Developer en **Sherpa** · Posadas, Misiones',
				'',
				'Construyo backends y aplicaciones web con **Python** y **Node.js**,',
				'y me ocupo de que lleguen a producción.',
				'',
				'## Hoy me mueve',
				'',
				'- Desarrollo web',
				'- APIs REST',
				'- DevOps',
				'- Rendimiento',
				'',
				'## Enlaces',
				'',
				`- [GitHub](${LINKS.github})`,
				`- [LinkedIn](${LINKS.linkedin})`,
				'- [Currículum](https://facurodrij.github.io/curriculum_vitae.pdf)',
			],
		},
		'formacion.json': {
			lang: 'JSON',
			icon: 'json',
			text: [
				'[',
				'  {',
				'    "titulo": "Licenciatura en Sistemas de Información",',
				'    "institucion": "Universidad Nacional de Misiones",',
				'    "periodo": "2019-02 → 2024-06",',
				'    "tesis": "Blockchain aplicada a rendiciones de cuentas municipales"',
				'  },',
				'  {',
				'    "titulo": "Analista en Sistemas de Computación",',
				'    "institucion": "Universidad Nacional de Misiones",',
				'    "periodo": "2019-02 → 2023-03"',
				'  }',
				']',
			],
		},
		'mentalidad.yml': {
			lang: 'YAML',
			icon: 'yaml',
			text: [
				'# Cómo encaro el trabajo',
				'claridad_primero: >',
				'  Priorizo soluciones entendibles, bien organizadas',
				'  y fáciles de mantener en el tiempo.',
				'',
				'entrega_concreta: >',
				'  Avanzo en iteraciones pequeñas, valido rápido',
				'  y evito complejidad innecesaria.',
				'',
				'criterio_operativo: >',
				'  Diseño pensando en producción: errores,',
				'  trazabilidad, rendimiento y seguridad.',
			],
		},
		'ubicacion.ts': {
			lang: 'TypeScript',
			icon: 'typescript',
			text: [
				'export const ubicacion = {',
				"  ciudad: 'Posadas, Misiones, Argentina',",
				'  coords: [-27.3671, -55.8961],',
				"  zonaHoraria: 'UTC-3',",
				"  idiomas: ['Español (nativo)', 'Inglés (B1)'],",
				'} as const;',
			],
		},
		'contacto.json': {
			lang: 'JSON',
			icon: 'json',
			text: [
				'{',
				`  "email": "${LINKS.email}",`,
				`  "github": "${LINKS.github}",`,
				`  "linkedin": "${LINKS.linkedin}"`,
				'}',
			],
		},
		'cv.pdf': { lang: 'PDF', icon: 'pdf', pdf: true },
		'hobbies/viajes.jpg': {
			lang: 'Imagen',
			icon: 'image',
			img: 'viajes',
			caption: 'Viajes',
		},
		'hobbies/playa.jpg': {
			lang: 'Imagen',
			icon: 'image',
			img: 'playa',
			caption: 'Relax en la playa',
		},
		'hobbies/asado.jpg': {
			lang: 'Imagen',
			icon: 'image',
			img: 'asado',
			caption: 'Asado con amigos',
		},
	};
	const ROOT_FILES = [
		'README.md',
		'formacion.json',
		'mentalidad.yml',
		'ubicacion.ts',
		'contacto.json',
		'cv.pdf',
	];
	const HOBBY_FILES = Object.keys(FILES).filter((k) =>
		k.startsWith('hobbies/'),
	);

	/* Syntax highlighting, small and per-language. Links become real anchors. */
	const hlLine = (line, lang) => {
		if (lang === 'Markdown') {
			if (/^#{1,6} /.test(line)) return S('s-head', line);
			let html = esc(line)
				.replace(/^(- )/, '<span class="s-key">$1</span>')
				.replace(
					/\*\*([^*]+)\*\*/g,
					'<span class="s-punc">**</span><span class="s-bold">$1</span><span class="s-punc">**</span>',
				);
			html = html.replace(
				/\[([^\]]+)\]\((https:[^)]+)\)/g,
				(_, t, url) =>
					`<span class="s-punc">[</span>${S('s-str', t)}<span class="s-punc">](</span>${A(url, url)}<span class="s-punc">)</span>`,
			);
			return html;
		}
		if (lang === 'JSON') {
			const html = esc(line).replace(
				/("[^"]*")(\s*:)?/g,
				(_match, str, colon) =>
					colon
						? `<span class="s-prop">${str}</span>${colon}`
						: `<span class="s-str">${str}</span>`,
			);
			return html
				.replace(
					/(<span class="s-str">")(https:[^"<]+)("<\/span>)/g,
					(_match, a, url, b) => `${a}${A(url, url)}${b}`,
				)
				.replace(
					/(<span class="s-str">")([^"<]+@[^"<]+)("<\/span>)/g,
					(_match, a, mail, b) =>
						`${a}<a class="s-link" href="mailto:${mail}">${mail}</a>${b}`,
				);
		}
		if (lang === 'YAML') {
			if (line.trim().startsWith('#')) return S('s-com', line);
			const m = line.match(/^(\w+)(:)(.*)$/);
			if (m)
				return `${S('s-prop', m[1])}${S('s-punc', m[2])}${S('s-key', m[3])}`;
			return S('s-str', line);
		}
		if (lang === 'TypeScript') {
			return esc(line)
				.replace(/('[^']*')/g, '<span class="s-str">$1</span>')
				.replace(/\b(export|const|as)\b/g, '<span class="s-key">$1</span>')
				.replace(/(-?\d+\.\d+)/g, '<span class="s-num">$1</span>')
				.replace(/^(\s+)(\w+)(:)/, '$1<span class="s-prop">$2</span>$3')
				.replace(/(ubicacion)/, '<span class="s-fn">$1</span>');
		}
		return esc(line);
	};

	const renderPreview = (lines) => {
		const out = [];
		let list = null;
		const inline = (t) =>
			esc(t)
				.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
				.replace(
					/\[([^\]]+)\]\((https:[^)]+)\)/g,
					'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
				);
		lines.forEach((l) => {
			if (l.startsWith('- ')) {
				if (!list) {
					list = [];
					out.push(list);
				}
				list.push(`<li>${inline(l.slice(2))}</li>`);
				return;
			}
			list = null;
			if (l.startsWith('## ')) out.push(`<h2>${inline(l.slice(3))}</h2>`);
			else if (l.startsWith('# ')) out.push(`<h1>${inline(l.slice(2))}</h1>`);
			else if (l.trim()) out.push(`<p>${inline(l)}</p>`);
		});
		return `<article class="preview">${out.map((b) => (Array.isArray(b) ? `<ul>${b.join('')}</ul>` : b)).join('')}</article>`;
	};

	/* ---------- Explorer ---------- */
	const tree = root.querySelector('[data-tree]');
	const explorer = root.querySelector('[data-explorer]');
	const filesToggle = root.querySelector('[data-files-toggle]');
	let hobbiesOpen = true;
	let rootOpen = true;

	const focusKey = (container) => {
		const a = document.activeElement;
		if (!a || !container.contains(a)) return null;
		if (a.dataset.open) return `[data-open="${a.dataset.open}"]`;
		if (a.dataset.toggle) return `[data-toggle="${a.dataset.toggle}"]`;
		return '[aria-current="true"]';
	};
	const renderTree = () => {
		const hadFocus = focusKey(tree);
		const fileNode = (path, depth) => {
			const name = path.split('/').pop();
			return `<li><button class="node" type="button" style="--depth:${depth}" data-open="${path}" aria-current="${path === active}"><span class="spacer"></span>${icon(FILES[path].icon)}<span>${name}</span></button></li>`;
		};
		const chev =
			'<svg class="chev" viewBox="0 0 16 16" aria-hidden="true"><path d="M5 6l3 3 3-3"></path></svg>';
		tree.innerHTML = `
			<li><button class="node node--root" type="button" aria-expanded="${rootOpen}" data-toggle="root">${chev}<span>sobre-mi</span></button>
			${
				rootOpen
					? `<ul>
				<li><button class="node" type="button" style="--depth:1" aria-expanded="${hobbiesOpen}" data-toggle="hobbies">${chev}${icon(hobbiesOpen ? 'folder-images-open' : 'folder-images')}<span>hobbies</span></button>
					${hobbiesOpen ? `<ul class="nested">${HOBBY_FILES.map((p) => fileNode(p, 2)).join('')}</ul>` : ''}
				</li>
				${ROOT_FILES.map((p) => fileNode(p, 1)).join('')}
			</ul>`
					: ''
			}</li>`;
		if (hadFocus)
			(
				tree.querySelector(hadFocus) ||
				tree.querySelector(`[data-open="${active}"]`) ||
				tree.querySelector('.node')
			)?.focus({ preventScroll: true });
	};

	tree.addEventListener('click', (event) => {
		const toggle = event.target.closest('[data-toggle]');
		if (toggle) {
			if (toggle.dataset.toggle === 'root') rootOpen = !rootOpen;
			else hobbiesOpen = !hobbiesOpen;
			renderTree();
			tree
				.querySelector(`[data-toggle="${toggle.dataset.toggle}"]`)
				?.focus({ preventScroll: true });
			return;
		}
		const open = event.target.closest('[data-open]');
		if (open) {
			openFile(open.dataset.open);
			if (mqPhone.matches) setDrawer(false, false);
		}
	});

	/* On phones the explorer is an off-canvas drawer; on wider screens it is always visible. */
	const winEl = root.querySelector('[data-win]');
	const scrimEl = root.querySelector('[data-explorer-scrim]');
	const mqPhone = window.matchMedia('(max-width: 760px)');
	const drawerOpen = () => winEl.classList.contains('drawer-open');
	const focusables = () =>
		Array.from(explorer.querySelectorAll('button')).filter(
			(b) => b.offsetParent !== null,
		);

	function setDrawer(open, returnFocus = true) {
		winEl.classList.toggle('drawer-open', open);
		filesToggle.setAttribute('aria-expanded', String(open));
		explorer.inert = mqPhone.matches && !open;
		explorer.style.removeProperty('--drag-x');
		if (open) {
			const current =
				explorer.querySelector('[aria-current="true"]') ||
				explorer.querySelector('.node');
			setTimeout(() => current?.focus({ preventScroll: true }), 60);
		} else if (returnFocus && explorer.contains(document.activeElement)) {
			filesToggle.focus({ preventScroll: true });
		}
	}

	filesToggle.addEventListener('click', () => setDrawer(!drawerOpen()));
	root
		.querySelector('[data-explorer-close]')
		.addEventListener('click', () => setDrawer(false));
	scrimEl.addEventListener('click', () => setDrawer(false));

	explorer.addEventListener('keydown', (event) => {
		if (!mqPhone.matches || !drawerOpen()) return;
		if (event.key === 'Escape') {
			event.preventDefault();
			setDrawer(false);
		} else if (event.key === 'Tab') {
			// Keep keyboard focus inside the open drawer.
			const items = focusables();
			const first = items[0];
			const last = items[items.length - 1];
			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}
	});

	// Swipe left to close.
	let swipe = null;
	explorer.addEventListener('pointerdown', (event) => {
		if (!mqPhone.matches || !drawerOpen() || event.pointerType === 'mouse')
			return;
		swipe = { x: event.clientX, y: event.clientY, dx: 0, active: false };
	});
	explorer.addEventListener('pointermove', (event) => {
		if (!swipe) return;
		const dx = event.clientX - swipe.x;
		const dy = event.clientY - swipe.y;
		if (!swipe.active && Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy)) {
			swipe.active = true;
			explorer.classList.add('is-dragging');
		}
		if (swipe.active) {
			swipe.dx = Math.min(0, dx);
			explorer.style.setProperty('--drag-x', `${swipe.dx}px`);
		}
	});
	const endSwipe = () => {
		if (!swipe) return;
		const shouldClose = swipe.active && swipe.dx < -60;
		explorer.classList.remove('is-dragging');
		swipe = null;
		if (shouldClose) setDrawer(false);
		else explorer.style.removeProperty('--drag-x');
	};
	explorer.addEventListener('pointerup', endSwipe);
	explorer.addEventListener('pointercancel', endSwipe);

	const breakpointHandlers = [];
	let lastPhone = mqPhone.matches;
	const checkBreakpoint = () => {
		if (mqPhone.matches === lastPhone) return;
		lastPhone = mqPhone.matches;
		breakpointHandlers.forEach((fn) => fn());
	};
	mqPhone.addEventListener('change', checkBreakpoint);
	window.addEventListener('resize', checkBreakpoint);

	const syncExplorer = () => setDrawer(false, false);
	breakpointHandlers.push(syncExplorer);
	syncExplorer();

	/* ---------- Editor & tabs ---------- */
	const tabsEl = root.querySelector('[data-tabs]');
	const editor = root.querySelector('[data-editor]');
	const crumbs = root.querySelector('[data-crumbs]');
	const viewmode = root.querySelector('[data-viewmode]');
	const titleEl = root.querySelector('[data-title]');
	const statusLn = root.querySelector('[data-status-ln]');
	const statusLang = root.querySelector('[data-status-lang]');
	const open = ['README.md'];
	let active = 'README.md';
	const previewOn = { 'README.md': true };

	const renderTabs = () => {
		const hadFocus = tabsEl.contains(document.activeElement);
		tabsEl.innerHTML = open
			.map((p) => {
				const name = p.split('/').pop();
				return `<div class="tab${p === active ? ' is-active' : ''}" role="presentation">
					<button class="tab__open" type="button" role="tab" aria-selected="${p === active}" data-tab="${p}">${icon(FILES[p].icon)}${name}<span class="tab__lock" title="Solo lectura"><svg viewBox="0 0 16 16" aria-hidden="true"><rect x="3.5" y="7" width="9" height="7" rx="1.2"></rect><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"></path></svg><span class="sr-only">, solo lectura</span></span></button>
					<button class="tab__close" type="button" tabindex="-1" aria-label="Cerrar ${name}" data-close="${p}"><svg viewBox="0 0 10 10"><path d="M2 2l6 6M8 2L2 8"></path></svg></button>
				</div>`;
			})
			.join('');
		// Keep the active tab visible without scrolling the page itself.
		const current = tabsEl.querySelector('.tab.is-active');
		if (current) {
			const left = current.offsetLeft;
			const right = left + current.offsetWidth;
			if (left < tabsEl.scrollLeft) tabsEl.scrollLeft = left;
			else if (right > tabsEl.scrollLeft + tabsEl.clientWidth)
				tabsEl.scrollLeft = right - tabsEl.clientWidth;
		}
		tabsEl.hidden = !open.length;
		if (hadFocus)
			(tabsEl.querySelector(`[data-tab="${active}"]`) || editor).focus({
				preventScroll: true,
			});
	};

	const renderEditor = () => {
		const hadFocus =
			editor.contains(document.activeElement) &&
			document.activeElement !== editor;
		renderEditorContent();
		if (hadFocus)
			(editor.querySelector('.empty__item') || editor).focus({
				preventScroll: true,
			});
	};
	const renderEditorContent = () => {
		if (!active) {
			const item = (action, label, keys) =>
				`<li><button class="empty__item" type="button" data-action="${action}"><span>${label}</span><span class="keys">${keys}</span></button></li>`;
			const k = (...ks) => ks.map((x) => `<kbd>${x}</kbd>`).join('');
			editor.innerHTML = `<div class="empty"><span class="empty__mark" aria-hidden="true">FJR</span><ul class="empty__list" aria-label="Acciones">
				${item('quick-open', 'Ir a archivo…', k('Ctrl', 'P'))}
				${closed.length ? item('reopen', `Reabrir ${esc(closed[closed.length - 1].split('/').pop())}`, k('Alt', 'Z')) : ''}
				${item('readme', 'Abrir README.md', '<span class="cmd">code README.md</span>')}
				${item('neofetch', 'Ver resumen en la terminal', '<span class="cmd">neofetch</span>')}
				${item('cv', 'Abrir currículum', '<span class="cmd">cv</span>')}
				${item('terminal', 'Ir a la terminal', k('Ctrl', '`'))}
			</ul></div>`;
			crumbs.innerHTML = '';
			viewmode.hidden = true;
			titleEl.textContent = '~/sobre-mi';
			statusLn.textContent = '';
			statusLang.textContent = '';
			return;
		}
		const f = FILES[active];
		const parts = active.split('/');
		crumbs.innerHTML = [
			`<span>sobre-mi</span>`,
			...parts.map((p, i) =>
				i === parts.length - 1
					? `${icon(f.icon)}<span>${p}</span>`
					: `<span>${p}</span>`,
			),
		].join('<span class="sep">›</span>');
		titleEl.textContent = `~/sobre-mi — ${parts[parts.length - 1]}`;
		statusLang.textContent = f.lang;
		viewmode.hidden = f.lang !== 'Markdown';
		viewmode
			.querySelectorAll('[data-mode]')
			.forEach((b) =>
				b.setAttribute(
					'aria-pressed',
					String((b.dataset.mode === 'preview') === !!previewOn[active]),
				),
			);

		if (f.img) {
			editor.innerHTML = `<div class="viewer"><img src="${IMGS[f.img]}" alt="${esc(f.caption)}"><p>${esc(parts[1])} · 420 × 420 · ${esc(f.caption)}</p></div>`;
			statusLn.textContent = '420 × 420';
		} else if (f.pdf) {
			editor.innerHTML = `<div class="viewer"><div class="pdf">${icon('pdf')}<h4>curriculum_vitae.pdf</h4><p>1 página · versión en español</p><a class="btn" href="${LINKS.cv}" target="_blank" rel="noopener noreferrer">Abrir CV</a></div></div>`;
			statusLn.textContent = '1 página';
		} else if (f.lang === 'Markdown' && previewOn[active]) {
			editor.innerHTML = renderPreview(f.text);
			statusLn.textContent = 'Vista previa';
		} else {
			editor.innerHTML = `<div class="code">${f.text.map((l, i) => `<div class="ln" data-line="${i + 1}"><span>${i + 1}</span><span>${hlLine(l, f.lang) || ' '}</span></div>`).join('')}</div>`;
			placeCaret(1, 0);
		}
		editor.classList.remove('is-swapping');
		void editor.offsetWidth;
		editor.classList.add('is-swapping');
		editor.scrollTop = 0;
	};

	const closed = [];
	function openFile(path) {
		if (!FILES[path]) return false;
		const idx = closed.lastIndexOf(path);
		if (idx >= 0) closed.splice(idx, 1);
		const revealed = !rootOpen || (path.startsWith('hobbies/') && !hobbiesOpen);
		rootOpen = true;
		if (path.startsWith('hobbies/')) hobbiesOpen = true;
		if (path === active && open.includes(path)) {
			if (revealed) renderTree();
			return true;
		}
		if (!open.includes(path)) open.push(path);
		active = path;
		renderTabs();
		renderEditor();
		renderTree();
		return true;
	}

	const closeFile = (path) => {
		const i = open.indexOf(path);
		if (i < 0) return;
		open.splice(i, 1);
		closed.push(path);
		if (active === path) active = open[Math.min(i, open.length - 1)] || null;
		renderTabs();
		renderEditor();
		renderTree();
	};

	tabsEl.addEventListener('click', (event) => {
		const close = event.target.closest('[data-close]');
		if (close) return closeFile(close.dataset.close);
		const tab = event.target.closest('[data-tab]');
		if (tab) openFile(tab.dataset.tab);
	});
	tabsEl.addEventListener('keydown', (event) => {
		const tab = event.target.closest('[data-tab]');
		if (!tab) return;
		if (event.key === 'Delete') {
			event.preventDefault();
			closeFile(tab.dataset.tab);
		} else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
			event.preventDefault();
			const i = open.indexOf(tab.dataset.tab);
			const next =
				open[
					(i + (event.key === 'ArrowRight' ? 1 : -1) + open.length) %
						open.length
				];
			openFile(next);
			tabsEl
				.querySelector(`[data-tab="${next}"]`)
				?.focus({ preventScroll: true });
		}
	});
	tabsEl.addEventListener('auxclick', (event) => {
		const tab = event.target.closest('[data-tab]');
		if (tab && event.button === 1) closeFile(tab.dataset.tab);
	});

	viewmode.addEventListener('click', (event) => {
		const b = event.target.closest('[data-mode]');
		if (!b || !active) return;
		previewOn[active] = b.dataset.mode === 'preview';
		renderEditor();
	});

	/* Scroll `box` just enough to show `el`, without touching any other scroll container. */
	const revealIn = (box, el) => {
		if (!box || !el) return;
		const b = box.getBoundingClientRect();
		const r = el.getBoundingClientRect();
		if (r.top < b.top) box.scrollTop -= b.top - r.top;
		else if (r.bottom > b.bottom) box.scrollTop += r.bottom - b.bottom;
		if (r.left < b.left) box.scrollLeft -= b.left - r.left + 24;
		else if (r.right > b.right) box.scrollLeft += r.right - b.right + 24;
	};

	/* ---------- Caret and read-only hint ---------- */
	const caret = { line: 1, col: 0 };
	let charWidth = 0;
	const remeasure = () => {
		charWidth = 0;
		if (editor.querySelector('.code')) placeCaret(caret.line, caret.col);
	};
	document.fonts?.ready.then(remeasure);
	breakpointHandlers.push(remeasure);
	const measureChar = () => {
		const probe = document.createElement('span');
		probe.className = 'code';
		probe.style.cssText =
			'position:absolute;visibility:hidden;padding:0;white-space:pre';
		probe.textContent = 'x'.repeat(40);
		document.body.appendChild(probe);
		charWidth = probe.getBoundingClientRect().width / 40;
		probe.remove();
	};
	const lineEls = () => Array.from(editor.querySelectorAll('.ln'));
	const lineText = (el) => el.lastElementChild.textContent.replace(/\s+$/, '');

	function placeCaret(lineNo, col) {
		const lines = lineEls();
		if (!lines.length) return;
		if (!charWidth) measureChar();
		caret.line = Math.max(1, Math.min(lines.length, lineNo));
		const el = lines[caret.line - 1];
		caret.col = Math.max(0, Math.min(lineText(el).length, col));
		lines.forEach((l) => l.classList.toggle('is-active', l === el));
		editor.querySelector('.caret')?.remove();
		const bar = document.createElement('span');
		bar.className = 'caret';
		bar.style.left = `${caret.col * charWidth}px`;
		el.lastElementChild.appendChild(bar);
		statusLn.textContent = `Ln ${caret.line}, Col ${caret.col + 1}`;
	}

	let tipTimer = 0;
	const hideTip = () => {
		clearTimeout(tipTimer);
		editor.querySelector('.ro-tip')?.remove();
	};
	const showReadOnly = () => {
		const code = editor.querySelector('.code');
		const el = lineEls()[caret.line - 1];
		if (!code || !el) return;
		hideTip();
		const tip = document.createElement('div');
		tip.className = 'ro-tip';
		tip.setAttribute('role', 'status');
		tip.textContent = 'El editor es de solo lectura.';
		code.appendChild(tip);
		const textLeft = el.lastElementChild.offsetLeft;
		const caretX = textLeft + caret.col * charWidth;
		const left = Math.max(
			8,
			Math.min(caretX - 14, code.clientWidth - tip.offsetWidth - 8),
		);
		tip.style.left = `${left}px`;
		tip.style.setProperty('--arrow-x', `${Math.max(10, caretX - left)}px`);
		// Above the line when there is room, otherwise below it.
		const above = el.offsetTop - tip.offsetHeight - 8;
		if (above >= editor.scrollTop) tip.style.top = `${above}px`;
		else {
			tip.classList.add('is-below');
			tip.style.top = `${el.offsetTop + el.offsetHeight + 8}px`;
		}
		tipTimer = setTimeout(hideTip, 3200);
	};

	editor.addEventListener('mousedown', (event) => {
		const line = event.target.closest('.ln');
		if (!line || event.target.closest('a')) return;
		hideTip();
		if (!charWidth) measureChar();
		const text = line.lastElementChild;
		const col = Math.round(
			(event.clientX - text.getBoundingClientRect().left) / charWidth,
		);
		placeCaret(Number(line.dataset.line), col);
	});

	editor.addEventListener('keydown', (event) => {
		if (event.target !== editor || !editor.querySelector('.code')) return;
		const { key } = event;
		const moves = {
			ArrowUp: () => placeCaret(caret.line - 1, caret.col),
			ArrowDown: () => placeCaret(caret.line + 1, caret.col),
			ArrowLeft: () => placeCaret(caret.line, caret.col - 1),
			ArrowRight: () => placeCaret(caret.line, caret.col + 1),
			Home: () => placeCaret(caret.line, 0),
			End: () => placeCaret(caret.line, Infinity),
		};
		if (moves[key] && !event.altKey && !event.metaKey) {
			event.preventDefault();
			hideTip();
			moves[key]();
			revealIn(editor, editor.querySelector('.caret'));
			return;
		}
		if (key === 'Escape') return hideTip();
		const edits =
			key === 'Backspace' ||
			key === 'Delete' ||
			key === 'Enter' ||
			(key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey);
		const shortcutEdits =
			(event.ctrlKey || event.metaKey) &&
			['v', 'x', 'z', 'y'].includes(key.toLowerCase());
		if (edits || shortcutEdits) {
			event.preventDefault();
			showReadOnly();
		}
	});
	['paste', 'cut', 'drop'].forEach((type) =>
		editor.addEventListener(type, (event) => {
			if (!editor.querySelector('.code')) return;
			event.preventDefault();
			showReadOnly();
		}),
	);
	editor.addEventListener('blur', hideTip);

	renderTree();
	renderTabs();
	renderEditor();

	/* ---------- Terminal ---------- */
	const term = root.querySelector('[data-term]');
	const termOut = root.querySelector('[data-term-out]');
	const form = root.querySelector('[data-cmdline]');
	const input = root.querySelector('[data-input]');
	const promptEl = root.querySelector('[data-prompt]');
	const ghostTyped = root.querySelector('[data-ghost-typed]');
	const ghostRest = root.querySelector('[data-ghost-rest]');
	let cwd = '';
	const history = [];
	let histIndex = -1;
	let draft = '';

	const promptHTML = () =>
		`<span class="prompt-user">facundo</span><span class="prompt-at prompt-user">@posadas</span> <span class="prompt-path">~/sobre-mi${cwd ? '/' + cwd : ''}</span> <span class="prompt-arrow">❯</span>`;
	const renderPrompt = () => (promptEl.innerHTML = promptHTML());
	renderPrompt();

	const now0 = posadasNow();
	const days = ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'];
	const monthsShort = [
		'ene',
		'feb',
		'mar',
		'abr',
		'may',
		'jun',
		'jul',
		'ago',
		'sep',
		'oct',
		'nov',
		'dic',
	];
	root.querySelector('[data-login]').textContent =
		`Último inicio de sesión: ${days[now0.getUTCDay()]} ${now0.getUTCDate()} ${monthsShort[now0.getUTCMonth()]} ${pad(now0.getUTCHours())}:${pad(now0.getUTCMinutes())} en ttys001`;

	const out = (html, cls = '') => {
		const el = document.createElement(html.includes('<div') ? 'div' : 'pre');
		if (cls) el.className = cls;
		el.innerHTML = html;
		termOut.appendChild(el);
		term.scrollTop = term.scrollHeight;
		return el;
	};
	const echo = (cmd) => out(`${promptHTML()} ${esc(cmd)}`);

	const resolve = (arg) => {
		if (!arg) return null;
		const fromHome = arg.startsWith('~') || arg.startsWith('/');
		const rest = arg.replace(
			/^~\/sobre-mi|^~|^\/home\/facundo\/sobre-mi|^\//,
			'',
		);
		const parts = fromHome || !cwd ? [] : cwd.split('/');
		for (const seg of rest.split('/')) {
			if (!seg || seg === '.') continue;
			if (seg === '..') parts.pop();
			else parts.push(seg);
		}
		return parts.join('/');
	};
	const isDir = (p) => p === '' || p === 'hobbies';
	const listDir = (dir) =>
		dir === 'hobbies'
			? HOBBY_FILES.map((p) => p.split('/')[1])
			: ['hobbies/', ...ROOT_FILES];

	const lsLong = (dir) => {
		const rows = (
			dir === 'hobbies' ? HOBBY_FILES : ['hobbies', ...ROOT_FILES]
		).map((p) => {
			const name = p.split('/').pop();
			const dirEntry = isDir(p);
			const size = dirEntry
				? '128'
				: FILES[p].text
					? String(FILES[p].text.join('\n').length)
					: FILES[p].pdf
						? '98K'
						: '38K';
			const perm = dirEntry ? 'drwxr-xr-x' : '-rw-r--r--';
			return `<span class="dim">${perm}  facundo  ${size.padStart(5)}  nov  7</span>  ${dirEntry ? `<span class="acc">${name}/</span>` : esc(name)}`;
		});
		return `<span class="dim">total ${rows.length}</span>\n${rows.join('\n')}`;
	};

	const levenshtein = (a, b) => {
		const d = Array.from({ length: a.length + 1 }, (_, i) => [
			i,
			...Array(b.length).fill(0),
		]);
		for (let j = 1; j <= b.length; j++) d[0][j] = j;
		for (let i = 1; i <= a.length; i++)
			for (let j = 1; j <= b.length; j++)
				d[i][j] = Math.min(
					d[i - 1][j] + 1,
					d[i][j - 1] + 1,
					d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1),
				);
		return d[a.length][b.length];
	};

	const neofetch = () => {
		const art = [
			' ███████╗██████╗ ',
			' ██╔════╝██╔══██╗',
			' █████╗  ██████╔╝',
			' ██╔══╝  ██╔══██╗',
			' ██║     ██║  ██║',
			' ╚═╝     ╚═╝  ╚═╝',
		].join('\n');
		const row = (k, v) => `<span><span class="ok">${k}</span>: ${v}</span>`;
		const t = posadasNow();
		return `<div class="neofetch"><pre>${art}</pre><div class="info">
			<span><span class="ok">facundo</span>@<span class="ok">posadas</span></span>
			<span class="dim">───────────────</span>
			${row('Rol', 'Full Stack Developer @ Sherpa')}
			${row('Stack', 'Python · Node.js')}
			${row('Base', `Posadas, Misiones · ${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())} (UTC-3)`)}
			${row('Formación', 'Lic. en Sistemas de Información (UNaM)')}
			${row('Idiomas', 'Español (nativo), Inglés (B1)')}
			${row('Uptime', '2+ años construyendo software')}
			<span class="swatches"><i style="--c:#020617"></i><i style="--c:#00d084"></i><i style="--c:#38bdf8"></i><i style="--c:#c084fc"></i><i style="--c:#fbbf24"></i><i style="--c:#fda4af"></i><i style="--c:#94a3b8"></i><i style="--c:#f8fafc"></i></span>
		</div></div>`;
	};

	const COMMANDS = {
		help: { d: 'muestra esta ayuda' },
		neofetch: { d: 'resumen del perfil' },
		whoami: { d: 'quién soy' },
		ls: { d: 'lista archivos (ls -la para detalle)' },
		cd: { d: 'cambia de carpeta (cd hobbies, cd ..)' },
		cat: { d: 'muestra un archivo en la terminal' },
		code: { d: 'abre un archivo en el editor' },
		open: { d: 'igual que code' },
		contacto: { d: 'email, GitHub y LinkedIn' },
		cv: { d: 'abre mi currículum' },
		stack: { d: 'tecnologías principales' },
		date: { d: 'hora en Posadas' },
		pwd: { d: 'carpeta actual' },
		echo: { d: 'repite el texto' },
		history: { d: 'comandos usados' },
		clear: { d: 'limpia la terminal (Ctrl+L)' },
	};
	const NAMES = Object.keys(COMMANDS);

	const run = (raw) => {
		const line = raw.trim();
		echo(raw);
		if (!line) return;
		history.push(line);
		const [cmd, ...args] = line.split(/\s+/);
		const arg = args.join(' ');

		switch (cmd) {
			case 'help':
				return out(
					`<div class="help">${NAMES.map((n) => `<span>${n}</span><span>${COMMANDS[n].d}</span>`).join('')}</div>`,
				);
			case 'neofetch':
				return out(neofetch());
			case 'whoami':
				return out(
					'facundo · Full Stack Developer @ Sherpa · Python y Node.js',
					'muted',
				);
			case 'stack':
				return out(
					'<span class="hl">Python</span> · <span class="hl">Node.js</span> · TypeScript · Django · Next.js · PostgreSQL · Docker · AWS',
					'muted',
				);
			case 'date': {
				const t = posadasNow();
				return out(
					`${days[t.getUTCDay()]} ${t.getUTCDate()} ${monthsShort[t.getUTCMonth()]} ${t.getUTCFullYear()} ${pad(t.getUTCHours())}:${pad(t.getUTCMinutes())}:${pad(t.getUTCSeconds())} -03 · Posadas`,
					'muted',
				);
			}
			case 'pwd':
				return out(`/home/facundo/sobre-mi${cwd ? '/' + cwd : ''}`, 'muted');
			case 'echo':
				return out(esc(arg), 'muted');
			case 'history':
				return out(
					history
						.map((h, i) => `${String(i + 1).padStart(4)}  ${esc(h)}`)
						.join('\n'),
					'muted',
				);
			case 'clear':
				termOut.innerHTML = '';
				return;
			case 'ls': {
				const target = args.filter((a) => !a.startsWith('-'))[0];
				const long = args.some((a) => /^-\w*l/.test(a));
				const dir = target ? resolve(target) : cwd;
				if (dir && !isDir(dir))
					return FILES[dir]
						? out(esc(target), 'muted')
						: out(
								`ls: ${esc(target)}: No existe el archivo o directorio`,
								'err',
							);
				if (long) return out(lsLong(dir));
				return out(
					listDir(dir)
						.map((n) =>
							n.endsWith('/') ? `<span class="acc">${n}</span>` : esc(n),
						)
						.join('   '),
				);
			}
			case 'cd': {
				if (!arg || arg === '~' || arg === '..' || arg === '/') {
					cwd = '';
					return renderPrompt();
				}
				const p = resolve(arg);
				if (isDir(p)) {
					cwd = p;
					return renderPrompt();
				}
				if (FILES[p]) return out(`cd: no es un directorio: ${esc(arg)}`, 'err');
				return out(`cd: no existe el archivo o directorio: ${esc(arg)}`, 'err');
			}
			case 'cat': {
				if (!arg) return out('uso: cat &lt;archivo&gt;', 'muted');
				const p = resolve(arg);
				const f = FILES[p];
				if (isDir(p)) return out(`cat: ${esc(arg)}: es un directorio`, 'err');
				if (!f)
					return out(
						`cat: ${esc(arg)}: No existe el archivo o directorio`,
						'err',
					);
				if (!f.text)
					return out(
						`cat: ${esc(arg)}: archivo binario. Probá <span class="ok">code ${esc(arg)}</span>`,
						'muted',
					);
				return out(f.text.map((l) => hlLine(l, f.lang)).join('\n'));
			}
			case 'code':
			case 'open': {
				if (!arg) return out(`uso: ${cmd} &lt;archivo&gt;`, 'muted');
				const p = resolve(arg);
				if (isDir(p)) {
					hobbiesOpen = true;
					renderTree();
					rootOpen = true;
					renderTree();
					return out(
						`carpeta ${esc(p || 'sobre-mi')}/ desplegada en el explorador`,
						'ok',
					);
				}
				if (openFile(p)) return out(`abriendo ${esc(p)} en el editor ↑`, 'ok');
				return out(
					`${cmd}: ${esc(arg)}: No existe el archivo o directorio`,
					'err',
				);
			}
			case 'contacto':
				return out(
					`<span class="ok">email</span>     <a href="mailto:${LINKS.email}">${LINKS.email}</a>\n<span class="ok">github</span>    <a href="${LINKS.github}" target="_blank" rel="noopener noreferrer">${LINKS.github}</a>\n<span class="ok">linkedin</span>  <a href="${LINKS.linkedin}" target="_blank" rel="noopener noreferrer">${LINKS.linkedin}</a>`,
				);
			case 'cv':
				openFile('cv.pdf');
				return out(
					`abriendo cv.pdf ↑ · <a href="${LINKS.cv}" target="_blank" rel="noopener noreferrer">${LINKS.cv}</a>`,
					'muted',
				);
			case 'sudo':
				return out(
					'facundo no está en el archivo sudoers. Este incidente será reportado.',
					'err',
				);
			case 'rm':
				return out(
					'rm: operación no permitida en el portfolio. Buen intento.',
					'err',
				);
			case 'exit':
				return out(
					'exit: la sesión del portfolio queda abierta. Probá <span class="ok">clear</span>.',
					'muted',
				);
			default: {
				const best = NAMES.map((n) => [n, levenshtein(cmd, n)]).sort(
					(a, b) => a[1] - b[1],
				)[0];
				const tip =
					best && best[1] <= 2
						? `\n¿Quisiste decir <span class="ok">${best[0]}</span>?`
						: '';
				return out(`zsh: command not found: ${esc(cmd)}${tip}`, 'err');
			}
		}
	};

	/* Ghost suggestion (fish style) from history, then commands and file arguments. */
	const candidates = () => {
		const fileArgs = [...ROOT_FILES, ...HOBBY_FILES, 'hobbies'];
		return [
			...[...history].reverse(),
			...NAMES,
			...['cat', 'code'].flatMap((c) => fileArgs.map((f) => `${c} ${f}`)),
			'cd hobbies',
			'ls -la',
		];
	};
	const updateGhost = () => {
		const v = input.value;
		const hit =
			v && input.selectionStart === v.length
				? candidates().find((c) => c.startsWith(v) && c !== v)
				: null;
		ghostTyped.textContent = v;
		ghostRest.textContent = hit ? hit.slice(v.length) : '';
	};

	const complete = () => {
		const v = input.value;
		const parts = v.split(' ');
		let pool;
		if (parts.length === 1) pool = NAMES;
		else {
			const base =
				cwd === 'hobbies'
					? HOBBY_FILES.map((p) => p.split('/')[1])
					: ['hobbies/', ...ROOT_FILES, ...HOBBY_FILES];
			pool = base;
		}
		const last = parts[parts.length - 1];
		const matches = pool.filter((p) => p.startsWith(last));
		if (matches.length === 1) {
			parts[parts.length - 1] = matches[0];
			input.value = parts.join(' ') + (matches[0].endsWith('/') ? '' : ' ');
		} else if (matches.length > 1) {
			let prefix = matches[0];
			matches.forEach((m) => {
				while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
			});
			if (prefix.length > last.length) {
				parts[parts.length - 1] = prefix;
				input.value = parts.join(' ');
			} else {
				echo(v);
				out(
					matches
						.map((m) =>
							m.endsWith('/') ? `<span class="acc">${m}</span>` : esc(m),
						)
						.join('   '),
				);
			}
		}
		updateGhost();
	};

	input.addEventListener('input', () => {
		histIndex = -1;
		updateGhost();
	});
	input.addEventListener('keyup', updateGhost);
	input.addEventListener('keydown', (event) => {
		if (event.key === 'Tab' && !event.shiftKey && input.value.trim()) {
			event.preventDefault();
			complete();
		} else if (
			event.key === 'ArrowRight' &&
			ghostRest.textContent &&
			input.selectionStart === input.value.length
		) {
			event.preventDefault();
			input.value += ghostRest.textContent;
			updateGhost();
		} else if (event.key === 'ArrowUp') {
			if (!history.length) return;
			event.preventDefault();
			if (histIndex === -1) {
				draft = input.value;
				histIndex = history.length;
			}
			histIndex = Math.max(0, histIndex - 1);
			input.value = history[histIndex];
			updateGhost();
		} else if (event.key === 'ArrowDown') {
			if (histIndex === -1) return;
			event.preventDefault();
			histIndex += 1;
			if (histIndex >= history.length) {
				histIndex = -1;
				input.value = draft;
			} else input.value = history[histIndex];
			updateGhost();
		} else if (event.key === 'l' && event.ctrlKey) {
			event.preventDefault();
			termOut.innerHTML = '';
		} else if (
			event.key === 'c' &&
			event.ctrlKey &&
			input.selectionStart === input.selectionEnd &&
			!window.getSelection()?.toString()
		) {
			event.preventDefault();
			echo(input.value + '^C');
			input.value = '';
			updateGhost();
		}
	});

	form.addEventListener('submit', (event) => {
		event.preventDefault();
		if (typing) return;
		const v = input.value;
		input.value = '';
		histIndex = -1;
		updateGhost();
		run(v);
	});

	term.addEventListener('mouseup', () => {
		if (!window.getSelection()?.toString())
			input.focus({ preventScroll: true });
	});

	let typing = false;
	let queued = null;
	const typeCommand = async (text) => {
		if (typing) {
			queued = text;
			return;
		}
		typing = true;
		input.readOnly = true;
		const termTab = root.querySelector('[data-ptab="terminal"]');
		if (termTab.getAttribute('aria-selected') !== 'true') termTab.click();
		input.value = '';
		if (!reduceMotion) {
			for (let i = 1; i <= text.length; i++) {
				input.value = text.slice(0, i);
				updateGhost();
				await new Promise((r) => setTimeout(r, 45 + Math.random() * 40));
			}
			await new Promise((r) => setTimeout(r, 180));
		}
		input.value = '';
		updateGhost();
		run(text);
		input.readOnly = false;
		typing = false;
		if (queued) {
			const next = queued;
			queued = null;
			typeCommand(next);
		}
	};
	root
		.querySelectorAll('[data-run]')
		.forEach((chip) =>
			chip.addEventListener('click', () => typeCommand(chip.dataset.run)),
		);

	/* Panel tabs: Problemas / Terminal */
	const ptabs = Array.from(root.querySelectorAll('[data-ptab]'));
	const problemsEl = root.querySelector('[data-problems]');
	const selectPanelTab = (tab, focus = false) => {
		const toProblems = tab.dataset.ptab === 'problems';
		ptabs.forEach((t) => {
			t.setAttribute('aria-selected', String(t === tab));
			t.tabIndex = t === tab ? 0 : -1;
		});
		problemsEl.hidden = !toProblems;
		termOut.hidden = toProblems;
		form.hidden = toProblems;
		if (!toProblems) term.scrollTop = term.scrollHeight;
		if (focus) tab.focus({ preventScroll: true });
	};
	ptabs.forEach((tab) => {
		tab.addEventListener('click', () => selectPanelTab(tab));
		tab.addEventListener('keydown', (event) => {
			if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
			event.preventDefault();
			selectPanelTab(ptabs[(ptabs.indexOf(tab) + 1) % ptabs.length], true);
		});
	});

	/* ---------- Empty-editor actions, quick open and shortcuts ---------- */
	const mainCol = root.querySelector('.main');
	const reopenClosed = () => {
		const path = closed.pop();
		if (path) openFile(path);
	};
	const focusTerminal = () => {
		const termTab = root.querySelector('[data-ptab="terminal"]');
		if (termTab.getAttribute('aria-selected') !== 'true') termTab.click();
		input.focus({ preventScroll: true });
	};

	let qo = null;
	let qoReturn = null;
	const closeQuickOpen = (restoreFocus = true) => {
		if (!qo) return;
		qo.remove();
		qo = null;
		if (!restoreFocus) return;
		const back =
			qoReturn && document.contains(qoReturn)
				? qoReturn
				: editor.querySelector('.empty__item') || editor;
		back.focus({ preventScroll: true });
	};
	const fuzzy = (query, text) => {
		// Subsequence match; returns the highlighted label or null.
		if (!query) return esc(text);
		let qi = 0;
		let html = '';
		for (const ch of text) {
			if (qi < query.length && ch.toLowerCase() === query[qi].toLowerCase()) {
				html += `<mark>${esc(ch)}</mark>`;
				qi++;
			} else html += esc(ch);
		}
		return qi === query.length ? html : null;
	};
	const openQuickOpen = () => {
		if (qo) return qo.querySelector('input').focus({ preventScroll: true });
		qoReturn = document.activeElement;
		qo = document.createElement('div');
		qo.className = 'qo';
		qo.innerHTML = `<input class="qo__input" type="text" role="combobox" aria-expanded="true" placeholder="Buscar archivos por nombre" aria-label="Buscar archivos por nombre" aria-controls="about-qo-list" aria-autocomplete="list" spellcheck="false" autocomplete="off"><ul class="qo__list" id="about-qo-list" role="listbox" aria-label="Archivos"></ul>`;
		mainCol.appendChild(qo);
		const field = qo.querySelector('input');
		const list = qo.querySelector('ul');
		let results = [];
		let sel = 0;
		const paint = () => {
			const q = field.value.trim();
			results = Object.keys(FILES)
				.map((path) => ({ path, label: fuzzy(q, path.split('/').pop()) }))
				.filter((r) => r.label !== null);
			sel = Math.min(sel, Math.max(0, results.length - 1));
			list.innerHTML = results.length
				? results
						.map(
							(r, i) =>
								`<li class="qo__opt" role="option" id="about-qo-${i}" aria-selected="${i === sel}" data-path="${r.path}">${icon(FILES[r.path].icon)}<span>${r.label}</span><small>${r.path.includes('/') ? 'sobre-mi/hobbies' : 'sobre-mi'}</small></li>`,
						)
						.join('')
				: '<li class="qo__none">No hay archivos que coincidan.</li>';
			if (results.length)
				field.setAttribute('aria-activedescendant', `about-qo-${sel}`);
			else field.removeAttribute('aria-activedescendant');
			revealIn(list, list.querySelector('[aria-selected="true"]'));
		};
		const choose = (path) => {
			closeQuickOpen(false);
			openFile(path);
			editor.focus({ preventScroll: true });
		};
		field.addEventListener('input', () => {
			sel = 0;
			paint();
		});
		field.addEventListener('keydown', (event) => {
			if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
				event.preventDefault();
				if (!results.length) return;
				sel =
					(sel + (event.key === 'ArrowDown' ? 1 : -1) + results.length) %
					results.length;
				paint();
			} else if (event.key === 'Enter') {
				event.preventDefault();
				if (results[sel]) choose(results[sel].path);
			} else if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				closeQuickOpen();
			}
		});
		list.addEventListener('mousedown', (event) => {
			const opt = event.target.closest('[data-path]');
			if (!opt) return;
			event.preventDefault();
			choose(opt.dataset.path);
		});
		field.addEventListener('blur', () =>
			setTimeout(() => closeQuickOpen(false), 0),
		);
		paint();
		field.focus({ preventScroll: true });
	};

	editor.addEventListener('click', (event) => {
		const action = event.target.closest('[data-action]')?.dataset.action;
		if (!action) return;
		if (action === 'quick-open') openQuickOpen();
		else if (action === 'reopen') reopenClosed();
		else if (action === 'readme') openFile('README.md');
		else if (action === 'cv') openFile('cv.pdf');
		else if (action === 'terminal') focusTerminal();
		else if (action === 'neofetch') {
			focusTerminal();
			typeCommand('neofetch');
		}
	});

	// Shortcuts only while focus is inside the window, so the page keeps its own keys.
	root.querySelector('[data-win]').addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && drawerOpen()) {
			event.preventDefault();
			return setDrawer(false);
		}
		const mod = event.ctrlKey || event.metaKey;
		const key = event.key.toLowerCase();
		if (mod && !event.shiftKey && key === 'p') {
			event.preventDefault();
			openQuickOpen();
		} else if (mod && (event.key === '`' || event.code === 'Backquote')) {
			event.preventDefault();
			focusTerminal();
		} else if (event.altKey && !mod && event.code === 'KeyZ' && closed.length) {
			event.preventDefault();
			reopenClosed();
		}
	});

	/* ---------- Resizable terminal ---------- */
	const win = root.querySelector('[data-win]');
	const main = root.querySelector('.main');
	const sash = root.querySelector('[data-sash]');
	const panelEl = sash.parentElement;
	const MIN_PANEL = 120;
	const MIN_EDITOR = 110;
	const defaultPanel = () => (mqPhone.matches ? 280 : 236);
	const maxPanel = () => {
		if (mqPhone.matches) return 560;
		const fixed =
			main.querySelector('.tabbar').offsetHeight +
			main.querySelector('.crumbs').offsetHeight;
		return Math.max(MIN_PANEL, main.clientHeight - fixed - MIN_EDITOR);
	};
	const setPanel = (h) => {
		const value = Math.round(Math.min(maxPanel(), Math.max(MIN_PANEL, h)));
		main.style.setProperty('--panel-h', `${value}px`);
		sash.setAttribute('aria-valuenow', String(value));
		sash.setAttribute('aria-valuemax', String(Math.round(maxPanel())));
		term.scrollTop = term.scrollHeight;
	};

	let drag = null;
	sash.addEventListener('pointerdown', (event) => {
		event.preventDefault();
		sash.setPointerCapture(event.pointerId);
		drag = { y: event.clientY, h: panelEl.offsetHeight };
		sash.classList.add('is-dragging');
		document.body.classList.add('is-resizing');
	});
	sash.addEventListener('pointermove', (event) => {
		if (drag) setPanel(drag.h + (drag.y - event.clientY));
	});
	const endDrag = () => {
		drag = null;
		sash.classList.remove('is-dragging');
		document.body.classList.remove('is-resizing');
	};
	sash.addEventListener('pointerup', endDrag);
	sash.addEventListener('pointercancel', endDrag);
	sash.addEventListener('dblclick', () => setPanel(defaultPanel()));
	sash.addEventListener('keydown', (event) => {
		const step = event.shiftKey ? 64 : 16;
		if (event.key === 'ArrowUp') setPanel(panelEl.offsetHeight + step);
		else if (event.key === 'ArrowDown') setPanel(panelEl.offsetHeight - step);
		else if (event.key === 'Home') setPanel(MIN_PANEL);
		else if (event.key === 'End') setPanel(maxPanel());
		else if (event.key === 'Enter') setPanel(defaultPanel());
		else return;
		event.preventDefault();
	});
	const syncSashValues = () => {
		sash.setAttribute('aria-valuenow', String(defaultPanel()));
		sash.setAttribute('aria-valuemax', String(Math.round(maxPanel())));
	};
	syncSashValues();
	breakpointHandlers.push(() => {
		main.style.removeProperty('--panel-h');
		syncSashValues();
	});
	// Keep a stretched terminal within bounds if the window layout changes.
	window.addEventListener('resize', () => {
		if (main.style.getPropertyValue('--panel-h'))
			setPanel(panelEl.offsetHeight);
	});

	/* ---------- Opening sequence when the window scrolls into view ---------- */
	const boot = () => {
		win.classList.remove('is-waiting');
		setTimeout(() => typeCommand('neofetch'), reduceMotion ? 0 : 650);
	};
	if ('IntersectionObserver' in window) {
		const io = new IntersectionObserver(
			(entries) => {
				if (entries.some((e) => e.isIntersecting)) {
					io.disconnect();
					boot();
				}
			},
			{ threshold: 0.3 },
		);
		io.observe(win);
	} else boot();
};

document.addEventListener('astro:page-load', initAboutTerminal);
