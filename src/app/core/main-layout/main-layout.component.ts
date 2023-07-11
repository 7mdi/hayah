import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/features/Profile/services/notification.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {

  constructor(private notificationService: NotificationService) { }

  ngOnInit(): void {

  }

}
