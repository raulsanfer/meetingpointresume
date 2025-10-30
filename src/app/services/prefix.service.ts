import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PrefixConfig, ParsedContent } from '../models/prefix.model';

@Injectable({
  providedIn: 'root'
})
export class PrefixService {
  private defaultPrefixes: PrefixConfig[] = [
    { name: 'TODO', fontSize: '16px', color: '#3b82f6' },
    { name: 'REQ', fontSize: '16px', color: '#10b981' },
    { name: 'TITLE', fontSize: '20px', color: '#8b5cf6' },
    { name: 'NOTE', fontSize: '14px', color: '#6b7280' },
    { name: 'IMPORTANT', fontSize: '18px', color: '#ef4444' }
  ];

  private prefixesSubject = new BehaviorSubject<PrefixConfig[]>(this.defaultPrefixes);
  public prefixes$: Observable<PrefixConfig[]> = this.prefixesSubject.asObservable();

  getPrefixes(): PrefixConfig[] {
    return this.prefixesSubject.value;
  }

  updatePrefixes(prefixes: PrefixConfig[]): void {
    this.prefixesSubject.next(prefixes);
  }

  addPrefix(prefix: PrefixConfig): void {
    const current = this.getPrefixes();
    this.updatePrefixes([...current, prefix]);
  }

  removePrefix(index: number): void {
    const current = this.getPrefixes();
    if (current.length > 1) {
      this.updatePrefixes(current.filter((_, i) => i !== index));
    }
  }

  parseContent(content: string): ParsedContent[] {
    const lines = content.split('\n');
    const parsed: ParsedContent[] = [];
    const prefixes = this.getPrefixes();
    
    lines.forEach(line => {
      let matched = false;
      for (const prefix of prefixes) {
        const regex = new RegExp(`^${prefix.name}:\\s*(.+)`, 'i');
        const match = line.match(regex);
        if (match) {
          parsed.push({
            prefix: prefix.name,
            text: match[1],
            style: { fontSize: prefix.fontSize, color: prefix.color }
          });
          matched = true;
          break;
        }
      }
      if (!matched && line.trim()) {
        parsed.push({
          prefix: null,
          text: line,
          style: { fontSize: '14px', color: '#374151' }
        });
      }
    });
    
    return parsed;
  }
}