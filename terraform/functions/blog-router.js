function handler(event) {
    var request = event.request;
    var basePath = ${blog_base_path};

    var aboutRedirect = ${about_redirect};
    if (aboutRedirect && (request.uri === basePath + "/about" || request.uri === basePath + "/about/" || request.uri === basePath + "/about/index.html" || request.uri === basePath + "/about.html")) {
        return {
            statusCode: 308,
            statusDescription: "Permanent Redirect",
            headers: { location: { value: aboutRedirect } }
        };
    }

    if (request.uri === basePath) {
        return {
            statusCode: 308,
            statusDescription: "Permanent Redirect",
            headers: {
                location: { value: basePath + "/" }
            }
        };
    }

    if (request.uri.indexOf(basePath + "/") === 0 && request.uri.charAt(request.uri.length - 1) === "/") {
        request.uri += "index.html";
    }

    return request;
}
