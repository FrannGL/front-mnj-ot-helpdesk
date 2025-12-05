import { Image, Description, PictureAsPdf, InsertDriveFile } from '@mui/icons-material';

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return <PictureAsPdf color="error" />;
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'webp':
      return <Image color="primary" />;
    case 'txt':
      return <Description color="info" />;
    default:
      return <InsertDriveFile color="action" />;
  }
};
