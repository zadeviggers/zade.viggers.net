import mailChannelsPlugin from "@cloudflare/pages-plugin-mailchannels";

export const onRequest = mailChannelsPlugin({
	personalizations: [
		{
			to: [{ name: "Zade Viggers", email: "zade-contact@viggers.net" }],
		},
	],
	from: ({ formData }) => ({
		name: (formData.get("name") ?? "Unknown").toString(),
		email: "contact-form@zade.viggers.net"
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
