import { environment } from './../environments/environment';
import { Component } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  pictureUrl = 'https://upload.wikimedia.org/wikipedia/commons/c/c4/The_Beatles_in_America.JPG';
  title = 'FaceRecognition';
  response = '';

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
      response => { this.response = JSON.stringify(response, null, 4); }
      , error => { alert(error); }
    );
  }
}
