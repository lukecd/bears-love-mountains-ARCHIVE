// mock-browser-objects.js
class HTMLVideoElementMock {
	// Add minimal properties and methods, or leave it empty if that's sufficient
}

if (typeof window === "undefined") {
	global.HTMLVideoElement = HTMLVideoElementMock;
}
