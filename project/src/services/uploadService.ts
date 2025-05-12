// Mock upload and scan services for demonstration

export const uploadFiles = (files: File[], language: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Return a mock scan ID
      resolve('scan123');
    }, 1500);
  });
};

export const scanRepository = (repoUrl: string, language: string): Promise<string> => {
  return new Promise((resolve) => {
    // Simulate processing time
    setTimeout(() => {
      // Return a mock scan ID
      resolve('scan456');
    }, 2000);
  });
};