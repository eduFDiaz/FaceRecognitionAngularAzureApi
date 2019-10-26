import { environment } from './../environments/environment';
import { Component, ViewChild, Input, OnInit, Renderer2, ElementRef } from '@angular/core';
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
  @ViewChild('container', { static: true }) htmlImage: ElementRef;
  scaleFactors = { X: null, Y: null };

  constructor(private http: HttpClient, private renderer: Renderer2) {
  }

  ngOnInit(): void {
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
    this.htmlImage.nativeElement;
    const imgBox = document.getElementById('container').getBoundingClientRect();
    this.scaleFactors.X = imgBox.width / this.image.width;
    this.scaleFactors.Y = imgBox.height / this.image.height;
  }

  drawFaces() {
    this.drawImage();

    this.faces.forEach(face => {
      const box = face.faceRectangle;

      const imgBoundingBox = {
        left: box.left * this.scaleFactors.X,
        top: box.top * this.scaleFactors.Y,
        width: box.width * this.scaleFactors.X,
        height: box.height * this.scaleFactors.Y
      };

      const b: HTMLButtonElement = this.renderer.createElement('button');
      if (face.faceAttributes.gender === 'male') {
        b.style.border = '2px solid blue';
      }
      if (face.faceAttributes.gender === 'female') {
        b.style.border = '2px solid pink';
      }
      b.setAttribute('appTippy', '');
      b.setAttribute('title', JSON.stringify(face.faceAttributes, null, 4));
      b.style.position = 'absolute';

      b.style.top = imgBoundingBox.top.toString() + 'px';
      b.style.left = imgBoundingBox.left.toString() + 'px';
      b.style.width = imgBoundingBox.width.toString() + 'px';
      b.style.height = imgBoundingBox.height.toString() + 'px';
      b.style.zIndex = '2';
      b.style.background = 'none';

      this.renderer.appendChild(this.htmlImage.nativeElement, b);
    });
  }

  RemoveTooltips() {
      let tooltips: HTMLCollection = this.htmlImage.nativeElement.children;
      while (tooltips.length > 1) {
        this.renderer.removeChild(this.htmlImage.nativeElement, tooltips.item(tooltips.length - 1));
        tooltips = this.htmlImage.nativeElement.children;
      }
  }

  onResize(event) {
    if (this.response !== '') {
      this.RemoveTooltips();
      this.drawFaces();
    }
  }
}
