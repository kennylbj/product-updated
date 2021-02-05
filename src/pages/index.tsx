import { useState } from 'react';
import {
  Layout,
  Card,
  Steps,
  Form,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  Button,
  Upload,
  Table,
  Modal,
  Space,
  Radio,
} from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import groupBy from 'lodash/groupBy';

import { parseCsv } from '@/utils/utils';
import countryCity from '@/utils/CountryCiity';
import styles from './index.less';
import Description from '@/components/Description';

const { Header, Content } = Layout;
const { Step } = Steps;
const { Option } = Select;
const { TextArea } = Input;
const { confirm } = Modal;

export interface FilterConfirmProps {
  closeDropdown: boolean;
}

export interface ColumnFilterItem {
  text: React.ReactNode;
  value: string | number | boolean;
  children?: ColumnFilterItem[];
}

export interface FilterDropdownProps {
  prefixCls: string;
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedKeys: React.Key[];
  confirm: (param: FilterConfirmProps) => void;
  clearFilters: () => void;
  filters?: ColumnFilterItem[];
  visible: boolean;
}

export default function IndexPage() {
  const [form] = Form.useForm();
  const [step, setStep] = useState(0);
  const [country, setCountry] = useState('');
  const [fileList, setFileList] = useState<Array<any>>([]);

  const onFinish = (values: any) => {
    setStep(1);
  };

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

  const handleFileChange = (file: any) => {
    if (file) {
      setFileList(file.fileList.slice(-1));
    }
  };

  const handleFileRemove = (file: any): Promise<boolean> => {
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

  const handleFieldChange = (fields: any) => {
    if (fields[0].name[0] === 'country') {
      setCountry(fields[0].value);
      form.setFieldsValue({ city: undefined });
    }
  };

  const countryGroups = groupBy(countryCity, 'country');
  const countryOptions = Object.keys(countryGroups).map((item) => (
    <Option key={item} value={item}>
      {item}
    </Option>
  ));

  const cityOptions = country
    ? countryCity
        .filter((item) => item.country === country)
        .map((item) => (
          <Option key={item.city} value={item.city}>
            {item.city}
          </Option>
        ))
    : '';

  const firstStepField = (
    <Form
      layout="vertical"
      form={form}
      name="inputForm"
      onFinish={onFinish}
      onFieldsChange={handleFieldChange}
    >
      <h1 className={styles.title}>User</h1>
      <Row gutter={24}>
        <Col xs={24} md={12}>
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name' }]}
          >
            <Input placeholder="Name" />
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
              disabled={country === ''}
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
          fileList={fileList}
          onChange={handleFileChange}
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
        rules={[{ required: true, message: 'Please input csv' }]}
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

  const [filterPrice, setFilterPrice] = useState<number | undefined>(undefined);
  const [filterUpperPrice, setFilterUpperPrice] = useState<number | undefined>(
    undefined,
  );
  const [filterPriceDirection, setFilterPriceDirection] = useState<
    'above' | 'below' | 'between'
  >('above');

  const [searchPrice, setSearchPrice] = useState<number | undefined>(undefined);
  const [searchUpperPrice, setSearchUpperPrice] = useState<number | undefined>(
    undefined,
  );
  const [searchPriceDirection, setSearchPriceDirection] = useState<
    'above' | 'below' | 'between'
  >('above');
  const resetFilter = (clearFilter: any) => {
    clearFilter();
    setFilterPrice(undefined);
    setFilterUpperPrice(undefined);
    setFilterPriceDirection('above');

    setSearchPrice(undefined);
    setSearchUpperPrice(undefined);
    setSearchPriceDirection('above');
  };

  const handleFilterRadioChange = (e: any) => {
    setFilterPriceDirection(e.target.value);
  };

  const columns = [
    {
      title: 'Product',
      dataIndex: 'name',
      align: 'left',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      align: 'right',
      sorter: (a: { price: number }, b: { price: number }) => a.price - b.price,
      filterDropdown: (props: FilterDropdownProps) => {
        const { clearFilters, confirm } = props;
        return (
          <div style={{ padding: 8 }}>
            <Row>
              <Space size="middle" align="baseline">
                <InputNumber
                  placeholder={
                    filterPriceDirection === 'between' ? 'Lower Price' : 'Price'
                  }
                  min={0}
                  value={filterPrice}
                  onChange={(value) =>
                    setFilterPrice((value as number) || undefined)
                  }
                  style={{ width: 188, marginBottom: 8, display: 'block' }}
                />
                {filterPriceDirection === 'between' && '-'}
                {filterPriceDirection === 'between' && (
                  <InputNumber
                    placeholder="Upper Price"
                    min={filterPrice}
                    value={filterUpperPrice}
                    onChange={(value) =>
                      setFilterUpperPrice((value as number) || undefined)
                    }
                    style={{ width: 188, marginBottom: 8, display: 'block' }}
                  />
                )}
              </Space>
            </Row>
            <Space>
              <Radio.Group
                onChange={handleFilterRadioChange}
                value={filterPriceDirection}
              >
                <Radio value="above">Above</Radio>
                <Radio value="below">Below</Radio>
                <Radio value="between">Between</Radio>
              </Radio.Group>
              <Button
                style={{ width: 90 }}
                type="primary"
                icon={<SearchOutlined />}
                size="small"
                disabled={
                  ((filterPriceDirection === 'above' ||
                    filterPriceDirection == 'below') &&
                    filterPrice === undefined) ||
                  (filterPriceDirection === 'between' &&
                    (filterPrice === undefined ||
                      filterUpperPrice === undefined))
                }
                onClick={() => {
                  setSearchPrice(filterPrice);
                  setSearchUpperPrice(filterUpperPrice);
                  setSearchPriceDirection(filterPriceDirection);
                  confirm({ closeDropdown: false });
                }}
              >
                Search
              </Button>
              <Button
                onClick={() => resetFilter(clearFilters)}
                size="small"
                style={{ width: 90 }}
              >
                Reset
              </Button>
            </Space>
          </div>
        );
      },
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
    },
  ] as any;

  const products = parseCsv(form.getFieldValue('csvInput'))
    .map(({ name, price }) => ({
      key: name,
      name,
      price,
    }))
    .filter((product) => {
      if (!searchPrice) return true;
      switch (searchPriceDirection) {
        case 'above':
          return product.price > searchPrice;
        case 'below':
          return product.price < searchPrice;
        case 'between':
          return (
            product.price >= searchPrice &&
            product.price <= (searchUpperPrice || 0)
          );
      }
    });

  const [order, setOrder] = useState('');
  let barData = products;
  if (order == 'ascend') {
    barData = products.sort((a, b) => a.price - b.price);
  } else if (order === 'descend') {
    barData = products.sort((a, b) => b.price - a.price);
  }

  const handleTableChange = (_: any, filters: any, sorter: any) => {
    setOrder(sorter.order);
  };

  const secondStepCmp = (
    <section>
      <h1>Personal Information</h1>
      <Row gutter={48}>
        <Col xs={24} md={12}>
          <Description title="Name" subtitle={form.getFieldValue('name')} />
        </Col>
        <Col xs={24} md={12}>
          <Description title="Email" subtitle={form.getFieldValue('email')} />
        </Col>
        <Col xs={24} md={12}>
          <Description title="Gender" subtitle={form.getFieldValue('gender')} />
        </Col>
        <Col xs={24} md={12}>
          <Description
            title="Country"
            subtitle={form.getFieldValue('country')}
          />
        </Col>
        <Col xs={24} md={12}>
          <Description title="Age" subtitle={form.getFieldValue('age')} />
        </Col>
        <Col xs={24} md={12}>
          <Description title="City" subtitle={form.getFieldValue('city')} />
        </Col>
      </Row>
      <Row className={styles.display} gutter={48}>
        <Col xs={24} lg={12}>
          <h1>Data</h1>
          <Table
            columns={columns}
            dataSource={products}
            onChange={handleTableChange}
          />
        </Col>
        <Col xs={24} lg={12}>
          <h1>Graph</h1>
          <ResponsiveContainer width="100%" height={550}>
            <BarChart
              data={barData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="price" fill="#1890ff" />
            </BarChart>
          </ResponsiveContainer>
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
