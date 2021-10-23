import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, notification, Upload } from 'antd';
import { FormattedMessage } from 'react-intl';
import { UploadOutlined } from '@ant-design/icons';

const FormItem = Form.Item;
const ForgetPassword = ({ intl, visible, getList }) => {
  const [checkFirst, setCheckFirst] = useState(true);
  const [visibleModal, setVisibleModal] = useState(false);
  const [key, setKey] = useState(Math.random());
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    if (!visible && checkFirst) {
      setCheckFirst(false);
    } else {
      changeModal('show');
    }
  }, [visible]);

  const changeModal = (value) => {
    if (value === 'show') {
      setVisibleModal(!visibleModal);
      setKey(key + 1);
    } else if (value === 'close') {
      setVisibleModal(false);
    }
  };
  const openNotification = (type, message, color) => {
    notification[type]({
      message: message,
      placement: 'bottomRight',
      style: { background: color },
    });
  };
  const props = {
    name: 'file',
    action: 'http://localhost:8080/user/xlsx',
    headers: {
      authorization: 'authorization-text',
      contentType: 'multipart/form-data',
    },
    accept: '.xlsx',

    // // onRemove: (file) => {
    // //   const index = fileList.indexOf(file);
    // //   const newFileList = fileList.slice();
    // //   newFileList.splice(index, 1);
    // //   setFileList(newFileList);
    // // },
    // // beforeUpload: (file) => {
    // //   setFileList([...fileList, file]);
    // //   return false;
    // // },
    fileList,
  };

  const handleCancel = () => {
    changeModal('close');
  };
  return (
    <>
      <Modal
        title={intl.formatMessage({ id: 'app.user.upload.title' })}
        visible={visibleModal}
        onCancel={handleCancel}
        footer={false}
        cancelText={intl.formatMessage({
          id: 'app.common.deleteBtn.cancelText',
        })}
      >
        <Form>
          <FormItem name="file">
            <Upload
              {...props}
              onChange={(response) => {
                getList();
                changeModal('close');
                openNotification(
                  'success',
                  intl.formatMessage({ id: 'app.user.upload.success' }),
                  '#f6ffed'
                );
                if (response.file.status !== 'uploading') {
                  console.log(response.file, response.fileList);
                }
                if (response.file.status === 'done') {
                  openNotification(
                    'success',
                    `${response.file.name} 
                      file uploaded successfully`,
                    '#f6ffed'
                  );
                } else if (response.file.status === 'error') {
                  openNotification(
                    'error',
                    `${response.file.name} 
                             file upload failed.`,
                    '#fff1f0'
                  );
                }
              }}
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </FormItem>
        </Form>
      </Modal>
    </>
  );
};

export default ForgetPassword;
