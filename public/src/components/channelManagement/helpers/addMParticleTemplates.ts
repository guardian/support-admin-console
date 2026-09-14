export const addMParticleTemplates = (text: string | undefined, templates: Set<string>) => {
  if (!text) {
    return;
  }
  for (const templateMatch of text.matchAll(/%%mParticle_([^%]+)%%/g)) {
    templates.add(templateMatch[1]);
  }
};
