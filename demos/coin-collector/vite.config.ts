import { defineConfig } from 'vite';
import { createDemoViteConfig } from '../vite.shared.js';

export default defineConfig(createDemoViteConfig(import.meta.url));
