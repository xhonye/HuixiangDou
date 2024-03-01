import {
    FC, ReactNode, useEffect, useRef, useState
} from 'react';
import { addDocs } from '@services/home';
import Button from '@components/button/button';
import { message } from 'sea-lion-ui';
import { useLocale } from '@hooks/useLocale';
import styles from './upload.module.less';

export interface UploadProps {
    afterUpload?: () => void;
    files?: string[];
    children?: ReactNode;
}

const acceptFileTypes = '.jpg,.png,.jpeg,.bmp,.pdf,.txt,.md,.docx,.doc,.xlsx,.xls,.csv,.java,.cpp,.py,.js,.go';

const Upload: FC<UploadProps> = ({
    afterUpload,
    files = [], children
}) => {
    const locales = useLocale('components');

    const fileInputRef = useRef(null);
    const [loading, setLoading] = useState(false);
    const [pendingFiles, setPendingFiles] = useState([]); // 待上传文件列表

    const handleClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const onFileChange = (e) => {
        setPendingFiles([...pendingFiles, ...e.target.files]);
    };

    const uploadFile = () => {
        setLoading(true);
        // check file's size
        for (let i = 0; i < pendingFiles.length; i++) {
            if (pendingFiles[i].size > 1024 * 1024 * 1000) {
                message.warning(locales.fileSize);
                setLoading(false);
                return;
            }
        }

        addDocs(pendingFiles)
            .then((res) => {
                setPendingFiles([]);
                if (afterUpload) {
                    afterUpload();
                }
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <div className={styles.upload} onClick={handleClick}>
                <input
                    onChange={onFileChange}
                    ref={fileInputRef}
                    type="file"
                    accept={acceptFileTypes}
                    multiple
                    max={10}
                    style={{ display: 'none' }}
                />
                {children}
            </div>
            <h4>{locales.pendingFiles}</h4>
            <div className={styles.fileList}>
                {pendingFiles.map((file) => (
                    <div key={file}>{file.name}</div>
                ))}
            </div>
            {pendingFiles.length > 0 && (
                <Button onClick={uploadFile}>{loading ? locales.uploading : locales.confirmUpload}</Button>
            )}
            <h4>{locales.uploadedFiles}</h4>
            <div className={styles.fileList}>
                {files.map((file) => (
                    <div key={file}>{file}</div>
                ))}
            </div>
        </>
    );
};

export default Upload;
