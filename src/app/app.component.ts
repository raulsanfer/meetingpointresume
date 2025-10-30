import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PrefixService } from './services/prefix.service';
import { PrefixConfig, ParsedContent } from './models/prefix.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  textBoxes: string[] = [''];
  currentView: 'editor' | 'report' | 'config' = 'editor';
  prefixes: PrefixConfig[] = [];

  constructor(private prefixService: PrefixService) {
    this.prefixes = this.prefixService.getPrefixes();
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackByPrefixIndex(index: number): number {
    return index;
  }

  addTextBox(): void {
    this.textBoxes.push('');
  }

  removeTextBox(index: number): void {
    if (this.textBoxes.length > 1) {
      this.textBoxes.splice(index, 1);
    }
  }

  updateTextBox(index: number, value: string): void {
    this.textBoxes[index] = value;
  }

  generateReport(): void {
    this.currentView = 'report';
  }

  parseContent(content: string): ParsedContent[] {
    return this.prefixService.parseContent(content);
  }

  addPrefix(): void {
    this.prefixes.push({ name: '', fontSize: '16px', color: '#000000' });
  }

  removePrefix(index: number): void {
    if (this.prefixes.length > 1) {
      this.prefixes.splice(index, 1);
    }
  }

  updatePrefix(index: number, field: keyof PrefixConfig, value: string): void {
    this.prefixes[index][field] = value;
  }
}