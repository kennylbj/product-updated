import { useState } from 'react';
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  Modal,
} from 'antd';
import groupBy from 'lodash/groupBy';
import { validateProductCsv, getCountriesAndCities } from '@/utils/utils';
import { IInputProps } from './index.type';
import styles from './index.less';

const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

export default function InputForm(props: IInputProps) {
  const { form, onSubmit } = props;
  const [selectedCountry, setSelectedCountry] = useState('');

  const handleFieldChange = (fields: any) => {
    if (fields[0].name[0] === 'country') {
      setSelectedCountry(fields[0].value);
      form.setFieldsValue({ city: undefined });
    }
  };

  const countryGroups = groupBy(getCountriesAndCities(), 'country');
  const countryOptions = Object.keys(countryGroups).map((item) => (
    <Option key={item} value={item}>
      {item}
    </Option>
  ));

  const cityOptions = selectedCountry
    ? getCountriesAndCities()
        .filter((item) => item.country === selectedCountry)
        .map((item) => (
          <Option key={item.city} value={item.city}>
            {item.city}
          </Option>
        ))
    : '';

  const readUploadedFile = (file: Blob) => {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      const payload = e.target?.result;
      if (typeof payload === 'string') {
        form.setFieldsValue({ csvInput: payload });
      }
    };
    reader.readAsText(file);
  };

  const handleBeforeUpload = (file: any): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      // already upload
      if (form.getFieldValue('csvInput')) {
        confirm({
          title: 'Do you Want to replace the data?',
          onOk() {
            readUploadedFile(file);
            resolve(file);
          },
          onCancel() {
            reject();
          },
        });
      } else {
        // upload at first time
        readUploadedFile(file);
        resolve(file);
      }
    });
  };

  const handleFileRemove = (): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      confirm({
        title: 'Do you Want to delete this csv?',
        onOk() {
          form.setFieldsValue({ csvInput: '' });
          resolve(true);
        },
        onCancel() {
          reject(false);
        },
      });
    });
  };

  return (
    <Form
      layout="vertical"
      form={form}
      name="inputForm"
      onFinish={onSubmit}
      onFieldsChange={handleFieldChange}
    >
      <h1 className={styles.title}>User</h1>
      <Row gutter={24}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="lastName"
            label="Last Name"
            rules={[{ required: true, message: 'Please input your last name' }]}
          >
            <Input placeholder="Last Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="firstName"
            label="First Name"
            rules={[
              { required: true, message: 'Please input your first name' },
            ]}
          >
            <Input placeholder="First Name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="gender"
            label="Gender"
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select style={{ width: '100%' }} placeholder="Unspecified">
              <Option value="Male">Male</Option>
              <Option value="Female">Female</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="age"
            label="Age"
            rules={[{ required: true, message: 'Please input your age' }]}
          >
            <InputNumber
              style={{ width: '100%' }}
              placeholder="Age"
              min={0}
              max={120}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                type: 'email',
                message: 'Please input your email',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="country"
            label="Country"
            rules={[{ required: true, message: 'Please select your country' }]}
          >
            <Select
              style={{ width: '100%' }}
              showSearch
              placeholder="Please Select"
            >
              {countryOptions}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item
            name="city"
            label="City"
            rules={[{ required: true, message: 'Please select your city' }]}
          >
            <Select
              style={{ width: '100%' }}
              showSearch
              disabled={selectedCountry === ''}
              placeholder="Please Select"
            >
              {cityOptions}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <h1 className={styles.title}>Input CSV Data</h1>
      <Row>
        <Upload
          accept=".csv"
          name="csvFile"
          fileList={[]}
          beforeUpload={handleBeforeUpload}
          onRemove={handleFileRemove}
        >
          <Button className={styles.uploadButton} type="primary">
            Upload
          </Button>
        </Upload>
      </Row>
      <Form.Item
        style={{ marginTop: '24px' }}
        name="csvInput"
        label="Manual CSV Data Input"
        rules={[
          { required: true, message: 'Please input csv' },
          () => ({
            validator(_, value) {
              if (validateProductCsv(value)) {
                return Promise.resolve();
              }
              return Promise.reject('Invalid csv content');
            },
          }),
        ]}
      >
        <TextArea
          style={{ width: '100%' }}
          autoSize={{ minRows: 10, maxRows: 15 }}
        />
      </Form.Item>
      <div className={styles.buttonWrapper}>
        <Button
          className={styles.continueButton}
          type="primary"
          htmlType="submit"
        >
          Continue
        </Button>
      </div>
    </Form>
  );
}
