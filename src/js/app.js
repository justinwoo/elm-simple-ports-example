var Rx = require('rx');

// bring in our Elm application through webpack!
var Elm = require('../elm/App.elm');

// basically an event bus, but is an Observable we can subscribe to and whatnot
var filesData$ = new Rx.Subject();

// default files listing
var files = [
  'file1',
  'file2',
  'file3',
  'file4',
  'file5'
];

function loadFilesData() {
  console.log('pretending to fetch data...');
  // every time we "fetch" data, let's say it updated.
  files.push('file' + files.length);
  // fire off the files data stream with the new files
  filesData$.onNext(files);
}

function init() {
  var appContainer = document.getElementById('app');
  console.log('embedding our Elm application!');
  /**
   * embed our elm app in our container.
   * you might remember that this is what i was talking about in our Elm code,
   * where you need to provide an initial value for these Signals.
   * this is the one we control from the JS side, so we need to provide it from
   * this side to make it work correctly.
   *
   * we also get the App instance returned when we call this, so
   * we need to use to access our ports.
   */
  var elmApp = Elm.embed(Elm.App, appContainer, {
    newFiles: [] // need to provide initial values to our listening port!
  });

  filesData$.subscribe(function (files) {
    console.log('new data came down in our stream!');
    console.log('sending data down our newFiles port...');
    // so let's send the new files down the port
    // in elm we had `port newFiles`, so this way we access this
    // from JS is to do the following:
    elmApp.ports.newFiles.send(files);
  });

  // just like above, we access the output port from JS similarly,
  // but we will subscribe to the output from this.
  // all we really care about is the event instead of the value,
  // so we'll just kick of loadFilesData as a result.
  elmApp.ports.updateRequests.subscribe(function (value) {
    console.log('update request came from our updateRequests port!');
    loadFilesData();
  });

  loadFilesData();
}

init();
