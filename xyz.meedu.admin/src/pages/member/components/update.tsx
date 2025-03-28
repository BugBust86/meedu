import { useEffect, useState } from "react";
import {
  Row,
  Col,
  Modal,
  Form,
  Input,
  message,
  Select,
  DatePicker,
  Space,
  Spin,
} from "antd";
import { member } from "../../../api/index";
import dayjs from "dayjs";
import moment from "moment";
import { UploadImageButton, HelperText } from "../../../components";

interface PropsInterface {
  id: number;
  open: boolean;
  roles: any[];
  onCancel: () => void;
  onSuccess: () => void;
}

export const MemberUpdateDialog = (props: PropsInterface) => {
  const [form] = Form.useForm();
  const [init, setInit] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [avatar, setAvatar] = useState<string>("");
  const [role_id, setRoleId] = useState<any>(null);

  useEffect(() => {
    if (props.id > 0 && props.open) {
      setInit(true);
      form.setFieldsValue({
        password: "",
      });
      setRoleId(null);
      setAvatar("");
      initData();
    }
  }, [props.open, props.id]);

  const initData = async () => {
    await getDetail();
    setInit(false);
  };

  const getDetail = async () => {
    const res: any = await member.edit(props.id);
    form.setFieldsValue({
      nick_name: res.data.nick_name,
      avatar: res.data.avatar,
      mobile: res.data.mobile,
      role_expired_at:
        res.data.role_id == 0
          ? ""
          : dayjs(res.data.role_expired_at, "YYYY-MM-DD HH:mm:ss"),
      role_id: res.data.role_id == 0 ? [] : res.data.role_id,
    });
    setRoleId(res.data.role_id == 0 ? null : res.data.role_id);
    setAvatar(res.data.avatar);
  };

  const onFinish = (values: any) => {
    if (loading) {
      return;
    }
    if (
      values.role_id &&
      values.role_id.length !== 0 &&
      !values.role_expired_at
    ) {
      message.error("请选择VIP过期时间");
      return;
    }
    values.role_expired_at = values.role_expired_at
      ? moment(new Date(values.role_expired_at)).format("YYYY-MM-DD HH:mm:ss")
      : "";
    if (!values.password) {
      delete values.password;
    }
    setLoading(true);
    member
      .update(props.id, values)
      .then((res: any) => {
        setLoading(false);
        message.success("成功！");
        props.onSuccess();
      })
      .catch((e) => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <>
      {props.open ? (
        <Modal
          title="编辑学员资料"
          onCancel={() => {
            props.onCancel();
          }}
          open={true}
          width={800}
          maskClosable={false}
          onOk={() => {
            form.submit();
          }}
          centered
        >
          {init && (
            <div className="float-left text-center mt-30">
              <Spin></Spin>
            </div>
          )}
          <div
            style={{ display: init ? "none" : "block" }}
            className="float-left mt-30"
          >
            <Form
              form={form}
              name="member-update-dailog"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 21 }}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
            >
              <Form.Item
                label="手机号码"
                name="mobile"
                rules={[{ required: true, message: "请输入手机号码!" }]}
              >
                <Input
                  type="number"
                  style={{ width: 300 }}
                  placeholder="填输入学员登录手机号码"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="登录密码" name="password">
                <Input.Password
                  style={{ width: 300 }}
                  placeholder="如需修改请输入新密码"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="学员昵称" name="nick_name">
                <Input
                  style={{ width: 300 }}
                  placeholder="请输入学员昵称"
                  allowClear
                />
              </Form.Item>
              <Form.Item label="学员头像" name="avatar">
                <Space align="baseline" style={{ height: 32 }}>
                  <Form.Item name="avatar">
                    <UploadImageButton
                      text="上传头像"
                      scene="avatar"
                      onSelected={(url) => {
                        form.setFieldsValue({ avatar: url });
                        setAvatar(url);
                      }}
                    ></UploadImageButton>
                  </Form.Item>
                  <div className="ml-10">
                    <HelperText text="建议尺寸：100x100"></HelperText>
                  </div>
                </Space>
              </Form.Item>
              {avatar && (
                <Row style={{ marginBottom: 22 }}>
                  <Col span={3}></Col>
                  <Col span={21}>
                    <div
                      className="contain-thumb-box"
                      style={{
                        backgroundImage: `url(${avatar})`,
                        width: 100,
                        height: 100,
                      }}
                    ></div>
                  </Col>
                </Row>
              )}
              <Form.Item label="设置会员" name="role_id">
                <Select
                  style={{ width: 300 }}
                  onChange={(e) => {
                    setRoleId(e);
                  }}
                  placeholder="请选择会员"
                  allowClear
                  options={props.roles}
                />
              </Form.Item>
              <div style={{ display: role_id ? "block" : "none" }}>
                <Form.Item label="会员到期" name="role_expired_at">
                  <DatePicker
                    format="YYYY-MM-DD HH:mm:ss"
                    style={{ width: 300 }}
                    showTime
                    placeholder="授权会员到期时间"
                  />
                </Form.Item>
              </div>
            </Form>
          </div>
        </Modal>
      ) : null}
    </>
  );
};
