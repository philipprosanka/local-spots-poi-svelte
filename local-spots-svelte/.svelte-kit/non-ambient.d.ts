
// this file is generated — do not edit it


declare module "svelte/elements" {
	export interface HTMLAttributes<T> {
		'data-sveltekit-keepfocus'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-noscroll'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-preload-code'?:
			| true
			| ''
			| 'eager'
			| 'viewport'
			| 'hover'
			| 'tap'
			| 'off'
			| undefined
			| null;
		'data-sveltekit-preload-data'?: true | '' | 'hover' | 'tap' | 'off' | undefined | null;
		'data-sveltekit-reload'?: true | '' | 'off' | undefined | null;
		'data-sveltekit-replacestate'?: true | '' | 'off' | undefined | null;
	}
}

export {};


declare module "$app/types" {
	export interface AppTypes {
		RouteId(): "/" | "/about" | "/admin" | "/charts" | "/dashboard" | "/login" | "/logout" | "/map" | "/signup";
		RouteParams(): {
			
		};
		LayoutParams(): {
			"/": Record<string, never>;
			"/about": Record<string, never>;
			"/admin": Record<string, never>;
			"/charts": Record<string, never>;
			"/dashboard": Record<string, never>;
			"/login": Record<string, never>;
			"/logout": Record<string, never>;
			"/map": Record<string, never>;
			"/signup": Record<string, never>
		};
		Pathname(): "/" | "/about" | "/about/" | "/admin" | "/admin/" | "/charts" | "/charts/" | "/dashboard" | "/dashboard/" | "/login" | "/login/" | "/logout" | "/logout/" | "/map" | "/map/" | "/signup" | "/signup/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): "/images/idylic_cafe.jpg" | string & {};
	}
}