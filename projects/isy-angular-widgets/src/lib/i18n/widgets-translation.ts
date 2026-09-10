/**
 * Represents a set of translated strings used in a component or application.
 */
export interface WidgetsTranslation {
  wizard?: {
    back?: string;
    next?: string;
    save?: string;
    close?: string;
  };
  inputChar?: {
    title?: string;
    headerBaseChars?: string;
    headerGroups?: string;
    headerAllCharacters?: string;
    insert?: string;
    preview?: {
      letters?: string;
      information?: string;
    };
    aria?: {
      togglePicker?: string;
      closePicker?: string;
      characterGrid?: string;
      filterAllCharacters?: string;
      filterBaseChars?: string;
      filterGroups?: string;
    };
  };
  hauptfenster?: {
    altLogoAwl?: string;
    altLogoAnbieterAwl?: string;
    logout?: string;
    browserWarning?: {
      currentBrowserFallback?: string;
      message?: string;
      supportedBrowser?: string;
    };
  };
  formWrapper?: {
    required?: string;
    invalid?: string;
  };
  seitentoolbar?: {
    back?: string;
  };
}
