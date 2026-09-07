function handler(event) {
    var request = event.request;
    var basePath = ${blog_base_path};

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
