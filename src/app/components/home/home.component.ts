import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  features = [
    {
      icon: 'bi-search',
      title: 'Recherche Avancée',
      description: 'Recherchez des offres d\'emploi provenant de plusieurs sources internationales avec des filtres puissants.'
    },
    {
      icon: 'bi-star-fill',
      title: 'Gestion des Favoris',
      description: 'Sauvegardez vos offres préférées et accédez-y facilement à tout moment.'
    },
    {
      icon: 'bi-file-earmark-check',
      title: 'Suivi des Candidatures',
      description: 'Organisez et suivez l\'état de vos candidatures avec des notes personnalisées.'
    },
    {
      icon: 'bi-globe',
      title: 'Offres Internationales',
      description: 'Accédez à des milliers d\'offres d\'emploi du monde entier via des APIs fiables.'
    }
  ];

  stats = [
    { value: '1000+', label: 'Offres disponibles' },
    { value: '50+', label: 'Pays couverts' },
    { value: '4', label: 'Sources d\'API' }
  ];
}
