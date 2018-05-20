function url_join(mUrl) {
	return "http://119.10.54.43:8090/" + mUrl;
}

/*登录页面跳转*/
function jumpLogin() {
	if(window.parent.parent.parent.parent) {
		parent.parent.parent.parent.location.href = "../login.html";
	}
	if(window.parent.parent.parent) {
		parent.parent.parent.location.href = "../login.html";
	}
	if(window.parent.parent) {
		parent.parent.location.href = "../login.html";
	} else if(window.parent) {
		parent.location.href = "../login.html";
	} else {
		window.location.href = "login.html";
	}
}