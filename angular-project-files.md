# Proyecto Angular 19 - Editor de Notas

## 📁 Estructura del Proyecto

```
editor-notas/
├── src/
│   ├── app/
│   │   ├── models/
│   │   │   └── prefix.model.ts
│   │   ├── services/
│   │   │   └── prefix.service.ts
│   │   └── app.component.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── package.json
├── tsconfig.json
├── angular.json
└── tailwind.config.js
```

---

## 📄 src/app/models/prefix.model.ts

```typescript
export interface PrefixConfig {
  name: string;
  fontSize: string;
  color: string;
}

export interface ParsedContent {
  prefix: string | null;
  text: string;
  style: {
    fontSize: string;
    color: string;
  };
}
```

---

## 📄 src/app/services/prefix.service.ts

```typescript
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
```

---

## 📄 src/app/app.component.ts

```typescript
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

  addTextBox(): void {
    this.textBoxes.push('');
  }

  removeTextBox(index: number): void {
    if (this.textBoxes.length > 1) {
      this.textBoxes.splice(index, 1);
    }
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
}
```

---

## 📄 src/app/app.component.html

```html
<div class="min-h-screen bg-gradient-to-br p-6" 
     [ngClass]="currentView === 'editor' ? 'from-blue-50 to-indigo-100' : 'from-slate-50 to-slate-100'">
  
  <!-- VISTA DE CONFIGURACIÓN -->
  <div *ngIf="currentView === 'config'" class="max-w-4xl mx-auto">
    <div class="bg-white rounded-xl shadow-lg p-6">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Configuración de Prefijos
        </h2>
        <button (click)="currentView = 'editor'" 
                class="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition">
          Volver
        </button>
      </div>
      
      <div class="space-y-4">
        <div *ngFor="let prefix of prefixes; let i = index" 
             class="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
          <input type="text" placeholder="Nombre" [(ngModel)]="prefix.name"
                 class="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="text" placeholder="Tamaño (ej: 16px)" [(ngModel)]="prefix.fontSize"
                 class="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          <input type="color" [(ngModel)]="prefix.color"
                 class="w-16 h-10 border border-slate-300 rounded-lg cursor-pointer" />
          <button (click)="removePrefix(i)" 
                  class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      
      <button (click)="addPrefix()" 
              class="mt-4 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Agregar Prefijo
      </button>
    </div>
  </div>

  <!-- VISTA DE REPORTE -->
  <div *ngIf="currentView === 'report'" class="max-w-6xl mx-auto">
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Reporte Generado
        </h2>
        <button (click)="currentView = 'editor'" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Volver a Editar
        </button>
      </div>
    </div>

    <div class="grid gap-6">
      <div *ngFor="let box of textBoxes; let i = index" 
           class="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition"
           [class.hidden]="!box.trim()">
        <div class="flex items-center gap-2 mb-4 pb-3 border-b border-slate-200">
          <div class="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
            {{ i + 1 }}
          </div>
          <span class="text-slate-500 text-sm">Tarjeta #{{ i + 1 }}</span>
        </div>
        <div class="space-y-3">
          <div *ngFor="let item of parseContent(box)" class="flex gap-3">
            <span *ngIf="item.prefix" class="font-bold shrink-0"
                  [style.color]="item.style.color"
                  [style.fontSize]="item.style.fontSize">
              {{ item.prefix }}:
            </span>
            <span [style.color]="item.style.color"
                  [style.fontSize]="item.style.fontSize">
              {{ item.text }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- VISTA DE EDITOR -->
  <div *ngIf="currentView === 'editor'" class="max-w-4xl mx-auto">
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
      <h1 class="text-3xl font-bold text-slate-800 mb-2">Editor de Notas</h1>
      <p class="text-slate-600">Agrega tus notas con prefijos personalizados</p>
    </div>

    <div class="space-y-4 mb-6">
      <div *ngFor="let box of textBoxes; let i = index" 
           class="bg-white rounded-xl shadow-md p-4 hover:shadow-lg transition">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm font-semibold text-slate-500">Nota #{{ i + 1 }}</span>
          <button *ngIf="textBoxes.length > 1" (click)="removeTextBox(i)"
                  class="text-red-500 hover:bg-red-50 p-1 rounded transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <textarea [(ngModel)]="textBoxes[i]"
                  placeholder="Escribe aquí... Ejemplo:&#10;TITLE: Mi proyecto&#10;TODO: Completar documentación&#10;REQ: Usuario debe poder login"
                  class="w-full h-32 px-4 py-3 border-2 border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 resize-none">
        </textarea>
      </div>
    </div>

    <div class="flex gap-3">
      <button (click)="addTextBox()" 
              class="flex-1 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Agregar Nota
      </button>
      
      <button (click)="currentView = 'config'" 
              class="py-4 px-6 bg-slate-600 text-white rounded-xl hover:bg-slate-700 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Config
      </button>
      
      <button (click)="generateReport()" 
              class="flex-1 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition flex items-center justify-center gap-2 font-semibold shadow-md hover:shadow-lg">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Generar Reporte
      </button>
    </div>

    <div class="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p class="text-sm text-blue-800">
        <strong>Tip:</strong> Usa prefijos como TODO:, REQ:, TITLE: al inicio de cada línea. Configura los prefijos en el botón Config.
      </p>
    </div>
  </div>
</div>
```

