import { Component, OnInit } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'ngbasicpdfforms';
// }
import * as pdfjsLib from 'src/assets/pdfjs-dist/build/pdf';
import { AnnotationStorage } from "src/assets/pdfjs-dist/lib/display/annotation_storage.js";
const PDFJSViewer = require('src/assets/pdfjs-dist/web/pdf_viewer');
declare var $: any;

pdfjsLib.GlobalWorkerOptions.workerSrc = 'src/assets/pdfjs-dist/build/pdf.worker.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    var DEFAULT_URL = "./assets/f1040.pdf";
    var DEFAULT_SCALE = 1.0;
    var container = document.getElementById("pageContainer");
    var eventBus = new PDFJSViewer.EventBus();
    var loadingTask = pdfjsLib.getDocument(DEFAULT_URL);
    const annotationStorage = new AnnotationStorage();
    annotationStorage.getOrCreateValue("textfield1", "sample text string");
    annotationStorage.getOrCreateValue("textfield2", "sample text string");
    console.log(annotationStorage, 'AnnotationStorage');
    loadingTask.promise.then(function (doc) {
      doc.saveDocument(annotationStorage);
      // Use a promise to fetch and render the next page.
      var promise = Promise.resolve();

      for (var i = 1; i <= doc.numPages; i++) {
        promise = promise.then(
          function (pageNum) {
            return doc.getPage(pageNum).then(function (pdfPage) {
              // Create the page view.
              var pdfPageView = new PDFJSViewer.PDFPageView({
                container: container,
                id: pageNum,
                scale: DEFAULT_SCALE,
                defaultViewport: pdfPage.getViewport({ scale: DEFAULT_SCALE }),
                eventBus: eventBus,
                annotationLayerFactory: new PDFJSViewer.DefaultAnnotationLayerFactory(),
                renderInteractiveForms: true,
              });


              console.log(doc, "doc1");
              doc.saveDocument(annotationStorage).then(function () {
                console.log(doc, "doc2");
                // Associate the actual page with the view and draw it.
                pdfPageView.setPdfPage(pdfPage);
                console.log(pdfPage, "page" + pageNum);
                return pdfPageView.draw().then(function () {
                });



                // Change the text of multiple elements with a loop


              });
            });
          }.bind(null, i)
        );
      }
    });


  } //End of ngOnInit
}

