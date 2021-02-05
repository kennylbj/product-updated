import { useState } from 'react';
import { Row, Col, InputNumber, Button, Table, Space, Radio } from 'antd';
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
import { parseCsv } from '@/utils/utils';
import Description from '@/components/Description';
import { IProductStats, FilterDropdownProps } from './index.type';
import styles from './index.less';

export default function ProductStats(props: IProductStats) {
  const { form } = props;

  // record filter fields change
  const [filterPrice, setFilterPrice] = useState<number | undefined>(undefined);
  const [filterUpperPrice, setFilterUpperPrice] = useState<number | undefined>(
    undefined,
  );
  const [filterPriceDirection, setFilterPriceDirection] = useState<
    'above' | 'below' | 'between'
  >('above');

  // separate filter values with search values will avoid applying filter to table data whenever fields changed.
  // in opposite, it will only apply the filter when user click search button.
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

  const handleFilterRadioChange = (e: any) =>
    setFilterPriceDirection(e.target.value);

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
                  // hide filter dropdown after search
                  confirm({ closeDropdown: true });
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
      // filter products accourding to search filter
      if (!searchPrice) return true;
      switch (searchPriceDirection) {
        case 'above':
          return product.price > searchPrice;
        case 'below':
          return product.price < searchPrice;
        case 'between':
          if (!searchUpperPrice) return true;
          return (
            product.price >= searchPrice && product.price <= searchUpperPrice
          );
      }
    });

  // apply order to chart bar
  const [order, setOrder] = useState('');
  let barData = products;
  if (order == 'ascend') {
    barData = products.sort((a, b) => a.price - b.price);
  } else if (order === 'descend') {
    barData = products.sort((a, b) => b.price - a.price);
  }

  const handleTableChange = (_: any, filters: any, sorter: any) =>
    setOrder(sorter.order);

  return (
    <section>
      <h1>Personal Information</h1>
      <Row gutter={48}>
        <Col xs={24} md={12}>
          <Description
            title="Name"
            subtitle={`${form.getFieldValue('lastName')} ${form.getFieldValue(
              'firstName',
            )}`}
          />
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
}
