import { modernTemplate } from './modern';
import { professionalTemplate } from './professional';
import { creativeTemplate } from './creative';

// Export all templates
export const templates = {
  modern: modernTemplate,
  professional: professionalTemplate,
  creative: creativeTemplate,
};

// Helper function to get template by name
export const getTemplateByName = (name) => {
  return templates[name.toLowerCase()] || templates.modern; // Default to modern if template not found
};

// Export template names for selection
export const templateNames = Object.keys(templates);
