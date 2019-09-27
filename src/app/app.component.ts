import { environment } from './../environments/environment';
import { Component, ViewChild, Input, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'FaceRecognition';
  response = '';
  faces: any;
  cx: CanvasRenderingContext2D;
  image = new Image();
  @ViewChild('canvas', { static: true }) canvas;

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.image.src = 'http://sparethekids.com/wp-content/uploads/2017/03/cmgmh-14320822.png';
    if (this.image.complete) {
      this.drawImage(this.image);
    }
  }

  detectFaces() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Ocp-Apim-Subscription-Key': environment.key
    });

    const httpParams = new HttpParams({});
    httpParams.append('returnFaceId', 'true');
    httpParams.append('returnFaceLandmarks', 'true');
    httpParams.append('returnFaceAttributes',
      'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise');

    this.http.post(environment.apiEndpoint, { url: this.image.src, params: httpParams }, { headers }).subscribe(
      response => {
        this.response = JSON.stringify(response, null, 4);
        this.faces = response;
        this.drawImage(this.image);
        this.drawFaces();
      }
      , error => { alert(error); }
    );
  }

  drawImage(image: any) {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');

    canvasEl.width = image.width;
    canvasEl.height = image.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    this.cx.drawImage(image, 0, 0, image.width, image.height);
  }

  drawFaces() {
    this.drawImage(this.image);

    this.faces.forEach(face => {
      const box = face.faceRectangle;
      this.cx.beginPath();
      this.cx.rect(box.left, box.top, box.width, box.height);
      this.cx.lineWidth = 7;
      this.cx.strokeStyle = 'blue';
      this.cx.stroke();
    });
  }
}
