
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
		RouteId(): "/" | "/api" | "/api/encryption" | "/api/encryption/decrypt-simple" | "/api/encryption/encrypt-simple" | "/api/encryption/generate-key-test" | "/api/public-key" | "/api/test" | "/dashboard" | "/dashboard/ads" | "/dashboard/ads/[adId]" | "/dashboard/create" | "/dashboard/messages" | "/dashboard/messages/[adId]" | "/test";
		RouteParams(): {
			"/dashboard/ads/[adId]": { adId: string };
			"/dashboard/messages/[adId]": { adId: string }
		};
		LayoutParams(): {
			"/": { adId?: string };
			"/api": Record<string, never>;
			"/api/encryption": Record<string, never>;
			"/api/encryption/decrypt-simple": Record<string, never>;
			"/api/encryption/encrypt-simple": Record<string, never>;
			"/api/encryption/generate-key-test": Record<string, never>;
			"/api/public-key": Record<string, never>;
			"/api/test": Record<string, never>;
			"/dashboard": { adId?: string };
			"/dashboard/ads": { adId?: string };
			"/dashboard/ads/[adId]": { adId: string };
			"/dashboard/create": Record<string, never>;
			"/dashboard/messages": { adId?: string };
			"/dashboard/messages/[adId]": { adId: string };
			"/test": Record<string, never>
		};
		Pathname(): "/" | "/api" | "/api/" | "/api/encryption" | "/api/encryption/" | "/api/encryption/decrypt-simple" | "/api/encryption/decrypt-simple/" | "/api/encryption/encrypt-simple" | "/api/encryption/encrypt-simple/" | "/api/encryption/generate-key-test" | "/api/encryption/generate-key-test/" | "/api/public-key" | "/api/public-key/" | "/api/test" | "/api/test/" | "/dashboard" | "/dashboard/" | "/dashboard/ads" | "/dashboard/ads/" | `/dashboard/ads/${string}` & {} | `/dashboard/ads/${string}/` & {} | "/dashboard/create" | "/dashboard/create/" | "/dashboard/messages" | "/dashboard/messages/" | `/dashboard/messages/${string}` & {} | `/dashboard/messages/${string}/` & {} | "/test" | "/test/";
		ResolvedPathname(): `${"" | `/${string}`}${ReturnType<AppTypes['Pathname']>}`;
		Asset(): string & {};
	}
}