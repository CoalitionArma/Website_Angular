import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DropdownModule, GridModule, NavModule, HeaderModule} from '@coreui/angular';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,RouterLinkActive,RouterOutlet,DropdownModule, HeaderModule, GridModule, NavModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

    subDivClicked($event:any) {
      console.log($event)
      $event.stopPropagation()
    }
}
