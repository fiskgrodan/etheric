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

	function validate_store(store, name) {
		if (!store || typeof store.subscribe !== 'function') {
			throw new Error(`'${name}' is not a store with a 'subscribe' method`);
		}
	}

	function subscribe(component, store, callback) {
		const unsub = store.subscribe(callback);

		component.$$.on_destroy.push(unsub.unsubscribe
			? () => unsub.unsubscribe()
			: unsub);
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

	function listen(node, event, handler, options) {
		node.addEventListener(event, handler, options);
		return () => node.removeEventListener(event, handler, options);
	}

	function children(element) {
		return Array.from(element.childNodes);
	}

	function set_data(text, data) {
		data = '' + data;
		if (text.data !== data) text.data = data;
	}

	function toggle_class(element, name, toggle) {
		element.classList[toggle ? 'add' : 'remove'](name);
	}

	let current_component;

	function set_current_component(component) {
		current_component = component;
	}

	// TODO figure out if we still want to support
	// shorthand events, or if we want to implement
	// a real bubbling mechanism
	function bubble(component, event) {
		const callbacks = component.$$.callbacks[event.type];

		if (callbacks) {
			callbacks.slice().forEach(fn => fn(event));
		}
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

	let outros;

	function group_outros() {
		outros = {
			remaining: 0,
			callbacks: []
		};
	}

	function check_outros() {
		if (!outros.remaining) {
			run_all(outros.callbacks);
		}
	}

	function on_outro(callback) {
		outros.callbacks.push(callback);
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
			component.$$.dirty = {};
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

	function readable(value, start) {
		return {
			subscribe: writable(value, start).subscribe
		};
	}

	function writable(value, start = noop) {
		let stop;
		const subscribers = [];

		function set(new_value) {
			if (safe_not_equal(value, new_value)) {
				value = new_value;
				if (!stop) return; // not ready
				subscribers.forEach(s => s[1]());
				subscribers.forEach(s => s[0](value));
			}
		}

		function update(fn) {
			set(fn(value));
		}

		function subscribe(run, invalidate = noop) {
			const subscriber = [run, invalidate];
			subscribers.push(subscriber);
			if (subscribers.length === 1) stop = start(set) || noop;
			run(value);

			return () => {
				const index = subscribers.indexOf(subscriber);
				if (index !== -1) subscribers.splice(index, 1);
				if (subscribers.length === 0) stop();
			};
		}

		return { set, update, subscribe };
	}

	const hash = readable(window.location.hash, set => {
		window.onhashchange = () => set(window.location.hash);
	});

	const mobileQuery = "(max-width: 700px)";

	const media = readable(!!window.matchMedia(mobileQuery).matches, set => {
		const mql = window.matchMedia(mobileQuery);
		const onChange = () => set(!!mql.matches);
		mql.addListener(onChange);

		return () => mql.removeListener(onChange);
	});

	/* src\components\navbar\Underline.svelte generated by Svelte v3.2.0 */

	const file = "src\\components\\navbar\\Underline.svelte";

	function create_fragment(ctx) {
		var div1, div0;

		return {
			c: function create() {
				div1 = element("div");
				div0 = element("div");
				div0.className = "line svelte-1n4qrv0";
				toggle_class(div0, "current", ctx.$hash === ctx.matchingHash);
				add_location(div0, file, 1, 1, 26);
				div1.className = "container svelte-1n4qrv0";
				add_location(div1, file, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div1, anchor);
				append(div1, div0);
			},

			p: function update(changed, ctx) {
				if ((changed.$hash || changed.matchingHash)) {
					toggle_class(div0, "current", ctx.$hash === ctx.matchingHash);
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
		let $hash;

		validate_store(hash, 'hash');
		subscribe($$self, hash, $$value => { $hash = $$value; $$invalidate('$hash', $hash); });

		let { matchingHash } = $$props;

		$$self.$set = $$props => {
			if ('matchingHash' in $$props) $$invalidate('matchingHash', matchingHash = $$props.matchingHash);
		};

		return { matchingHash, $hash };
	}

	class Underline extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance, create_fragment, safe_not_equal, ["matchingHash"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.matchingHash === undefined && !('matchingHash' in props)) {
				console.warn("<Underline> was created without expected prop 'matchingHash'");
			}
		}

		get matchingHash() {
			throw new Error("<Underline>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set matchingHash(value) {
			throw new Error("<Underline>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\navbar\Link.svelte generated by Svelte v3.2.0 */

	const file$1 = "src\\components\\navbar\\Link.svelte";

	function create_fragment$1(ctx) {
		var a, div1, div0, t0, t1, current;

		var underline = new Underline({
			props: { matchingHash: ctx.matchingHash },
			$$inline: true
		});

		return {
			c: function create() {
				a = element("a");
				div1 = element("div");
				div0 = element("div");
				t0 = text(ctx.label);
				t1 = space();
				underline.$$.fragment.c();
				div0.className = "link-text svelte-13w6iky";
				add_location(div0, file$1, 2, 2, 48);
				add_location(div1, file$1, 1, 1, 39);
				a.href = ctx.matchingHash;
				a.className = "link svelte-13w6iky";
				add_location(a, file$1, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, a, anchor);
				append(a, div1);
				append(div1, div0);
				append(div0, t0);
				append(div1, t1);
				mount_component(underline, div1, null);
				current = true;
			},

			p: function update(changed, ctx) {
				if (!current || changed.label) {
					set_data(t0, ctx.label);
				}

				var underline_changes = {};
				if (changed.matchingHash) underline_changes.matchingHash = ctx.matchingHash;
				underline.$set(underline_changes);

				if (!current || changed.matchingHash) {
					a.href = ctx.matchingHash;
				}
			},

			i: function intro(local) {
				if (current) return;
				underline.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				underline.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(a);
				}

				underline.$destroy();
			}
		};
	}

	function instance$1($$self, $$props, $$invalidate) {
		let { label = "", matchingHash } = $$props;

		$$self.$set = $$props => {
			if ('label' in $$props) $$invalidate('label', label = $$props.label);
			if ('matchingHash' in $$props) $$invalidate('matchingHash', matchingHash = $$props.matchingHash);
		};

		return { label, matchingHash };
	}

	class Link extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$1, create_fragment$1, safe_not_equal, ["label", "matchingHash"]);

			const { ctx } = this.$$;
			const props = options.props || {};
			if (ctx.matchingHash === undefined && !('matchingHash' in props)) {
				console.warn("<Link> was created without expected prop 'matchingHash'");
			}
		}

		get label() {
			throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set label(value) {
			throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		get matchingHash() {
			throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}

		set matchingHash(value) {
			throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
		}
	}

	/* src\components\navbar\NavBar.svelte generated by Svelte v3.2.0 */

	const file$2 = "src\\components\\navbar\\NavBar.svelte";

	function create_fragment$2(ctx) {
		var nav, div, t1, t2, t3, current;

		var link0 = new Link({
			props: {
			label: "Ingredienser",
			matchingHash: "#/ingredients"
		},
			$$inline: true
		});

		var link1 = new Link({
			props: {
			label: "Tillstånd",
			matchingHash: "#/conditions"
		},
			$$inline: true
		});

		var link2 = new Link({
			props: {
			label: "Kategorier",
			matchingHash: "#/categories"
		},
			$$inline: true
		});

		return {
			c: function create() {
				nav = element("nav");
				div = element("div");
				div.textContent = "Etheric Data";
				t1 = space();
				link0.$$.fragment.c();
				t2 = space();
				link1.$$.fragment.c();
				t3 = space();
				link2.$$.fragment.c();
				div.className = "logo svelte-1piaa56";
				add_location(div, file$2, 1, 1, 23);
				nav.className = "navbar svelte-1piaa56";
				add_location(nav, file$2, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, nav, anchor);
				append(nav, div);
				append(nav, t1);
				mount_component(link0, nav, null);
				append(nav, t2);
				mount_component(link1, nav, null);
				append(nav, t3);
				mount_component(link2, nav, null);
				current = true;
			},

			p: noop,

			i: function intro(local) {
				if (current) return;
				link0.$$.fragment.i(local);

				link1.$$.fragment.i(local);

				link2.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				link0.$$.fragment.o(local);
				link1.$$.fragment.o(local);
				link2.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(nav);
				}

				link0.$destroy();

				link1.$destroy();

				link2.$destroy();
			}
		};
	}

	class NavBar extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$2, safe_not_equal, []);
		}
	}

	/* src\components\buttons\Button.svelte generated by Svelte v3.2.0 */

	const file$3 = "src\\components\\buttons\\Button.svelte";

	function create_fragment$3(ctx) {
		var button, current, dispose;

		const default_slot_1 = ctx.$$slots.default;
		const default_slot = create_slot(default_slot_1, ctx, null);

		return {
			c: function create() {
				button = element("button");

				if (default_slot) default_slot.c();

				button.className = "svelte-13ua2ne";
				add_location(button, file$3, 0, 0, 0);
				dispose = listen(button, "click", ctx.click_handler);
			},

			l: function claim(nodes) {
				if (default_slot) default_slot.l(button_nodes);
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, button, anchor);

				if (default_slot) {
					default_slot.m(button, null);
				}

				current = true;
			},

			p: function update(changed, ctx) {
				if (default_slot && default_slot.p && changed.$$scope) {
					default_slot.p(get_slot_changes(default_slot_1, ctx, changed,), get_slot_context(default_slot_1, ctx, null));
				}
			},

			i: function intro(local) {
				if (current) return;
				if (default_slot && default_slot.i) default_slot.i(local);
				current = true;
			},

			o: function outro(local) {
				if (default_slot && default_slot.o) default_slot.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(button);
				}

				if (default_slot) default_slot.d(detaching);
				dispose();
			}
		};
	}

	function instance$2($$self, $$props, $$invalidate) {
		let { $$slots = {}, $$scope } = $$props;

		function click_handler(event) {
			bubble($$self, event);
		}

		$$self.$set = $$props => {
			if ('$$scope' in $$props) $$invalidate('$$scope', $$scope = $$props.$$scope);
		};

		return { click_handler, $$slots, $$scope };
	}

	class Button extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$2, create_fragment$3, safe_not_equal, []);
		}
	}

	/* src\app\ingredients\Ingredients.svelte generated by Svelte v3.2.0 */

	const file$4 = "src\\app\\ingredients\\Ingredients.svelte";

	// (3:1) <Button on:click={()=> console.log('click')}>
	function create_default_slot(ctx) {
		var t;

		return {
			c: function create() {
				t = text("Lägg till en ny ingrediens");
			},

			m: function mount(target, anchor) {
				insert(target, t, anchor);
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(t);
				}
			}
		};
	}

	function create_fragment$4(ctx) {
		var div, h1, t_1, current;

		var button = new Button({
			props: {
			$$slots: { default: [create_default_slot] },
			$$scope: { ctx }
		},
			$$inline: true
		});
		button.$on("click", click_handler);

		return {
			c: function create() {
				div = element("div");
				h1 = element("h1");
				h1.textContent = "Ingredienser";
				t_1 = space();
				button.$$.fragment.c();
				add_location(h1, file$4, 1, 1, 26);
				div.className = "container svelte-c7u1l8";
				add_location(div, file$4, 0, 0, 0);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				insert(target, div, anchor);
				append(div, h1);
				append(div, t_1);
				mount_component(button, div, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var button_changes = {};
				if (changed.$$scope) button_changes.$$scope = { changed, ctx };
				button.$set(button_changes);
			},

			i: function intro(local) {
				if (current) return;
				button.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				button.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				if (detaching) {
					detach(div);
				}

				button.$destroy();
			}
		};
	}

	function click_handler() {
		return console.log('click');
	}

	class Ingredients extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, null, create_fragment$4, safe_not_equal, []);
		}
	}

	/* src\app\App.svelte generated by Svelte v3.2.0 */

	const file$5 = "src\\app\\App.svelte";

	// (9:1) {:else}
	function create_else_block(ctx) {
		var h1;

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Home";
				add_location(h1, file$5, 9, 2, 206);
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
				}
			}
		};
	}

	// (7:36) 
	function create_if_block_2(ctx) {
		var h1;

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Kategorier";
				add_location(h1, file$5, 7, 2, 173);
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
				}
			}
		};
	}

	// (5:36) 
	function create_if_block_1(ctx) {
		var h1;

		return {
			c: function create() {
				h1 = element("h1");
				h1.textContent = "Tillstånd";
				add_location(h1, file$5, 5, 2, 113);
			},

			m: function mount(target, anchor) {
				insert(target, h1, anchor);
			},

			i: noop,
			o: noop,

			d: function destroy(detaching) {
				if (detaching) {
					detach(h1);
				}
			}
		};
	}

	// (3:1) {#if $hash === "#/ingredients"}
	function create_if_block(ctx) {
		var current;

		var ingredients = new Ingredients({ $$inline: true });

		return {
			c: function create() {
				ingredients.$$.fragment.c();
			},

			m: function mount(target, anchor) {
				mount_component(ingredients, target, anchor);
				current = true;
			},

			i: function intro(local) {
				if (current) return;
				ingredients.$$.fragment.i(local);

				current = true;
			},

			o: function outro(local) {
				ingredients.$$.fragment.o(local);
				current = false;
			},

			d: function destroy(detaching) {
				ingredients.$destroy(detaching);
			}
		};
	}

	function create_fragment$5(ctx) {
		var t, main, current_block_type_index, if_block, current;

		var navbar = new NavBar({ $$inline: true });

		var if_block_creators = [
			create_if_block,
			create_if_block_1,
			create_if_block_2,
			create_else_block
		];

		var if_blocks = [];

		function select_block_type(ctx) {
			if (ctx.$hash === "#/ingredients") return 0;
			if (ctx.$hash === "#/conditions") return 1;
			if (ctx.$hash === "#/categories") return 2;
			return 3;
		}

		current_block_type_index = select_block_type(ctx);
		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

		return {
			c: function create() {
				navbar.$$.fragment.c();
				t = space();
				main = element("main");
				if_block.c();
				main.className = "svelte-149l197";
				add_location(main, file$5, 1, 0, 12);
			},

			l: function claim(nodes) {
				throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
			},

			m: function mount(target, anchor) {
				mount_component(navbar, target, anchor);
				insert(target, t, anchor);
				insert(target, main, anchor);
				if_blocks[current_block_type_index].m(main, null);
				current = true;
			},

			p: function update(changed, ctx) {
				var previous_block_index = current_block_type_index;
				current_block_type_index = select_block_type(ctx);
				if (current_block_type_index !== previous_block_index) {
					group_outros();
					on_outro(() => {
						if_blocks[previous_block_index].d(1);
						if_blocks[previous_block_index] = null;
					});
					if_block.o(1);
					check_outros();

					if_block = if_blocks[current_block_type_index];
					if (!if_block) {
						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
						if_block.c();
					}
					if_block.i(1);
					if_block.m(main, null);
				}
			},

			i: function intro(local) {
				if (current) return;
				navbar.$$.fragment.i(local);

				if (if_block) if_block.i();
				current = true;
			},

			o: function outro(local) {
				navbar.$$.fragment.o(local);
				if (if_block) if_block.o();
				current = false;
			},

			d: function destroy(detaching) {
				navbar.$destroy(detaching);

				if (detaching) {
					detach(t);
					detach(main);
				}

				if_blocks[current_block_type_index].d();
			}
		};
	}

	function instance$3($$self, $$props, $$invalidate) {
		let $hash;

		validate_store(hash, 'hash');
		subscribe($$self, hash, $$value => { $hash = $$value; $$invalidate('$hash', $hash); });

		return { $hash };
	}

	class App extends SvelteComponentDev {
		constructor(options) {
			super(options);
			init(this, options, instance$3, create_fragment$5, safe_not_equal, []);
		}
	}

	const app = new App({
		target: document.body,
	});

	return app;

}());
