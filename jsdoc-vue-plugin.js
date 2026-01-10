/**
 * JSDoc Vue Plugin
 * Processes Vue Single File Components for JSDoc documentation
 */

import { compileScript, parse } from '@vue/compiler-sfc';
import fs from 'fs';
import path from 'path';

/**
 * JSDoc plugin to handle Vue Single File Components
 * @param {Object} dictionary - JSDoc dictionary
 */
export const handlers = {
  /**
   * Process files before parsing
   * @param {Object} e - Event object
   */
  beforeParse: function(e) {
    // Only process .vue files
    if (e.filename && e.filename.endsWith('.vue')) {
      try {
        const source = e.source;
        const { descriptor } = parse(source, { filename: e.filename });
        
        let jsContent = '';
        
        // Extract script content
        if (descriptor.script) {
          jsContent += descriptor.script.content;
        }
        
        // Extract script setup content
        if (descriptor.scriptSetup) {
          try {
            const compiled = compileScript(descriptor, {
              id: path.basename(e.filename, '.vue')
            });
            jsContent += '\n' + compiled.content;
          } catch (error) {
            // Fallback to raw script setup content
            jsContent += '\n' + descriptor.scriptSetup.content;
          }
        }
        
        // Add component metadata as JSDoc comments
        const componentName = path.basename(e.filename, '.vue');
        const componentDoc = `
/**
 * Vue Component: ${componentName}
 * @component
 * @file ${e.filename}
 * @description Vue Single File Component
 * ${descriptor.template ? '@template Includes template section' : ''}
 * ${descriptor.styles?.length ? '@styles Includes ' + descriptor.styles.length + ' style block(s)' : ''}
 * @example
 * // Usage in template:
 * <${componentName} />
 */
`;
        
        // Replace the source with extracted JavaScript content
        e.source = componentDoc + jsContent;
        
      } catch (error) {
        console.warn(`Warning: Could not parse Vue file ${e.filename}:`, error.message);
        // Keep original source if parsing fails
      }
    }
  }
};

/**
 * Define tags for Vue-specific documentation
 */
export function defineTags(dictionary) {
  dictionary.defineTag('component', {
    mustHaveValue: false,
    onTagged: function(doclet, tag) {
      doclet.component = true;
      doclet.kind = 'component';
    }
  });
  
  dictionary.defineTag('template', {
    mustHaveValue: false,
    onTagged: function(doclet, tag) {
      doclet.hasTemplate = true;
    }
  });
  
  dictionary.defineTag('styles', {
    mustHaveValue: false,
    onTagged: function(doclet, tag) {
      doclet.hasStyles = true;
    }
  });
};
