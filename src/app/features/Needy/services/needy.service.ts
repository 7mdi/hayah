import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ApiResponse } from '../../Donation/_models/response';
import { NeedRequest } from '../_models/needy-request';

@Injectable({
  providedIn: 'root'
})
export class NeedyService {
  public receiveIdSubject = new Subject<string>();

  constructor(private http:HttpClient) { }

  getAllNeedyRequest(): Observable<ApiResponse<NeedRequest>>{
    return this.http.get<ApiResponse<NeedRequest>>(`${environment.APIURL}/NeedRequest/Get`);

   }

  getNeedyRequestByBloodType(type:string,sectionId:number): Observable<ApiResponse<NeedRequest>>{
    return this.http.get<ApiResponse<NeedRequest>>(`${environment.APIURL}/NeedRequest/GetByBloodType?bloodType=${type}&sectionId=${sectionId}`);

  }

  getNeedyRequestById(id:number): Observable<ApiResponse<NeedRequest>>{
    return this.http.get<ApiResponse<NeedRequest>>(`${environment.APIURL}/NeedRequest/Get/${id}`);

  }

  getNeedyRequestBySectionId(sectionId:number): Observable<ApiResponse<NeedRequest>>{
    return this.http.get<ApiResponse<NeedRequest>>(`${environment.APIURL}/NeedRequest/GetBySection/${sectionId}`);

  }

  getAllNeedyRequestByUser(email:string): Observable<ApiResponse<NeedRequest>>{
    return this.http.get<ApiResponse<NeedRequest>>(`${environment.APIURL}/NeedRequest/GetByUserId/${email}`);

   }

  addRequest(neederObj : NeedRequest):Observable<ApiResponse<NeedRequest>>{
    
    // const formData: FormData= new FormData();
    // formData.append('iD', neederObj.iD?.toString() || '');
    // formData.append('ssn', neederObj.ssn);
    // formData.append('firstName', neederObj.firstName);
    // formData.append('lastName', neederObj.lastName);
    // formData.append('age', neederObj.age?.toString() || '');
    // formData.append('bloodType', neederObj.bloodType);
    // formData.append('gender', neederObj.gender);
    // formData.append('phone', neederObj.phone);
    // formData.append('location', neederObj.location);
    // formData.append('File', neederObj.hospitalReport , neederObj.hospitalReport.name);
    // formData.append('quantity', neederObj.quantity?.toString() || '');
    // formData.append('date', neederObj.date?.toString() || '');
    // formData.append('longitude', neederObj.longitude?.toString() || '');
    // formData.append('latitude', neederObj.latitude?.toString() || '');
    // formData.append('sectionId', neederObj.sectionId?.toString() || '');
    // formData.append('applicationUserId', neederObj.applicationUserId);

    return this.http.post<ApiResponse<NeedRequest>>(`${environment.APIURL}/NeedRequest/Post`,neederObj)
    
  }

  editNeedyRequestByUser(id:number,neederObj:NeedRequest){
    // const formData: FormData= new FormData();
    // formData.append('iD', neederObj.iD?.toString() || '');
    // formData.append('ssn', neederObj.ssn);
    // formData.append('firstName', neederObj.firstName);
    // formData.append('lastName', neederObj.lastName);
    // formData.append('age', neederObj.age?.toString() || '');
    // formData.append('bloodType', neederObj.bloodType);
    // formData.append('gender', neederObj.gender);
    // formData.append('phone', neederObj.phone);
    // formData.append('location', neederObj.location);
    // formData.append('File', neederObj.hospitalReport , neederObj.hospitalReport.name);
    // formData.append('quantity', neederObj.quantity?.toString() || '');
    // formData.append('date', neederObj.date?.toString() || '');
    // formData.append('longitude', neederObj.longitude?.toString() || '');
    // formData.append('latitude', neederObj.latitude?.toString() || '');
    // formData.append('sectionId', neederObj.sectionId?.toString() || '');
    // formData.append('applicationUserId', neederObj.applicationUserId);
    return this.http.put<any>(`${environment.APIURL}/NeedRequest/Put/${id}`,neederObj);

   }

   deleteNeedyRequestByUser(id:number){
    return this.http.delete<any>(`${environment.APIURL}/NeedRequest/Delete${id}`);

   }
   
   getUser(userId:string){
    return this.http.get<any>(`http://ranamohsen-001-site1.itempurl.com/User/GetUser/${userId}`);
   }


   post(longitude:number, latitude:number, current:number, bloodType:string, donatType:number):any{
    const params = new HttpParams()
    .set('l1', longitude.toString())
    .set('l2', latitude.toString())
    .set('curr', current.toString())
    .set('BT', bloodType)
    .set('DT', donatType.toString());


    const url = `https://nearest-donor-hayah12.onrender.com/prediction?l1=${longitude}&l2=${latitude}&curr=${current}&BT=${bloodType}&DT=${donatType}`;

    return this.http.post(url,'')

  }

  GetNeersteDonar(lon:number, lat:number):any{
    
    return this.http.post(`${environment.APIURL}/DonationRequest/GetNeersteDonarByLocation?Origin.Latitude=${lat}&Origin.Longitude=${lon}`,{})

  }



  editNeedyRequestQuantity(id:number, quantity:number){
    return this.http.put<any>(`${environment.APIURL}/NeedRequest/EditNeedRequestQuantity?quantity=${quantity}&id=${id}`,'');

   }


  //  setReceiveId(receiveId: string) {
  //   this.receiveIdSubject.next(receiveId);
  // }

  // getReceiveId():Observable<string>  {
  //   return this.receiveIdSubject.asObservable();
  // }



}
