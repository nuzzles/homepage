function handler(event) {
    var request = event.request;
    var routes = {
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