---

## 📄 src/app/app.component.css

```css
:host {
  display: block;
  font-family: system-ui, -apple-system, sans-serif;
}
```

---

## 📄 src/index.html

```html
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Editor de Notas - Angular 19</title>
</head>
<body>
  <app-root></app-root>
</body>
</html>
```

---

## 📄 src/main.ts

```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: []
}).catch(err => console.error(err));
```

---

## 📄 src/styles.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}
```

---

## 📄 package.json

```json
{
  "name": "editor-notas",
  "version": "1.0.0",
  "scripts": {
    "ng": "ng",
    "start": "ng serve",
    "build": "ng build",
    "watch": "ng build --watch --configuration development",
    "test": "ng test"
  },
  "private": true,
  "dependencies": {
    "@angular/animations": "^19.0.0",
    "@angular/common": "^19.0.0",
    "@angular/compiler": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/forms": "^19.0.0",
    "@angular/platform-browser": "^19.0.0",
    "@angular/platform-browser-dynamic": "^19.0.0",
    "@angular/router": "^19.0.0",
    "rxjs": "~7.8.0",
    "tslib": "^2.3.0",
    "zone.js": "~0.15.0"
  },
  "devDependencies": {
    "@angular-devkit/build-angular": "^19.0.0",
    "@angular/cli": "^19.0.0",
    "@angular/compiler-cli": "^19.0.0",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "typescript": "~5.6.0"
  }
}
```

---

## 📄 tailwind.config.js

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

---

## 📄 angular.json

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "editor-notas": {
      "projectType": "application",
      "schematics": {
        "@schematics/angular:component": {
          "style": "css"
        }
      },
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "outputPath": "dist/editor-notas",
            "index": "src/index.html",
            "browser": "src/main.ts",
            "polyfills": [
              "zone.js"
            ],
            "tsConfig": "tsconfig.app.json",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.css"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {
              "budgets": [
                {
                  "type": "initial",
                  "maximumWarning": "500kb",
                  "maximumError": "1mb"
                },
                {
                  "type": "anyComponentStyle",
                  "maximumWarning": "2kb",
                  "maximumError": "4kb"
                }
              ],
              "outputHashing": "all"
            },
            "development": {
              "optimization": false,
              "extractLicenses": false,
              "sourceMap": true
            }
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "buildTarget": "editor-notas:build:production"
            },
            "development": {
              "buildTarget": "editor-notas:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
```

---

## 📄 tsconfig.json

```json
{
  "compileOnSave": false,
  "compilerOptions": {
    "outDir": "./dist/out-tsc",
    "strict": true,
    "noImplicitOverride": true,
    "noPropertyAccessFromIndexSignature": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "sourceMap": true,
    "declaration": false,
    "experimentalDecorators": true,
    "moduleResolution": "node",
    "importHelpers": true,
    "target": "ES2022",
    "module": "ES2022",
    "useDefineForClassFields": false,
    "lib": [
      "ES2022",
      "dom"
    ]
  },
  "angularCompilerOptions": {
    "enableI18nLegacyMessageIdFormat": false,
    "strictInjectionParameters": true,
    "strictInputAccessModifiers": true,
    "strictTemplates": true
  }
}
```

---

## 📄 tsconfig.app.json

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/app",
    "types": []
  },
  "files": [
    "src/main.ts"
  ],
  "include": [
    "src/**/*.d.ts"
  ]
}
```

---

## 🚀 Instrucciones de Instalación

### 1. Crear el proyecto

```bash
# Crear carpeta del proyecto
mkdir editor-notas
cd editor-notas

# Copiar todos los archivos anteriores en sus respectivas ubicaciones
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el proyecto

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`

---

## ✨ Características

- ✅ Angular 19 con Standalone Components
- ✅ TypeScript estricto
- ✅ Tailwind CSS para estilos
- ✅ RxJS para manejo de estado
- ✅ Arquitectura modular con servicios
- ✅ Interfaz responsive y moderna
- ✅ Configuración de prefijos dinámica
- ✅ Generación de reportes HTML

---

## 📝 Notas Adicionales

- El proyecto usa **Standalone Components** (sin módulos tradicionales)
- Tailwind CSS se integra mediante PostCSS
- Los prefijos son completamente configurables
- La aplicación es 100% client-side (sin backend necesario)
