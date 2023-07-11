import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as signalR from '@microsoft/signalr';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private hubConnection: signalR.HubConnection | undefined;
  private notificationSubject = new Subject<string[]>();
  private notificationReceivIdSubject = new Subject<string>();
  private notificationMessageSubject = new Subject<string>();
  private QuantitySubject = new Subject<number>();
  private requstIdSubject = new Subject<number>();
  private showFormSubject = new Subject<boolean>();
  private longitudeSubject = new Subject<number>();
  public userTdNotifi!: string;
  constructor() { 
    // this.startConnection()
  }

  public startConnection = (someKey: string) => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.baseUrl}/Notify?some_key=${someKey}`)
      .build();
    this.hubConnection.serverTimeoutInMilliseconds = 300000;
    this.hubConnection.start().then(() => {
      console.log("Connection Start");
    }).catch((err: any) => console.log(err));
  }

  public onDisconnected(callback: () => void): void {
    this.hubConnection!.onclose(callback);
  }

  public stopConnection(): void {
    this.hubConnection!.stop().then(() => {
      console.log("Connection Stop !");
    }).catch((err: any) => console.log(err));
  }


  public signalRListener = (methodName:string, callback: (...Input:any[]) => void) => {
    this.hubConnection?.on(methodName, callback);
  }

  public sendNotificationToUser(userId: string, message: string, show:boolean,requstId:number) {
    this.hubConnection?.invoke('SendNotification', userId, message, show ,requstId)
      .catch(error => {
        console.error('Error sending notification:', error);
      });
  }

  sendNotificationToAllUsers(message: string) {
    this.hubConnection?.invoke('SendToAll', 'all', message);
  }

  notify(notifications: string[]): void {
    this.notificationSubject.next(notifications);
    // this.formSubject.next(true);
  }

  onNotification(): Observable<string[]> {
    return this.notificationSubject.asObservable();
  }

  setReceiveIdNotifi(receiveId: string) {
    this.notificationReceivIdSubject.next(receiveId);
  }

  getReceiveIdNotifi():Observable<string>  {
    return this.notificationReceivIdSubject.asObservable();
  }


  setMessageNotifiToUser(message: string) {
    this.notificationMessageSubject.next(message);
  }

  getMessageNotifiToUser():Observable<string>  {
    return this.notificationMessageSubject.asObservable();
  }


  setShowForm(show: boolean) {
    this.showFormSubject.next(show);
  }

  getShowForm():Observable<boolean>  {
    return this.showFormSubject.asObservable();
  }


  setQuantityValue(quantity: number) {
    this.QuantitySubject.next(quantity);
  }

  getQuantityValue():Observable<number>  {
    return this.QuantitySubject.asObservable();
  }

  setRequstIdValue(requstid: number) {
    this.requstIdSubject.next(requstid);
  }

  getRequstIdValue():Observable<number>  {
    return this.requstIdSubject.asObservable();
  }

  setLongituValue(long: number) {
    this.longitudeSubject.next(long);
  }

  getLongituValue():Observable<number>  {
    return this.longitudeSubject.asObservable();
  }

}
