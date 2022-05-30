import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest = mailChannelsPlugin({
	personalizations: [
		{
			to: [{ name: "Zade Viggers", email: "zade-contact@viggers.net" }],
		},
	],
	from: ({ formData }) => ({
		name: (formData.get("name") ?? "Unknown").toString(),
		email: (
			formData.get("email") ?? "unknown-email@unknown-email.viggers.net"
		).toString(),
	}),
	respondWith: ({ formData }) => {
		const name = formData.get("name").toString();
		return new Response(null, {
			status: 302,
			headers: {
				Location: `/contact-submitted${
					name ? `?name=${encodeURIComponent(name)}` : ""
				}`,
			},
		});
	},
});
