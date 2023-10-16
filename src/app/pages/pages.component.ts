import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';
import { SidebarService } from '../services/sidebar.service';

declare function customInitFunctions(): any;

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styles: [],
})
export class PagesComponent implements OnInit {
  constructor(private SettingsSvc: SettingsService,
              private sidebarSvc: SidebarService) {}

  ngOnInit(): void {
    customInitFunctions();
    this.sidebarSvc.cargarMenu();
  }
}
