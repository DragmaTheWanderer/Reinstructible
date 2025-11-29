import { HttpClient, HttpParams } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';

interface PartsInf {
  id:                        number;    
  set_num:                    string; 
  set_num_parent:              string; 
  name:                      string; 
  theme_id:                   number;    
  set_img_url:                 string; 
  set_imager_resource:          number;    
  set_element_count:           number;    
  set_element_storage_count:    number;    
}

@Component({
  selector: 'parts-root',
  templateUrl: './parts.html',
  standalone: false,
  styleUrl: './parts.css'
})
export class Parts implements OnInit {
  public parts :PartsInf[] = [];
  public partsLoaded: boolean = false;
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getParts();
  }

  getParts() {

    let filterValue = "";
    let idValue = "4093-1";


    let params = new HttpParams()
      .set('param', 'parts')
      .set('filter', filterValue)
      .set('id', idValue); // Convert non-string values if needed

    this.http.get<PartsInf[]>('/api/part', { params: params }).subscribe({
      next: (result) => {
      this.parts = result;
      this.partsLoaded = true;
    },
      error: (error) => {
        console.error(error);
        this.parts[0].name = "Did not load";
        this.partsLoaded = false;
      }
    })
  }
  protected readonly title = signal('reinstructible.client');
}
