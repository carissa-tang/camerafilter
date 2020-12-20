const $video  = document.querySelector('video')
	, $startVideo  = document.querySelector('#startVideo')
	, $takePicture  = document.querySelector('#takePicture')
	, $switchCamera  = document.querySelector('#switchCamera')
	, $download  = document.querySelector('#download')
	, $sectionCamera  = document.querySelector('#camera')
	, $sectionFilters  = document.querySelector('#filters')
	, $img = document.querySelector('#img')
	, videoSize = $video.getBoundingClientRect()
	, sp = new URLSearchParams(location.search)
;

let width = videoSize.width
	, height = videoSize.height
	, constraints = {
		audio: false,
		video: {
		    width: {
		      min: 1280,
		      ideal: 1920,
		      max: 2560,
		    },
		    height: {
		      min: 720,
		      ideal: 1080,
		      max: 1440
		    },
			facingMode: sp.get('facingMode') || 'user'
		}
	}
	, videoTracks
;
	
function playVideo() {
	try {
		$video.play();
		$startVideo.style.display = 'none';
		$takePicture.style.display = 'block';
		$switchCamera.style.display = 'block';
	} catch(ex) {
		alert(ex + '')
	}
}
	
function loadVideo(mediaStream) {
	$video.srcObject = mediaStream; 
	videoTracks = mediaStream.getVideoTracks()
	$video.onloadedmetadata = playVideo;
}

function handleNoCamera() {
	alert('No camera found')
}
	
function setupVideo() {
	navigator
		.mediaDevices
		.getUserMedia(constraints)
		.then(loadVideo)
		.catch(handleNoCamera)
}

function takePicture() {
	const $canvas = document.createElement('canvas')
		, context = $canvas.getContext('2d')
	;
	
	$canvas.width = $video.videoWidth;
	$canvas.height = $video.videoHeight;
	context.drawImage($video, 0,  0, $video.videoWidth, $video.videoHeight);
	
	const imgUrl = $canvas.toDataURL();
	$img.src = imgUrl;
	
	$sectionCamera.style.display = 'none';
	$sectionFilters.style.display = 'block';
}

function switchCamera() {
	location.href = location.pathname + '?facingMode=' + (sp.get('facingMode') === 'environment' ? 'user' : 'environment');
}



function download() {
	const $main = document.querySelector('#filters main');
	domtoimage.toJpeg($main, { quality: 0.95 })
    .then(function (dataUrl) {
        var link = document.createElement('a');
        link.download = 'pic.jpeg';
        link.href = dataUrl;
        link.click();
    });
}
$startVideo.addEventListener('click', setupVideo);
$takePicture.addEventListener('click', takePicture);
$switchCamera.addEventListener('click', switchCamera);

$download.addEventListener('click', download);

export { download };