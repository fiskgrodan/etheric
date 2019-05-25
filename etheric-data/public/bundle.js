var app = (function () {
	'use strict';

	function noop() {}

	function assign(tar, src) {
		for (const k in src) tar[k] = src[k];
		return tar;
	}

	function add_location(element, file, line, column, char) {
		element.__svelte_meta = {
			loc: { file, line, column, char }
		};
	}

	function run(fn) {
		return fn();
	}

	function blank_object() {
		return Object.create(null);
	}

	function run_all(fns) {
		fns.forEach(run);
	}

	function is_function(thing) {
		return typeof thing === 'function';
	}

	function safe_not_equal(a, b) {
		return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
	}

	function create_slot(definition, ctx, fn) {
		if (definition) {
			const slot_ctx = get_slot_context(definition, ctx, fn);
			return definition[0](slot_ctx);
		}
	}

	function get_slot_context(definition, ctx, fn) {
		return definition[1]
			? assign({}, assign(ctx.$$scope.ctx, definition[1](fn ? fn(ctx) : {})))
			: ctx.$$scope.ctx;
	}

	function get_slot_changes(definition, ctx, changed, fn) {
		return definition[1]
			? assign({}, assign(ctx.$$scope.changed || {}, definition[1](fn ? fn(changed) : {})))
			: ctx.$$scope.changed || {};
	}

	function append(target, node) {
		target.appendChild(node);
	}

	function insert(target, node, anchor) {
		target.insertBefore(node, anchor || null);
	}

	function detach(node) {
		node.parentNode.removeChild(node);
	}

	function element(name) {
		return document.createElement(name);
	}

	function text(data) {
		return document.createTextNode(data);
	}

	function space() {
		return text(' ');
	}

	function children(element) {
		return Array.from(element.childNodes);
	}

	function set_data(text, data) {
		data = '' + data;
		if (text.data !== data) text.data = data;
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	const dirty_components = [];

	const resolved_promise = Promise.resolve();
	let update_scheduled = false;
	const binding_callbacks = [];
	const render_callbacks = [];
	const flush_callbacks = [];

	function schedule_update() {
		if (!update_scheduled) {
			update_scheduled = true;
			resolved_promise.then(flush);
		}
	}

	function add_render_callback(fn) {
		render_callbacks.push(fn);
	}

	function flush() {
		const seen_callbacks = new Set();

		do {
			// first, call beforeUpdate functions
			// and update components
			while (dirty_components.length) {
				const component = dirty_components.shift();
				set_current_component(component);
				update(component.$$);
			}

			while (binding_callbacks.length) binding_callbacks.shift()();

			// then, once components are updated, call
			// afterUpdate functions. This may cause
			// subsequent updates...
			while (render_callbacks.length) {
				const callback = render_callbacks.pop();
				if (!seen_callbacks.has(callback)) {
					callback();

					// ...so guard against infinite loops
					seen_callbacks.add(callback);
				}
			}
		} while (dirty_components.length);

		while (flush_callbacks.length) {
			flush_callbacks.pop()();
		}

		update_scheduled = false;
	}

	function update($$) {
		if ($$.fragment) {
			$$.update($$.dirty);
			run_all($$.before_render);
			$$.fragment.p($$.dirty, $$.ctx);
			$$.dirty = null;

			$$.after_render.forEach(add_render_callback);
		}
	}

	function mount_component(component, target, anchor) {
		const { fragment, on_mount, on_destroy, after_render } = component.$$;

		fragment.m(target, anchor);

		// onMount happens after the initial afterUpdate. Because
		// afterUpdate callbacks happen in reverse order (inner first)
		// we schedule onMount callbacks before afterUpdate callbacks
		add_render_callback(() => {
			const new_on_destroy = on_mount.map(run).filter(is_function);
			if (on_destroy) {
				on_destroy.push(...new_on_destroy);
			} else {
				// Edge case - component was destroyed immediately,
				// most likely as a result of a binding initialising
				run_all(new_on_destroy);
			}
			component.$$.on_mount = [];
		});

		after_render.forEach(add_render_callback);
	}

	function destroy(component, detaching) {
		if (component.$$) {
			run_all(component.$$.on_destroy);
			component.$$.fragment.d(detaching);

			// TODO null out other refs, including component.$$ (but need to
			// preserve final state?)
			component.$$.on_destroy = component.$$.fragment = null;
			component.$$.ctx = {};
		}
	}

	function make_dirty(component, key) {
		if (!component.$$.dirty) {
			dirty_components.push(component);
			schedule_update();
			component.$$.dirty = blank_object();
		}
		component.$$.dirty[key] = true;
	}

	function init(component, options, instance, create_fragment, not_equal$$1, prop_names) {
		const parent_component = current_component;
		set_current_component(component);

		const props = options.props || {};

		const $$ = component.$$ = {
			fragment: null,
			ctx: null,

			// state
			props: prop_names,
			update: noop,
			not_equal: not_equal$$1,
			bound: blank_object(),

			// lifecycle
			on_mount: [],
			on_destroy: [],
			before_render: [],
			after_render: [],
			context: new Map(parent_component ? parent_component.$$.context : []),

			// everything else
			callbacks: blank_object(),
			dirty: null
		};

		let ready = false;

		$$.ctx = instance
			? instance(component, props, (key, value) => {
				if ($$.ctx && not_equal$$1($$.ctx[key], $$.ctx[key] = value)) {
					if ($$.bound[key]) $$.bound[key](value);
					if (ready) make_dirty(component, key);
				}
			})
			: props;

		$$.update();
		ready = true;
		run_all($$.before_render);
		$$.fragment = create_fragment($$.ctx);

		if (options.target) {
			if (options.hydrate) {
				$$.fragment.l(children(options.target));
			} else {
				$$.fragment.c();
			}

			if (options.intro && component.$$.fragment.i) component.$$.fragment.i();
			mount_component(component, options.target, options.anchor);
			flush();
		}

		set_current_component(parent_component);
	}

	class SvelteComponent {
		$destroy() {
			destroy(this, true);
			this.$destroy = noop;
		}

		$on(type, callback) {
			const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
			callbacks.push(callback);

			return () => {
				const index = callbacks.indexOf(callback);
				if (index !== -1) callbacks.splice(index, 1);
			};
		}

		$set() {
			// overridden by instance, if it has props
		}
	}

	class SvelteComponentDev extends SvelteComponent {
		constructor(options) {
			if (!options || (!options.target && !options.$$inline)) {
				throw new Error(`'target' is a required option`);
			}

			super();
		}

		$destroy() {
			super.$destroy();
			this.$destroy = () => {
				console.warn(`Component was already destroyed`); // eslint-disable-line no-console
			};
		}
	}

	/* src\components\navbar\Navbar.svelte generated by Svelte v3.4.2 */

	const file = "src\\components\\navbar\\Navbar.svelte";

	function create_fragment(ctx) {
		var nav, div, a0, t1, a1, t3, a2;

		return {
			c: function create() {
				nav = element("nav");
				div = element("div");
				a0 = element("a");
				a0.textContent = "Ingredienser";
				t1 = space();
				a1 = element("a");
				a1.textContent = "Tillstånd";
				t3 = space();
				a2 = element("a");
				a2.textContent = "Kategorier";
				a0.href = "#ingredients";
				a0.className = "svelte-1alp3n";
				add_location(a0, file, 2, 2, 40);
				a1.href = "#conditions";
				a1.className = "svelte-1alp3n";
				add_location(a1, file, 3, 2, 83);
				a2.href = "#categories";
				a2.className = "svelte-1alp3n";
				add_location(a2, file, 4, 2, 122);
				div.className = "link-container svelte-1alp3n";
				add_location(div, file, 1, 1, 8);
				nav.className = "svelte-1alp3n";
				add_location(nav, file, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, nav, anchor);
				append(nav, div);
				append(div, a0);
				append(div, t1);
				append(div, a1);
				append(div, t3);
				append(div, a2);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(nav);
				}
			}
		};
	}

	class Navbar extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment, safe_not_equal, []);
		}
	}

	/* src\components\main\Header.svelte generated by Svelte v3.4.2 */

	const file$1 = "src\\components\\main\\Header.svelte";

	function create_fragment$1(ctx) {
		var div1, div0, h1, t;

		return {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				h1 = element("h1");
				t = text(ctx.headerText);
				h1.className = "svelte-1ykk7nl";
				add_location(h1, file$1, 2, 2, 59);
				div0.className = "wrapper svelte-1ykk7nl";
				add_location(div0, file$1, 1, 1, 34);
				div1.id = ctx.id;
				div1.className = "container svelte-1ykk7nl";
				add_location(div1, file$1, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);
				append(div0, h1);
				append(h1, t);
			},

			p: function update(changed, ctx) {
				if (changed.headerText) {
					set_data(t, ctx.headerText);
				}

				if (changed.id) {
					div1.id = ctx.id;
				}
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(div1);
				}
			}
		};
	}

	function instance($$self, $$props, $$invalidate) {
		let { id, headerText = "" } = $$props;

		$$self.$set = $$props => {
			if ('id' in $$props) $$invalidate('id', id = $$props.id);
			if ('headerText' in $$props) $$invalidate('headerText', headerText = $$props.headerText);
		};

		return { id, headerText };
	}

	class Header extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment$1, safe_not_equal, ["id", "headerText"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.id === undefined && !('id' in props)) {
				console.warn("<Header> was created without expected prop 'id'");
			}
		}

		get id() {
			throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set id(value) {
			throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get headerText() {
			throw new Error("<Header>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set headerText(value) {
			throw new Error("<Header>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\main\ContentHeader.svelte generated by Svelte v3.4.2 */

	const file$2 = "src\\components\\main\\ContentHeader.svelte";

	function create_fragment$2(ctx) {
		var div3, div0, t1, div1, t3, div2;

		return {
			c: function create() {
				div3 = element("div");
				div0 = element("div");
				div0.textContent = "Svenska";
				t1 = space();
				div1 = element("div");
				div1.textContent = "Engelska";
				t3 = space();
				div2 = element("div");
				div0.className = "language-header svelte-p4lrd3";
				add_location(div0, file$2, 1, 1, 26);
				div1.className = "language-header svelte-p4lrd3";
				add_location(div1, file$2, 2, 1, 71);
				div2.className = "delete-header svelte-p4lrd3";
				add_location(div2, file$2, 3, 1, 117);
				div3.className = "container svelte-p4lrd3";
				add_location(div3, file$2, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div3, anchor);
				append(div3, div0);
				append(div3, t1);
				append(div3, div1);
				append(div3, t3);
				append(div3, div2);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(div3);
				}
			}
		};
	}

	class ContentHeader extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$2, safe_not_equal, []);
		}
	}

	/* src\components\main\Content.svelte generated by Svelte v3.4.2 */

	const file$3 = "src\\components\\main\\Content.svelte";

	function create_fragment$3(ctx) {
		var div1, div0, t, current;

		var contentheader = new ContentHeader({ $$inline: true });

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				contentheader.$$.fragment.c();
				t = space();

				if (default_slot) default_slot.c();

				div0.className = "inner svelte-1yi2osr";
				add_location(div0, file$3, 1, 1, 22);
				div1.className = "outer svelte-1yi2osr";
				add_location(div1, file$3, 0, 0, 0);
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(div0_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);
				mount_component(contentheader, div0, null);
				append(div0, t);

				if (default_slot) {
					default_slot.m(div0, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (default_slot && default_slot.p && changed.$$scope) {
					default_slot.p(get_slot_changes(default_slot_1, ctx, changed, null), get_slot_context(default_slot_1, ctx, null));
				}
			},

			i: function intro(local) {
				if (current) return;
				contentheader.$$.fragment.i(local);

				if (default_slot && default_slot.i) default_slot.i(local);
				current = true;
			},

			o: function outro(local) {
				contentheader.$$.fragment.o(local);
				if (default_slot && default_slot.o) default_slot.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div1);
				}

				contentheader.$destroy();

				if (default_slot) default_slot.d(detaching);
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { $$slots = {}, $$scope } = $$props;

		$$self.$set = $$props => {
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return { $$slots, $$scope };
	}

	class Content extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$3, safe_not_equal, []);
		}
	}

	/* src\app\ingredients\Ingredients.svelte generated by Svelte v3.4.2 */

	const file$4 = "src\\app\\ingredients\\Ingredients.svelte";

	// (2:0) <Content>
	function create_default_slot(ctx) {
		var div;

		return {
			c: function create() {
				div = element("div");
				div.textContent = "hello";
				add_location(div, file$4, 2, 1, 67);
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	function create_fragment$4(ctx) {
		var t, current;

		var header = new Header({
			props: {
			id: "ingredients",
			headerText: "Ingredienser"
		},
			$$inline: true
		});

		var content = new Content({
			props: {
			$$slots: { default: [create_default_slot] },
			$$scope: { ctx }
		},
			$$inline: true
		});

		return {
			c: function create() {
				header.$$.fragment.c();
				t = space();
				content.$$.fragment.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				mount_component(header, target, anchor);
				insert(target, t, anchor);
				mount_component(content, target, anchor);
				current = true;
			},

			p: function update(changed, ctx) {
				var content_changes = {};
				if (changed.$$scope) content_changes.$$scope = { changed, ctx };
				content.$set(content_changes);
			},

			i: function intro(local) {
				if (current) return;
				header.$$.fragment.i(local);

				content.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				header.$$.fragment.o(local);
				content.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				header.$destroy(detaching);

				if (detaching) {
					detach(t);
				}

				content.$destroy(detaching);
			}
		};
	}

	class Ingredients extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$4, safe_not_equal, []);
		}
	}

	/* src\app\conditions\Conditions.svelte generated by Svelte v3.4.2 */

	function create_fragment$5(ctx) {
		var t, current;

		var header = new Header({
			props: {
			id: "conditions",
			headerText: "Tillstånd"
		},
			$$inline: true
		});

		var content = new Content({ $$inline: true });

		return {
			c: function create() {
				header.$$.fragment.c();
				t = space();
				content.$$.fragment.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				mount_component(header, target, anchor);
				insert(target, t, anchor);
				mount_component(content, target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				header.$$.fragment.i(local);

				content.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				header.$$.fragment.o(local);
				content.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				header.$destroy(detaching);

				if (detaching) {
					detach(t);
				}

				content.$destroy(detaching);
			}
		};
	}

	class Conditions extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$5, safe_not_equal, []);
		}
	}

	/* src\app\categories\Categories.svelte generated by Svelte v3.4.2 */

	function create_fragment$6(ctx) {
		var t, current;

		var header = new Header({
			props: {
			id: "categories",
			headerText: "Kategorier"
		},
			$$inline: true
		});

		var content = new Content({ $$inline: true });

		return {
			c: function create() {
				header.$$.fragment.c();
				t = space();
				content.$$.fragment.c();
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				mount_component(header, target, anchor);
				insert(target, t, anchor);
				mount_component(content, target, anchor);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				header.$$.fragment.i(local);

				content.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				header.$$.fragment.o(local);
				content.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				header.$destroy(detaching);

				if (detaching) {
					detach(t);
				}

				content.$destroy(detaching);
			}
		};
	}

	class Categories extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$6, safe_not_equal, []);
		}
	}

	/* src\components\main\Footer.svelte generated by Svelte v3.4.2 */

	const file$5 = "src\\components\\main\\Footer.svelte";

	function create_fragment$7(ctx) {
		var div;

		return {
			c: function create() {
				div = element("div");
				div.className = "svelte-1ry5vh5";
				add_location(div, file$5, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
			},

			p: noop,
			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}
			}
		};
	}

	class Footer extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$7, safe_not_equal, []);
		}
	}

	/* src\app\App.svelte generated by Svelte v3.4.2 */

	const file$6 = "src\\app\\App.svelte";

	function create_fragment$8(ctx) {
		var t0, main, t1, t2, t3, current;

		var navbar = new Navbar({ $$inline: true });

		var ingredients = new Ingredients({ $$inline: true });

		var conditions = new Conditions({ $$inline: true });

		var categories = new Categories({ $$inline: true });

		var footer = new Footer({ $$inline: true });

		return {
			c: function create() {
				navbar.$$.fragment.c();
				t0 = space();
				main = element("main");
				ingredients.$$.fragment.c();
				t1 = space();
				conditions.$$.fragment.c();
				t2 = space();
				categories.$$.fragment.c();
				t3 = space();
				footer.$$.fragment.c();
				add_location(main, file$6, 1, 0, 12);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				mount_component(navbar, target, anchor);
				insert(target, t0, anchor);
				insert(target, main, anchor);
				mount_component(ingredients, main, null);
				append(main, t1);
				mount_component(conditions, main, null);
				append(main, t2);
				mount_component(categories, main, null);
				append(main, t3);
				mount_component(footer, main, null);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				navbar.$$.fragment.i(local);

				ingredients.$$.fragment.i(local);

				conditions.$$.fragment.i(local);

				categories.$$.fragment.i(local);

				footer.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				navbar.$$.fragment.o(local);
				ingredients.$$.fragment.o(local);
				conditions.$$.fragment.o(local);
				categories.$$.fragment.o(local);
				footer.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				navbar.$destroy(detaching);

				if (detaching) {
					detach(t0);
					detach(main);
				}

				ingredients.$destroy();

				conditions.$destroy();

				categories.$destroy();

				footer.$destroy();
			}
		};
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$8, safe_not_equal, []);
		}
	}

	const app = new App({
		target: document.body,
	});

	return app;

}());
