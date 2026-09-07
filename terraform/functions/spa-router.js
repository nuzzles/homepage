function handler(event) {
    var request = event.request;
    var routes = {
        "/resume": true,
        "/resume/": true,
        "/en": true,
        "/en/": true,
        "/en/resume": true,
        "/en/resume/": true,
        "/fr": true,
        "/fr/": true,
        "/fr/resume": true,
        "/fr/resume/": true,
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
