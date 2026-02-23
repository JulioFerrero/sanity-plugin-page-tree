import { Reference, ValidationContext } from 'sanity';

import { getLanguageFieldName } from '../helpers/config';
import { getRawPageMetadataQuery } from '../queries';
import { apiVersion } from '../sanity/api-version';
import { PageTreeConfig, RawPageMetadata } from '../types';

/**
 * Validates that the slug is unique within the parent page and therefore that entire the path is unique.
 */
export const parentValidator =
  (config: PageTreeConfig, ownType: string) =>
  async (selectedParentRef: Reference | undefined, context: ValidationContext) => {
    const client = context.getClient({ apiVersion });

    if (!selectedParentRef) {
      return true;
    }

    const parentId = selectedParentRef._ref;
    const selectedParent = (await client.fetch<RawPageMetadata[]>(getRawPageMetadataQuery(parentId, config)))[0];

    const allowedParentValidation = allowedParentValidator(selectedParent, config, ownType);
    if (allowedParentValidation !== true) {
      return allowedParentValidation;
    }

    return parentLanguageValidator(selectedParent, config, context);
  };

const allowedParentValidator = (selectedParent: RawPageMetadata, config: PageTreeConfig, ownType: string) => {
  const allowedParents = config.allowedParents?.[ownType];

  if (allowedParents === undefined) {
    return true;
  }

  if (!allowedParents.includes(selectedParent._type)) {
    return `El padre de tipo "${selectedParent._type}" no está permitido para este tipo de documento.`;
  }

  return true;
};

const parentLanguageValidator = (
  selectedParent: RawPageMetadata,
  config: PageTreeConfig,
  context: ValidationContext,
) => {
  if (config.documentInternationalization?.documentLanguageShouldMatchParent) {
    const languageFieldName = getLanguageFieldName(config);
    const language = context.document?.[languageFieldName];
    const parentLanguage = selectedParent?.[languageFieldName];

    if (language !== parentLanguage) {
      return 'El idioma del padre debe coincidir con el idioma del documento.';
    }
  }

  return true;
};
