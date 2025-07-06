import {Component, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {FooterComponent} from './componentes/layauts/footer/footer.component';
import {SimuladorService} from './core/services/SimuladorService';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FooterComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  constructor(private simuladorService: SimuladorService) {}

  ngOnInit(): void {
    this.simuladorService.iniciarSimulacion(); // Quita esto cuando ya no quieras simular
  }
}
