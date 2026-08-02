export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      return Response.json(
        {
          ok: false,
          error: "This hosted learning view does not provide server-side AI APIs."
        },
        { status: 503 }
      );
    }

    return env.ASSETS.fetch(request);
  }
};
