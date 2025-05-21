import { toast } from 'sonner';
import { useDropzone } from 'react-dropzone';
import { useState, useCallback } from 'react';

export function useFileUpload() {
  const [file, setFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
      toast.success('Archivo adjuntado correctamente');
    }
  }, []);

  const openFileDialog = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = (event) => {
      const { files } = event.target as HTMLInputElement;
      if (files && files.length > 0) {
        setFile(files[0]);
        toast.success('Archivo adjuntado correctamente');
      }
    };
    input.click();
  };

  const clearFile = () => setFile(null);

  const dropzone = useDropzone({
    onDrop,
    multiple: false,
  });

  return { file, setFile, clearFile, openFileDialog, ...dropzone };
}
