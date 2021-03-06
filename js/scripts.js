
	var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 

    // Wait for Cordova to connect with the device
    document.addEventListener("deviceready",onDeviceReady,false);

    // Cordova is ready to be used!
    //
    function onDeviceReady() {
      $(function() {
            FastClick.attach(document.body);
        });

        ////////////////// CAMARA ///////////////////////
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;

        //////////////// GEOLOCALIZACION ///////////////
        navigator.geolocation.getCurrentPosition(onSuccess, onError);


        $('a, button').addEventListener('touchstart');
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      // Uncomment to view the base64 encoded image data
      // console.log(imageData);

      // Get image handle
      //
      var smallImage = document.getElementById('smallImage');

      // Unhide image elements
      //
      smallImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      smallImage.src = "data:image/jpeg;base64," + imageData;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoURISuccess(imageURI) {
      // Uncomment to view the image file URI 
      // console.log(imageURI);

      // Get image handle
      //
      var largeImage = document.getElementById('largeImage');

      // Unhide image elements
      //
      largeImage.style.display = 'block';

      // Show the captured photo
      // The inline CSS rules are used to resize the image
      //
      largeImage.src = imageURI;
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 80,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true,
        destinationType: destinationType.DATA_URL });
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 50, 
        destinationType: destinationType.FILE_URI,
        sourceType: source });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('No se pudo realizar la acción por que: ' + message);
    }

    // onSuccess Geolocation
    //
    function onSuccess(position) {
        var element = document.getElementById('geolocation');
        element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br/>' +
                            'Longitude: '          + position.coords.longitude             + '<br/>' +
                            'Altitude: '           + position.coords.altitude              + '<br/>' +
                            'Accuracy: '           + position.coords.accuracy              + '<br/>' +
                            'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br/>' +
                            'Heading: '            + position.coords.heading               + '<br/>' +
                            'Speed: '              + position.coords.speed                 + '<br/>' +
                            'Timestamp: '          + position.timestamp                    + '<br/>';
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }


     // Called when capture operation is finished
    //
    function captureSuccess(mediaFiles) {
        var i, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
            uploadFile(mediaFiles[i]);
        }
    }

    // Called if something bad happens.
    //
    function captureError(error) {
        var msg = 'An error occurred during capture: ' + error.code;
        navigator.notification.alert(msg, null, 'Uh oh!');
    }

    // A button will call this function
    //
    function captureAudio() {
        // Launch device audio recording application,
        // allowing user to capture up to 2 audio clips
        navigator.device.capture.captureAudio(captureSuccess, captureError, {limit: 2});
    }

    // Upload files to server
    function uploadFile(mediaFile) {
        var ft = new FileTransfer(),
            path = mediaFile.fullPath,
            name = mediaFile.name;

        ft.upload(path,
            "http://my.domain.com/upload.php",
            function(result) {
                console.log('Upload success: ' + result.responseCode);
                console.log(result.bytesSent + ' bytes sent');
            },
            function(error) {
                console.log('Error uploading file ' + path + ': ' + error.code);
            },
            { fileName: name });
    }



    var watchID = null;

    function startWatch() {
      var opciones = { frequency: 1000 };
      watchID = navigator.accelerometer.watchAcceleration(onSuccess, onError, opciones);
    }

    function stopWatch() {
      if (watchID) {
        watchID = navigator.accelerometer.clearWatch(watchID);
        watchID = null;
      }
    }

    function onSuccess(acceleration) {
      var aceX = document.getElementById('aceleraX');
      aceX.value = acceleration.x;

      var aceY = document.getElementById('aceleraY');
      aceY.value = acceleration.y;

      var aceZ = document.getElementById('aceleraZ');
      aceZ.value = acceleration.z;
    }

    function onError() {
      alert('¡Error!');
    }

