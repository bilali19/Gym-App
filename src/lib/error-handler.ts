export function getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'string') {
      return error;
    }
    return 'An unknown error occurred';
  }
  
  export function logError(error: unknown, context?: string) {
    const message = getErrorMessage(error);
    const name = error instanceof Error ? error.name : 'UnknownError';
    
    console.error(`❌ ${context ? `${context}: ` : ''}${name}`, message);
    
    if (error instanceof Error && error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }