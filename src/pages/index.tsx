import { useState } from 'react';
import { Layout, Card, Steps, Form, Row, Col, Input, Select, InputNumber, Button, Upload, Table } from 'antd';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend,
} from 'recharts';
import groupBy from 'lodash/groupBy';

import { parseCsv, IProduct } from '@/utils/utils';
import countryCity from '@/utils/CountryCiity';
import styles from './index.less';
import Description from '@/components/Description';

const { Header, Content } = Layout;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
export default function IndexPage() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [csvData, setCsvData] = useState<Array<IProduct>>();
  const [country, setCountry] = useState('');

  const onFinish = (values: any) => {
    setStep(1);
  };

  const handleFileChange = (info: any) => {
  }

  const handleBeforeUpload = (file: any) => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent<FileReader>) => {
      const payload = e.target?.result;
      if (typeof payload === 'string') {
        const result = parseCsv(payload);
        setCsvData(result);
        form.setFieldsValue({ csvInput: payload })
      }
    };
    reader.readAsText(file);
    return true;
  }

  const handleFieldChange = (fields: any) => {
    if (fields[0].name[0] === 'country') {
      setCountry(fields[0].value);
      form.setFieldsValue({city: undefined});
    }
  }

  const countryGroups = groupBy(countryCity, 'country');
  const countryOptions = Object.keys(countryGroups).map(item => (
    <Option key={item} value={item}>
      {item}
    </Option>
  ))

  const cityOptions = country ? 
    countryCity.filter(item => item.country === country)
      .map(item => (
        <Option key={item.city} value={item.city}>
          {item.city}
        </Option>
      )) : '';

  const firstStepField = (
    <Form
      layout='vertical'
      form={form}
      name="inputForm"
      onFinish={onFinish}
      onFieldsChange={handleFieldChange}
    >
      <h1 className={styles.title}>User</h1>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="name"
            label='Name'
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input placeholder='Name' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="gender"
            label='Gender'
            rules={[{ required: true, message: 'Please select your gender' }]}
          >
            <Select style={{ width: '100%' }} placeholder='Unspecified'>
              <Option value='Male'>Male</Option>
              <Option value='Female'>Female</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="age"
            label='Age'
            rules={[{ required: true, message: 'Please input your age' }]}
          >
            <InputNumber style={{ width: '100%' }} placeholder='Age' min={0} max={120} />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={24}>
        <Col span={12}>
          <Form.Item
            name="email"
            label='Email'
            rules={[{ required: true, type: 'email', message: 'Please input your email' }]}
          >
            <Input placeholder='Email' />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name="country"
            label='Country'
            rules={[{ required: true, message: 'Please select your country' }]}
          >
            <Select style={{ width: '100%' }} placeholder='Please Select'>
              {countryOptions}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            name='city'
            label='City'
            rules={[{ required: true, message: 'Please select your city' }]}
          >
            <Select style={{ width: '100%' }} disabled={country===''} placeholder='Please Select'>
              {cityOptions}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <h1 className={styles.title}>Input CSV Data</h1>
      <Row>
        <Upload name='csvFile' onChange={handleFileChange} beforeUpload={handleBeforeUpload} >
          <Button className={styles.uploadButton} type='primary'>Upload</Button>
        </Upload>
      </Row>
      <Form.Item
        style={{ marginTop: '24px' }}
        name='csvInput'
        label='Manual CSV Data Input'
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <TextArea style={{ width: '100%' }} autoSize={{ minRows: 10, maxRows: 15 }} />
      </Form.Item>
      <div className={styles.buttonWrapper}>
        <Button className={styles.continueButton} type='primary' htmlType="submit">
          Continue
        </Button>
      </div>
    </Form>);

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
    }, {
      title: 'Price',
      dataIndex: 'price',
      sorter: (a: { price: number }, b: { price: number }) => a.price - b.price,
    }
  ]

  const products = parseCsv(form.getFieldValue('csvInput')).map(({ name, price }) => ({
    key: name,
    name,
    price,
  }));

  const [order, setOrder] = useState('');
  let barData = products
  if (order == 'ascend') {
    barData = products.sort((a, b) => a.price - b.price);
  } else if (order === 'descend') {
    barData = products.sort((a, b) => b.price - a.price);
  }

  const handleTableChange = (_: any, filters: any, sorter: any) => {
    setOrder(sorter.order)
  }

  const secondStepCmp = (
    <section>
      <h1>Personal Information</h1>
      <Row gutter={48}>
        <Col span={12}>
          <Description title='Name' subtitle={form.getFieldValue('name')} />
        </Col>
        <Col span={12}>
          <Description title='Email' subtitle={form.getFieldValue('email')} />
        </Col>
        <Col span={12}>
          <Description title='Gender' subtitle={form.getFieldValue('gender')} />
        </Col>
        <Col span={12}>
          <Description title='Country' subtitle={form.getFieldValue('country')} />
        </Col>
        <Col span={12}>
          <Description title='Age' subtitle={form.getFieldValue('age')} />
        </Col>
        <Col span={12}>
          <Description title='City' subtitle={form.getFieldValue('city')} />
        </Col>
      </Row>
      <Row className={styles.display} gutter={48}>
        <Col span={12}>
          <h1>Data</h1>
          <Table columns={columns} dataSource={products} onChange={handleTableChange} />
        </Col>
        <Col span={12}>
          <h1>Graph</h1>
          <BarChart
            width={500}
            height={300}
            data={barData}
            margin={{
              top: 5, right: 30, left: 20, bottom: 5,
            }}
          >
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#1890ff" />
          </BarChart>
        </Col>
      </Row>
    </section>
  );
  return (
    <Layout>
      <Header className={styles.header}>
        <Steps className={styles.steps} current={step}>
          <Step title="INPUT" />
          <Step title="OUTPUT" />
        </Steps>
      </Header>
      <Content className={styles.content}>
        <Card className={styles.card}>
          {step === 0 ? firstStepField : secondStepCmp}
        </Card>
      </Content>
    </Layout>
  );
}
