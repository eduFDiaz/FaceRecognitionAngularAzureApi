import { environment } from './../environments/environment';
import { Component, ViewChild, Input } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  pictureUrl = 'http://sparethekids.com/wp-content/uploads/2017/03/cmgmh-14320822.png';
  title = 'FaceRecognition';
  response = '';

  @Input() public width = 495;
  @Input() public height = 445;
  cx: CanvasRenderingContext2D;
  @ViewChild('canvas', {static: true}) canvas;

  constructor(private http: HttpClient) {
  }

  detectFaces() {
    const headers = new HttpHeaders({
      'Content-Type' : 'application/json',
      'Ocp-Apim-Subscription-Key': environment.key
    });

    const options = {headers};

    const httpParams =  new HttpParams({});
    httpParams.append('returnFaceId', 'true');
    httpParams.append('returnFaceLandmarks', 'true');
    httpParams.append('returnFaceAttributes',
      'age,gender,headPose,smile,facialHair,glasses,emotion,hair,makeup,occlusion,accessories,blur,exposure,noise');

    this.http.post(environment.apiEndpoint, { url: this.pictureUrl, params: httpParams } , { headers }).subscribe(
      response => { this.response = JSON.stringify(response, null, 4); console.log(response[0]); this.drawCanvas(); }
      , error => { alert(error); }
    );
  }

  drawCanvas() {
    const canvasEl: HTMLCanvasElement = this.canvas.nativeElement;
    this.cx = canvasEl.getContext('2d');
    const image = new Image();
    image.src = this.pictureUrl;

    canvasEl.width = image.width;
    canvasEl.height = image.height;

    this.cx.lineWidth = 3;
    this.cx.lineCap = 'round';
    this.cx.strokeStyle = '#000';
    image.onload = () => {
        this.cx.drawImage(image, 0, 0, image.width, image.height);
    };
  }
}
