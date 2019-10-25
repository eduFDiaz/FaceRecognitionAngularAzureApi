import { environment } from './../environments/environment';
import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'FaceRecognition';
  response = '';
  faces: any;
  image = new Image();
  @ViewChild('image', { static: true }) htmlImage;
  cx: CanvasRenderingContext2D;
  canvasEl: HTMLCanvasElement;
  scaleFactors = { X: null, Y: null };

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    // tslint:disable-next-line: max-line-length
    this.image.src = 'https://pop-verse.com/wp-content/uploads/2017/08/it-crowd-banner.jpg';

    this.image.addEventListener('load', () => {
      this.RemoveTooltips();
    });
  }

  detectFaces() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': environment.key
    });

    let httpParams = new HttpParams();
    httpParams = httpParams.append('returnFaceId', 'true');
    // httpParams = httpParams.append('returnFaceLandmarks', 'true');
    httpParams = httpParams.append('returnFaceAttributes',
      'age,gender,smile,emotion');
    // 'age,gender,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise');

    this.http.post(environment.apiEndpoint, { url: this.image.src }, { headers, params: httpParams }).subscribe(
      response => {
        this.response = JSON.stringify(response, null, 4);
        this.faces = response;
        this.drawImage();
        this.drawFaces();
      }
      , error => { alert(error); }
    );
  }

  drawImage() {
    const imgBox = document.getElementById('container').getBoundingClientRect();
    this.scaleFactors.X = imgBox.width / this.image.width;
    this.scaleFactors.Y = imgBox.height / this.image.height;
  }

  drawFaces() {
    this.drawImage();

    this.faces.forEach(face => {
      const box = face.faceRectangle;
      const boundingBox = {
        left: box.left * this.scaleFactors.X,
        top: box.top * this.scaleFactors.Y,
        width: box.width * this.scaleFactors.X,
        height: box.height * this.scaleFactors.Y
      };

      // and give it some content
      // add the text node to the newly created div
      const imgBox = document.getElementById('container').getBoundingClientRect();

      const currentDiv = document.getElementById('container');


      const imgBoundingBox = {
        left: box.left * this.scaleFactors.X,
        top: box.top * this.scaleFactors.Y,
        width: box.width * this.scaleFactors.X,
        height: box.height * this.scaleFactors.Y
      };

      const newDiv = document.createElement('button');
      newDiv.className = 'Tooltip';
      newDiv.style.position = 'absolute';
      newDiv.type = 'button';
      newDiv.setAttribute('data-toggle', 'tooltip');
      newDiv.setAttribute('trigger', 'focus');
      newDiv.setAttribute('data-placement', 'right');
      /* const attributes = [];
      attributes.push(['Gender: ', face.faceAttributes.gender, '\n'].join(''));
      attributes.push(['Smile: ', face.faceAttributes.smile, '\n'].join(''));
      attributes.push(['Age: ', face.faceAttributes.age, '\n'].join(''));
      attributes.push(['Emotion: ', JSON.stringify(face.faceAttributes.emotion, null, 4), '\n'].join('')); */
      newDiv.setAttribute('title', JSON.stringify(face.faceAttributes, null, 4));
      newDiv.style.top = imgBoundingBox.top.toString() + 'px';
      newDiv.style.left = imgBoundingBox.left.toString() + 'px';
      newDiv.style.width = imgBoundingBox.width.toString() + 'px';
      newDiv.style.height = imgBoundingBox.height.toString() + 'px';
      newDiv.style.zIndex = '2';
      newDiv.style.background = 'none';
      if (face.faceAttributes.gender === 'male') {
        newDiv.style.border = '2px solid blue';
      }
      if (face.faceAttributes.gender === 'female') {
        newDiv.style.border = '2px solid pink';
      }

      /* newDiv.addEventListener('touchstart', () => {
        if (this.isTouchDevice() === false) {
          newDiv. tooltip();
      }
      }); */

      currentDiv.appendChild(newDiv);
    });
  }
  RemoveTooltips() {
    const tooltips = document.getElementsByClassName('Tooltip');
    while (tooltips.length > 0) {
      tooltips[0].parentNode.removeChild(tooltips[0]);
    }
  }

  onResize(event) {
    if (this.response !== '') {
      this.RemoveTooltips();
      this.drawFaces();
    }
  }

  /* isTouchDevice() {
    return true === ('ontouchstart' in window || window.Touch && document instanceof Touch);
  } */
}
