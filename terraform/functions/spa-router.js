function handler(event) {
    var request = event.request;
    var oldBooksRoute = request.uri.match(/^((?:\/(?:en|fr|fa))?)\/reading-list\/?$/);
    if (oldBooksRoute) {
        return {
            statusCode: 308,
            statusDescription: "Permanent Redirect",
            headers: { location: { value: oldBooksRoute[1] + "/books" } }
        };
    }
    var routes = {
        "/books": true,
        "/books/": true,
        "/en/books": true,
        "/en/books/": true,
        "/fr/books": true,
        "/fr/books/": true,
        "/fa/books": true,
        "/fa/books/": true,

        "/about": true,
        "/about/": true,
        "/en/about": true,
        "/en/about/": true,
        "/fr/about": true,
        "/fr/about/": true,
        "/fa/about": true,
        "/fa/about/": true,

        "/how-i-work": true,
        "/how-i-work/": true,
        "/resume": true,
        "/resume/": true,
        "/en/how-i-work": true,
        "/en/how-i-work/": true,
        "/en": true,
        "/en/": true,
        "/en/resume": true,
        "/en/resume/": true,
        "/fr/how-i-work": true,
        "/fr/how-i-work/": true,
        "/fr": true,
        "/fr/": true,
        "/fr/resume": true,
        "/fr/resume/": true,
        "/fa/how-i-work": true,
        "/fa/how-i-work/": true,
        "/fa": true,
        "/fa/": true,
        "/fa/resume": true,
        "/fa/resume/": true
    };

    if (routes[request.uri]) {
        request.uri = "/index.html";
    }

    return request;
}
