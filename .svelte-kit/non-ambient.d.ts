
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
		RouteId(): "/" | "/dashboard" | "/dashboard/ads" | "/dashboard/create" | "/dashboard/messages" | "/dashboard/messages/[adId]" | "/test";
		RouteParams(): {
			"/dashboard/messages/[adId]": { adId: string }
		};
		LayoutParams(): {
			"/": { adId?: string };
			"/dashboard": { adId?: string };
			"/dashboard/ads": Record<string, never>;
			"/dashboard/create": Record<string, never>;
			"/dashboard/messages": { adId?: string };
			"/dashboard/messages/[adId]": { adId: string };
			"/test": Record<string, never>
		};
		Pathname(): "/" | "/dashboard" | "/dashboard/" | "/dashboard/ads" | "/dashboard/ads/" | "/dashboard/create" | "/dashboard/create/" | "/dashboard/messages" | "/dashboard/messages/" | `/dashboard/messages/${string}` & {} | `/dashboard/messages/${string}/` & {} | "/test" | "/test/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}