import { Button, message, Modal } from "antd";
import Dragger from "antd/es/upload/Dragger";
import { useState } from "react";
import config from "../../../js/config";
import { getToken } from "../../../utils";
import { InboxOutlined } from "@ant-design/icons";
import { PerButton } from "../../permission-button";

interface PropsInterface {
  scene: string;
  onUpdate: () => void;
}

export const UploadImageSub = (props: PropsInterface) => {
  const [showModal, setShowModal] = useState(false);

  const uploadProps = {
    name: "file",
    multiple: true,
    action: config.url + "/backend/api/v1/media/image/create?scene=" + props.scene,
    headers: {
      authorization: "Bearer " + getToken(),
    },
    onChange(info: any) {
      const { status, response } = info.file;
      if (status === "done") {
        if (response.status === 0) {
          message.success(`${info.file.name} 上传成功`);
        } else {
          message.error(
            `上传失败:错误代码${response.status}-${response.message}`
          );
        }
      } else if (status === "error") {
        message.error(`${info.file.name} 上传失败`);
      }
    },
    showUploadList: {
      showRemoveIcon: false,
      showDownloadIcon: false,
    },
  };

  return (
    <>
      <PerButton
        type="primary"
        text="上传图片"
        class=""
        icon={null}
        p="media.image.store"
        onClick={() => setShowModal(true)}
        disabled={null}
      />

      {showModal ? (
        <Modal
          open={true}
          closable={false}
          onCancel={() => {
            setShowModal(false);
          }}
          onOk={() => {
            props.onUpdate();
            setShowModal(false);
          }}
          maskClosable={false}
          centered
        >
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">请将图片拖拽到此处上传</p>
            <p className="ant-upload-hint">
              支持一次上传多个 / 支持 png,jpg,jpeg,gif 格式图片
            </p>
          </Dragger>
        </Modal>
      ) : null}
    </>
  );
};
