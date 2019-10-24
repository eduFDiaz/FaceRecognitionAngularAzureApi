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
    this.image.src = 'https://www.telegraph.co.uk/content/dam/technology/2018/12/18/TELEMMGLPICT000183951855_trans_NvBQzQNjv4Bqul3YgLXf2lEf3afmzmy4CDDC3Z_MGy0c2EgWsFix-NU.jpeg?imwidth=1400';
    this.image.addEventListener('load', () => {
      this.drawImage(this.image);
      console.log('image was loaded');
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
        this.drawImage(this.image);
        this.drawFaces();
      }
      , error => { alert(error); }
    );
  }

  drawImage(image: HTMLImageElement) {
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
      if (face.faceAttributes.gender === "male"){
        this.cx.strokeStyle = 'blue';
      }
      if (face.faceAttributes.gender === "female"){
        this.cx.strokeStyle = 'pink';
      }
      this.cx.stroke();
    });
  }
}
