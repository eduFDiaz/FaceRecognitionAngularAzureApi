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
    this.image.src = 'https://cdn.vox-cdn.com/thumbor/sK3gMTENF_LR1DhAUl9e3V_5jC4=/0x0:2592x2017/1200x800/filters:focal(1089x801:1503x1215)/cdn.vox-cdn.com/uploads/chorus_image/image/65282724/friendscast.0.0.1429818191.0.jpg';

    /* this.image.addEventListener('load', () => {
      //this.drawImage();
    }); */
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

      const newDiv = document.createElement('div');
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

      if (face.faceAttributes.gender === 'male') {
        newDiv.style.border = '2px solid blue';
      }
      if (face.faceAttributes.gender === 'female') {
        newDiv.style.border = '2px solid pink';
      }
      newDiv.style.position = 'absolute';
      newDiv.style.top = imgBoundingBox.top.toString() + 'px';
      newDiv.style.left = imgBoundingBox.left.toString() + 'px';
      newDiv.style.width = imgBoundingBox.width.toString() + 'px';
      newDiv.style.height = imgBoundingBox.height.toString() + 'px';
      newDiv.style.zIndex = '2';

      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.innerHTML = 'Hover over me';

      const tooltiptext = document.createElement('span');
      tooltiptext.className = 'tooltiptext';
      tooltiptext.innerHTML = ' fdfdf dfd fggfd';

      tooltip.appendChild(tooltiptext);

      newDiv.appendChild(tooltip);

      currentDiv.appendChild(newDiv);

      currentDiv.addEventListener('mouseover',  () => {
        const currentchild = newDiv.children;
        console.log(currentchild);
      });
    });
  }
  onResize(event) {
    this.drawFaces(); // window width
  }
}
